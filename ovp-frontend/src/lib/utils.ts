import type { UserProps } from "@/types/type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid } from "date-fns";

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

/**
 * Formats a date string or Date object into a readable format.
 * Handles null, undefined, and invalid date values gracefully.
 * @param dateInput The date to format (string, Date, null, or undefined).
 * @param formatString The desired output format (defaults to 'PPP' -> 'MMM d, yyyy').
 * @param fallback A string to return if the date is invalid (defaults to '—').
 * @returns The formatted date string or the fallback string.
 */
export const formatDateTime = (
  dateInput: string | Date | null | undefined,
  formatString: string = "do MMMM yyyy, hh:mm a",
  fallback: string = "—"
): string => {
  // 1. If the input is null or undefined, return the fallback immediately.
  if (!dateInput) {
    return fallback;
  }

  // 2. Convert the input to a Date object.
  const date = new Date(dateInput);

  // 3. Check if the resulting date is valid. `new Date(null)` creates an invalid date.
  if (!isValid(date)) {
    return fallback;
  }

  // 4. If valid, format it and return the result.
  try {
    return format(date, formatString);
  } catch (error) {
    console.error("Date formatting failed:", error);
    return fallback; // Return fallback on any unexpected formatting error.
  }
};
