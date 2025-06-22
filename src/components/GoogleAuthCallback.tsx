import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { exchangeCodeForTokens, storeTokens } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const GoogleAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        setStatus("error");
        setError(`Authentication failed: ${error}`);
        return;
      }

      if (!code) {
        setStatus("error");
        setError("No authorization code received");
        return;
      }

      try {
        const tokens = await exchangeCodeForTokens(code);
        storeTokens(tokens);
        setStatus("success");

        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2000);
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Failed to authenticate");
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === "loading" && (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Connecting to Google...
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Successfully Connected!
              </>
            )}
            {status === "error" && (
              <>
                <AlertCircle className="h-5 w-5 text-red-600" />
                Connection Failed
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {status === "loading" && (
            <p className="text-muted-foreground">
              Please wait while we complete the authentication process...
            </p>
          )}
          {status === "success" && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Your Google account has been successfully connected. You can now
                access your contacts and Drive files.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting you back to the app...
              </p>
            </div>
          )}
          {status === "error" && (
            <div className="space-y-4">
              <p className="text-red-600 text-sm">{error}</p>
              <Button onClick={() => navigate("/")} variant="outline">
                Return to App
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleAuthCallback;
