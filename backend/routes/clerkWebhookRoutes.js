const express = require("express");
const router = express.Router();
const { Webhook } = require("svix");
const clerk = require("@clerk/clerk-sdk-node");
require("dotenv").config();

// Simply log that Clerk is initialized
console.log("Clerk SDK initialized");

// Make sure the secret key is properly set
const clerkClient = clerk;

// Ensure the API key is set
// if (process.env.CLERK_SECRET_KEY) {
//   clerk.setKey(process.env.CLERK_SECRET_KEY);
//   console.log("Clerk API key has been set");
// } else {
//   console.error("CLERK_SECRET_KEY environment variable is missing");
// }

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
    if (Buffer.isBuffer(payload)) {
      parsedPayload = JSON.parse(payload.toString("utf8"));
    }
  } catch (e) {
    console.error("Failed to parse payload:", e);
    return res.status(400).json({ error: "Invalid payload format" });
  }

  // Handle the webhook events
  try {
    // Check the payload structure
    console.log("Webhook payload type:", parsedPayload.type);
    console.log(
      "Webhook payload data keys:",
      Object.keys(parsedPayload.data || {})
    );

    // Check if it's a user.created event
    if (parsedPayload.type === "user.created") {
      const { id: userId } = parsedPayload.data;

      console.log(`Processing new user: ${userId}`);

      // Use your organization ID
      const organizationId = "org_2seut9vrbVZNOzDXy77YsFRy0Vl";

      console.log(
        `Attempting to add user ${userId} to organization ${organizationId}`
      );

      // First try updateUserMetadata (newer method)
      try {
        console.log("Attempting to update user metadata...");
        if (typeof clerkClient.users.updateUserMetadata === "function") {
          await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
              role: "farmer",
            },
          });
          console.log(
            `Set role 'farmer' for user ${userId} using updateUserMetadata`
          );
        }
        // Fall back to updateUser if needed
        else if (typeof clerkClient.users.updateUser === "function") {
          await clerkClient.users.updateUser(userId, {
            publicMetadata: {
              role: "farmer",
            },
          });
          console.log(`Set role 'farmer' for user ${userId} using updateUser`);
        } else {
          console.error("No suitable method found for updating user metadata");
        }
      } catch (metadataError) {
        console.error("Error setting user metadata:", metadataError);
        console.error("Error details:", metadataError.message);
      }

      // Then try to add the user to the organization
      try {
        console.log("Adding user to organization...");
        if (
          typeof clerkClient.organizations.createOrganizationMembership ===
          "function"
        ) {
          await clerkClient.organizations.createOrganizationMembership({
            organizationId,
            userId,
            role: "basic_member",
          });
          console.log(
            `User ${userId} added to organization ${organizationId} using createOrganizationMembership`
          );
        }
        // Try alternative methods
        else if (typeof clerkClient.organizations.addMember === "function") {
          await clerkClient.organizations.addMember({
            organizationId,
            userId,
            role: "basic_member",
          });
          console.log(
            `User ${userId} added to organization ${organizationId} using addMember`
          );
        } else {
          console.error(
            "No suitable method found for adding organization member"
          );
        }
      } catch (orgError) {
        console.error("Error adding user to organization:", orgError);
        console.error("Error details:", orgError.message);
      }
    } else {
      console.log("Ignoring non-user.created event:", parsedPayload.type);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ error: "Failed to process webhook" });
  }
});

// Debug route to check Clerk client
router.get("/clerk-debug", async (req, res) => {
  try {
    // Try to get a list of users to verify the client is working
    const users = await clerkClient.users.getUserList({ limit: 1 });

    res.json({
      status: "Clerk client initialized successfully",
      canListUsers: users && Array.isArray(users),
      userCount: users ? users.length : 0,
      hasUpdateMethod: typeof clerkClient.users.updateUser === "function",
      hasUpdateMetadataMethod:
        typeof clerkClient.users.updateUserMetadata === "function",
      organizationMethods: {
        createOrganizationMembership:
          typeof clerkClient.organizations.createOrganizationMembership ===
          "function",
        addMember: typeof clerkClient.organizations.addMember === "function",
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error initializing Clerk client",
      error: error.message,
    });
  }
});

module.exports = router;
