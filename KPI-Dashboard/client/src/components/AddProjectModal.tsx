import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useCreateProject } from "@/hooks/use-projects";
import { useToast } from "@/hooks/use-toast";

export function AddProjectModal() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useCreateProject();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    clientName: "",
    projectNo: "",
    media: "",
    status: "In Progress"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData, {
      onSuccess: () => {
        setOpen(false);
        setFormData({ clientName: "", projectNo: "", media: "", status: "In Progress" });
        toast({ title: "Project created", description: "Successfully added new project tracker." });
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Error", description: err.message });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-black/5 rounded-lg px-4">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6 rounded-xl border border-border/60 bg-white/95 backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium tracking-tight">Add New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-xs uppercase text-muted-foreground font-semibold">Client Name</Label>
            <Input 
              id="clientName" 
              required
              placeholder="e.g. Acme Corp"
              value={formData.clientName}
              onChange={e => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              className="bg-muted/30 border-border focus:ring-primary/10"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectNo" className="text-xs uppercase text-muted-foreground font-semibold">Project No.</Label>
              <Input 
                id="projectNo" 
                required
                placeholder="PRJ-001"
                value={formData.projectNo}
                onChange={e => setFormData(prev => ({ ...prev, projectNo: e.target.value }))}
                className="bg-muted/30 border-border focus:ring-primary/10 font-mono text-xs"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="media" className="text-xs uppercase text-muted-foreground font-semibold">Media Type</Label>
              <Select 
                required 
                value={formData.media} 
                onValueChange={val => setFormData(prev => ({ ...prev, media: val }))}
              >
                <SelectTrigger className="bg-muted/30 border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="Web">Web Design</SelectItem>
                  <SelectItem value="Social">Social Media</SelectItem>
                  <SelectItem value="Print">Print</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
