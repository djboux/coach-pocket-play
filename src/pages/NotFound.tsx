import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-hero p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="text-center shadow-2xl">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">⚽</div>
            <h1 className="text-3xl font-bold mb-2">Oops!</h1>
            <h2 className="text-xl font-semibold mb-4 text-muted-foreground">Page Not Found</h2>
            <p className="text-muted-foreground mb-6">
              Looks like this page went offside! Let's get you back to training.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.href = "/"}
                variant="hero"
                size="lg"
                className="w-full"
              >
                <Home className="h-5 w-5" />
                Back to Training
              </Button>
              <Button 
                onClick={() => window.history.back()}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <ArrowLeft className="h-5 w-5" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
