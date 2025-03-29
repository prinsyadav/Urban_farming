import { useState } from "react";
import { toast } from "sonner";
import API_URL from "@/config/apiConfig";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function CropRotationForm({ onRotationAdded, onCancel, plots = [] }) {
  const [formData, setFormData] = useState({
    plot_id: "",
    previous_crop: "",
    next_crop: "",
    rotation_date: new Date(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Common crop types for selection
  const commonCrops = [
    "Wheat",
    "Corn",
    "Rice",
    "Soybeans",
    "Potatoes",
    "Tomatoes",
    "Lettuce",
    "Carrots",
    "Cotton",
    "Barley",
    "Oats",
    "Peas",
    "Beans",
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.plot_id ||
      !formData.previous_crop ||
      !formData.next_crop ||
      !formData.rotation_date
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/crop-rotations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create crop rotation");
      }

      toast.success("Crop rotation created successfully");
      onRotationAdded();
    } catch (error) {
      console.error("Error creating crop rotation:", error);
      toast.error("Failed to create crop rotation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="plot_id">Plot *</Label>
          <Select
            value={formData.plot_id}
            onValueChange={(value) => handleInputChange("plot_id", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a plot" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {plots.length === 0 ? (
                <SelectItem value="" disabled>
                  No plots available
                </SelectItem>
              ) : (
                plots.map((plot) => (
                  <SelectItem key={plot.plot_id} value={plot.plot_id}>
                    {plot.plot_id} - {plot.location}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="previous_crop">Previous Crop *</Label>
          <Select
            value={formData.previous_crop}
            onValueChange={(value) => handleInputChange("previous_crop", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select previous crop" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {commonCrops.map((crop) => (
                <SelectItem key={crop} value={crop}>
                  {crop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="next_crop">Next Crop *</Label>
          <Select
            value={formData.next_crop}
            onValueChange={(value) => handleInputChange("next_crop", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select next crop" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {commonCrops.map((crop) => (
                <SelectItem key={crop} value={crop}>
                  {crop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rotation_date">Rotation Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.rotation_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.rotation_date ? (
                  format(formData.rotation_date, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white">
              <Calendar
                mode="single"
                selected={formData.rotation_date}
                onSelect={(date) => handleInputChange("rotation_date", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Rotation"
          )}
        </Button>
      </div>
    </form>
  );
}
