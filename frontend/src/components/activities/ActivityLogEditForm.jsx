import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export function ActivityLogEditForm({
  activity,
  onActivityUpdated,
  onCancel,
  plots = [],
}) {
  const [formData, setFormData] = useState({
    plot_id: activity?.plot_id || "",
    type: activity?.type || "",
    date: activity?.date ? new Date(activity.date) : new Date(),
    notes: activity?.notes || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activityTypes = [
    { value: "Irrigation", label: "Irrigation" },
    { value: "Fertilization", label: "Fertilization" },
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.plot_id || !formData.type || !formData.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:3000/api/activity-logs/${activity.activity_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update activity log");
      }

      toast.success("Activity log updated successfully");
      onActivityUpdated();
    } catch (error) {
      console.error("Error updating activity log:", error);
      toast.error("Failed to update activity log");
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
            <SelectContent>
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
          <Label htmlFor="type">Activity Type *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleInputChange("type", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select activity type" />
            </SelectTrigger>
            <SelectContent>
              {activityTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Activity Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? (
                  format(formData.date, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={(date) => handleInputChange("date", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            placeholder="Enter activity details..."
            rows={3}
          />
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
              Updating...
            </>
          ) : (
            "Update Activity"
          )}
        </Button>
      </div>
    </form>
  );
}
