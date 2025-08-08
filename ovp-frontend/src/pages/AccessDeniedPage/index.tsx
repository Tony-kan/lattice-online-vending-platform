import { useLocation, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

// Define the shape of the state we expect to receive from the router
interface LocationState {
  from: string;
  requiredRoles: string[];
}

const AccessDeniedPage = () => {
  const location = useLocation();

  // Safely access state with a fallback to an empty object
  const { from, requiredRoles } = (location.state as LocationState) || {
    from: "a restricted page",
    requiredRoles: [],
  };

  // Get the user's current role from localStorage to display it
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : { role: "guest" };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-100 rounded-full p-3 w-fit">
            <Lock className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold mt-4">
            Access Denied
          </CardTitle>
          <CardDescription>
            You do not have the necessary permissions to view this page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm bg-slate-50 border p-4 rounded-md space-y-2">
            <p>
              <span className="font-semibold">Your Role:</span>
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full capitalize">
                {user.role.replace("_", " ")}
              </span>
            </p>
            <p>
              <span className="font-semibold">Page Requested:</span>
              <code className="ml-2 font-mono text-slate-700">{from}</code>
            </p>
            <p>
              <span className="font-semibold">Required Role(s):</span>
              <span className="ml-2 text-slate-700 capitalize">
                {requiredRoles.join(", ").replace(/_/g, " ")}
              </span>
            </p>
          </div>
          <Button
            asChild
            className="w-full mt-6 bg-amber-500 border-2 border-transparent text-white font-extrabold h-12 hover:bg-transparent hover:border-amber-500 hover:text-amber-500"
          >
            <Link to="/modules">Go to Modules Page</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDeniedPage;
