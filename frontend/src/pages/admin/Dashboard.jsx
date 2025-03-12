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
  RotateCw,
  Droplets,
} from "lucide-react";
import { CropForm } from "../../components/crops/CropForm";
import { CropEditForm } from "../../components/crops/CropEditForm";
import { PlotEditForm } from "../../components/plots/PlotEditForm";
import { HarvestScheduleForm } from "../../components/schedules/HarvestScheduleForm";
import { CropRotationForm } from "../../components/rotations/CropRotationForm";
import { ActivityLogForm } from "../../components/activities/ActivityLogForm";
import { HarvestScheduleEditForm } from "../../components/schedules/HarvestScheduleEditForm";
import { CropRotationEditForm } from "../../components/rotations/CropRotationEditForm";
import { ActivityLogEditForm } from "../../components/activities/ActivityLogEditForm";

function AdminDashboard() {
  const { user } = useUser();
  const [plots, setPlots] = useState([]);
  const [crops, setCrops] = useState([]);
  const [harvestSchedules, setHarvestSchedules] = useState([]);
  const [cropRotations, setCropRotations] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCropsLoading, setIsCropsLoading] = useState(true);
  const [isSchedulesLoading, setIsSchedulesLoading] = useState(true);
  const [isRotationsLoading, setIsRotationsLoading] = useState(true);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);
  const [showPlotCard, setShowPlotCard] = useState(false);
  const [showCropForm, setShowCropForm] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showRotationForm, setShowRotationForm] = useState(false);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardStats, setDashboardStats] = useState({
    totalPlots: 0,
    activePlots: 0,
    totalArea: 0,
    cropTypes: 0,
  });

  // State for edit forms
  const [showPlotEditForm, setShowPlotEditForm] = useState(false);
  const [showCropEditForm, setShowCropEditForm] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);

  // Add these new state variables for edit forms
  const [showScheduleEditForm, setShowScheduleEditForm] = useState(false);
  const [showRotationEditForm, setShowRotationEditForm] = useState(false);
  const [showActivityEditForm, setShowActivityEditForm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedRotation, setSelectedRotation] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);

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

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "crops") {
      fetchCrops();
    } else if (activeTab === "schedule") {
      fetchHarvestSchedules();
    } else if (activeTab === "rotations") {
      fetchCropRotations();
    } else if (activeTab === "activities") {
      fetchActivityLogs();
    }
  }, [activeTab]);

  // Function to fetch crops from the API
  const fetchCrops = async () => {
    setIsCropsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/crops");
      if (!response.ok) {
        throw new Error("Failed to fetch crops");
      }
      const data = await response.json();
      setCrops(data.data || []);
    } catch (error) {
      console.error("Error fetching crops:", error);
      toast.error("Failed to load crops");
    } finally {
      setIsCropsLoading(false);
    }
  };

  // Function to fetch harvest schedules from the API
  const fetchHarvestSchedules = async () => {
    setIsSchedulesLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/harvest-schedules"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch harvest schedules");
      }
      const data = await response.json();
      setHarvestSchedules(data.data || []);
    } catch (error) {
      console.error("Error fetching harvest schedules:", error);
      toast.error("Failed to load harvest schedules");
    } finally {
      setIsSchedulesLoading(false);
    }
  };

  // Function to fetch crop rotations from the API
  const fetchCropRotations = async () => {
    setIsRotationsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/crop-rotations");
      if (!response.ok) {
        throw new Error("Failed to fetch crop rotations");
      }
      const data = await response.json();
      setCropRotations(data.data || []);
    } catch (error) {
      console.error("Error fetching crop rotations:", error);
      toast.error("Failed to load crop rotations");
    } finally {
      setIsRotationsLoading(false);
    }
  };

  // Function to fetch activity logs from the API
  const fetchActivityLogs = async () => {
    setIsActivitiesLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/activity-logs");
      if (!response.ok) {
        throw new Error("Failed to fetch activity logs");
      }
      const data = await response.json();
      setActivityLogs(data.data || []);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      toast.error("Failed to load activity logs");
    } finally {
      setIsActivitiesLoading(false);
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

  // Handle editing a plot
  const handleEditPlot = (plot) => {
    setSelectedPlot(plot);
    setShowPlotEditForm(true);
  };

  // Handle plot updated successfully
  const handlePlotUpdated = () => {
    setShowPlotEditForm(false);
    setSelectedPlot(null);
    fetchPlots(); // Refresh plots after update
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

  // Handle adding a new crop
  const handleAddCrop = () => {
    setShowCropForm(true);
  };

  // Handle crop added successfully
  const handleCropAdded = () => {
    setShowCropForm(false);
    fetchCrops(); // Refresh crops after adding
    toast.success("Crop added successfully");
  };

  // Handle editing a crop
  const handleEditCrop = (crop) => {
    setSelectedCrop(crop);
    setShowCropEditForm(true);
  };

  // Handle crop updated successfully
  const handleCropUpdated = () => {
    setShowCropEditForm(false);
    setSelectedCrop(null);
    fetchCrops(); // Refresh crops after update
  };

  // Handle deleting a crop
  const handleDeleteCrop = async (cropId) => {
    if (!confirm("Are you sure you want to delete this crop?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/crops/${cropId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete crop");
      }

      toast.success("Crop deleted successfully");
      fetchCrops(); // Refresh crops after deletion
    } catch (error) {
      console.error("Error deleting crop:", error);
      toast.error("Failed to delete crop");
    }
  };

  // Handle adding and deleting operations for schedules, rotations, and activities
  const handleAddSchedule = () => {
    setShowScheduleForm(true);
  };

  const handleScheduleAdded = () => {
    setShowScheduleForm(false);
    fetchHarvestSchedules();
    toast.success("Harvest schedule added successfully");
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/harvest-schedules/${scheduleId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete schedule");
      }

      toast.success("Schedule deleted successfully");
      fetchHarvestSchedules();
    } catch (error) {
      console.error("Error deleting schedule:", error);
      toast.error("Failed to delete schedule");
    }
  };

  const handleAddRotation = () => {
    setShowRotationForm(true);
  };

  const handleRotationAdded = () => {
    setShowRotationForm(false);
    fetchCropRotations();
    toast.success("Crop rotation added successfully");
  };

  const handleEditRotation = (rotation) => {
    setSelectedRotation(rotation);
    setShowRotationEditForm(true);
  };

  const handleRotationUpdated = () => {
    setShowRotationEditForm(false);
    setSelectedRotation(null);
    fetchCropRotations();
    toast.success("Crop rotation updated successfully");
  };

  const handleDeleteRotation = async (rotationId) => {
    if (!confirm("Are you sure you want to delete this rotation?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/crop-rotations/${rotationId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete rotation");
      }

      toast.success("Rotation deleted successfully");
      fetchCropRotations();
    } catch (error) {
      console.error("Error deleting rotation:", error);
      toast.error("Failed to delete rotation");
    }
  };

  const handleAddActivity = () => {
    setShowActivityForm(true);
  };

  const handleActivityAdded = () => {
    setShowActivityForm(false);
    fetchActivityLogs();
    toast.success("Activity log added successfully");
  };

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setShowActivityEditForm(true);
  };

  const handleActivityUpdated = () => {
    setShowActivityEditForm(false);
    setSelectedActivity(null);
    fetchActivityLogs();
    toast.success("Activity log updated successfully");
  };

  const handleDeleteActivity = async (activityId) => {
    if (!confirm("Are you sure you want to delete this activity log?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/activity-logs/${activityId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete activity log");
      }

      toast.success("Activity log deleted successfully");
      fetchActivityLogs();
    } catch (error) {
      console.error("Error deleting activity log:", error);
      toast.error("Failed to delete activity log");
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

  // Format date or return placeholder
  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  // Get crop status badge
  const getCropStatusBadge = (status) => {
    const colors = {
      Planted: "bg-blue-500",
      Growing: "bg-green-500",
      Harvested: "bg-amber-500",
    };

    return (
      <Badge className={`${colors[status] || "bg-gray-500"}`}>{status}</Badge>
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
        <TabsList className="grid grid-cols-7 w-[900px]">
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
            Schedules
          </TabsTrigger>
          <TabsTrigger value="rotations">
            <RotateCw className="h-4 w-4 mr-2" />
            Rotations
          </TabsTrigger>
          <TabsTrigger value="activities">
            <Droplets className="h-4 w-4 mr-2" />
            Activities
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
                                  <DropdownMenuItem
                                    onClick={() => handleEditPlot(plot)}
                                  >
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Crop Management</CardTitle>
                <CardDescription>
                  Manage crops and their rotation plans
                </CardDescription>
              </div>
              <Button
                onClick={handleAddCrop}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add New Crop
              </Button>
            </CardHeader>
            <CardContent>
              {isCropsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Variety</TableHead>
                        <TableHead>Plot</TableHead>
                        <TableHead>Planting Date</TableHead>
                        <TableHead>Expected Harvest</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {crops.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center">
                            No crops found. Add your first crop to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        crops.map((crop) => (
                          <TableRow key={crop.crop_id}>
                            <TableCell className="font-medium">
                              {crop.crop_id}
                            </TableCell>
                            <TableCell>{crop.name}</TableCell>
                            <TableCell>{crop.variety || "N/A"}</TableCell>
                            <TableCell>
                              {crop.plot?.location || crop.plot_id}
                            </TableCell>
                            <TableCell>
                              {formatDate(crop.planting_date)}
                            </TableCell>
                            <TableCell>
                              {formatDate(crop.harvest_date)}
                            </TableCell>
                            <TableCell>
                              {getCropStatusBadge(crop.status)}
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
                                  <DropdownMenuItem
                                    onClick={() => handleEditCrop(crop)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() =>
                                      handleDeleteCrop(crop.crop_id)
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

        {/* Harvest Schedule Tab Content */}
        <TabsContent value="schedule">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Harvest Schedule Management</CardTitle>
                <CardDescription>
                  Track and manage harvest schedules for all plots
                </CardDescription>
              </div>
              <Button
                onClick={handleAddSchedule}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add New Schedule
              </Button>
            </CardHeader>
            <CardContent>
              {isSchedulesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Plot</TableHead>
                        <TableHead>Crop</TableHead>
                        <TableHead>Expected Harvest</TableHead>
                        <TableHead>Actual Harvest</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {harvestSchedules.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No harvest schedules found. Add your first schedule
                            to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        harvestSchedules.map((schedule) => (
                          <TableRow key={schedule.schedule_id}>
                            <TableCell className="font-medium">
                              {schedule.schedule_id}
                            </TableCell>
                            <TableCell>
                              {schedule.plot?.plot_id || schedule.plot_id}
                            </TableCell>
                            <TableCell>
                              {schedule.crop?.name ||
                                `Crop #${schedule.crop_id}`}
                            </TableCell>
                            <TableCell>
                              {formatDate(schedule.expected_harvest_date)}
                            </TableCell>
                            <TableCell>
                              {schedule.actual_harvest_date ? (
                                formatDate(schedule.actual_harvest_date)
                              ) : (
                                <Badge variant="outline">Not harvested</Badge>
                              )}
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
                                  <DropdownMenuItem
                                    onClick={() => handleEditSchedule(schedule)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() =>
                                      handleDeleteSchedule(schedule.schedule_id)
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

        {/* Crop Rotation Tab Content */}
        <TabsContent value="rotations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Crop Rotation Management</CardTitle>
                <CardDescription>
                  Plan and monitor crop rotations to maintain soil health
                </CardDescription>
              </div>
              <Button
                onClick={handleAddRotation}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add New Rotation
              </Button>
            </CardHeader>
            <CardContent>
              {isRotationsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Plot</TableHead>
                        <TableHead>Previous Crop</TableHead>
                        <TableHead>Next Crop</TableHead>
                        <TableHead>Rotation Date</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cropRotations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No crop rotations found. Add your first rotation
                            plan to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        cropRotations.map((rotation) => (
                          <TableRow key={rotation.rotation_id}>
                            <TableCell className="font-medium">
                              {rotation.rotation_id}
                            </TableCell>
                            <TableCell>
                              {rotation.plot?.plot_id || rotation.plot_id}
                            </TableCell>
                            <TableCell>{rotation.previous_crop}</TableCell>
                            <TableCell>{rotation.next_crop}</TableCell>
                            <TableCell>
                              {formatDate(rotation.rotation_date)}
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
                                  <DropdownMenuItem
                                    onClick={() => handleEditRotation(rotation)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() =>
                                      handleDeleteRotation(rotation.rotation_id)
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

        {/* Activity Logs Tab Content */}
        <TabsContent value="activities">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Activity Log Management</CardTitle>
                <CardDescription>
                  Track irrigation, fertilization, and other farming activities
                </CardDescription>
              </div>
              <Button
                onClick={handleAddActivity}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add New Activity
              </Button>
            </CardHeader>
            <CardContent>
              {isActivitiesLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Plot</TableHead>
                        <TableHead>Activity Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No activity logs found. Add your first activity log
                            to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        activityLogs.map((activity) => (
                          <TableRow key={activity.activity_id}>
                            <TableCell className="font-medium">
                              {activity.activity_id}
                            </TableCell>
                            <TableCell>
                              {activity.plot?.plot_id || activity.plot_id}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  activity.type === "Irrigation"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {activity.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDate(activity.date)}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {activity.notes || "No notes"}
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
                                  <DropdownMenuItem
                                    onClick={() => handleEditActivity(activity)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() =>
                                      handleDeleteActivity(activity.activity_id)
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

      {/* Plot Edit Form Modal */}
      {showPlotEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Plot</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPlotEditForm(false)}
              >
                ✕
              </Button>
            </div>
            <PlotEditForm
              plot={selectedPlot}
              onPlotUpdated={handlePlotUpdated}
              onCancel={() => setShowPlotEditForm(false)}
            />
          </div>
        </div>
      )}

      {/* Crop Form Modal */}
      {showCropForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Crop</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCropForm(false)}
              >
                ✕
              </Button>
            </div>
            <CropForm
              onCropAdded={handleCropAdded}
              plots={plots}
              onCancel={() => setShowCropForm(false)}
            />
          </div>
        </div>
      )}

      {/* Crop Edit Form Modal */}
      {showCropEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Crop</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCropEditForm(false)}
              >
                ✕
              </Button>
            </div>
            <CropEditForm
              crop={selectedCrop}
              plots={plots}
              onCropUpdated={handleCropUpdated}
              onCancel={() => setShowCropEditForm(false)}
            />
          </div>
        </div>
      )}

      {/* Harvest Schedule Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Harvest Schedule</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowScheduleForm(false)}
              >
                ✕
              </Button>
            </div>
            <HarvestScheduleForm
              onScheduleAdded={handleScheduleAdded}
              plots={plots}
              onCancel={() => setShowScheduleForm(false)}
            />
          </div>
        </div>
      )}

      {/* Harvest Schedule Edit Form Modal */}
      {showScheduleEditForm && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Harvest Schedule</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowScheduleEditForm(false)}
              >
                ✕
              </Button>
            </div>
            <HarvestScheduleEditForm
              schedule={selectedSchedule}
              plots={plots}
              onScheduleUpdated={handleScheduleUpdated}
              onCancel={() => setShowScheduleEditForm(false)}
            />
          </div>
        </div>
      )}

      {/* Crop Rotation Form Modal */}
      {showRotationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Crop Rotation</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRotationForm(false)}
              >
                ✕
              </Button>
            </div>
            <CropRotationForm
              onRotationAdded={handleRotationAdded}
              plots={plots}
              onCancel={() => setShowRotationForm(false)}
            />
          </div>
        </div>
      )}

      {/* Crop Rotation Edit Form Modal */}
      {showRotationEditForm && selectedRotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Crop Rotation</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRotationEditForm(false)}
              >
                ✕
              </Button>
            </div>
            <CropRotationEditForm
              rotation={selectedRotation}
              plots={plots}
              onRotationUpdated={handleRotationUpdated}
              onCancel={() => setShowRotationEditForm(false)}
            />
          </div>
        </div>
      )}

      {/* Activity Log Form Modal */}
      {showActivityForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Activity Log</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActivityForm(false)}
              >
                ✕
              </Button>
            </div>
            <ActivityLogForm
              onActivityAdded={handleActivityAdded}
              plots={plots}
              onCancel={() => setShowActivityForm(false)}
            />
          </div>
        </div>
      )}

      {/* Activity Log Edit Form Modal */}
      {showActivityEditForm && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Activity Log</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowActivityEditForm(false)}
              >
                ✕
              </Button>
            </div>
            <ActivityLogEditForm
              activity={selectedActivity}
              plots={plots}
              onActivityUpdated={handleActivityUpdated}
              onCancel={() => setShowActivityEditForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
