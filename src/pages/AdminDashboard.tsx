import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type CivicIssue, type IssueStatus } from "@/data/mockData";
import { Link } from "react-router-dom";
import { getIssues, updateIssueStatus, getNotifications, assignIssue } from "@/lib/api";
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
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [notificationsState, setNotificationsState] = useState<any[]>([]);

  const [fileUploads, setFileUploads] = useState<{ [id: string]: File | null }>({});

  const updateStatus = async (id: string, status: IssueStatus) => {
    try {
      const file = fileUploads[id] || undefined;
      const updated = await updateIssueStatus(id, status, file ?? undefined);
      setIssues((prev) => prev.map((i) => (i.id === id ? updated : i)));
      // refresh notifications after an update
      const notes = await getNotifications();
      setNotificationsState(notes);
    } catch (err) {
      console.error(err);
    }
  };

  // initial data load
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getIssues();
        setIssues(data);
        const notes = await getNotifications();
        setNotificationsState(notes);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const assignRole = async (id: string, role: string) => {
    try {
      // send to backend assign endpoint
      const updated = await assignIssue(id, role);
      setIssues((prev) => prev.map((i) => (i.id === id ? updated : i)));
      const notes = await getNotifications();
      setNotificationsState(notes);
    } catch (err) {
      console.error(err);
    }
  };

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
        <div className="p-3 border-t border-sidebar-border">
          <Link to="/">
            <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground">
              <LogOut className="mr-2 h-4 w-4" /> Back to Site
            </Button>
          </Link>
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
                          <th className="text-left p-3 font-medium text-muted-foreground">Assigned To</th>
                          <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Location</th>
                          <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Date</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Upload</th>
                          <th className="text-left p-3 font-medium text-muted-foreground">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {issues.map((issue) => (
                          <tr key={issue.id} className="border-b last:border-0 hover:bg-muted/30">
                            <td className="p-3 font-medium">{issue.id}</td>
                            <td className="p-3">{issue.type}</td>
                            <td className="p-3">
                              <select
                                className="border rounded px-2 py-1 text-sm"
                                value={issue.assignedTo || ""}
                                onChange={(e) => assignRole(issue.id, e.target.value)}
                              >
                                <option value="">--</option>
                                <option value="BBMP">BBMP</option>
                                <option value="BWSSB">BWSSB</option>
                                <option value="BESOM">BESOM</option>
                              </select>
                            </td>
                            <td className="p-3 hidden md:table-cell">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="h-3 w-3" /> {issue.location}
                              </div>
                            </td>
                            <td className="p-3 hidden sm:table-cell text-muted-foreground">{issue.date}</td>
                            <td className="p-3"><StatusBadge status={issue.status} /></td>
                            <td className="p-3">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  setFileUploads((prev) => ({ ...prev, [issue.id]: e.target.files ? e.target.files[0] : null }))
                                }
                              />
                            </td>
                            <td className="p-3">
                              <Select
                                value={issue.status}
                                onValueChange={(v) => updateStatus(issue.id, v as IssueStatus)}
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
                {notificationsState.map((n) => (
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
