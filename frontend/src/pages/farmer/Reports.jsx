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
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import {
//   Download,
//   FileText,
//   BarChart3,
//   PieChart,
//   Loader2,
//   Calendar,
//   Filter,
// } from "lucide-react";

// function Reports() {
//   const { user } = useUser();
//   const [reports, setReports] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("harvest");

//   // Mock harvest reports data
//   const harvestReports = [
//     {
//       id: 1,
//       plot_id: "Plot_001",
//       crop: "Wheat",
//       variety: "Winter Wheat",
//       harvest_date: new Date(2024, 6, 15),
//       yield: "45 q/ha",
//       quality: "Good",
//     },
//     {
//       id: 2,
//       plot_id: "Plot_002",
//       crop: "Corn",
//       variety: "Sweet Corn",
//       harvest_date: new Date(2024, 8, 10),
//       yield: "95 q/ha",
//       quality: "Excellent",
//     },
//   ];

//   // Mock yield history data
//   const yieldHistory = [
//     {
//       id: 1,
//       year: 2023,
//       plot_id: "Plot_001",
//       crop: "Wheat",
//       yield: "42 q/ha",
//       compared_to_previous: "+5%",
//     },
//     {
//       id: 2,
//       year: 2022,
//       plot_id: "Plot_001",
//       crop: "Wheat",
//       yield: "40 q/ha",
//       compared_to_previous: "+2%",
//     },
//     {
//       id: 3,
//       year: 2023,
//       plot_id: "Plot_002",
//       crop: "Corn",
//       yield: "90 q/ha",
//       compared_to_previous: "+10%",
//     },
//   ];

//   // Mock soil analysis data
//   const soilAnalysis = [
//     {
//       id: 1,
//       plot_id: "Plot_001",
//       test_date: new Date(2024, 3, 10),
//       ph: 6.8,
//       nitrogen: "Medium",
//       phosphorus: "High",
//       potassium: "Medium",
//       organic_matter: "3.2%",
//     },
//     {
//       id: 2,
//       plot_id: "Plot_002",
//       test_date: new Date(2024, 3, 15),
//       ph: 7.2,
//       nitrogen: "Low",
//       phosphorus: "Medium",
//       potassium: "High",
//       organic_matter: "4.1%",
//     },
//   ];

//   useEffect(() => {
//     // Simulate loading reports
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   const handleDownloadReport = (reportType) => {
//     toast.success(`${reportType} report download started`);
//     // Implement actual download functionality here
//   };

//   return (
//     <div className="container mx-auto py-6 px-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold tracking-tight">Crop Reports</h1>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             className="flex items-center gap-2"
//             onClick={() => handleDownloadReport("All")}
//           >
//             <Download className="h-4 w-4" /> Export All
//           </Button>
//         </div>
//       </div>

//       <Tabs
//         defaultValue="harvest"
//         value={activeTab}
//         onValueChange={setActiveTab}
//         className="mb-6"
//       >
//         <TabsList className="grid grid-cols-3 w-[450px]">
//           <TabsTrigger value="harvest">
//             <Calendar classNameimport { useState, useEffect } from "react";
// import { useUser } from "@clerk/clerk-react";
// import { format } from "date-fns";
// import { toast } from "sonner";
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
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import {
//   Download,
//   FileText,
//   BarChart3,
//   PieChart,
//   Loader2,
//   Calendar,
//   Filter,
// } from "lucide-react";

// function Reports() {
//   const { user } = useUser();
//   const [reports, setReports] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("harvest");

//   // Mock harvest reports data
//   const harvestReports = [
//     {
//       id: 1,
//       plot_id: "Plot_001",
//       crop: "Wheat",
//       variety: "Winter Wheat",
//       harvest_date: new Date(2024, 6, 15),
//       yield: "45 q/ha",
//       quality: "Good",
//     },
//     {
//       id: 2,
//       plot_id: "Plot_002",
//       crop: "Corn",
//       variety: "Sweet Corn",
//       harvest_date: new Date(2024, 8, 10),
//       yield: "95 q/ha",
//       quality: "Excellent",
//     },
//   ];

//   // Mock yield history data
//   const yieldHistory = [
//     {
//       id: 1,
//       year: 2023,
//       plot_id: "Plot_001",
//       crop: "Wheat",
//       yield: "42 q/ha",
//       compared_to_previous: "+5%",
//     },
//     {
//       id: 2,
//       year: 2022,
//       plot_id: "Plot_001",
//       crop: "Wheat",
//       yield: "40 q/ha",
//       compared_to_previous: "+2%",
//     },
//     {
//       id: 3,
//       year: 2023,
//       plot_id: "Plot_002",
//       crop: "Corn",
//       yield: "90 q/ha",
//       compared_to_previous: "+10%",
//     },
//   ];

//   // Mock soil analysis data
//   const soilAnalysis = [
//     {
//       id: 1,
//       plot_id: "Plot_001",
//       test_date: new Date(2024, 3, 10),
//       ph: 6.8,
//       nitrogen: "Medium",
//       phosphorus: "High",
//       potassium: "Medium",
//       organic_matter: "3.2%",
//     },
//     {
//       id: 2,
//       plot_id: "Plot_002",
//       test_date: new Date(2024, 3, 15),
//       ph: 7.2,
//       nitrogen: "Low",
//       phosphorus: "Medium",
//       potassium: "High",
//       organic_matter: "4.1%",
//     },
//   ];

//   useEffect(() => {
//     // Simulate loading reports
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   const handleDownloadReport = (reportType) => {
//     toast.success(`${reportType} report download started`);
//     // Implement actual download functionality here
//   };

//   return (
//     <div className="container mx-auto py-6 px-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold tracking-tight">Crop Reports</h1>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             className="flex items-center gap-2"
//             onClick={() => handleDownloadReport("All")}
//           >
//             <Download className="h-4 w-4" /> Export All
//           </Button>
//         </div>
//       </div>

//       <Tabs
//         defaultValue="harvest"
//         value={activeTab}
//         onValueChange={setActiveTab}
//         className="mb-6"
//       >
//         <TabsList className="grid grid-cols-3 w-[450px]">
//           <TabsTrigger value="harvest">
//             <Calendar className="h-6 w-6" /> Harvest
//             </TabsTrigger>
//             <TabsTrigger value="yield">
//                 <BarChart3 className="h-6 w-6" /> Yield History
//             </TabsTrigger>
//             <TabsTrigger value="soil">
//                 <PieChart className="h-6 w-6" /> Soil Analysis
//             </TabsTrigger>
//             </TabsList>
//             <TabsContent>
//                 <div className="mb-6">
//                     {activeTab === "harvest" && (
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Harvest Reports</CardTitle>
//                                 <CardDescription>
//                                     View all your harvest reports
//                                 </CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 {isLoading ? (
//                                     <div className="flex justify-center items-center py-8">
//                                         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                                     </div>
//                                 ) : (
//                                     <div className="rounded-md border">
//                                         <Table>
//                                             <TableHeader>
//                                                 <TableRow>
//                                                     <TableHead>Plot ID</TableHead>
//                                                     <TableHead>Crop</TableHead>
//                                                     <TableHead>Variety</TableHead>
//                                                     <TableHead>Harvest Date</TableHead>
//                                                     <TableHead>Yield</TableHead>
//                                                     <TableHead>Quality</TableHead>
//                                                 </TableRow>
//                                             </TableHeader>
//                                             <TableBody>
//                                                 {harvestReports.length === 0 ? (
//                                                     <TableRow>
//                                                         <TableCell colSpan={6} className="h-24 text-center">
//                                                             No harvest reports found for your account.
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ) : (
//                                                     harvestReports.map((report) => (
//                                                         <TableRow key={report.id}>
//                                                             <TableCell className="font-medium">{report.plot_id}</TableCell>
//                                                             <TableCell>{report.crop}</TableCell>
//                                                             <TableCell>{report.variety}</TableCell>
//                                                             <TableCell>{format(new Date(report.harvest_date), "MMM d, yyyy")}</TableCell>
//                                                             <TableCell>{report.yield}</TableCell>
//                                                             <TableCell>
//                                                                 <Badge color={report.quality === "Good" ? "green" : "blue"}>
//                                                                     {report.quality}
//                                                                 </Badge>
//                                                             </TableCell>
//                                                         </TableRow>
//                                                     ))
//                                                 )}
//                                             </TableBody>
//                                         </Table>
//                                     </div>
//                                 )}
//                             </CardContent>
//                         </Card>
//                     )}
//                     {activeTab === "yield" && (
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Yield History</CardTitle>
//                                 <CardDescription>
//                                     View your yield history
//                                 </CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 {isLoading ? (
//                                     <div className="flex justify-center items-center py-8">
//                                         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                                     </div>
//                                 ) : (
//                                     <div className="rounded-md border">
//                                         <Table>
//                                             <TableHeader>
//                                                 <TableRow>
//                                                     <TableHead>Year</TableHead>
//                                                     <TableHead>Plot ID</TableHead>
//                                                     <TableHead>Crop</TableHead>
//                                                     <TableHead>Yield</TableHead>
//                                                     <TableHead>Compared to Previous</TableHead>
//                                                 </TableRow>
//                                             </TableHeader>
//                                             <TableBody>
//                                                 {yieldHistory.length === 0 ? (
//                                                     <TableRow>
//                                                         <TableCell colSpan={5} className="h-24 text-center">
//                                                             No yield history found for your account.
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ) : (
//                                                     yieldHistory.map((history) => (
//                                                         <TableRow key={history.id}>
//                                                             <TableCell>{history.year}</TableCell>
//                                                             <TableCell>{history.plot_id}</TableCell>
//                                                             <TableCell>{history.crop}</TableCell>
//                                                             <TableCell>{history.yield}</TableCell>
//                                                             <TableCell>
//                                                                 <Badge color={history.compared_to_previous.includes("+") ? "green" : "red"}>
//                                                                     {history.compared_to_previous}
//                                                                 </Badge>
//                                                             </TableCell>
//                                                         </TableRow>
//                                                     ))
//                                                 )}
//                                             </TableBody>
//                                         </Table>
//                                     </div>
//                                 )}
//                             </CardContent>
//                         </Card>
//                     )}

//                     {activeTab === "soil" && (
//                         <Card>
//                             <CardHeader>
//                                 <CardTitle>Soil Analysis</CardTitle>
//                                 <CardDescription>
//                                     View your soil analysis reports
//                                 </CardDescription>
//                             </CardHeader>
//                             <CardContent>
//                                 {isLoading ? (
//                                     <div className="flex justify-center items-center py-8">
//                                         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                                     </div>
//                                 ) : (
//                                     <div className="rounded-md border">
//                                         <Table>
//                                             <TableHeader>
//                                                 <TableRow>
//                                                     <TableHead>Plot ID</TableHead>
//                                                     <TableHead>Test Date</TableHead>
//                                                     <TableHead>pH</TableHead>
//                                                     <TableHead>Nitrogen</TableHead>
//                                                     <TableHead>Phosphorus</TableHead>
//                                                     <TableHead>Potassium</TableHead>
//                                                     <TableHead>Organic Matter</TableHead>
//                                                 </TableRow>
//                                             </TableHeader>
//                                             <TableBody>
//                                                 {soilAnalysis.length === 0 ? (
//                                                     <TableRow>
//                                                         <TableCell colSpan={7} className="h-24 text-center">
//                                                             No soil analysis reports found for your account.
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ) : (
//                                                     soilAnalysis.map((analysis) => (
//                                                         <TableRow key={analysis.id}>
//                                                             <TableCell className="font-medium">{analysis.plot_id}</TableCell>
//                                                             <TableCell>{format(new Date(analysis.test_date), "MMM d, yyyy")}</TableCell>
//                                                             <TableCell>{analysis.ph}</TableCell>
//                                                             <TableCell>{analysis.nitrogen}</TableCell>
//                                                             <TableCell>{analysis.phosphorus}</TableCell>
//                                                             <TableCell>{analysis.potassium}</TableCell>
//                                                             <TableCell>{analysis.organic_matter}</TableCell>
//                                                         </TableRow>
//                                                     ))
//                                                 )}
//                                             </TableBody>
//                                         </Table>
//                                     </div>
//                                 )}
//                             </CardContent>
//                         </Card>
//                     )}
//                 </div>
//             </TabsContent>
//         </Tabs>
//     </div>
//     );

// }

// export default Reports;
//             <Calendar className="h-6 w-6" /> Harvest
//           </TabsTrigger>
//             <TabsTrigger value="yield">
// ="h-6 w-6" /> Harvest
//           </TabsTrigger>
//           <TabsTrigger value="yield">
//             <BarChart3 className="h-6 w-6" /> Yield History
//           </TabsTrigger>
//           <TabsTrigger value="soil">
//             <PieChart className="h-6 w-6" /> Soil Analysis
//           </TabsTrigger>
//         </TabsList>
//         <TabsContent>
//           <div className="mb-6">
//             {activeTab === "harvest" && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Harvest Reports</CardTitle>
//                   <CardDescription>
//                     View all your harvest reports
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {isLoading ? (
//                     <div className="flex justify-center items-center py-8">
//                       <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                     </div>
//                   ) : (
//                     <div className="rounded-md border">
//                       <Table>
//                         <TableHeader>
//                           <TableRow>
//                             <TableHead>Plot ID</TableHead>
//                             <TableHead>Crop</TableHead>
//                             <TableHead>Variety</TableHead>
//                             <TableHead>Harvest Date</TableHead>
//                             <TableHead>Yield</TableHead>
//                             <TableHead>Quality</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {harvestReports.length === 0 ? (
//                             <TableRow>
//                               <TableCell colSpan={6} className="h-24 text-center">
//                                 No harvest reports found for your account.
//                               </TableCell>
//                             </TableRow>
//                           ) : (
//                             harvestReports.map((report) => (
//                               <TableRow key={report.id}>
//                                 <TableCell className="font-medium">
//                                   {report.plot_id}
//                                 </TableCell>
//                                 <TableCell>{report.crop}</TableCell>
//                                 <TableCell>{report.variety}</TableCell>
//                                 <TableCell>
//                                   {format(new Date(report.harvest_date), "MMM d, yyyy")}
//                                 </TableCell>
//                                 <TableCell>{report.yield}</TableCell>
//                                 <TableCell>
//                                   <Badge
//                                     color={report.quality === "Good" ? "green" : "blue"}
//                                   >
//                                     {report.quality}
//                                   </Badge>
//                                 </TableCell>
//                               </TableRow>
//                             ))
//                           )}
//                         </TableBody>
//                       </Table>
//                     </div>
//                     )}
//                 </CardContent>
//                 </Card>
//             )}
//             {activeTab === "yield" && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Yield History</CardTitle>
//                   <CardDescription>
//                     View your yield history
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {isLoading ? (
//                     <div className="flex justify-center items-center py-8">
//                       <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                     </div>
//                   ) : (
//                     <div className="rounded-md border">
//                       <Table>
//                         <TableHeader>
//                           <TableRow>
//                             <TableHead>Year</TableHead>
//                             <TableHead>Plot ID</TableHead>
//                             <TableHead>Crop</TableHead>
//                             <TableHead>Yield</TableHead>
//                             <TableHead>Compared to Previous</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {yieldHistory.length === 0 ? (
//                             <TableRow>
//                               <TableCell colSpan={5} className="h-24 text-center">
//                                 No yield history found for your account.
//                               </TableCell>
//                             </TableRow>
//                           ) : (
//                             yieldHistory.map((history) => (
//                               <TableRow key={history.id}>
//                                 <TableCell>{history.year}</TableCell>
//                                 <TableCell>{history.plot_id}</TableCell>
//                                 <TableCell>{history.crop}</TableCell>
//                                 <TableCell>{history.yield}</TableCell>
//                                 <TableCell>
//                                   <Badge
//                                     color={
//                                       history.compared_to_previous.includes("+")
//                                         ? "green"
//                                         : "red"
//                                     }
//                                   >
//                                     {history.compared_to_previous}
//                                   </Badge>
//                                 </TableCell>
//                               </TableRow>
//                             ))
//                           )}
//                         </TableBody>
//                       </Table>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             {activeTab === "soil" && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Soil Analysis</CardTitle>
//                   <CardDescription>
//                     View your soil analysis reports
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {isLoading ? (
//                     <div className="flex justify-center items-center py-8">
//                       <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                     </div>
//                   ) : (
//                     <div className="rounded-md border">
//                       <Table>
//                         <TableHeader>
//                           <TableRow>
//                             <TableHead>Plot ID</TableHead>
//                             <TableHead>Test Date</TableHead>
//                             <TableHead>pH</TableHead>
//                             <TableHead>Nitrogen</TableHead>
//                             <TableHead>Phosphorus</TableHead>
//                             <TableHead>Potassium</TableHead>
//                             <TableHead>Organic Matter</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {soilAnalysis.length === 0 ? (
//                             <TableRow>
//                               <TableCell colSpan={7} className="h-24 text-center">
//                                 No soil analysis reports found for your account.
//                               </TableCell>
//                             </TableRow>
//                           ) : (
//                             soilAnalysis.map((analysis) => (
//                               <TableRow key={analysis.id}>
//                                 <TableCell className="font-medium">
//                                   {analysis.plot_id}
//                                 </TableCell>
//                                 <TableCell>
//                                   {format(new Date(analysis.test_date), "MMM d, yyyy")}
//                                 </TableCell>
//                                 <TableCell>{analysis.ph}</TableCell>
//                                 <TableCell>{analysis.nitrogen}</TableCell>
//                                 <TableCell>{analysis.phosphorus}</TableCell>
//                                 <TableCell>{analysis.potassium}</TableCell>
//                                 <TableCell>{analysis.organic_matter}</TableCell>
//                               </TableRow>
//                             ))
//                           )}
//                         </TableBody>
//                       </Table>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             )}
//             </div>
//         </TabsContent>
//         </Tabs>
//     </div>
//     );

// }

// export default Reports;
