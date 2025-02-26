import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { FarmPlotCard } from "../../assets/component/plots/PlotCard";
import { toast } from "sonner";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  Trash2,
  Edit,
  Plus,
  Loader2,
  LayoutDashboard,
  PieChart,
  Sprout,
  Calendar,
  Map,
  Users,
} from "lucide-react";

function AdminDashboard() {
  const { user } = useUser();
  const [plots, setPlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlotCard, setShowPlotCard] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardStats, setDashboardStats] = useState({
    totalPlots: 0,
    activePlots: 0,
    totalArea: 0,
    cropTypes: 0,
  });

  // Fetch all plots when component mounts
  useEffect(() => {
    fetchPlots();
  }, []);

  // Update dashboard stats when plots change
  useEffect(() => {
    if (plots.length > 0) {
      const activePlots = plots.filter(
        (plot) => plot.status === "active"
      ).length;
      const totalArea = plots.reduce(
        (sum, plot) => sum + parseFloat(plot.size),
        0
      );

      setDashboardStats({
        totalPlots: plots.length,
        activePlots,
        totalArea: totalArea.toFixed(2),
        cropTypes: Math.floor(Math.random() * 10) + 5, // Mock data - replace with actual crop counts
      });
    }
  }, [plots]);

  // Function to fetch plots from the API
  const fetchPlots = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/plots");
      if (!response.ok) {
        throw new Error("Failed to fetch plots");
      }
      const data = await response.json();
      setPlots(data.data || []);
    } catch (error) {
      console.error("Error fetching plots:", error);
      toast.error("Failed to load plots");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a new plot
  const handleAddPlot = () => {
    setShowPlotCard(true);
  };

  // Handle plot added successfully
  const handlePlotAdded = () => {
    setShowPlotCard(false);
    fetchPlots(); // Refresh plots after adding
    toast.success("Plot added successfully");
  };

  // Handle deleting a plot
  const handleDeletePlot = async (plotId) => {
    if (!confirm("Are you sure you want to delete this plot?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/plots/${plotId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete plot");
      }

      toast.success("Plot deleted successfully");
      fetchPlots(); // Refresh plots after deletion
    } catch (error) {
      console.error("Error deleting plot:", error);
      toast.error("Failed to delete plot");
    }
  };

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[450px] text-center">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Please contact an administrator if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <Button onClick={handleAddPlot} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Plot
        </Button>
      </div>

      {/* Dashboard Tabs */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-5 w-[600px]">
          <TabsTrigger value="overview">
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="plots">
            <Map className="h-4 w-4 mr-2" />
            Plots
          </TabsTrigger>
          <TabsTrigger value="crops">
            <Sprout className="h-4 w-4 mr-2" />
            Crops
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="farmers">
            <Users className="h-4 w-4 mr-2" />
            Farmers
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Plots
                </CardTitle>
                <Map className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats.totalPlots}
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboardStats.activePlots} active plots
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Area
                </CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats.totalArea} acres
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {dashboardStats.totalPlots} plots
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Crop Types
                </CardTitle>
                <Sprout className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardStats.cropTypes}
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently in cultivation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Next Harvest
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {format(
                    new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
                    "MMM dd"
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  3 crops scheduled
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Overview of recent farming activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="mr-4 bg-green-100 p-2 rounded-full">
                    <Sprout className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      New crop planted in Plot 3
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                        "MMMM d, yyyy"
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="mr-4 bg-blue-100 p-2 rounded-full">
                    <Map className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      New plot registered: Plot 7
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                        "MMMM d, yyyy"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plots Tab Content */}
        <TabsContent value="plots">
          <Card>
            <CardHeader>
              <CardTitle>Plot Management</CardTitle>
              <CardDescription>
                Manage all farm plots and their details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
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
                        <TableHead className="w-[100px]">Actions</TableHead>
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
                            <TableCell>
                              {getSoilTypeBadge(plot.soil_type)}
                            </TableCell>
                            <TableCell>
                              {format(
                                new Date(plot.lease_start),
                                "MMM d, yyyy"
                              )}{" "}
                              -{format(new Date(plot.lease_end), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  plot.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {plot.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() =>
                                      handleDeletePlot(plot.plot_id)
                                    }
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Crops Tab Content */}
        <TabsContent value="crops">
          <Card>
            <CardHeader>
              <CardTitle>Crop Management</CardTitle>
              <CardDescription>
                Manage crops and their rotation plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Crop management interface coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab Content */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Harvest Schedule</CardTitle>
              <CardDescription>
                View and manage upcoming harvests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Harvest schedule interface coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Farmers Tab Content */}
        <TabsContent value="farmers">
          <Card>
            <CardHeader>
              <CardTitle>Farmer Management</CardTitle>
              <CardDescription>
                Manage farmers and plot assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Farmer management interface coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Plot Card Modal */}
      {showPlotCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Plot</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPlotCard(false)}
              >
                ✕
              </Button>
            </div>
            <FarmPlotCard onPlotAdded={handlePlotAdded} />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
