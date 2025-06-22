import React, { useState } from "react";
import { Plus, Filter, SortDesc, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Dialog, DialogTrigger } from "./ui/dialog";
import TaskItem from "./TaskItem";
import SharingPanel from "./SharingPanel";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  attachments?: Array<{
    name: string;
    url: string;
  }>;
  shared?: Array<{
    email: string;
    permission: "read" | "edit";
  }>;
}

interface TaskListProps {
  listId?: string;
  listName?: string;
  tasks?: Task[];
  onCreateTask?: (task: Omit<Task, "id">) => void;
  onUpdateTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onShareTask?: (
    taskId: string,
    users: Array<{ email: string; permission: "read" | "edit" }>,
  ) => void;
}

const TaskList = ({
  listId = "default",
  listName = "My Tasks",
  tasks = [
    {
      id: "1",
      title: "Complete project proposal",
      description: "Finish the proposal for the new client project",
      completed: false,
      dueDate: new Date("2023-12-31"),
      attachments: [{ name: "proposal.docx", url: "#" }],
      shared: [{ email: "colleague@example.com", permission: "read" }],
    },
    {
      id: "2",
      title: "Schedule team meeting",
      description: "Set up weekly sync with the development team",
      completed: true,
      dueDate: new Date("2023-12-15"),
    },
    {
      id: "3",
      title: "Review design mockups",
      description: "Provide feedback on the new UI designs",
      completed: false,
      dueDate: new Date("2023-12-20"),
      shared: [{ email: "designer@example.com", permission: "edit" }],
    },
  ],
  onCreateTask = () => {},
  onUpdateTask = () => {},
  onDeleteTask = () => {},
  onShareTask = () => {},
}: TaskListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showSharingPanel, setShowSharingPanel] = useState(false);

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const completedTasks = filteredTasks.filter((task) => task.completed);
  const pendingTasks = filteredTasks.filter((task) => !task.completed);

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleShareTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setShowSharingPanel(true);
  };

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      onUpdateTask({ ...task, completed });
    }
  };

  return (
    <div className="bg-white w-full h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-semibold">{listName}</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <SortDesc className="h-4 w-4 mr-2" />
            Sort
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
          prefix={<Search className="h-4 w-4 text-gray-400" />}
        />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All ({filteredTasks.length})</TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pendingTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-2">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onClick={() => handleTaskClick(task.id)}
                  onToggleComplete={(completed) =>
                    handleToggleComplete(task.id, completed)
                  }
                  onShare={() => handleShareTask(task.id)}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No tasks found. Create a new task to get started.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-2">
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onClick={() => handleTaskClick(task.id)}
                  onToggleComplete={(completed) =>
                    handleToggleComplete(task.id, completed)
                  }
                  onShare={() => handleShareTask(task.id)}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No pending tasks. All caught up!
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-2">
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onClick={() => handleTaskClick(task.id)}
                  onToggleComplete={(completed) =>
                    handleToggleComplete(task.id, completed)
                  }
                  onShare={() => handleShareTask(task.id)}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No completed tasks yet.
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {showSharingPanel && selectedTaskId && (
        <Dialog open={showSharingPanel} onOpenChange={setShowSharingPanel}>
          <SharingPanel
            taskId={selectedTaskId}
            task={tasks.find((t) => t.id === selectedTaskId)}
            onShare={(users) => {
              onShareTask(selectedTaskId, users);
              setShowSharingPanel(false);
            }}
            onClose={() => setShowSharingPanel(false)}
          />
        </Dialog>
      )}
    </div>
  );
};

export default TaskList;
