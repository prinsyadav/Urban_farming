const express = require("express");
const router = express.Router();
const { Webhook } = require("svix");
const clerk = require("@clerk/clerk-sdk-node");

// Initialize Clerk client - no need to create a new instance
const clerkClient = clerk;

// Webhook handler for user creation
router.post("/clerk-webhooks", async (req, res) => {
  console.log("Webhook received");

  // Get the Svix signature header
  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  // If there's no signature header, return 400
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.log("Missing svix headers");
    return res.status(400).json({ error: "Missing svix headers" });
  }

  // Get the webhook signing secret from your environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.log("Webhook secret not configured");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  // Create a new Svix instance with your secret
  const webhook = new Webhook(WEBHOOK_SECRET);

  // Get the raw body buffer
  const payload = req.body;
  let body;

  // Handle different body formats
  if (Buffer.isBuffer(req.body)) {
    body = req.body.toString("utf8");
  } else if (typeof req.body === "string") {
    body = req.body;
  } else {
    body = JSON.stringify(payload);
  }

  // Verify the webhook signature
  try {
    const headers = {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    };

    webhook.verify(body, headers);
    console.log("Webhook signature verified");
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(401).json({ error: "Invalid signature" });
  }

  // Parse the payload if it's a string
  let parsedPayload;
  try {
    parsedPayload = typeof payload === "string" ? JSON.parse(payload) : payload;
  } catch (e) {
    console.error("Failed to parse payload:", e);
    return res.status(400).json({ error: "Invalid payload format" });
  }

  // Handle the webhook events
  try {
    // Check if it's a user.created event
    if (parsedPayload.type === "user.created") {
      const { id: userId } = parsedPayload.data;

      console.log(`Processing new user: ${userId}`);

      // Use your organization ID
      const organizationId = "org_2seut9vrbVZNOzDXy77YsFRy0Vl";

      console.log(
        `Attempting to add user ${userId} to organization ${organizationId}`
      );

      try {
        // 1. Update user's public metadata to include the role
        await clerkClient.users.updateUser(userId, {
          publicMetadata: {
            role: "farmer", // Set to farmer for regular users
          },
        });
        console.log(`Set role 'farmer' for user ${userId}`);
      } catch (metadataError) {
        console.error("Error setting user metadata:", metadataError);
      }

      try {
        // 2. Create organization membership using your organization ID
        await clerkClient.organizations.createOrganizationMembership({
          organizationId,
          userId,
          role: "basic_member", // This is the organization role from Clerk
        });
        console.log(`User ${userId} added to organization ${organizationId}`);
      } catch (orgError) {
        console.error("Error adding user to organization:", orgError);
        // Continue execution even if this fails
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
});

module.exports = router;
