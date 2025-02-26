import { useState } from "react";
import { usePlot } from "../../contexts/PlotContext";
import { FarmPlotCard } from "../../assets/component/plots/PlotCard";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";

function PlotsManager() {
  const { plots, isLoading, error, fetchPlots, deletePlot } = usePlot();
  const [showAddPlotDialog, setShowAddPlotDialog] = useState(false);

  const handleAddPlot = () => {
    setShowAddPlotDialog(true);
  };

  const handlePlotAdded = () => {
    setShowAddPlotDialog(false);
    fetchPlots();
  };

  const handleDeletePlot = async (plotId) => {
    if (!confirm("Are you sure you want to delete this plot?")) return;

    try {
      await deletePlot(plotId);
      toast.success("Plot deleted successfully");
    } catch (error) {
      console.error("Error deleting plot:", error);
    }
  };

  const getSoilTypeBadge = (soilType) => {
    const colors = {
      clay: "bg-amber-500",
      sandy: "bg-yellow-200",
      loamy: "bg-green-700",
      silt: "bg-blue-700",
      peat: "bg-brown-700",
    };

    return (
      <Badge className={`${colors[soilType] || "bg-gray-500"}`}>
        {soilType}
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Farm Plots</CardTitle>
          <CardDescription>Manage your farm plots</CardDescription>
        </div>
        <Button onClick={handleAddPlot} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Plot
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plot ID</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Size (acres)</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Soil Type</TableHead>
                  <TableHead>Lease Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plots.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No plots found. Add your first plot to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  plots.map((plot) => (
                    <TableRow key={plot.plot_id}>
                      <TableCell className="font-medium">
                        {plot.plot_id}
                      </TableCell>
                      <TableCell>{plot.owner_id}</TableCell>
                      <TableCell>{plot.size}</TableCell>
                      <TableCell>{plot.location}</TableCell>
                      <TableCell>{getSoilTypeBadge(plot.soil_type)}</TableCell>
                      <TableCell>
                        {format(new Date(plot.lease_start), "MMM d, yyyy")} -{" "}
                        {format(new Date(plot.lease_end), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            plot.status === "active" ? "default" : "secondary"
                          }
                        >
                          {plot.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePlot(plot.plot_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={showAddPlotDialog} onOpenChange={setShowAddPlotDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Plot</DialogTitle>
            <DialogDescription>
              Fill in the details to register a new farm plot
            </DialogDescription>
          </DialogHeader>
          <FarmPlotCard onPlotAdded={handlePlotAdded} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default PlotsManager;
