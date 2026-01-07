import { Project } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Film, Globe, MessageSquare, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectTableProps {
  projects: Project[];
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, status: string) => void;
}

export function ProjectTable({ projects, onDelete, onUpdateStatus }: ProjectTableProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
        <p className="text-muted-foreground">No projects yet. Start tracking by adding one.</p>
      </div>
    );
  }

  const getMediaIcon = (media: string) => {
    const lower = media.toLowerCase();
    if (lower.includes("video")) return <Film className="w-4 h-4" />;
    if (lower.includes("web")) return <Globe className="w-4 h-4" />;
    if (lower.includes("social")) return <MessageSquare className="w-4 h-4" />;
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700 hover:bg-green-100/80 border-green-200";
      case "In Progress": return "bg-blue-100 text-blue-700 hover:bg-blue-100/80 border-blue-200";
      case "On Hold": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80 border-yellow-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border shadow-sm bg-white">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted/40 border-b border-border">
          <tr>
            <th className="py-3 px-4 font-medium text-muted-foreground w-[25%]">Client Name</th>
            <th className="py-3 px-4 font-medium text-muted-foreground w-[20%]">Project No.</th>
            <th className="py-3 px-4 font-medium text-muted-foreground w-[20%]">Media</th>
            <th className="py-3 px-4 font-medium text-muted-foreground w-[20%]">Status</th>
            <th className="py-3 px-4 font-medium text-muted-foreground w-[15%] text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors group">
              <td className="py-3 px-4 font-medium text-foreground">{project.clientName}</td>
              <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{project.projectNo}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2 text-foreground/80">
                  {getMediaIcon(project.media)}
                  <span>{project.media}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge variant="outline" className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </td>
              <td className="py-3 px-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => onUpdateStatus(project.id, "Completed")}>
                      Mark Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateStatus(project.id, "In Progress")}>
                      Mark In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpdateStatus(project.id, "On Hold")}>
                      Mark On Hold
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={() => onDelete(project.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
