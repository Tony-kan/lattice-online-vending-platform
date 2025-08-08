import type { UserProps } from "@/types/type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (user: UserProps) => {
  const name = user?.name || "";
  const initialsFromName = name
    .split(" ")
    .filter(Boolean) // This removes empty strings
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // If name didn't produce initials, try the email. If that fails, use a default.
  return initialsFromName || user?.email?.[0]?.toUpperCase() || "U";
};
