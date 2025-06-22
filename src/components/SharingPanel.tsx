import React, { useState } from "react";
import {
  Search,
  Users,
  UserPlus,
  FileText,
  Lock,
  Edit2,
  Eye,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface Contact {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface SharedUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  permission: "read" | "edit";
}

interface SharingPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  taskId?: string;
  taskTitle?: string;
}

const SharingPanel = ({
  isOpen = true,
  onClose = () => {},
  taskId = "1",
  taskTitle = "Complete project proposal",
}: SharingPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      permission: "edit",
    },
    {
      id: "2",
      name: "Sarah Miller",
      email: "sarah@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      permission: "read",
    },
  ]);

  // Mock Google contacts data
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "3",
      name: "Michael Brown",
      email: "michael@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
    {
      id: "5",
      name: "David Wilson",
      email: "david@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    },
    {
      id: "6",
      name: "Jessica Taylor",
      email: "jessica@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
    },
  ]);

  const filteredContacts = contacts.filter(
    (contact) =>
      !sharedUsers.some((user) => user.id === contact.id) &&
      (contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleAddUser = (contact: Contact) => {
    setSharedUsers([...sharedUsers, { ...contact, permission: "read" }]);
  };

  const handleRemoveUser = (userId: string) => {
    setSharedUsers(sharedUsers.filter((user) => user.id !== userId));
  };

  const handleTogglePermission = (userId: string) => {
    setSharedUsers(
      sharedUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              permission: user.permission === "read" ? "edit" : "read",
            }
          : user,
      ),
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Share Task
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Share "{taskTitle}" with others
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-md px-3 py-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search contacts..."
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <h3 className="text-sm font-medium">Google Contacts</h3>
            </div>
            <Badge
              variant="outline"
              className="text-xs bg-blue-50 text-blue-600 border-blue-200"
            >
              Connected
            </Badge>
          </div>

          <ScrollArea className="h-48 rounded-md border">
            {filteredContacts.length > 0 ? (
              <div className="p-2">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={contact.avatarUrl}
                          alt={contact.name}
                        />
                        <AvatarFallback>
                          {contact.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.email}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => handleAddUser(contact)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <FileText className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  {searchQuery
                    ? "No matching contacts found"
                    : "No contacts available"}
                </p>
              </div>
            )}
          </ScrollArea>
        </div>

        <Separator className="my-4" />

        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Shared with ({sharedUsers.length})
          </h3>

          {sharedUsers.length > 0 ? (
            <div className="space-y-2">
              {sharedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {user.permission === "edit" ? (
                        <Edit2 className="h-3 w-3 text-blue-600" />
                      ) : (
                        <Eye className="h-3 w-3 text-gray-600" />
                      )}
                      <span className="text-xs">
                        {user.permission === "edit" ? "Can edit" : "Can view"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={user.permission === "edit"}
                        onCheckedChange={() => handleTogglePermission(user.id)}
                        size="sm"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-gray-500 hover:text-red-500"
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-4 border rounded-md text-center">
              <Lock className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                This task isn't shared with anyone
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button>Save Sharing Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharingPanel;
