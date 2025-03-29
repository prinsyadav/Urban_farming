import { useState, useEffect } from "react";
import { toast } from "sonner";
import API_URL from "@/config/apiConfig";
import { Button } from "@/components/ui/button";
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

export function HarvestScheduleEditForm({
  schedule,
  onScheduleUpdated,
  onCancel,
  plots = [],
}) {
  const [formData, setFormData] = useState({
    plot_id: schedule?.plot_id || "",
    crop_id: schedule?.crop_id?.toString() || "",
    expected_harvest_date: schedule?.expected_harvest_date
      ? new Date(schedule.expected_harvest_date)
      : null,
    actual_harvest_date: schedule?.actual_harvest_date
      ? new Date(schedule.actual_harvest_date)
      : null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [crops, setCrops] = useState([]);
  const [isLoadingCrops, setIsLoadingCrops] = useState(false);

  // Load crops based on selected plot
  useEffect(() => {
    if (formData.plot_id) {
      fetchCropsForPlot(formData.plot_id);
    } else {
      setCrops([]);
    }
  }, [formData.plot_id]);

  const fetchCropsForPlot = async (plotId) => {
    setIsLoadingCrops(true);
    try {
      const response = await fetch(
        `${API_URL}/api/crops/plot/${plotId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch crops for this plot");
      }
      const data = await response.json();
      setCrops(data.data || []);
    } catch (error) {
      console.error("Error fetching crops:", error);
      toast.error("Failed to load crops for this plot");
    } finally {
      setIsLoadingCrops(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.plot_id ||
      !formData.crop_id ||
      !formData.expected_harvest_date
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/harvest-schedules/${schedule.schedule_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update harvest schedule");
      }

      toast.success("Harvest schedule updated successfully");
      onScheduleUpdated();
    } catch (error) {
      console.error("Error updating harvest schedule:", error);
      toast.error("Failed to update harvest schedule");
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
                <SelectItem value="_no_plots">No plots available</SelectItem>
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
          <Label htmlFor="crop_id">Crop *</Label>
          <Select
            value={formData.crop_id}
            onValueChange={(value) => handleInputChange("crop_id", value)}
            required
            disabled={
              !formData.plot_id ||
              isLoadingCrops ||
              formData.plot_id === "_no_plots"
            }
          >
            <SelectTrigger>
              {isLoadingCrops ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading crops...
                </div>
              ) : (
                <SelectValue placeholder="Select a crop" />
              )}
            </SelectTrigger>
            <SelectContent className="bg-white">
              {!formData.plot_id ? (
                <SelectItem value="_select_plot">
                  Select a plot first
                </SelectItem>
              ) : crops.length === 0 ? (
                <SelectItem value="_no_crops">
                  No crops found for this plot
                </SelectItem>
              ) : (
                crops.map((crop) => (
                  <SelectItem
                    key={crop.crop_id}
                    value={crop.crop_id.toString()}
                  >
                    {crop.name} {crop.variety ? `(${crop.variety})` : ""}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expected_harvest_date">Expected Harvest Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.expected_harvest_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.expected_harvest_date ? (
                  format(formData.expected_harvest_date, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white">
              <Calendar
                mode="single"
                selected={formData.expected_harvest_date}
                onSelect={(date) =>
                  handleInputChange("expected_harvest_date", date)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="actual_harvest_date">
            Actual Harvest Date (Optional)
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.actual_harvest_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.actual_harvest_date ? (
                  format(formData.actual_harvest_date, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white">
              <Calendar
                mode="single"
                selected={formData.actual_harvest_date}
                onSelect={(date) =>
                  handleInputChange("actual_harvest_date", date)
                }
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
        <Button
          type="submit"
          disabled={
            isSubmitting ||
            !formData.plot_id ||
            formData.plot_id === "_no_plots" ||
            !formData.crop_id ||
            formData.crop_id === "_select_plot" ||
            formData.crop_id === "_no_crops" ||
            !formData.expected_harvest_date
          }
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Schedule"
          )}
        </Button>
      </div>
    </form>
  );
}
