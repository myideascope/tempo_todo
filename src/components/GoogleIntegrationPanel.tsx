import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  AlertCircle,
  Settings,
  FileText,
  Users,
  Mail,
  ExternalLink,
} from "lucide-react";
import {
  generateGoogleAuthUrl,
  getStoredTokens,
  clearStoredTokens,
} from "@/lib/utils";

interface GoogleIntegrationPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const GoogleIntegrationPanel: React.FC<GoogleIntegrationPanelProps> = ({
  isOpen = true,
  onClose = () => {},
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedServices, setConnectedServices] = useState({
    contacts: false,
    drive: false,
  });
  const [defaultPermission, setDefaultPermission] = useState("read");
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const { accessToken, isExpired } = getStoredTokens();
    if (accessToken && !isExpired) {
      setIsConnected(true);
      // Enable services by default when connected
      setConnectedServices({ contacts: true, drive: true });
    }
  }, []);

  const handleConnect = () => {
    try {
      setIsConnecting(true);
      const authUrl = generateGoogleAuthUrl();
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error("Failed to initiate Google OAuth:", error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    // Clear stored tokens
    clearStoredTokens();
    setIsConnected(false);
    setConnectedServices({ contacts: false, drive: false });
  };

  const toggleService = (service: "contacts" | "drive") => {
    setConnectedServices((prev) => ({
      ...prev,
      [service]: !prev[service],
    }));
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Mail className="h-6 w-6 text-primary" />
            <CardTitle>Google Integration</CardTitle>
          </div>
          {isConnected && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" /> Connected
            </Badge>
          )}
        </div>
        <CardDescription>
          Connect your Google account to enable contacts and file sharing
          features
        </CardDescription>
      </CardHeader>

      <CardContent>
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="rounded-full bg-slate-50 p-3">
              <Mail className="h-8 w-8 text-slate-600" />
            </div>
            <div className="text-center">
              <h3 className="font-medium">Connect your Google Account</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Enable task sharing with contacts and file attachments
              </p>
            </div>
            <Button
              onClick={handleConnect}
              className="mt-2"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Connect with Google
                </>
              )}
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-slate-600" />
                    <div>
                      <p className="font-medium">Google Contacts</p>
                      <p className="text-xs text-muted-foreground">
                        Access contacts for task sharing
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={connectedServices.contacts}
                    onCheckedChange={() => toggleService("contacts")}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-slate-600" />
                    <div>
                      <p className="font-medium">Google Drive</p>
                      <p className="text-xs text-muted-foreground">
                        Attach files from Drive to tasks
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={connectedServices.drive}
                    onCheckedChange={() => toggleService("drive")}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Default Sharing Permissions
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="read-only"
                        name="permission"
                        value="read"
                        checked={defaultPermission === "read"}
                        onChange={() => setDefaultPermission("read")}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="read-only">Read Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="full-edit"
                        name="permission"
                        value="edit"
                        checked={defaultPermission === "edit"}
                        onChange={() => setDefaultPermission("edit")}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="full-edit">Full Edit</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Advanced Configuration
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowConfigDialog(true)}
                    className="w-full justify-start"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Integration Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>

      {isConnected && (
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="destructive" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </CardFooter>
      )}

      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Advanced Configuration</DialogTitle>
            <DialogDescription>
              Configure additional settings for Google integration.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
              <Input
                id="sync-interval"
                type="number"
                defaultValue={15}
                min={5}
                max={60}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="auto-sync" defaultChecked />
              <Label htmlFor="auto-sync">Auto-sync contacts</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="notification" defaultChecked />
              <Label htmlFor="notification">
                Notify on shared task updates
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfigDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowConfigDialog(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default GoogleIntegrationPanel;
