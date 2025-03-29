import { useState, useEffect } from "react";
import API_URL from "@/config/apiConfig";
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

export function CropEditForm({ crop, plots, onCropUpdated, onCancel }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    variety: "",
    plot_id: "",
    planting_date: "",
    harvest_date: "",
    status: "",
  });

  // Initialize form data when crop prop changes
  useEffect(() => {
    if (crop) {
      // Format dates for input fields (YYYY-MM-DD)
      const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      setFormData({
        name: crop.name || "",
        variety: crop.variety || "",
        plot_id: crop.plot_id || "",
        planting_date: formatDate(crop.planting_date),
        harvest_date: formatDate(crop.harvest_date),
        status: crop.status || "Planted",
      });
    }
  }, [crop]);

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
    if (!formData.name || !formData.plot_id || !formData.planting_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_URL}/api/crops/${crop.crop_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update crop");
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Crop updated successfully");
        onCropUpdated();
      } else {
        toast.error(data.message || "Failed to update crop");
      }
    } catch (error) {
      console.error("Error updating crop:", error);
      toast.error("Failed to update crop");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Crop Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Crop Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Tomato"
            required
          />
        </div>

        {/* Variety */}
        <div className="space-y-2">
          <Label htmlFor="variety">Variety</Label>
          <Input
            id="variety"
            name="variety"
            value={formData.variety}
            onChange={handleChange}
            placeholder="e.g. Cherry"
          />
        </div>
      </div>

      {/* Plot Selection */}
      <div className="space-y-2">
        <Label htmlFor="plot_id">Select Plot *</Label>
        <Select
          onValueChange={(value) => handleSelectChange("plot_id", value)}
          value={formData.plot_id}
          required
        >
          <SelectTrigger id="plot_id">
            <SelectValue placeholder="Select a plot for this crop" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {plots.length === 0 ? (
              <SelectItem value="" disabled>
                No plots available
              </SelectItem>
            ) : (
              plots.map((plot) => (
                <SelectItem key={plot.plot_id} value={plot.plot_id}>
                  {plot.location} ({plot.plot_id}) - {plot.size} acres
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Planting Date */}
        <div className="space-y-2">
          <Label htmlFor="planting_date">Planting Date *</Label>
          <Input
            id="planting_date"
            name="planting_date"
            type="date"
            value={formData.planting_date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Expected Harvest Date */}
        <div className="space-y-2">
          <Label htmlFor="harvest_date">Expected Harvest Date</Label>
          <Input
            id="harvest_date"
            name="harvest_date"
            type="date"
            value={formData.harvest_date}
            onChange={handleChange}
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
            <SelectValue placeholder="Select crop status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="Planted">Planted</SelectItem>
            <SelectItem value="Growing">Growing</SelectItem>
            <SelectItem value="Harvested">Harvested</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Crop
        </Button>
      </div>
    </form>
  );
}
