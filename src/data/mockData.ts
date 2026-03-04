export type IssueStatus = "Reported" | "Assigned" | "In Progress" | "Resolved";
export type IssueType = "Pothole" | "Garbage" | "Water Leak" | "Streetlight Damage" | "Other";

export interface CivicIssue {
  id: string;
  type: IssueType;
  description: string;
  location: string;
  lat: number;
  lng: number;
  date: string;
  status: IssueStatus;
  image: string;
}

export const mockIssues: CivicIssue[] = [
  {
    id: "CIV-1001",
    type: "Pothole",
    description: "Large pothole on main road near market area causing traffic hazard.",
    location: "MG Road, Sector 14",
    lat: 28.4595,
    lng: 77.0266,
    date: "2026-02-15",
    status: "Reported",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&q=80",
  },
  {
    id: "CIV-1002",
    type: "Garbage",
    description: "Overflowing garbage bins at community park entrance.",
    location: "Central Park, Block C",
    lat: 28.4615,
    lng: 77.0286,
    date: "2026-02-18",
    status: "In Progress",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80",
  },
  {
    id: "CIV-1003",
    type: "Water Leak",
    description: "Burst water pipe flooding the residential street for 3 days.",
    location: "Lakeview Colony, Street 7",
    lat: 28.4575,
    lng: 77.0246,
    date: "2026-02-20",
    status: "Assigned",
    image: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&q=80",
  },
  {
    id: "CIV-1004",
    type: "Streetlight Damage",
    description: "Multiple streetlights not working on highway service road.",
    location: "NH-48 Service Road",
    lat: 28.4635,
    lng: 77.0306,
    date: "2026-02-22",
    status: "Resolved",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80",
  },
  {
    id: "CIV-1005",
    type: "Pothole",
    description: "Deep pothole near school zone, risky for children.",
    location: "Green Valley School Road",
    lat: 28.4555,
    lng: 77.0226,
    date: "2026-02-25",
    status: "In Progress",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&q=80",
  },
  {
    id: "CIV-1006",
    type: "Garbage",
    description: "Construction waste dumped illegally on vacant plot.",
    location: "Industrial Area Phase 2",
    lat: 28.4650,
    lng: 77.0330,
    date: "2026-02-28",
    status: "Reported",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&q=80",
  },
];

export const notifications = [
  { id: 1, message: 'Your complaint #CIV-1002 has been marked as "In Progress"', time: "2 hours ago", read: false },
  { id: 2, message: 'Your complaint #CIV-1004 has been "Resolved"', time: "1 day ago", read: false },
  { id: 3, message: "New complaint #CIV-1006 has been registered successfully", time: "3 days ago", read: true },
  { id: 4, message: 'Complaint #CIV-1003 has been "Assigned" to Municipal Ward 5', time: "4 days ago", read: true },
];
