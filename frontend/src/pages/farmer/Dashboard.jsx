import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { format } from "date-fns";
import API_URL from "@/config/apiConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  PieChart,
  Sprout,
  Calendar,
  Map,
  RotateCw,
  Droplets,
  Loader2,
  Info,
  Menu,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function FarmerDashboard() {
  const { user, isLoaded: isUserLoaded } = useUser();
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
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboardStats, setDashboardStats] = useState({
    totalPlots: 0,
    activePlots: 0,
    totalArea: 0,
    cropTypes: 0,
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Get farmer ID from Clerk metadata
  const farmerId = user?.publicMetadata?.owner_id;
  const isRole = user?.publicMetadata?.role === "farmer";

  // Fetch data when user is loaded
  useEffect(() => {
    if (isUserLoaded && farmerId && isRole) {
      fetchFarmerPlots();
    }
  }, [isUserLoaded, farmerId, isRole]);

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

      // Get unique crop types
      const uniqueCrops = new Set(crops.map((crop) => crop.name));

      setDashboardStats({
        totalPlots: plots.length,
        activePlots,
        totalArea: totalArea.toFixed(2),
        cropTypes: uniqueCrops.size || 0,
      });
    }
  }, [plots, crops]);

  // Fetch additional data when active tab changes
  useEffect(() => {
    if (plots.length > 0) {
      if (activeTab === "crops") {
        fetchFarmerCrops();
      } else if (activeTab === "schedule") {
        fetchFarmerHarvestSchedules();
      } else if (activeTab === "rotations") {
        fetchFarmerCropRotations();
      } else if (activeTab === "activities") {
        fetchFarmerActivityLogs();
      }
    }
  }, [activeTab, plots]);

  // Function to fetch plots for this farmer
  const fetchFarmerPlots = async () => {
    setIsLoading(true);
    try {
      // Use the owner-specific endpoint
      const response = await fetch(`${API_URL}/api/plots/owner/${farmerId}`);

      if (response.status === 404) {
        // No plots found for this owner
        setPlots([]);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch plots");
      }

      const data = await response.json();
      setPlots(data.data || []);

      // After getting plots, fetch crops for overview stats
      if (data.data && data.data.length > 0) {
        fetchFarmerCrops(data.data);
      }
    } catch (error) {
      console.error("Error fetching plots:", error);
      toast.error("Failed to load your plots");
      setPlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch crops for this farmer's plots
  const fetchFarmerCrops = async (plotsData = plots) => {
    setIsCropsLoading(true);
    try {
      if (plotsData.length === 0) {
        setCrops([]);
        return;
      }

      const allCrops = [];

      // Fetch crops for each plot
      for (const plot of plotsData) {
        const response = await fetch(
          `${API_URL}/api/crops/plot/${plot.plot_id}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            allCrops.push(...data.data);
          }
        }
      }

      setCrops(allCrops);
    } catch (error) {
      console.error("Error fetching crops:", error);
      toast.error("Failed to load your crops");
    } finally {
      setIsCropsLoading(false);
    }
  };

  // Function to fetch harvest schedules for this farmer's plots
  const fetchFarmerHarvestSchedules = async () => {
    setIsSchedulesLoading(true);
    try {
      if (plots.length === 0) {
        setHarvestSchedules([]);
        return;
      }

      const allSchedules = [];

      // Fetch schedules for each plot
      for (const plot of plots) {
        const response = await fetch(
          `${API_URL}/api/harvest-schedules/plot/${plot.plot_id}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            allSchedules.push(...data.data);
          }
        }
      }

      setHarvestSchedules(allSchedules);
    } catch (error) {
      console.error("Error fetching harvest schedules:", error);
      toast.error("Failed to load your harvest schedules");
    } finally {
      setIsSchedulesLoading(false);
    }
  };

  // Function to fetch crop rotations for this farmer's plots
  const fetchFarmerCropRotations = async () => {
    setIsRotationsLoading(true);
    try {
      if (plots.length === 0) {
        setCropRotations([]);
        return;
      }

      const allRotations = [];

      // Fetch rotations for each plot
      for (const plot of plots) {
        const response = await fetch(
          `${API_URL}/api/crop-rotations/plot/${plot.plot_id}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            allRotations.push(...data.data);
          }
        }
      }

      setCropRotations(allRotations);
    } catch (error) {
      console.error("Error fetching crop rotations:", error);
      toast.error("Failed to load your crop rotations");
    } finally {
      setIsRotationsLoading(false);
    }
  };

  // Function to fetch activity logs for this farmer's plots
  const fetchFarmerActivityLogs = async () => {
    setIsActivitiesLoading(true);
    try {
      if (plots.length === 0) {
        setActivityLogs([]);
        return;
      }

      const allActivities = [];

      // Fetch activities for each plot
      for (const plot of plots) {
        const response = await fetch(
          `${API_URL}/api/activity-logs/plot/${plot.plot_id}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            allActivities.push(...data.data);
          }
        }
      }

      setActivityLogs(allActivities);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      toast.error("Failed to load your activity logs");
    } finally {
      setIsActivitiesLoading(false);
    }
  };

  // Format date or return placeholder
  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  // Get soil type badge
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

  // Check if user is a farmer
  if (isUserLoaded && !isRole) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-[450px] text-center">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              This page is for farmers only. Please contact an administrator if
              you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle loading state
  if (!isUserLoaded || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle no plots found
  if (isUserLoaded && plots.length === 0) {
    return (
      <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user.firstName || "Farmer"}</CardTitle>
            <CardDescription>Farmer Dashboard</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Info className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No plots assigned yet</h3>
            <p className="text-muted-foreground">
              You don't have any plots assigned to you yet. Please contact an
              administrator to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-3 md:py-6 md:px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Farmer Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user.firstName || farmerId}
          </p>
        </div>

        {/* Mobile Menu Button - Only keep this ONE implementation */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSheetOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[240px] sm:w-[300px] bg-white"
            >
              <div className="py-4">
                <div className="space-y-1 flex flex-col">
                  <Button
                    variant={activeTab === "overview" ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => {
                      setActiveTab("overview");
                      setIsSheetOpen(false);
                    }}
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" /> Overview
                  </Button>
                  <Button
                    variant={activeTab === "plots" ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => {
                      setActiveTab("plots");
                      setIsSheetOpen(false);
                    }}
                  >
                    <Map className="h-4 w-4 mr-2" /> Plots
                  </Button>
                  <Button
                    variant={activeTab === "crops" ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => {
                      setActiveTab("crops");
                      setIsSheetOpen(false);
                    }}
                  >
                    <Sprout className="h-4 w-4 mr-2" /> Crops
                  </Button>
                  <Button
                    variant={activeTab === "schedule" ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => {
                      setActiveTab("schedule");
                      setIsSheetOpen(false);
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" /> Schedules
                  </Button>
                  <Button
                    variant={activeTab === "rotations" ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => {
                      setActiveTab("rotations");
                      setIsSheetOpen(false);
                    }}
                  >
                    <RotateCw className="h-4 w-4 mr-2" /> Rotations
                  </Button>
                  <Button
                    variant={activeTab === "activities" ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => {
                      setActiveTab("activities");
                      setIsSheetOpen(false);
                    }}
                  >
                    <Droplets className="h-4 w-4 mr-2" /> Activities
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Tabs - Add this section */}
      <div className="hidden md:block mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full max-w-[800px]">
            <TabsTrigger value="overview">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="plots">
              <Map className="h-4 w-4 mr-2" />
              <span>Plots</span>
            </TabsTrigger>
            <TabsTrigger value="crops">
              <Sprout className="h-4 w-4 mr-2" />
              <span>Crops</span>
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Schedules</span>
            </TabsTrigger>
            <TabsTrigger value="rotations">
              <RotateCw className="h-4 w-4 mr-2" />
              <span>Rotations</span>
            </TabsTrigger>
            <TabsTrigger value="activities">
              <Droplets className="h-4 w-4 mr-2" />
              <span>Activities</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile Tab Indicator - Keep this */}
      <div className="md:hidden mb-4">
        <Card>
          <CardHeader className="py-2 px-4">
            <div className="flex items-center space-x-1">
              {activeTab === "overview" && (
                <LayoutDashboard className="h-4 w-4 mr-1" />
              )}
              {activeTab === "plots" && <Map className="h-4 w-4 mr-1" />}
              {activeTab === "crops" && <Sprout className="h-4 w-4 mr-1" />}
              {activeTab === "schedule" && (
                <Calendar className="h-4 w-4 mr-1" />
              )}
              {activeTab === "rotations" && (
                <RotateCw className="h-4 w-4 mr-1" />
              )}
              {activeTab === "activities" && (
                <Droplets className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </span>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Overview Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Plots</CardTitle>
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
                {harvestSchedules && harvestSchedules.length > 0 ? (
                  <>
                    <div className="text-2xl font-bold">
                      {formatDate(harvestSchedules[0].expected_harvest_date)
                        .split(" ")
                        .slice(0, 2)
                        .join(" ")}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {harvestSchedules.length} scheduled harvests
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-2xl font-bold">No data</div>
                    <p className="text-xs text-muted-foreground">
                      No upcoming harvests
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Recent activities on your plots</CardDescription>
            </CardHeader>
            <CardContent>
              {activityLogs && activityLogs.length > 0 ? (
                <div className="space-y-4">
                  {activityLogs.slice(0, 3).map((log) => (
                    <div key={log.activity_id} className="flex items-center">
                      <div
                        className={`mr-4 p-2 rounded-full ${
                          log.type === "Irrigation"
                            ? "bg-blue-100"
                            : "bg-green-100"
                        }`}
                      >
                        {log.type === "Irrigation" ? (
                          <Droplets className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Sprout className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {log.type} on Plot {log.plot_id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(log.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No recent activities found
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Plots Tab Content */}
      {activeTab === "plots" && (
        <Card>
          <CardHeader>
            <CardTitle>My Plots</CardTitle>
            <CardDescription>
              View all your assigned plots and their details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full rounded-md border">
              <div className="w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plot ID</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Location
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Soil Type
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Lease Period
                      </TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plots.map((plot) => (
                      <TableRow key={plot.plot_id}>
                        <TableCell className="font-medium">
                          {plot.plot_id}
                        </TableCell>
                        <TableCell>{plot.size}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {plot.location}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {getSoilTypeBadge(plot.soil_type)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {formatDate(plot.lease_start).split(" ")[0]} -{" "}
                          {formatDate(plot.lease_end).split(" ")[0]}
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Crops Tab Content */}
      {activeTab === "crops" && (
        <Card>
          <CardHeader>
            <CardTitle>My Crops</CardTitle>
            <CardDescription>
              View all crops planted in your plots
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isCropsLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ScrollArea className="w-full rounded-md border">
                <div className="w-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Variety
                        </TableHead>
                        <TableHead>Plot</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Planted
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Harvest
                        </TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {crops.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No crops found for your plots.
                          </TableCell>
                        </TableRow>
                      ) : (
                        crops.map((crop) => (
                          <TableRow key={crop.crop_id}>
                            <TableCell className="font-medium">
                              {crop.name}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {crop.variety || "N/A"}
                            </TableCell>
                            <TableCell>{crop.plot_id}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatDate(crop.planting_date).split(" ")[0]}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {formatDate(crop.harvest_date).split(" ")[0]}
                            </TableCell>
                            <TableCell>
                              {getCropStatusBadge(crop.status)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}

      {/* Harvest Schedule Tab Content */}
      {activeTab === "schedule" && (
        <Card>
          <CardHeader>
            <CardTitle>Harvest Schedules</CardTitle>
            <CardDescription>
              View upcoming harvests for your plots
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSchedulesLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ScrollArea className="w-full rounded-md border">
                <div className="w-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plot</TableHead>
                        <TableHead>Crop</TableHead>
                        <TableHead>Expected</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Actual
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {harvestSchedules.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            No harvest schedules found for your plots.
                          </TableCell>
                        </TableRow>
                      ) : (
                        harvestSchedules.map((schedule) => (
                          <TableRow key={schedule.schedule_id}>
                            <TableCell>{schedule.plot_id}</TableCell>
                            <TableCell>
                              {schedule.crop?.name ||
                                `Crop #${schedule.crop_id}`}
                            </TableCell>
                            <TableCell>
                              {
                                formatDate(
                                  schedule.expected_harvest_date
                                ).split(" ")[0]
                              }
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {schedule.actual_harvest_date ? (
                                formatDate(schedule.actual_harvest_date).split(
                                  " "
                                )[0]
                              ) : (
                                <Badge variant="outline">Not harvested</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}

      {/* Crop Rotation Tab Content */}
      {activeTab === "rotations" && (
        <Card>
          <CardHeader>
            <CardTitle>Crop Rotations</CardTitle>
            <CardDescription>
              View crop rotation plans for your plots
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRotationsLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ScrollArea className="w-full rounded-md border">
                <div className="w-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plot</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Previous
                        </TableHead>
                        <TableHead>Next</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Rotation Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cropRotations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            No crop rotations found for your plots.
                          </TableCell>
                        </TableRow>
                      ) : (
                        cropRotations.map((rotation) => (
                          <TableRow key={rotation.rotation_id}>
                            <TableCell>{rotation.plot_id}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {rotation.previous_crop}
                            </TableCell>
                            <TableCell>{rotation.next_crop}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {formatDate(rotation.rotation_date).split(" ")[0]}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}

      {/* Activity Logs Tab Content */}
      {activeTab === "activities" && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Logs</CardTitle>
            <CardDescription>
              View all activities performed on your plots
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isActivitiesLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <ScrollArea className="w-full rounded-md border">
                <div className="w-full overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Plot</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Notes
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activityLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-24 text-center">
                            No activity logs found for your plots.
                          </TableCell>
                        </TableRow>
                      ) : (
                        activityLogs.map((activity) => (
                          <TableRow key={activity.activity_id}>
                            <TableCell>
                              {formatDate(activity.date).split(" ")[0]}
                            </TableCell>
                            <TableCell>{activity.plot_id}</TableCell>
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
                            <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                              {activity.notes || "No notes"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default FarmerDashboard;
