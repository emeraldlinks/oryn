"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboards/dashboard-shell";
import { BentoGrid, BentoCard } from "@/components/shared/bento-grid";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  X,
  Loader2,
  LayoutList,
  Columns,
  Calendar,
  Trash2,
  Eye,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useApi } from "@/hooks/use-api";

type ProjectStatus = "active" | "on_hold" | "completed" | "cancelled";
type TaskStatus = "todo" | "in_progress" | "review" | "done";
type Priority = "low" | "medium" | "high" | "critical";

interface Project {
  id: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: Priority;
  startDate?: string;
  endDate?: string;
  tags?: string;
  ownerId?: number;
  owner?: { id: number; name: string };
  tasks?: Task[];
  milestones?: Milestone[];
}

interface Task {
  id: number;
  projectId: number;
  title: string;
  description?: string;
  status: TaskStatus;
  assigneeId?: number;
  dueDate?: string;
}

interface Milestone {
  id: number;
  projectId: number;
  title: string;
  description?: string;
  dueDate?: string;
  tasks?: Task[];
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "Active",
  on_hold: "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_ORDER: ProjectStatus[] = ["active", "on_hold", "completed", "cancelled"];

const PRIORITY_VARIANTS: Record<Priority, "destructive" | "warning" | "default" | "secondary"> = {
  critical: "destructive",
  high: "warning",
  medium: "default",
  low: "secondary",
};

const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

function priorityBadge(priority: Priority) {
  return <Badge variant={PRIORITY_VARIANTS[priority]}>{priority}</Badge>;
}

function statusBadge(status: ProjectStatus) {
  const variants: Record<ProjectStatus, "success" | "warning" | "default" | "destructive"> = {
    active: "success",
    on_hold: "warning",
    completed: "default",
    cancelled: "destructive",
  };
  return <Badge variant={variants[status]}>{STATUS_LABELS[status]}</Badge>;
}

function taskStatusIcon(status: TaskStatus) {
  switch (status) {
    case "todo": return <Circle className="h-4 w-4 text-muted-foreground" />;
    case "in_progress": return <Clock className="h-4 w-4 text-blue-500" />;
    case "review": return <AlertCircle className="h-4 w-4 text-amber-500" />;
    case "done": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
  }
}

export default function ProjectsPage() {
  const {
    data: projects,
    loading,
    insert: insertProject,
    update: updateProject,
    remove: deleteProject,
    refetch: refetchProjects,
  } = useApi<Project>("/api/projects?tasks=true");

  const [view, setView] = useState<"table" | "kanban">("kanban");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectTasks, setProjectTasks] = useState<Task[]>([]);
  const [projectMilestones, setProjectMilestones] = useState<Milestone[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    status: "active" as ProjectStatus,
    priority: "medium" as Priority,
    startDate: "",
    endDate: "",
    tags: "",
  });

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const result = await insertProject({
      name: createForm.name,
      description: createForm.description,
      status: createForm.status,
      priority: createForm.priority,
      startDate: createForm.startDate || undefined,
      endDate: createForm.endDate || undefined,
      tags: createForm.tags,
    });
    setSubmitting(false);
    if (result) {
      setShowCreateModal(false);
      setCreateForm({ name: "", description: "", status: "active", priority: "medium", startDate: "", endDate: "", tags: "" });
    }
  }

  async function handleChangeStatus(project: Project, status: ProjectStatus) {
    const ok = await updateProject(project.id, { status });
    if (ok) toast.success(`Moved to ${STATUS_LABELS[status]}`);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;
    const ok = await deleteProject(id);
    if (ok) {
      setSelectedProject(null);
      setProjectTasks([]);
      setProjectMilestones([]);
    }
  }

  async function loadProjectDetail(project: Project) {
    setSelectedProject(project);
    setLoadingDetail(true);
    try {
      const [tasksRes, milestonesRes] = await Promise.all([
        fetch(`/api/projects/${project.id}/tasks`),
        fetch(`/api/projects/${project.id}/milestones`),
      ]);
      if (tasksRes.ok) setProjectTasks(await tasksRes.json());
      if (milestonesRes.ok) setProjectMilestones(await milestonesRes.json());
    } catch {
      toast.error("Failed to load project details");
    } finally {
      setLoadingDetail(false);
    }
  }

  async function addTask(projectId: number, title: string) {
    if (!title.trim()) return;
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), status: "todo" }),
      });
      if (!res.ok) throw new Error("Failed to create task");
      const task = await res.json();
      setProjectTasks((prev) => [...prev, task]);
      toast.success("Task created");
    } catch {
      toast.error("Failed to create task");
    }
  }

  async function updateTaskStatus(task: Task, status: TaskStatus) {
    const previous = projectTasks;
    setProjectTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status } : t)));
    try {
      const res = await fetch(`/api/projects/${task.projectId}/tasks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id, status }),
      });
      if (!res.ok) throw new Error("Update failed");
    } catch {
      setProjectTasks(previous);
      toast.error("Failed to update task");
    }
  }

  async function deleteTask(task: Task) {
    const previous = projectTasks;
    setProjectTasks((prev) => prev.filter((t) => t.id !== task.id));
    try {
      const res = await fetch(`/api/projects/${task.projectId}/tasks?id=${task.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    } catch {
      setProjectTasks(previous);
      toast.error("Failed to delete task");
    }
  }

  async function addMilestone(projectId: number, title: string, description: string) {
    if (!title.trim()) return;
    try {
      const res = await fetch(`/api/projects/${projectId}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
      });
      if (!res.ok) throw new Error("Failed to create milestone");
      const milestone = await res.json();
      setProjectMilestones((prev) => [...prev, milestone]);
      toast.success("Milestone created");
    } catch {
      toast.error("Failed to create milestone");
    }
  }

  function getTasksForStatus(status: TaskStatus) {
    return projectTasks.filter((t) => t.status === status);
  }

  function milestoneProgress(milestone: Milestone): number {
    const tasks = milestone.tasks;
    if (!tasks || !tasks.length) return 0;
    return Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100);
  }

  const kanbanColumns = projects.reduce(
    (acc, project) => {
      acc[project.status].push(project);
      return acc;
    },
    { active: [] as Project[], on_hold: [] as Project[], completed: [] as Project[], cancelled: [] as Project[] }
  );

  const projectColumns: Column<Project>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (p) => (
        <button
          onClick={() => loadProjectDetail(p)}
          className="text-primary hover:underline font-medium text-left"
        >
          {p.name}
        </button>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (p) => statusBadge(p.status),
    },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      render: (p) => priorityBadge(p.priority),
    },
    {
      key: "tasks",
      label: "Tasks",
      render: (p) => <span>{p.tasks?.length || 0}</span>,
    },
    {
      key: "owner",
      label: "Owner",
      render: (p) => p.owner?.name || "-",
    },
    {
      key: "dates",
      label: "Dates",
      render: (p) => {
        if (!p.startDate && !p.endDate) return "-";
        const start = p.startDate ? new Date(p.startDate).toLocaleDateString() : "";
        const end = p.endDate ? new Date(p.endDate).toLocaleDateString() : "";
        return `${start}${start && end ? " - " : ""}${end}`;
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (p) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => loadProjectDetail(p)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const taskStatuses: TaskStatus[] = ["todo", "in_progress", "review", "done"];

  function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!open) return null;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card rounded-xl p-6 w-full max-w-lg shadow-xl border mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {children}
        </div>
      </div>
    );
  }

  function DetailPanel() {
    if (!selectedProject) return null;
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
    const [newMilestoneDesc, setNewMilestoneDesc] = useState("");

    return (
      <BentoCard colSpan={4} className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold">{selectedProject.name}</h3>
            {statusBadge(selectedProject.status)}
            {priorityBadge(selectedProject.priority)}
          </div>
          <Button variant="ghost" size="icon" onClick={() => { setSelectedProject(null); setProjectTasks([]); setProjectMilestones([]); }}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        {selectedProject.description && (
          <p className="text-muted-foreground mb-4">{selectedProject.description}</p>
        )}
        <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
          {selectedProject.startDate && (
            <div>
              <span className="text-muted-foreground">Start:</span> {new Date(selectedProject.startDate).toLocaleDateString()}
            </div>
          )}
          {selectedProject.endDate && (
            <div>
              <span className="text-muted-foreground">End:</span> {new Date(selectedProject.endDate).toLocaleDateString()}
            </div>
          )}
          {selectedProject.tags && (
            <div>
              <span className="text-muted-foreground">Tags:</span> {selectedProject.tags}
            </div>
          )}
          {selectedProject.owner && (
            <div>
              <span className="text-muted-foreground">Owner:</span> {selectedProject.owner.name}
            </div>
          )}
        </div>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Tasks</h4>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {taskStatuses.map((status) => (
                  <div key={status} className="rounded-lg border bg-muted/30 p-3">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                      {taskStatusIcon(status)}
                      {TASK_STATUS_LABELS[status]}
                      <span className="ml-auto text-muted-foreground">{getTasksForStatus(status).length}</span>
                    </div>
                    <div className="space-y-2 min-h-[80px]">
                      {getTasksForStatus(status).map((task) => (
                        <div
                          key={task.id}
                          className="rounded-md border bg-card px-2.5 py-2 text-xs flex items-center gap-2 group"
                        >
                          <span className="flex-1 truncate">{task.title}</span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {status !== "todo" && (
                              <button
                                className="text-muted-foreground hover:text-foreground"
                                onClick={() => updateTaskStatus(task, taskStatuses[taskStatuses.indexOf(status) - 1])}
                              >
                                <ArrowRight className="h-3 w-3 rotate-180" />
                              </button>
                            )}
                            {status !== "done" && (
                              <button
                                className="text-muted-foreground hover:text-foreground"
                                onClick={() => updateTaskStatus(task, taskStatuses[taskStatuses.indexOf(status) + 1])}
                              >
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            )}
                            <button
                              className="text-muted-foreground hover:text-destructive ml-1"
                              onClick={() => deleteTask(task)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newTaskTitle.trim()) {
                    addTask(selectedProject.id, newTaskTitle);
                    setNewTaskTitle("");
                  }
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="New task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={!newTaskTitle.trim()}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </form>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3">Milestones</h4>
              <div className="space-y-3 mb-4">
                {projectMilestones.length === 0 && (
                  <p className="text-sm text-muted-foreground">No milestones yet.</p>
                )}
                {projectMilestones.map((milestone) => {
                  const progress = milestoneProgress(milestone);
                  return (
                    <div key={milestone.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-medium">{milestone.title}</span>
                          {milestone.description && (
                            <p className="text-sm text-muted-foreground mt-0.5">{milestone.description}</p>
                          )}
                        </div>
                        {milestone.dueDate && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(milestone.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-10 text-right">{progress}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addMilestone(selectedProject.id, newMilestoneTitle, newMilestoneDesc);
                  setNewMilestoneTitle("");
                  setNewMilestoneDesc("");
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Milestone title..."
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Description (optional)"
                  value={newMilestoneDesc}
                  onChange={(e) => setNewMilestoneDesc(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={!newMilestoneTitle.trim()}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </form>
            </div>
          </>
        )}
      </BentoCard>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Manage projects, tasks, and milestones</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border p-0.5">
              <Button
                variant={view === "kanban" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("kanban")}
              >
                <Columns className="h-4 w-4 mr-1" /> Kanban
              </Button>
              <Button
                variant={view === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setView("table")}
              >
                <LayoutList className="h-4 w-4 mr-1" /> Table
              </Button>
            </div>
            <Button size="sm" onClick={() => setShowCreateModal(true)}>
              <Plus className="mr-1 h-4 w-4" /> New Project
            </Button>
          </div>
        </div>

        {view === "kanban" ? (
          <div className="grid grid-cols-4 gap-4">
            {STATUS_ORDER.map((status) => (
              <div key={status} className="rounded-lg border bg-muted/20">
                <div className="p-3 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{STATUS_LABELS[status]}</h3>
                  <Badge variant="secondary">{kanbanColumns[status].length}</Badge>
                </div>
                <div className="p-3 space-y-3 min-h-[200px]">
                  {kanbanColumns[status].map((project) => (
                    <div
                      key={project.id}
                      className="rounded-lg border bg-card p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        if (!selectedProject || selectedProject.id !== project.id) {
                          loadProjectDetail(project);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium text-sm leading-tight">{project.name}</span>
                        {priorityBadge(project.priority)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span>{project.tasks?.length || 0} tasks</span>
                        {project.endDate && (
                          <>
                            <span>·</span>
                            <span>{new Date(project.endDate).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {status !== "active" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={(e) => { e.stopPropagation(); handleChangeStatus(project, "active"); }}
                          >
                            Active
                          </Button>
                        )}
                        {status !== "on_hold" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={(e) => { e.stopPropagation(); handleChangeStatus(project, "on_hold"); }}
                          >
                            On Hold
                          </Button>
                        )}
                        {status !== "completed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={(e) => { e.stopPropagation(); handleChangeStatus(project, "completed"); }}
                          >
                            Done
                          </Button>
                        )}
                        {status !== "cancelled" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs px-2"
                            onClick={(e) => { e.stopPropagation(); handleChangeStatus(project, "cancelled"); }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DataTable
            columns={projectColumns}
            data={projects}
            loading={loading}
            searchKeys={["name", "description", "tags"]}
          />
        )}

        {selectedProject && <DetailPanel />}

        <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Project">
          <form onSubmit={handleCreateProject} className="space-y-3">
            <Input
              placeholder="Project Name"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              required
            />
            <textarea
              className="flex h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none"
              placeholder="Description (optional)"
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={createForm.status}
                onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as ProjectStatus })}
              >
                <option value="active">Active</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                value={createForm.priority}
                onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value as Priority })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Start Date</label>
                <Input
                  type="date"
                  value={createForm.startDate}
                  onChange={(e) => setCreateForm({ ...createForm, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">End Date</label>
                <Input
                  type="date"
                  value={createForm.endDate}
                  onChange={(e) => setCreateForm({ ...createForm, endDate: e.target.value })}
                />
              </div>
            </div>
            <Input
              placeholder="Tags (comma-separated)"
              value={createForm.tags}
              onChange={(e) => setCreateForm({ ...createForm, tags: e.target.value })}
            />
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Project
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardShell>
  );
}
