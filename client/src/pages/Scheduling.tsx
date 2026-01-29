import { useState } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Plus, Clock, Play, Pause, Trash2, Calendar as CalendarIcon } from "lucide-react";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Common cron presets
const cronPresets = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Every day at 9 AM", value: "0 9 * * *" },
  { label: "Every weekday at 9 AM", value: "0 9 * * 1-5" },
  { label: "Every Monday at 9 AM", value: "0 9 * * 1" },
  { label: "Every month on 1st at 9 AM", value: "0 9 1 * *" },
];

export default function Scheduling() {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [cronExpression, setCronExpression] = useState("0 9 * * 1-5");
  const [parameters, setParameters] = useState("{}");

  const utils = trpc.useUtils();

  // Fetch scheduled tasks
  const { data: tasks = [] } = trpc.scheduling.list.useQuery();

  // Fetch calendar events
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const { data: calendarEvents = [] } = trpc.scheduling.calendar.useQuery({
    start: startOfMonth.toISOString(),
    end: endOfMonth.toISOString(),
  });

  // Fetch skills for dropdown
  const { data: skills = [] } = trpc.skills.list.useQuery();

  // Validate cron expression
  const { data: cronValidation } = trpc.scheduling.validateCron.useQuery(
    { expression: cronExpression },
    { enabled: cronExpression.length > 0 }
  );

  // Create task mutation
  const createTask = trpc.scheduling.create.useMutation({
    onSuccess: () => {
      toast.success("Scheduled task created!");
      setIsCreateDialogOpen(false);
      utils.scheduling.list.invalidate();
      utils.scheduling.calendar.invalidate();
    },
    onError: (error) => {
      toast.error(`Failed to create task: ${error.message}`);
    },
  });

  // Update task mutation
  const updateTask = trpc.scheduling.update.useMutation({
    onSuccess: () => {
      toast.success("Task updated!");
      utils.scheduling.list.invalidate();
      utils.scheduling.calendar.invalidate();
    },
  });

  // Delete task mutation
  const deleteTask = trpc.scheduling.delete.useMutation({
    onSuccess: () => {
      toast.success("Task deleted!");
      utils.scheduling.list.invalidate();
      utils.scheduling.calendar.invalidate();
    },
  });

  const handleCreateTask = () => {
    if (!selectedSkill) {
      toast.error("Please select a skill");
      return;
    }

    if (!cronValidation?.valid) {
      toast.error("Invalid cron expression");
      return;
    }

    const skill = skills.find((s) => s.skillId === selectedSkill);
    if (!skill) return;

    createTask.mutate({
      skillId: skill.skillId,
      skillName: skill.name,
      cronExpression,
      parameters,
    });
  };

  const handleToggleTask = (taskId: number, enabled: boolean) => {
    updateTask.mutate({ id: taskId, enabled: !enabled });
  };

  const handleDeleteTask = (taskId: number) => {
    if (confirm("Are you sure you want to delete this scheduled task?")) {
      deleteTask.mutate({ id: taskId });
    }
  };

  // Transform calendar events for react-big-calendar
  const events = calendarEvents.map((event) => ({
    id: event.id,
    title: event.title,
    start: new Date(event.start),
    end: new Date(event.start), // Same as start for point-in-time events
    resource: event,
  }));

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Skill Scheduling</h1>
          <p className="text-muted-foreground mt-2">Schedule skills to run automatically with cron expressions</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Scheduled Task</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Select Skill</Label>
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a skill..." />
                  </SelectTrigger>
                  <SelectContent>
                    {skills.map((skill) => (
                      <SelectItem key={skill.skillId} value={skill.skillId}>
                        {skill.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Cron Expression</Label>
                <div className="flex gap-2">
                  <Input
                    value={cronExpression}
                    onChange={(e) => setCronExpression(e.target.value)}
                    placeholder="0 9 * * 1-5"
                    className="font-mono"
                  />
                  <Select value={cronExpression} onValueChange={setCronExpression}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Presets" />
                    </SelectTrigger>
                    <SelectContent>
                      {cronPresets.map((preset) => (
                        <SelectItem key={preset.value} value={preset.value}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {cronValidation && (
                  <div className="mt-2">
                    {cronValidation.valid ? (
                      <div className="text-sm text-green-600 dark:text-green-400">
                        ✓ {cronValidation.description}
                        {cronValidation.nextRun && (
                          <div className="text-muted-foreground mt-1">
                            Next run: {new Date(cronValidation.nextRun).toLocaleString()}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-red-600 dark:text-red-400">✗ Invalid cron expression</div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <Label>Parameters (JSON)</Label>
                <Input
                  value={parameters}
                  onChange={(e) => setParameters(e.target.value)}
                  placeholder='{"key": "value"}'
                  className="font-mono"
                />
              </div>

              <Button onClick={handleCreateTask} disabled={!cronValidation?.valid || createTask.isPending} className="w-full">
                {createTask.isPending ? "Creating..." : "Create Schedule"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="lg:col-span-2 p-6">
          <div className="h-[600px]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              date={date}
              onNavigate={setDate}
              style={{ height: "100%" }}
              className="rounded-lg"
            />
          </div>
        </Card>

        {/* Scheduled Tasks List */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Scheduled Tasks ({tasks.length})
          </h2>

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No scheduled tasks yet</p>
                <p className="text-sm">Create one to get started</p>
              </div>
            ) : (
              tasks.map((task) => (
                <Card key={task.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium">{task.skillName}</div>
                      <div className="text-sm text-muted-foreground font-mono mt-1">{task.cronExpression}</div>
                      {task.nextRun && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Next: {new Date(task.nextRun).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <Badge variant={task.enabled ? "default" : "secondary"}>{task.enabled ? "Active" : "Paused"}</Badge>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleTask(task.id, task.enabled === 1)}
                      className="flex-1"
                    >
                      {task.enabled ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                      {task.enabled ? "Pause" : "Resume"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteTask(task.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>

                  {task.runCount > 0 && (
                    <div className="text-xs text-muted-foreground mt-2">Executed {task.runCount} times</div>
                  )}
                </Card>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
