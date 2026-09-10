export { cn } from "cn";

export function formatDate(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function isOverdue(dueDate: string, status: string): boolean {
  if (status === "Completed") {
    return false;
  }

  const due = new Date(`${dueDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return due.getTime() < today.getTime();
}

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "?";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

const AVATAR_PALETTE = [
  "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
  "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  "bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400",
  "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  "bg-slate-100 text-slate-700 dark:bg-slate-400/10 dark:text-slate-300",
] as const;

export function getAvatarStyle(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % AVATAR_PALETTE.length;
  }

  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}
