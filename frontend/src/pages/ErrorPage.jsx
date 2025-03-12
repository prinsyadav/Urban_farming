import { useRouteError, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeft } from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Oops!</h1>
        <p className="text-gray-600 mb-4">
          Sorry, an unexpected error has occurred.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          <i>{error.statusText || error.message || "Unknown error"}</i>
        </p>

        <div className="flex gap-4">
          <Button asChild variant="default">
            <Link to="/" className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4" />
              Go to Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="-1" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
