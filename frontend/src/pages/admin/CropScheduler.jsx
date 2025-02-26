import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

function CropScheduler() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Wheat Harvest",
      plotId: "Plot_001",
      date: new Date(2025, 2, 10),
    },
    {
      id: 2,
      title: "Corn Planting",
      plotId: "Plot_002",
      date: new Date(2025, 2, 15),
    },
  ]);

  const selectedDayEvents = events.filter(
    (event) => format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Crop Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Events for {format(date, "MMMM d, yyyy")}</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDayEvents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No events scheduled for this day
            </p>
          ) : (
            <div className="space-y-4">
              {selectedDayEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 border rounded-md bg-muted/50"
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Plot: {event.plotId}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CropScheduler;
