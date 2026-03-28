import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "mild":
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "moderate":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "severe":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "critical":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "resolved":
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "referred":
      return "text-purple-600 bg-purple-50 border-purple-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
}
