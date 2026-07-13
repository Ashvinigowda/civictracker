import { CivicIssue, IssueStatus } from "@/data/mockData";

const BASE = ""; // proxy makes "/api" point at backend

function authFetch(input: RequestInfo, init: RequestInit = {}) {
  try {
    const stored = localStorage.getItem("auth");
    let token: string | null = null;
    if (stored) {
      const { token: authToken } = JSON.parse(stored);
      token = authToken;
    }
    const headers = { ...(init.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) };
    return fetch(input, { ...init, headers });
  } catch (err) {
    const headers = init.headers || {};
    return fetch(input, { ...init, headers });
  }
}

export async function getIssues(role?: string): Promise<CivicIssue[]> {
  const url = new URL(`${BASE}/api/issues`, window.location.origin);
  if (role) url.searchParams.append('role', role);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch issues");
  return res.json();
}

export async function getIssueById(id: string): Promise<CivicIssue | null> {
  const res = await fetch(`${BASE}/api/issues/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch issue");
  return res.json();
}

export async function reportIssue(formData: FormData): Promise<CivicIssue> {
  // Enable auto-classification for uploaded images
  if (formData.has('image')) {
    formData.append('autoClassify', 'true');
  }

  const res = await authFetch(`${BASE}/api/issues`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to report issue");
  return res.json();
}

export async function updateIssueStatus(
  id: string,
  status: IssueStatus,
  imageFile?: File
): Promise<CivicIssue> {
  let res;
  if (imageFile) {
    const form = new FormData();
    form.append("status", status);
    form.append("image", imageFile);
    res = await authFetch(`${BASE}/api/issues/${id}/status`, {
      method: "PATCH",
      body: form,
    });
  } else {
    res = await authFetch(`${BASE}/api/issues/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

export interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function signupUser(data: { name: string; email: string; password: string; role?: string }): Promise<{ user: User; token: string }> {
  const res = await fetch(`${BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Signup failed');
  return res.json();
}

export async function loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function assignIssue(id: string, role: string): Promise<CivicIssue> {
  const res = await authFetch(`${BASE}/api/issues/${id}/assign`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) throw new Error('Failed to assign issue');
  return res.json();
}

export async function getNotifications(): Promise<Notification[]> {
  const res = await fetch(`${BASE}/api/notifications`);
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}
