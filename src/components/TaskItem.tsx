import React, { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Paperclip,
  ChevronDown,
  ChevronUp,
  Eye,
  Edit2,
  Trash2,
  Share2,
} from "lucide-react";

interface TaskItemProps {
  id?: string;
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
  }>;
  sharedWith?: Array<{
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    permission: "read" | "edit";
  }>;
  onToggleComplete?: (id: string, completed: boolean) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onShare?: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  id = "1",
  title = "Complete project proposal",
  description = "Finish the draft and send it to the team for review",
  completed = false,
  dueDate = "2023-12-31",
  attachments = [
    { id: "1", name: "proposal.pdf", url: "https://example.com/proposal.pdf" },
    { id: "2", name: "notes.docx", url: "https://example.com/notes.docx" },
  ],
  sharedWith = [
    {
      id: "1",
      name: "Jane Doe",
      email: "jane@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      permission: "edit",
    },
    {
      id: "2",
      name: "John Smith",
      email: "john@example.com",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
      permission: "read",
    },
  ],
  onToggleComplete = () => {},
  onDelete = () => {},
  onEdit = () => {},
  onShare = () => {},
}) => {
  const [expanded, setExpanded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const formattedDate = new Date(dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleToggleComplete = () => {
    onToggleComplete(id, !completed);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  const handleEdit = () => {
    onEdit(id);
  };

  const handleShare = () => {
    onShare(id);
  };

  return (
    <Card className="mb-3 bg-white border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-grow">
            <Checkbox
              id={`task-${id}`}
              checked={completed}
              onCheckedChange={handleToggleComplete}
            />
            <div className="flex-grow">
              <div className="flex items-center">
                <span
                  className={`text-lg font-medium ${completed ? "line-through text-gray-500" : ""}`}
                >
                  {title}
                </span>
                {attachments.length > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="ml-2">
                          <Paperclip className="h-4 w-4 text-gray-500" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {attachments.length} attachment
                          {attachments.length !== 1 ? "s" : ""}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500">
                  Due: {formattedDate}
                </span>
                {sharedWith.length > 0 && (
                  <div className="ml-4 flex -space-x-2">
                    {sharedWith.slice(0, 3).map((person) => (
                      <TooltipProvider key={person.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar className="h-6 w-6 border-2 border-white">
                              <AvatarImage
                                src={person.avatarUrl}
                                alt={person.name}
                              />
                              <AvatarFallback>
                                {person.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {person.name} (
                              {person.permission === "edit"
                                ? "Editor"
                                : "Viewer"}
                              )
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                    {sharedWith.length > 3 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar className="h-6 w-6 border-2 border-white bg-gray-200">
                              <AvatarFallback>
                                +{sharedWith.length - 3}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{sharedWith.length - 3} more people</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pl-10">
            <p className="text-gray-700 mb-4">{description}</p>

            {attachments.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Attachments</h4>
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center">
                      <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {attachment.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sharedWith.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Shared with</h4>
                <div className="space-y-2">
                  {sharedWith.map((person) => (
                    <div key={person.id} className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={person.avatarUrl} alt={person.name} />
                        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{person.name}</span>
                      <Badge
                        variant={
                          person.permission === "edit" ? "secondary" : "outline"
                        }
                        className="ml-2"
                      >
                        {person.permission === "edit" ? "Editor" : "Viewer"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2 mt-4">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit2 className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-1" /> Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDetailsOpen(true)}
              >
                <Eye className="h-4 w-4 mr-1" /> Details
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-gray-700">{description}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Due Date</h4>
              <p>{formattedDate}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Status</h4>
              <Badge variant={completed ? "secondary" : "outline"}>
                {completed ? "Completed" : "Pending"}
              </Badge>
            </div>
            {attachments.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Attachments</h4>
                <div className="space-y-2">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center">
                      <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {attachment.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {sharedWith.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1">Shared with</h4>
                <div className="space-y-2">
                  {sharedWith.map((person) => (
                    <div key={person.id} className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={person.avatarUrl} alt={person.name} />
                        <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {person.name} ({person.email})
                      </span>
                      <Badge
                        variant={
                          person.permission === "edit" ? "secondary" : "outline"
                        }
                        className="ml-2"
                      >
                        {person.permission === "edit" ? "Editor" : "Viewer"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TaskItem;
