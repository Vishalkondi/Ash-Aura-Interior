import { booking } from "@/lib/site";

export type BookingDay = { key: string; weekday: string; day: string; month: string; label: string };

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Bookable days in Pune time (IST), starting tomorrow and skipping closed
 * days. `key` is YYYY-MM-DD. Shared by the picker and the server action.
 */
export function availableDays(now = new Date()): BookingDay[] {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
  const [y, m, d] = today.split("-").map(Number);
  const days: BookingDay[] = [];

  for (let i = 1; i <= booking.daysAhead; i++) {
    const date = new Date(Date.UTC(y, m - 1, d + i));
    if (booking.closedDays.includes(date.getUTCDay())) continue;
    const part = (opts: Intl.DateTimeFormatOptions) => date.toLocaleDateString("en-IN", { timeZone: "UTC", ...opts });
    days.push({
      key: date.toISOString().slice(0, 10),
      weekday: part({ weekday: "short" }),
      day: part({ day: "numeric" }),
      month: part({ month: "short" }),
      label: part({ weekday: "long", day: "numeric", month: "long" }),
    });
  }
  return days;
}

/** The matching day, also accepting yesterday's list so a form left open past midnight still sends. */
export function findBookableDay(key: string, now = new Date()) {
  return [...availableDays(now), ...availableDays(new Date(now.getTime() - DAY_MS))].find((d) => d.key === key);
}
