import { useState } from "react";
import API_URL from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function FarmPlotCard({ onPlotAdded, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [plotData, setPlotData] = useState({
    plot_id: "",
    owner_id: "",
    size: "",
    location: "",
    soil_type: "",
    lease_start: "",
    lease_end: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;

    // Special handling for size field to ensure it's a number
    if (id === "size") {
      const numValue = value === "" ? "" : parseFloat(value);
      setPlotData({ ...plotData, [id]: numValue });
    } else {
      setPlotData({ ...plotData, [id]: value });
    }
  };

  const handleSelectChange = (value) => {
    setPlotData({ ...plotData, soil_type: value });
  };

  const handleStatusChange = (value) => {
    setPlotData({ ...plotData, status: value });
  };

  const validateForm = () => {
    // Check all required fields
    for (const [key, value] of Object.entries(plotData)) {
      if (
        (value === "" || value === null || value === undefined) &&
        key !== "status"
      ) {
        toast.error(`${key.replace("_", " ")} is required`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Prepare data for submission - ensure size is a number
    const submissionData = {
      ...plotData,
      size: parseFloat(plotData.size),
    };

    console.log("Submitting plot data:", submissionData);

    try {
      const response = await fetch(`${API_URL}/api/plots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      // Log the response status
      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        toast.success("Plot registered successfully!");

        // Reset form
        setPlotData({
          plot_id: "",
          owner_id: "",
          size: "",
          location: "",
          soil_type: "",
          lease_start: "",
          lease_end: "",
          status: "active",
        });

        // Notify parent component
        if (onPlotAdded && typeof onPlotAdded === "function") {
          onPlotAdded();
        }
      } else {
        toast.error(data.message || "Failed to register plot");
      }
    } catch (error) {
      console.error("Error registering plot:", error);
      toast.error("Failed to connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    // Reset form data
    setPlotData({
      plot_id: "",
      owner_id: "",
      size: "",
      location: "",
      soil_type: "",
      lease_start: "",
      lease_end: "",
      status: "active",
    });

    // Call the onCancel prop if provided
    if (onCancel && typeof onCancel === "function") {
      onCancel();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Register Farm Plot</CardTitle>
        <CardDescription>
          Register a new farm plot with its details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="plot_id">Plot ID</Label>
              <Input
                id="plot_id"
                placeholder="Enter plot ID"
                value={plotData.plot_id}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="owner_id">Farmer ID</Label>
              <Input
                id="owner_id"
                placeholder="Enter farmer ID"
                value={plotData.owner_id}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="size">Plot Size (acres)</Label>
              <Input
                id="size"
                placeholder="Enter plot size in acres"
                type="number"
                step="0.01"
                value={plotData.size}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter plot location"
                value={plotData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="soil_type">Soil Type</Label>
              <Select
                onValueChange={handleSelectChange}
                value={plotData.soil_type}
                required
              >
                <SelectTrigger id="soil_type">
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent className="bg-white" position="popper">
                  <SelectItem value="clay">Clay</SelectItem>
                  <SelectItem value="sandy">Sandy</SelectItem>
                  <SelectItem value="loamy">Loamy</SelectItem>
                  <SelectItem value="silt">Silt</SelectItem>
                  <SelectItem value="peat">Peat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={handleStatusChange}
                value={plotData.status}
                required
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white" position="popper">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lease_start">Lease Start Date</Label>
              <Input
                id="lease_start"
                type="date"
                value={plotData.lease_start}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lease_end">Lease End Date</Label>
              <Input
                id="lease_end"
                type="date"
                value={plotData.lease_end}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancelClick}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Registering..." : "Register Plot"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default FarmPlotCard;
