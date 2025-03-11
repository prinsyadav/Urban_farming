// import { useEffect, useState } from "react";
// import { useUser } from "@clerk/clerk-react";
// import { toast } from "sonner";
// import { format } from "date-fns";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { PlotDetailsDialog } from "../../assets/component/plots/PlotDetailsDialog";
// import {
//   Loader2,
//   LayoutDashboard,
//   Sprout,
//   Calendar,
//   Map,
//   PieChart,
//   FileText,
//   Info,
//   Download,
//   BarChart,
// } from "lucide-react";
// import { ScrollArea } from "@/components/ui/scroll-area";

// function FarmerDashboard() {
//   const { user } = useUser();
//   const [plots, setPlots] = useState([]);
//   const [crops, setCrops] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isCropsLoading, setIsCropsLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [selectedPlot, setSelectedPlot] = useState(null);
//   const [plotDetailsOpen, setPlotDetailsOpen] = useState(false);
//   const [error, setError] = useState(null);
//   const [dashboardStats, setDashboardStats] = useState({
//     totalPlots: 0,
//     activePlots: 0,
//     totalArea: 0,
//     cropsPlanted: 0,
//     upcomingHarvests: 0,
//   });

//   // Get owner_id from clerk metadata
//   const ownerId = user?.publicMetadata?.owner_id;

//   // Fetch all plots for this farmer when component mounts
//   useEffect(() => {
//     if (ownerId) {
//       console.log("Fetching plots for owner:", ownerId);
//       fetchFarmerPlots(ownerId);
//       // Also fetch reports when we have an owner ID
//       fetchReports(ownerId);
//     } else {
//       console.warn("No owner_id found in user metadata:", user?.publicMetadata);
//       setIsLoading(false);
//       setIsReportsLoading(false);
//       toast.warning(
//         "Owner ID not found in your profile. Please contact an administrator."
//       );
//     }
//   }, [ownerId, user?.publicMetadata]);

//   // Update dashboard stats when plots or crops change
//   useEffect(() => {
//     if (plots.length > 0) {
//       const activePlots = plots.filter(
//         (plot) => plot.status === "active"
//       ).length;
//       const totalArea = plots.reduce(
//         (sum, plot) => sum + parseFloat(plot.size),
//         0
//       );

//       setDashboardStats((prev) => ({
//         ...prev,
//         totalPlots: plots.length,
//         activePlots,
//         totalArea: totalArea.toFixed(2),
//       }));
//     }

//     if (crops.length > 0) {
//       // Count upcoming harvests (crops with harvest dates in the future)
//       const now = new Date();
//       const upcomingHarvests = crops.filter((crop) => {
//         return crop.harvest_date && new Date(crop.harvest_date) > now;
//       }).length;

//       setDashboardStats((prev) => ({
//         ...prev,
//         cropsPlanted: crops.length,
//         upcomingHarvests,
//       }));
//     }
//   }, [plots, crops]);

//   // Function to fetch plots from the API for a specific owner
//   const fetchFarmerPlots = async (ownerId) => {
//     setIsLoading(true);
//     try {
//       // Ensure we're using the correct query parameter name that the backend expects
//       const response = await fetch(
//         `http://localhost:3000/api/plots?owner=${ownerId}`
//       );

//       if (!response.ok) {
//         if (response.status === 404) {
//           // Handle 404 specifically
//           console.warn("No plots found for this owner");
//           setPlots([]);
//           setCrops([]);
//           setIsCropsLoading(false);
//           return;
//         }
//         throw new Error(`Failed to fetch plots: ${response.statusText}`);
//       }

//       const data = await response.json();
//       setPlots(data.data || []);

//       // After getting plots, fetch all crops for these plots
//       if (data.data && data.data.length > 0) {
//         fetchAllCropsForPlots(data.data.map((plot) => plot.plot_id));
//       } else {
//         setCrops([]);
//         setIsCropsLoading(false);
//       }
//     } catch (error) {
//       console.error("Error fetching plots:", error);
//       setError(error.message);
//       toast.error("Failed to load your plots. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Function to fetch crops for all plots of this farmer
//   const fetchAllCropsForPlots = async (plotIds) => {
//     if (!plotIds || plotIds.length === 0) {
//       setIsCropsLoading(false);
//       return;
//     }

//     setIsCropsLoading(true);
//     try {
//       // For simplicity, we'll fetch all crops and filter client-side
//       const response = await fetch("http://localhost:3000/api/crops");

//       if (!response.ok) {
//         throw new Error(`Failed to fetch crops: ${response.statusText}`);
//       }

//       const data = await response.json();

//       // Filter crops to only those on this farmer's plots
//       const farmerCrops = (data.data || []).filter((crop) =>
//         plotIds.includes(crop.plot_id)
//       );

//       setCrops(farmerCrops);
//     } catch (error) {
//       console.error("Error fetching crops:", error);
//       setError(error.message);
//       toast.error("Failed to load crop information");
//     } finally {
//       setIsCropsLoading(false);
//     }
//   };

//   // Function to fetch reports by owner ID
//   const fetchReports = async (ownerId) => {
//     setIsReportsLoading(true);
//     try {
//       // In a real application, you'd fetch this from your API
//       // For now, let's mock some data based on the crops we have

//       setTimeout(() => {
//         // Create mock reports based on crops that have been harvested
//         if (crops.length > 0) {
//           const mockReports = crops
//             .filter((crop) => crop.status === "Harvested")
//             .map((crop) => {
//               const plot = plots.find((p) => p.plot_id === crop.plot_id);
//               return {
//                 report_id: `R${crop.crop_id}`,
//                 crop_id: crop.crop_id,
//                 crop_name: crop.name,
//                 variety: crop.variety || "Standard",
//                 plot_id: crop.plot_id,
//                 plot_location: plot?.location || "Unknown",
//                 planting_date: crop.planting_date,
//                 harvest_date: crop.harvest_date,
//                 yield_amount: Math.floor(Math.random() * 500) + 200, // Mock yield in kg
//                 yield_quality: ["Excellent", "Good", "Average"][
//                   Math.floor(Math.random() * 3)
//                 ],
//                 notes: "Regular harvest with standard processing.",
//                 created_at: new Date(),
//               };
//             });

//           setReports(mockReports);
//         }
//         setIsReportsLoading(false);
//       }, 800);
//     } catch (error) {
//       console.error("Error fetching reports:", error);
//       setError("Failed to load yield reports");
//       toast.error("Failed to load yield reports");
//       setIsReportsLoading(false);
//     }
//   };

//   // Handle viewing plot details
//   const handleViewPlotDetails = (plot) => {
//     setSelectedPlot(plot);
//     setPlotDetailsOpen(true);
//   };

//   // Check if user is a farmer
//   const isFarmer = user?.publicMetadata?.role === "farmer";

//   if (!isFarmer) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Card className="w-[450px] text-center">
//           <CardHeader>
//             <CardTitle>Access Denied</CardTitle>
//             <CardDescription>
//               You don't have permission to view this page.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <p>
//               Please contact an administrator if you believe this is an error.
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // Format date or return placeholder
//   const formatDate = (dateString) => {
//     if (!dateString) return "Not scheduled";
//     return format(new Date(dateString), "MMM d, yyyy");
//   };

//   // Get crop status badge
//   const getCropStatusBadge = (status) => {
//     const colors = {
//       Planted: "bg-blue-500",
//       Growing: "bg-green-500",
//       Harvested: "bg-amber-500",
//     };

//     return (
//       <Badge className={`${colors[status] || "bg-gray-500"}`}>{status}</Badge>
//     );
//   };

//   // Get plot status badge
//   const getPlotStatusBadge = (status) => {
//     const colors = {
//       active: "bg-green-500",
//       inactive: "bg-gray-500",
//       pending: "bg-yellow-500",
//     };

//     return (
//       <Badge className={`${colors[status] || "bg-gray-500"}`}>{status}</Badge>
//     );
//   };

//   // Get soil type badge
//   const getSoilTypeBadge = (soilType) => {
//     const colors = {
//       clay: "bg-amber-500",
//       sandy: "bg-yellow-200",
//       loamy: "bg-green-700",
//       silt: "bg-blue-700",
//       peat: "bg-brown-700",
//     };

//     return (
//       <Badge className={`${colors[soilType] || "bg-gray-500"}`}>
//         {soilType}
//       </Badge>
//     );
//   };

//   // Calculate days until harvest for a crop
//   const getDaysUntilHarvest = (harvestDate) => {
//     if (!harvestDate) return null;

//     const today = new Date();
//     const harvest = new Date(harvestDate);
//     const diffTime = Math.abs(harvest - today);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//     return harvest > today ? diffDays : null;
//   };

//   // If there's a critical error, show error state
//   if (error && !plots.length && !crops.length) {
//     return (
//       <div className="container mx-auto py-6 px-4">
//         <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
//           <h2 className="text-xl font-bold text-red-700 mb-2">
//             Something went wrong
//           </h2>
//           <p className="text-red-600 mb-4">
//             We encountered an error while loading your dashboard data.
//           </p>
//           <p className="text-gray-600 mb-4">Error details: {error}</p>
//           <Button
//             onClick={() => window.location.reload()}
//             className="bg-red-600 hover:bg-red-700 text-white"
//           >
//             Try Again
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-6 px-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
//         <div className="text-sm text-muted-foreground">
//           Welcome back, {user?.firstName || "Farmer"}
//         </div>
//       </div>

//       {/* Dashboard Tabs */}
//       <Tabs
//         defaultValue="overview"
//         value={activeTab}
//         onValueChange={setActiveTab}
//         className="mb-6"
//       >
//         <TabsList className="grid grid-cols-4 w-[550px]">
//           <TabsTrigger value="overview">
//             <LayoutDashboard className="h-4 w-4 mr-2" />
//             Overview
//           </TabsTrigger>
//           <TabsTrigger value="myplots">
//             <Map className="h-4 w-4 mr-2" />
//             My Plots
//           </TabsTrigger>
//           <TabsTrigger value="crops">
//             <Sprout className="h-4 w-4 mr-2" />
//             Crop Timeline
//           </TabsTrigger>
//           <TabsTrigger value="reports">
//             <BarChart className="h-4 w-4 mr-2" />
//             Yield Reports
//           </TabsTrigger>
//         </TabsList>

//         {/* Overview Tab Content */}
//         <TabsContent value="overview" className="space-y-4">
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">My Plots</CardTitle>
//                 <Map className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {dashboardStats.totalPlots}
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   {dashboardStats.activePlots} active plots
//                 </p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Total Area
//                 </CardTitle>
//                 <PieChart className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {dashboardStats.totalArea} acres
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   Land under management
//                 </p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Crops Planted
//                 </CardTitle>
//                 <Sprout className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {dashboardStats.cropsPlanted}
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   Across all plots
//                 </p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Upcoming Harvests
//                 </CardTitle>
//                 <Calendar className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 <div className="text-2xl font-bold">
//                   {dashboardStats.upcomingHarvests}
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   Scheduled for harvest
//                 </p>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                 <CardTitle className="text-sm font-medium">
//                   Next Harvest
//                 </CardTitle>
//                 <Calendar className="h-4 w-4 text-muted-foreground" />
//               </CardHeader>
//               <CardContent>
//                 {crops.filter(
//                   (c) => c.harvest_date && new Date(c.harvest_date) > new Date()
//                 ).length > 0 ? (
//                   <>
//                     <div className="text-2xl font-bold">
//                       {format(
//                         new Date(
//                           Math.min(
//                             ...crops
//                               .filter(
//                                 (c) =>
//                                   c.harvest_date &&
//                                   new Date(c.harvest_date) > new Date()
//                               )
//                               .map((c) => new Date(c.harvest_date))
//                           )
//                         ),
//                         "MMM dd"
//                       )}
//                     </div>
//                     <p className="text-xs text-muted-foreground">
//                       Days until next harvest:{" "}
//                       {getDaysUntilHarvest(
//                         Math.min(
//                           ...crops
//                             .filter(
//                               (c) =>
//                                 c.harvest_date &&
//                                 new Date(c.harvest_date) > new Date()
//                             )
//                             .map((c) => new Date(c.harvest_date))
//                         )
//                       )}
//                     </p>
//                   </>
//                 ) : (
//                   <>
//                     <div className="text-2xl font-bold">None</div>
//                     <p className="text-xs text-muted-foreground">
//                       No harvests scheduled
//                     </p>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           <div className="grid gap-4 md:grid-cols-2">
//             <Card className="col-span-1">
//               <CardHeader>
//                 <CardTitle>Upcoming Harvests</CardTitle>
//                 <CardDescription>Crops scheduled for harvest</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {isCropsLoading ? (
//                   <div className="flex justify-center items-center py-8">
//                     <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                   </div>
//                 ) : crops.filter(
//                     (crop) =>
//                       crop.harvest_date &&
//                       new Date(crop.harvest_date) > new Date()
//                   ).length === 0 ? (
//                   <div className="text-center py-8 text-muted-foreground">
//                     No upcoming harvests scheduled.
//                   </div>
//                 ) : (
//                   <ScrollArea className="h-[250px]">
//                     <div className="space-y-4">
//                       {crops
//                         .filter(
//                           (crop) =>
//                             crop.harvest_date &&
//                             new Date(crop.harvest_date) > new Date()
//                         )
//                         .sort(
//                           (a, b) =>
//                             new Date(a.harvest_date) - new Date(b.harvest_date)
//                         )
//                         .slice(0, 5)
//                         .map((crop) => {
//                           const plot = plots.find(
//                             (p) => p.plot_id === crop.plot_id
//                           );
//                           const daysUntil = getDaysUntilHarvest(
//                             crop.harvest_date
//                           );

//                           return (
//                             <div
//                               key={crop.crop_id}
//                               className="flex items-center p-4 border rounded-lg"
//                             >
//                               <div className="mr-4 bg-green-100 p-2 rounded-full">
//                                 <Sprout className="h-5 w-5 text-green-600" />
//                               </div>
//                               <div className="flex-1">
//                                 <div className="font-medium">
//                                   {crop.name}{" "}
//                                   {crop.variety ? `(${crop.variety})` : ""}
//                                 </div>
//                                 <div className="text-sm text-muted-foreground">
//                                   Plot: {plot?.location || crop.plot_id}
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 <div className="font-medium">
//                                   {formatDate(crop.harvest_date)}
//                                 </div>
//                                 <div className="text-sm text-muted-foreground">
//                                   {daysUntil} days remaining
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </ScrollArea>
//                 )}
//               </CardContent>
//             </Card>

//             <Card className="col-span-1">
//               <CardHeader>
//                 <CardTitle>Recently Planted</CardTitle>
//                 <CardDescription>
//                   Crops recently planted in your plots
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {isCropsLoading ? (
//                   <div className="flex justify-center items-center py-8">
//                     <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                   </div>
//                 ) : crops.length === 0 ? (
//                   <div className="text-center py-8 text-muted-foreground">
//                     No crops planted yet.
//                   </div>
//                 ) : (
//                   <ScrollArea className="h-[250px]">
//                     <div className="space-y-4">
//                       {crops
//                         .sort(
//                           (a, b) =>
//                             new Date(b.planting_date) -
//                             new Date(a.planting_date)
//                         )
//                         .slice(0, 5)
//                         .map((crop) => {
//                           const plot = plots.find(
//                             (p) => p.plot_id === crop.plot_id
//                           );

//                           return (
//                             <div
//                               key={crop.crop_id}
//                               className="flex items-center p-4 border rounded-lg"
//                             >
//                               <div className="mr-4 bg-blue-100 p-2 rounded-full">
//                                 <Sprout className="h-5 w-5 text-blue-600" />
//                               </div>
//                               <div className="flex-1">
//                                 <div className="font-medium">
//                                   {crop.name}{" "}
//                                   {crop.variety ? `(${crop.variety})` : ""}
//                                 </div>
//                                 <div className="text-sm text-muted-foreground">
//                                   Plot: {plot?.location || crop.plot_id}
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 <div className="font-medium">
//                                   {formatDate(crop.planting_date)}
//                                 </div>
//                                 <div className="text-sm">
//                                   {getCropStatusBadge(crop.status)}
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                     </div>
//                   </ScrollArea>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>

//         {/* My Plots Tab Content */}
//         <TabsContent value="myplots">
//           <Card>
//             <CardHeader>
//               <CardTitle>My Plots</CardTitle>
//               <CardDescription>
//                 Manage and monitor your leased plots
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <div className="flex justify-center items-center py-8">
//                   <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                 </div>
//               ) : (
//                 <div className="rounded-md border">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Plot ID</TableHead>
//                         <TableHead>Location</TableHead>
//                         <TableHead>Size (acres)</TableHead>
//                         <TableHead>Soil Type</TableHead>
//                         <TableHead>Lease Period</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {plots.length === 0 ? (
//                         <TableRow>
//                           <TableCell colSpan={7} className="h-24 text-center">
//                             No plots found. Please contact an administrator to
//                             assign plots to you.
//                           </TableCell>
//                         </TableRow>
//                       ) : (
//                         plots.map((plot) => (
//                           <TableRow key={plot.plot_id}>
//                             <TableCell className="font-medium">
//                               {plot.plot_id}
//                             </TableCell>
//                             <TableCell>{plot.location}</TableCell>
//                             <TableCell>{plot.size}</TableCell>
//                             <TableCell>
//                               {getSoilTypeBadge(plot.soil_type)}
//                             </TableCell>
//                             <TableCell>
//                               {format(
//                                 new Date(plot.lease_start),
//                                 "MMM d, yyyy"
//                               )}{" "}
//                               -{format(new Date(plot.lease_end), "MMM d, yyyy")}
//                             </TableCell>
//                             <TableCell>
//                               {getPlotStatusBadge(plot.status)}
//                             </TableCell>
//                             <TableCell>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => handleViewPlotDetails(plot)}
//                               >
//                                 <Info className="h-4 w-4 mr-1" /> Details
//                               </Button>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Crop Timeline Tab Content */}
//         <TabsContent value="crops">
//           <Card>
//             <CardHeader>
//               <CardTitle>Crop Timeline</CardTitle>
//               <CardDescription>
//                 Overview of planting and harvest schedules
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               {isCropsLoading ? (
//                 <div className="flex justify-center items-center py-8">
//                   <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                 </div>
//               ) : crops.length === 0 ? (
//                 <div className="text-center py-8 text-muted-foreground">
//                   No crops found. Once you plant crops, they will appear here.
//                 </div>
//               ) : (
//                 <div>
//                   {/* Simple Gantt Chart */}
//                   <div className="mt-4 space-y-6">
//                     <div className="flex items-center text-xs text-muted-foreground mb-2">
//                       <div className="w-[200px]">Crop</div>
//                       <div className="flex-1 flex">
//                         {Array.from({ length: 12 }).map((_, i) => (
//                           <div
//                             key={i}
//                             className="flex-1 text-center border-l border-gray-200"
//                           >
//                             {format(
//                               new Date(new Date().getFullYear(), i, 1),
//                               "MMM"
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {crops.map((crop) => {
//                       const plantingDate = new Date(crop.planting_date);
//                       const harvestDate = crop.harvest_date
//                         ? new Date(crop.harvest_date)
//                         : new Date(
//                             plantingDate.getTime() + 90 * 24 * 60 * 60 * 1000
//                           ); // default 90 days growth if no harvest date

//                       const currentYear = new Date().getFullYear();
//                       const startMonth = plantingDate.getMonth();
//                       const endMonth = harvestDate.getMonth();

//                       const startPercentage = (startMonth / 12) * 100;
//                       const duration =
//                         endMonth >= startMonth
//                           ? endMonth - startMonth + harvestDate.getDate() / 30
//                           : 12 -
//                             startMonth +
//                             endMonth +
//                             harvestDate.getDate() / 30;
//                       const widthPercentage = (duration / 12) * 100;

//                       const plot = plots.find(
//                         (p) => p.plot_id === crop.plot_id
//                       );

//                       return (
//                         <div
//                           key={crop.crop_id}
//                           className="flex items-center h-12"
//                         >
//                           <div className="w-[200px] flex items-center">
//                             <div className="font-medium truncate">
//                               {crop.name}{" "}
//                               {crop.variety ? `(${crop.variety})` : ""}
//                               <div className="text-xs text-muted-foreground">
//                                 {plot?.location || crop.plot_id}
//                               </div>
//                             </div>
//                           </div>
//                           <div className="flex-1 relative h-6">
//                             <div
//                               className="absolute h-6 rounded-md bg-green-600 bg-opacity-80 flex items-center justify-center text-xs text-white"
//                               style={{
//                                 left: `${startPercentage}%`,
//                                 width: `${widthPercentage}%`,
//                               }}
//                             >
//                               {crop.name}
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   {/* Crop List with Details */}
//                   <div className="mt-10 border rounded-md">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Crop</TableHead>
//                           <TableHead>Plot</TableHead>
//                           <TableHead>Planting Date</TableHead>
//                           <TableHead>Harvest Date</TableHead>
//                           <TableHead>Days Remaining</TableHead>
//                           <TableHead>Status</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {crops.map((crop) => {
//                           const plot = plots.find(
//                             (p) => p.plot_id === crop.plot_id
//                           );
//                           const daysUntil = getDaysUntilHarvest(
//                             crop.harvest_date
//                           );

//                           return (
//                             <TableRow key={crop.crop_id}>
//                               <TableCell>
//                                 <div className="font-medium">{crop.name}</div>
//                                 <div className="text-xs text-muted-foreground">
//                                   {crop.variety || "Standard"}
//                                 </div>
//                               </TableCell>
//                               <TableCell>
//                                 {plot?.location || crop.plot_id}
//                               </TableCell>
//                               <TableCell>
//                                 {formatDate(crop.planting_date)}
//                               </TableCell>
//                               <TableCell>
//                                 {formatDate(crop.harvest_date)}
//                               </TableCell>
//                               <TableCell>
//                                 {daysUntil
//                                   ? `${daysUntil} days`
//                                   : crop.status === "Harvested"
//                                   ? "Complete"
//                                   : "Unknown"}
//                               </TableCell>
//                               <TableCell>
//                                 {getCropStatusBadge(crop.status)}
//                               </TableCell>
//                             </TableRow>
//                           );
//                         })}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Yield Reports Tab Content - New Tab */}
//         <TabsContent value="reports">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between">
//               <div>
//                 <CardTitle>Yield Reports</CardTitle>
//                 <CardDescription>
//                   Historical data and yield metrics for your harvests
//                 </CardDescription>
//               </div>
//               <Button variant="outline" size="sm">
//                 <Download className="h-4 w-4 mr-2" /> Export Data
//               </Button>
//             </CardHeader>
//             <CardContent>
//               {isReportsLoading ? (
//                 <div className="flex justify-center items-center py-8">
//                   <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                 </div>
//               ) : reports.length === 0 ? (
//                 <div className="text-center py-8 text-muted-foreground">
//                   {crops.length === 0
//                     ? "No crops found. Plant crops to generate reports."
//                     : "No harvest reports available yet. Reports are generated after crops are harvested."}
//                 </div>
//               ) : (
//                 <>
//                   {/* Yield Summary Cards */}
//                   <div className="grid gap-4 md:grid-cols-3 mb-6">
//                     <Card>
//                       <CardHeader className="pb-2">
//                         <CardTitle className="text-sm">Total Yield</CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="text-2xl font-bold">
//                           {reports.reduce(
//                             (sum, report) => sum + report.yield_amount,
//                             0
//                           )}{" "}
//                           kg
//                         </div>
//                       </CardContent>
//                     </Card>

//                     <Card>
//                       <CardHeader className="pb-2">
//                         <CardTitle className="text-sm">
//                           Harvests Completed
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="text-2xl font-bold">
//                           {reports.length}
//                         </div>
//                       </CardContent>
//                     </Card>

//                     <Card>
//                       <CardHeader className="pb-2">
//                         <CardTitle className="text-sm">Average Yield</CardTitle>
//                       </CardHeader>
//                       <CardContent>
//                         <div className="text-2xl font-bold">
//                           {(
//                             reports.reduce(
//                               (sum, report) => sum + report.yield_amount,
//                               0
//                             ) / reports.length
//                           ).toFixed(2)}{" "}
//                           kg
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </div>

//                   {/* Reports Table */}
//                   <div className="rounded-md border">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>Crop</TableHead>
//                           <TableHead>Plot</TableHead>
//                           <TableHead>Harvest Date</TableHead>
//                           <TableHead>Yield</TableHead>
//                           <TableHead>Quality</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {reports.map((report) => (
//                           <TableRow key={report.report_id}>
//                             <TableCell>
//                               <div className="font-medium">
//                                 {report.crop_name}
//                               </div>
//                               <div className="text-xs text-muted-foreground">
//                                 {report.variety || "Standard"}
//                               </div>
//                             </TableCell>
//                             <TableCell>{report.plot_location}</TableCell>
//                             <TableCell>
//                               {formatDate(report.harvest_date)}
//                             </TableCell>
//                             <TableCell>{report.yield_amount} kg</TableCell>
//                             <TableCell>
//                               <Badge
//                                 className={
//                                   report.yield_quality === "Excellent"
//                                     ? "bg-green-500"
//                                     : report.yield_quality === "Good"
//                                     ? "bg-blue-500"
//                                     : "bg-yellow-500"
//                                 }
//                               >
//                                 {report.yield_quality}
//                               </Badge>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>

//                   {/* Yield Trends */}
//                   <div className="mt-8">
//                     <h3 className="text-lg font-medium mb-4">Yield Trends</h3>
//                     <div className="h-60 bg-gray-50 border rounded-md flex items-center justify-center">
//                       <div className="text-center text-muted-foreground">
//                         <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
//                         <p>Yield trend charts will appear here</p>
//                         <p className="text-xs">
//                           Charts are generated after multiple harvests
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* Plot Details Dialog */}
//       {selectedPlot && (
//         <PlotDetailsDialog
//           plot={selectedPlot}
//           open={plotDetailsOpen}
//           onOpenChange={setPlotDetailsOpen}
//         />
//       )}
//     </div>
//   );
// }

// export default FarmerDashboard;
