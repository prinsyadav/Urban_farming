// import { useState, useEffect } from "react";
// import { useUser } from "@clerk/clerk-react";
// import { format } from "date-fns";
// import { toast } from "sonner";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
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
// import { Eye, Loader2, Filter } from "lucide-react";
// import { Separator } from "@/components/ui/separator";
// import { PlotDetailsDialog } from "../../assets/component/plots/PlotDetailsDialog";

// function MyPlots() {
//   const { user } = useUser();
//   const [plots, setPlots] = useState([]);
//   const [selectedPlot, setSelectedPlot] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   useEffect(() => {
//     if (user?.id) {
//       fetchFarmerPlots();
//     }
//   }, [user?.id]);

//   const fetchFarmerPlots = async () => {
//     setIsLoading(true);
//     try {
//       // Use the owner_id from the user to filter plots
//       const response = await fetch(
//         `http://localhost:3000/api/plots?owner_id=${user.id}`
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch plots");
//       }
//       const data = await response.json();
//       setPlots(data.data || []);
//     } catch (error) {
//       console.error("Error fetching plots:", error);
//       toast.error("Failed to load your plots");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleViewDetails = (plot) => {
//     setSelectedPlot(plot);
//     setIsDialogOpen(true);
//   };

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

//   return (
//     <div className="container mx-auto py-6 px-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold tracking-tight">My Plots</h1>
//         <Button variant="outline" className="flex items-center gap-2">
//           <Filter className="h-4 w-4" /> Filter
//         </Button>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>My Leased Plots</CardTitle>
//           <CardDescription>
//             View all your plots and their details
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="flex justify-center items-center py-8">
//               <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             </div>
//           ) : (
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Plot ID</TableHead>
//                     <TableHead>Size (acres)</TableHead>
//                     <TableHead>Location</TableHead>
//                     <TableHead>Soil Type</TableHead>
//                     <TableHead>Lease Period</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead className="w-[100px]">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {plots.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={7} className="h-24 text-center">
//                         No plots found for your account.
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     plots.map((plot) => (
//                       <TableRow key={plot.plot_id}>
//                         <TableCell className="font-medium">
//                           {plot.plot_id}
//                         </TableCell>
//                         <TableCell>{plot.size}</TableCell>
//                         <TableCell>{plot.location}</TableCell>
//                         <TableCell>
//                           {getSoilTypeBadge(plot.soil_type)}
//                         </TableCell>
//                         <TableCell>
//                           {format(new Date(plot.lease_start), "MMM d, yyyy")} -{" "}
//                           {format(new Date(plot.lease_end), "MMM d, yyyy")}
//                         </TableCell>
//                         <TableCell>
//                           <Badge
//                             variant={
//                               plot.status === "active" ? "default" : "secondary"
//                             }
//                           >
//                             {plot.status}
//                           </Badge>
//                         </TableCell>
//                         <TableCell>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             className="flex items-center gap-1"
//                             onClick={() => handleViewDetails(plot)}
//                           >
//                             <Eye className="h-4 w-4" /> Details
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Plot stats summary */}
//       {plots.length > 0 && !isLoading && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm">Total Area</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold">
//                 {plots
//                   .reduce((sum, plot) => sum + parseFloat(plot.size), 0)
//                   .toFixed(2)}{" "}
//                 acres
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm">Active Plots</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold">
//                 {plots.filter((plot) => plot.status === "active").length}
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="pb-2">
//               <CardTitle className="text-sm">Average Plot Size</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-2xl font-bold">
//                 {(
//                   plots.reduce((sum, plot) => sum + parseFloat(plot.size), 0) /
//                   plots.length
//                 ).toFixed(2)}{" "}
//                 acres
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Plot Details Dialog */}
//       {selectedPlot && (
//         <PlotDetailsDialog
//           plot={selectedPlot}
//           open={isDialogOpen}
//           onOpenChange={setIsDialogOpen}
//         />
//       )}
//     </div>
//   );
// }

// export default MyPlots;
