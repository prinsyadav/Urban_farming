// import { useState, useEffect } from "react";
// import { useUser } from "@clerk/clerk-react";
// import {
//   format,
//   parseISO,
//   addDays,
//   eachDayOfInterval,
//   isSameMonth,
//   isSameDay,
// } from "date-fns";
// import {
//   Calendar as CalendarIcon,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";

// function CropCalendar() {
//   const { user } = useUser();
//   const [date, setDate] = useState(new Date());
//   const [crops, setCrops] = useState([]);
//   const [schedules, setSchedules] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedDayEvents, setSelectedDayEvents] = useState([]);

//   useEffect(() => {
//     if (user?.id) {
//       fetchCropData();
//     }
//   }, [user?.id]);

//   useEffect(() => {
//     // Filter events for the selected day
//     const events = [
//       ...crops.map((crop) => ({
//         type: "planting",
//         date: new Date(crop.planting_date),
//         crop: crop.name,
//         variety: crop.variety,
//         plot_id: crop.plot_id,
//       })),
//       ...crops.map((crop) => ({
//         type: "harvest",
//         date: new Date(crop.harvest_date),
//         crop: crop.name,
//         variety: crop.variety,
//         plot_id: crop.plot_id,
//       })),
//       ...schedules.map((schedule) => ({
//         type: "scheduled_harvest",
//         date: new Date(schedule.expected_harvest_date),
//         plot_id: schedule.plot_id,
//         status: schedule.actual_harvest_date ? "completed" : "pending",
//       })),
//     ].filter((event) => isSameDay(event.date, date));

//     setSelectedDayEvents(events);
//   }, [date, crops, schedules]);

//   const fetchCropData = async () => {
//     setIsLoading(true);
//     try {
//       // First get the farmer's plots
//       const plotsResponse = await fetch(
//         `http://localhost:3000/api/plots?owner_id=${user.id}`
//       );

//       if (!plotsResponse.ok) {
//         throw new Error("Failed to fetch plots");
//       }

//       const plotsData = await plotsResponse.json();
//       const plots = plotsData.data || [];

//       if (plots.length > 0) {
//         const plotIds = plots.map((plot) => plot.plot_id).join(",");

//         // Fetch crops
//         const cropsResponse = await fetch(
//           `http://localhost:3000/api/crops?plotIds=${plotIds}`
//         );

//         if (cropsResponse.ok) {
//           const cropsData = await cropsResponse.json();
//           setCrops(cropsData.data || []);
//         }

//         // Fetch schedules
//         const schedulesResponse = await fetch(
//           `http://localhost:3000/api/schedules?plotIds=${plotIds}`
//         );

//         if (schedulesResponse.ok) {
//           const schedulesData = await schedulesResponse.json();
//           setSchedules(schedulesData.data || []);
//         }
//       } else {
//         setCrops([]);
//         setSchedules([]);
//       }
//     } catch (error) {
//       console.error("Error fetching crop data:", error);
//       toast.error("Failed to load crop data");

//       // Mock data
//       setCrops([
//         {
//           id: 1,
//           plot_id: "PLOT-001",
//           name: "Corn",
//           variety: "Sweet Corn",
//           planting_date: new Date(2024, 3, 15),
//           harvest_date: new Date(2024, 8, 1),
//           status: "Growing",
//         },
//         {
//           id: 2,
//           plot_id: "PLOT-002",
//           name: "Tomato",
//           variety: "Roma",
//           planting_date: new Date(2024, 3, 20),
//           harvest_date: new Date(2024, 6, 15),
//           status: "Growing",
//         },
//       ]);

//       setSchedules([
//         {
//           id: 1,
//           plot_id: "PLOT-001",
//           crop_id: 1,
//           expected_harvest_date: new Date(2024, 8, 1),
//           actual_harvest_date: null,
//         },
//         {
//           id: 2,
//           plot_id: "PLOT-002",
//           crop_id: 2,
//           expected_harvest_date: new Date(2024, 6, 15),
//           actual_harvest_date: null,
//         },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Highlight dates with events
//   const getDayClassNames = (day) => {
//     const hasPlanting = crops.some((crop) =>
//       isSameDay(new Date(crop.planting_date), day)
//     );

//     const hasHarvest = crops.some((crop) =>
//       isSameDay(new Date(crop.harvest_date), day)
//     );

//     const hasSchedule = schedules.some((schedule) =>
//       isSameDay(new Date(schedule.expected_harvest_date), day)
//     );

//     if (hasPlanting && hasHarvest) {
//       return "bg-purple-100 text-purple-800 font-bold";
//     } else if (hasPlanting) {
//       return "bg-green-100 text-green-800 font-bold";
//     } else if (hasHarvest) {
//       return "bg-yellow-100 text-yellow-800 font-bold";
//     } else if (hasSchedule) {
//       return "bg-blue-100 text-blue-800 font-bold";
//     }

//     return "";
//   };

//   const getEventBadge = (eventType) => {
//     switch (eventType) {
//       case "planting":
//         return <Badge className="bg-green-500">Planting</Badge>;
//       case "harvest":
//         return <Badge className="bg-yellow-500">Harvest</Badge>;
//       case "scheduled_harvest":
//         return <Badge className="bg-blue-500">Scheduled Harvest</Badge>;
//       default:
//         return <Badge>Event</Badge>;
//     }
//   };

//   return (
//     <div className="grid gap-4 md:grid-cols-2">
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex justify-between items-center">
//             <span>Crop Calendar</span>
//             <div className="flex gap-1">
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => setDate(new Date())}
//               >
//                 <CalendarIcon className="h-4 w-4" />
//               </Button>
//             </div>
//           </CardTitle>
//           <CardDescription>
//             View all planting and harvesting schedules
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="space-y-2">
//               <Skeleton className="h-[300px] w-full" />
//             </div>
//           ) : (
//             <Calendar
//               mode="single"
//               selected={date}
//               onSelect={setDate}
//               className="rounded-md border"
//               modifiers={{
//                 hasEvent: (date) => {
//                   return (
//                     crops.some(
//                       (crop) =>
//                         isSameDay(new Date(crop.planting_date), date) ||
//                         isSameDay(new Date(crop.harvest_date), date)
//                     ) ||
//                     schedules.some((schedule) =>
//                       isSameDay(new Date(schedule.expected_harvest_date), date)
//                     )
//                   );
//                 },
//               }}
//               modifiersClassNames={{
//                 hasEvent: "bg-green-100 font-bold text-green-800",
//               }}
//             />
//           )}
//           <div className="mt-4 flex gap-2">
//             <div className="flex items-center">
//               <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
//               <span className="text-xs">Planting</span>
//             </div>
//             <div className="flex items-center">
//               <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
//               <span className="text-xs">Harvesting</span>
//             </div>
//             <div className="flex items-center">
//               <div className="mr-2 h-3 w-3 rounded-full bg-blue-500"></div>
//               <span className="text-xs">Scheduled</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Events for {format(date, "MMMM d, yyyy")}</CardTitle>
//           <CardDescription>
//             Crop activities scheduled for this day
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="space-y-2">
//               <Skeleton className="h-12 w-full" />
//               <Skeleton className="h-12 w-full" />
//             </div>
//           ) : selectedDayEvents.length === 0 ? (
//             <div className="text-center py-8 text-muted-foreground">
//               No events scheduled for this day
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {selectedDayEvents.map((event, index) => (
//                 <div key={index} className="p-3 border rounded-md bg-muted/50">
//                   <div className="flex justify-between items-center mb-1">
//                     <div className="font-medium">
//                       {event.crop
//                         ? `${event.crop} (${event.variety || "Standard"})`
//                         : "Crop Activity"}
//                     </div>
//                     {getEventBadge(event.type)}
//                   </div>
//                   <div className="text-sm text-muted-foreground">
//                     Plot: {event.plot_id}
//                   </div>
//                   {event.status && (
//                     <div className="text-sm mt-1">
//                       Status:{" "}
//                       <Badge
//                         variant={
//                           event.status === "completed" ? "secondary" : "outline"
//                         }
//                       >
//                         {event.status === "completed" ? "Completed" : "Pending"}
//                       </Badge>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       <Card className="md:col-span-2">
//         <CardHeader>
//           <CardTitle>Upcoming Harvests</CardTitle>
//           <CardDescription>Next 30 days harvest timeline</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="space-y-2">
//               <Skeleton className="h-16 w-full" />
//               <Skeleton className="h-16 w-full" />
//               <Skeleton className="h-16 w-full" />
//             </div>
//           ) : crops.length === 0 ? (
//             <div className="text-center py-8 text-muted-foreground">
//               No upcoming harvests in the next 30 days
//             </div>
//           ) : (
//             <div className="relative">
//               <div className="absolute top-0 bottom-0 left-16 w-px bg-muted"></div>
//               <div className="space-y-6">
//                 {crops
//                   .filter((crop) => {
//                     const harvestDate = new Date(crop.harvest_date);
//                     const today = new Date();
//                     const inThirtyDays = addDays(today, 30);
//                     return harvestDate >= today && harvestDate <= inThirtyDays;
//                   })
//                   .sort(
//                     (a, b) =>
//                       new Date(a.harvest_date) - new Date(b.harvest_date)
//                   )
//                   .map((crop, index) => (
//                     <div key={index} className="flex gap-4 relative">
//                       <div className="w-16 text-right text-sm text-muted-foreground">
//                         {format(new Date(crop.harvest_date), "MMM d")}
//                       </div>
//                       <div className="absolute left-16 w-3 h-3 rounded-full bg-primary transform -translate-x-1.5 mt-1"></div>
//                       <div className="pl-6">
//                         <div className="font-medium">{crop.name} Harvest</div>
//                         <div className="text-sm text-muted-foreground">
//                           Plot: {crop.plot_id} • Variety:{" "}
//                           {crop.variety || "Standard"}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// export default CropCalendar;
