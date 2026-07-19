import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getIssues, updateIssueStatus, assignIssue, getNotifications, type CivicIssue, type IssueStatus } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  Shield,
  LayoutDashboard,
  Bell,
  MapPin,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  LogOut,
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Bell, label: "Notifications", id: "notifications" },
];

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Resolved"
      ? "civic-badge-resolved"
      : status === "In Progress" || status === "Assigned"
      ? "civic-badge-progress"
      : "civic-badge-pending";
  return <span className={cls}>{status}</span>;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const queryClient = useQueryClient();
  const { logout, user } = useAuth();

  const { data: issues = [], isLoading: issuesLoading } = useQuery({
    queryKey: ['admin-issues'],
    queryFn: () => getIssues()
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: getNotifications,
    refetchInterval: 30000 // Poll every 30s
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: IssueStatus }) => updateIssueStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-issues'] })
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => assignIssue(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-issues'] })
  });

  const stats = [
    { label: "Total Complaints", value: issues.length, icon: BarChart3, color: "text-primary", bg: "bg-primary/10" },
    { label: "Pending", value: issues.filter((i) => i.status === "Reported").length, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
    { label: "In Progress", value: issues.filter((i) => i.status === "In Progress" || i.status === "Assigned").length, icon: Clock, color: "text-civic-amber", bg: "bg-civic-amber/10" },
    { label: "Resolved", value: issues.filter((i) => i.status === "Resolved").length, icon: CheckCircle2, color: "text-accent", bg: "bg-accent/10" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex-shrink-0 hidden md:flex flex-col">
        <div className="p-5 flex items-center gap-2 font-heading font-bold text-lg text-sidebar-primary-foreground">
          <Shield className="h-6 w-6" />
          CivicTrack Admin
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeTab === item.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <div className="px-3 py-2 text-sm text-sidebar-foreground/70 truncate">
            Logged in as <b>{user?.name}</b>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-background overflow-auto">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <span className="font-heading font-bold text-primary flex items-center gap-2">
            <Shield className="h-5 w-5" /> Admin
          </span>
          <div className="flex gap-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`p-2 rounded-lg ${activeTab === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
              >
                <item.icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 md:p-8">
          {activeTab === "dashboard" && (
            <>
              <h1 className="text-2xl font-heading font-bold mb-6">Dashboard</h1>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((s) => (
                  <div key={s.label} className="stat-card items-center text-center">
                    <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                      <s.icon className={`h-5 w-5 ${s.color}`} />
                    </div>
                    <span className="text-2xl font-heading font-bold">{s.value}</span>
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Table */}
              <Card className="civic-card overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">All Complaints</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-3 font-medium text-muted-foreground">ID</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                          <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Location</th>
                          <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Status Action</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Assign To</th>
                        </tr>
                      </thead>
                      <tbody>
                        {issues.map((issue) => (
                          <tr key={issue.id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="p-3 font-medium">{issue.id}</td>
                            <td className="p-3">{issue.type}</td>
                            <td className="p-3 hidden md:table-cell">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="h-3 w-3" /> {issue.location}
                              </div>
                            </td>
                            <td className="p-3 hidden sm:table-cell text-muted-foreground">{issue.date}</td>
                            <td className="p-3"><StatusBadge status={issue.status} /></td>
                            <td className="p-3">
                              <Select
                                value={issue.status}
                                onValueChange={(v) => statusMutation.mutate({ id: issue.id, status: v as IssueStatus })}
                                disabled={statusMutation.isPending}
                              >
                                <SelectTrigger className="h-8 w-32 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {(["Reported", "Assigned", "In Progress", "Resolved"] as IssueStatus[]).map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-3">
                              <Select
                                value={issue.assignedTo || "unassigned"}
                                onValueChange={(v) => assignMutation.mutate({ id: issue.id, role: v })}
                                disabled={assignMutation.isPending}
                              >
                                <SelectTrigger className="h-8 w-32 text-xs">
                                  <SelectValue placeholder="Assign" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="unassigned">Unassigned</SelectItem>
                                  <SelectItem value="PWD">PWD</SelectItem>
                                  <SelectItem value="SANITATION">Sanitation</SelectItem>
                                  <SelectItem value="WATER">Water Dept</SelectItem>
                                  <SelectItem value="ELECTRICITY">Electricity</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              <h1 className="text-2xl font-heading font-bold mb-6">Notifications</h1>
              <div className="space-y-3 max-w-2xl">
                {notifications.map((n) => (
                  <Card key={n.id} className={`civic-card ${!n.read ? "border-primary/30 bg-primary/5" : ""}`}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <Bell className={`h-5 w-5 mt-0.5 flex-shrink-0 ${!n.read ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="flex-1">
                        <p className="text-sm">{n.message}</p>
                        <span className="text-xs text-muted-foreground">{n.time}</span>
                      </div>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-2" />}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
