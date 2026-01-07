import { useProjects, useDeleteProject, useUpdateProject } from "@/hooks/use-projects";
import { MetricCard } from "@/components/MetricCard";
import { ProjectTable } from "@/components/ProjectTable";
import { AddProjectModal } from "@/components/AddProjectModal";
import { MediaDistributionChart, ProjectStatusChart } from "@/components/Charts";
import { Users, Briefcase, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: projects, isLoading, isError } = useProjects();
  const { mutate: deleteProject } = useDeleteProject();
  const { mutate: updateProject } = useUpdateProject();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    deleteProject(id, {
      onSuccess: () => toast({ title: "Deleted", description: "Project removed successfully." }),
      onError: () => toast({ variant: "destructive", title: "Error", description: "Could not delete project." })
    });
  };

  const handleStatusUpdate = (id: number, status: string) => {
    updateProject({ id, status }, {
      onSuccess: () => toast({ title: "Updated", description: `Project status changed to ${status}.` }),
      onError: () => toast({ variant: "destructive", title: "Error", description: "Could not update status." })
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6 md:p-12 space-y-8">
        <Skeleton className="h-12 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) return <div className="p-12 text-red-500">Failed to load dashboard data.</div>;

  const projectList = projects || [];
  const uniqueClients = new Set(projectList.map(p => p.clientName)).size;
  const activeProjects = projectList.filter(p => p.status === "In Progress").length;
  const completedProjects = projectList.filter(p => p.status === "Completed").length;

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-foreground font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">Overview</h1>
            <p className="text-muted-foreground mt-2 font-light text-lg">
              Track your client portfolio and project status.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block mr-4">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Current Date</p>
              <p className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <AddProjectModal />
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <MetricCard 
              title="Total Clients" 
              value={uniqueClients} 
              icon={<Users className="w-5 h-5" />} 
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <MetricCard 
              title="Active Projects" 
              value={activeProjects} 
              icon={<Activity className="w-5 h-5" />}
              trend="Current"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <MetricCard 
              title="Projects Completed" 
              value={completedProjects} 
              icon={<Briefcase className="w-5 h-5" />}
              className="bg-muted/30 border-dashed"
            />
          </motion.div>
        </div>

        {/* Main Content Area: Charts & Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Analytics */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl border border-border/60 p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-6">Media Distribution</h3>
              <MediaDistributionChart projects={projectList} />
            </div>

            <div className="bg-white rounded-xl border border-border/60 p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Project Status</h3>
              <ProjectStatusChart projects={projectList} />
            </div>
          </motion.div>

          {/* Right Column: Project Table */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-border/50 flex justify-between items-center bg-white">
                <h3 className="text-lg font-semibold">Recent Projects</h3>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {projectList.length} Total
                </span>
              </div>
              <div className="p-0">
                <ProjectTable 
                  projects={projectList} 
                  onDelete={handleDelete}
                  onUpdateStatus={handleStatusUpdate}
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
