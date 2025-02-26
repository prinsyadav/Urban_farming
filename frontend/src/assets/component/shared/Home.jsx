// import { SignedIn, useUser } from "@clerk/clerk-react";
// import { FarmPlotCard } from "../plots/PlotCard";
// import { useState } from "react";

// function Home() {
//   const { user } = useUser();
//   const [showPlotCard, setShowPlotCard] = useState(false);

//   const handleShowPlotCard = () => {
//     setShowPlotCard(true);
//   };

//   return (
//     <div className="flex flex-col justify-items-start min-h-screen">
//       <main className="p-4">
//         <SignedIn>
//           {user && user.publicMetadata.role === "admin" && (
//             <div className="flex flex-col items-center gap-4">
//               <button
//                 onClick={handleShowPlotCard}
//                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//               >
//                 Add Plot
//               </button>

//               {showPlotCard && <FarmPlotCard />}
//             </div>
//           )}
//         </SignedIn>
//       </main>
//     </div>
//   );
// }

// export default Home;

import { SignedIn, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Home() {
  const { user } = useUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <main className="p-4 text-center">
        <h1 className="text-4xl font-bold mb-6">Urban Farming Platform</h1>
        <p className="mb-8 text-lg text-gray-600 max-w-md mx-auto">
          Connecting urban farmers with plots and resources for sustainable
          agriculture.
        </p>

        <SignedIn>
          {user?.publicMetadata?.role === "admin" && (
            <div className="flex flex-col items-center gap-4">
              <Link to="/admin">
                <Button className="bg-green-600 hover:bg-green-700">
                  Go to Admin Dashboard
                </Button>
              </Link>
              <p className="text-sm text-gray-600">
                You're logged in as an administrator.
              </p>
            </div>
          )}

          {user?.publicMetadata?.role === "farmer" && (
            <div className="flex flex-col items-center gap-4">
              <Link to="/farmer-dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Go to Farmer Dashboard
                </Button>
              </Link>
              <p className="text-sm text-gray-600">
                You're logged in as a farmer.
              </p>
            </div>
          )}

          {!user?.publicMetadata?.role && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800">
                Your account hasn't been assigned a role yet. Please contact an
                administrator.
              </p>
            </div>
          )}
        </SignedIn>
      </main>
    </div>
  );
}

export default Home;
