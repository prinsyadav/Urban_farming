import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export function PlotEditForm({ plot, onPlotUpdated, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    owner_id: "",
    size: "",
    location: "",
    soil_type: "",
    lease_start: "",
    lease_end: "",
    status: "",
  });

  // Initialize form data when plot prop changes
  useEffect(() => {
    if (plot) {
      // Format dates for input fields (YYYY-MM-DD)
      const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      setFormData({
        owner_id: plot.owner_id || "",
        size: plot.size || "",
        location: plot.location || "",
        soil_type: plot.soil_type || "",
        lease_start: formatDate(plot.lease_start),
        lease_end: formatDate(plot.lease_end),
        status: plot.status || "active",
      });
    }
  }, [plot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.location || !formData.size || !formData.soil_type) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `http://localhost:3000/api/plots/${plot.plot_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update plot");
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Plot updated successfully");
        onPlotUpdated();
      } else {
        toast.error(data.message || "Failed to update plot");
      }
    } catch (error) {
      console.error("Error updating plot:", error);
      toast.error("Failed to update plot");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Owner ID */}
        <div className="space-y-2">
          <Label htmlFor="owner_id">Owner ID</Label>
          <Input
            id="owner_id"
            name="owner_id"
            value={formData.owner_id}
            onChange={handleChange}
            placeholder="Owner Identifier"
          />
        </div>

        {/* Plot Size */}
        <div className="space-y-2">
          <Label htmlFor="size">Plot Size (acres) *</Label>
          <Input
            id="size"
            name="size"
            type="number"
            step="0.01"
            min="0.1"
            value={formData.size}
            onChange={handleChange}
            placeholder="Plot size in acres"
            required
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Plot location"
          required
        />
      </div>

      {/* Soil Type */}
      <div className="space-y-2">
        <Label htmlFor="soil_type">Soil Type *</Label>
        <Select
          onValueChange={(value) => handleSelectChange("soil_type", value)}
          value={formData.soil_type}
          required
        >
          <SelectTrigger id="soil_type">
            <SelectValue placeholder="Select soil type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="clay">Clay</SelectItem>
            <SelectItem value="sandy">Sandy</SelectItem>
            <SelectItem value="loamy">Loamy</SelectItem>
            <SelectItem value="silt">Silt</SelectItem>
            <SelectItem value="peat">Peat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Lease Start */}
        <div className="space-y-2">
          <Label htmlFor="lease_start">Lease Start *</Label>
          <Input
            id="lease_start"
            name="lease_start"
            type="date"
            value={formData.lease_start}
            onChange={handleChange}
            required
          />
        </div>

        {/* Lease End */}
        <div className="space-y-2">
          <Label htmlFor="lease_end">Lease End *</Label>
          <Input
            id="lease_end"
            name="lease_end"
            type="date"
            value={formData.lease_end}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          onValueChange={(value) => handleSelectChange("status", value)}
          value={formData.status}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select plot status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Plot
        </Button>
      </div>
    </form>
  );
}
