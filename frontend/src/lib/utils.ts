import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ComplaintStatus, PriorityLevel, SeverityLevel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(dateStr: string | Date | undefined): string {
  if (!dateStr) return "N/A";
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatRelativeTime(dateStr: string | Date | undefined): string {
  if (!dateStr) return "N/A";
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
}

export function getStatusBadgeInfo(status: ComplaintStatus) {
  switch (status) {
    case "REPORT_SUBMITTED":
      return { label: "Submitted", color: "bg-blue-100 text-blue-800 border-blue-200" };
    case "VERIFIED":
      return { label: "Verified", color: "bg-indigo-100 text-indigo-800 border-indigo-200" };
    case "ASSIGNED":
      return { label: "Worker Assigned", color: "bg-purple-100 text-purple-800 border-purple-200" };
    case "IN_PROGRESS":
      return { label: "In Progress", color: "bg-amber-100 text-amber-800 border-amber-200" };
    case "RESOLVED":
      return { label: "Resolved (Pending Verification)", color: "bg-teal-100 text-teal-800 border-teal-200" };
    case "CITIZEN_VERIFIED":
      return { label: "Citizen Verified & Closed", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    case "REOPENED":
      return { label: "Reopened by Citizen", color: "bg-rose-100 text-rose-800 border-rose-200" };
    case "REJECTED":
      return { label: "Rejected", color: "bg-gray-100 text-gray-800 border-gray-200" };
    case "ESCALATED":
      return { label: "Escalated", color: "bg-red-100 text-red-800 border-red-300 font-semibold" };
    default:
      return { label: status, color: "bg-gray-100 text-gray-800 border-gray-200" };
  }
}

export function getPriorityBadgeInfo(priority: PriorityLevel) {
  switch (priority) {
    case "CRITICAL":
      return { label: "Critical", color: "bg-red-500 text-white animate-pulse" };
    case "HIGH":
      return { label: "High", color: "bg-rose-500 text-white" };
    case "MEDIUM":
      return { label: "Medium", color: "bg-amber-500 text-white" };
    case "LOW":
      return { label: "Low", color: "bg-emerald-600 text-white" };
    default:
      return { label: priority, color: "bg-slate-500 text-white" };
  }
}

export function calculateDeterministicPriority(
  categoryWeight: number,
  severity: SeverityLevel,
  affectedCount: number,
  isEmergency: boolean,
  reopenedCount: number = 0
): PriorityLevel {
  if (isEmergency) return "CRITICAL";

  let severityScore = 1;
  if (severity === "MEDIUM") severityScore = 2;
  if (severity === "HIGH") severityScore = 3;
  if (severity === "CRITICAL") severityScore = 4;

  let crowdMultiplier = 1.0;
  if (affectedCount > 500) crowdMultiplier = 1.6;
  else if (affectedCount > 100) crowdMultiplier = 1.4;
  else if (affectedCount > 25) crowdMultiplier = 1.2;

  const totalScore = (categoryWeight * 20) + (severityScore * 15) * crowdMultiplier + (reopenedCount * 25);

  if (totalScore >= 80) return "CRITICAL";
  if (totalScore >= 55) return "HIGH";
  if (totalScore >= 30) return "MEDIUM";
  return "LOW";
}
