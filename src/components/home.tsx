import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Settings, User, LogOut } from "lucide-react";
import TaskList from "./TaskList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HomeProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

const Home = ({
  userName = "John Doe",
  userEmail = "john.doe@example.com",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
}: HomeProps) => {
  const [activeTab, setActiveTab] = useState("my-tasks");

  // Mock data for task lists
  const taskLists = [
    { id: "1", name: "Personal Tasks", tasks: 5, shared: false },
    { id: "2", name: "Work Projects", tasks: 8, shared: true },
    { id: "3", name: "Shopping List", tasks: 3, shared: true },
    { id: "4", name: "Home Renovation", tasks: 12, shared: false },
  ];

  const [selectedList, setSelectedList] = useState(taskLists[0]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">
            Collaborative Todo
          </h1>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full" size="icon">
                  <Avatar>
                    <AvatarImage src={userAvatar} alt={userName} />
                    <AvatarFallback>{userName.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{userName}</p>
                    <p className="text-sm text-muted-foreground">{userEmail}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 container mx-auto px-4 py-6">
        {/* Sidebar */}
        <div className="w-64 mr-8">
          <div className="mb-6">
            <Button className="w-full" onClick={() => {}}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Task List
            </Button>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-semibold mb-2">My Lists</h2>
            {taskLists.map((list) => (
              <Button
                key={list.id}
                variant={selectedList.id === list.id ? "secondary" : "ghost"}
                className="w-full justify-start text-left"
                onClick={() => setSelectedList(list)}
              >
                <span>{list.name}</span>
                {list.shared && (
                  <span className="ml-auto bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5">
                    Shared
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <Card className="h-full">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="h-full"
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold">{selectedList.name}</h2>
                <TabsList>
                  <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
                  <TabsTrigger value="shared-with-me">
                    Shared with Me
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="p-0">
                <TabsContent value="my-tasks" className="h-full">
                  <TaskList
                    listId={selectedList.id}
                    listName={selectedList.name}
                  />
                </TabsContent>
                <TabsContent value="shared-with-me" className="h-full">
                  <TaskList
                    listId="shared"
                    listName="Shared with Me"
                    isSharedView={true}
                  />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
