import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type CivicIssue, type IssueStatus } from "@/data/mockData";
import { getIssues, updateIssueStatus, getNotifications, Notification as ApiNotification } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import {
  MapPin,
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Resolved"
      ? "civic-badge-resolved"
      : status === "In Progress" || status === "Assigned"
      ? "civic-badge-progress"
      : "civic-badge-pending";
  return <span className={cls}>{status}</span>;
}

export default function MemberDashboard() {
  const [issues, setIssues] = useState<CivicIssue[]>([]);
  const [notificationsState, setNotificationsState] = useState<ApiNotification[]>([]);
  const { user } = useAuth();
  const [fileUploads, setFileUploads] = useState<{ [id: string]: File | null }>({});

  useEffect(() => {
    async function load() {
      try {
        const data = await getIssues(user?.role || undefined);
        setIssues(data);
        const notes = await getNotifications();
        setNotificationsState(notes);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [user]);

  const updateStatus = async (id: string, newStatus: IssueStatus) => {
    try {
      const file = fileUploads[id] || undefined;
      const updated = await updateIssueStatus(id, newStatus, file ?? undefined);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-heading font-bold mb-6">Member Dashboard</h1>

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
          <CardTitle className="text-lg">Assigned Complaints</CardTitle>
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
                  <th className="text-left p-3 font-medium text-muted-foreground">Upload</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Action</th>
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
    </div>
  );
}
