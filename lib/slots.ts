// Asia/Kolkata timezone helpers and slot calculation engine
import { toZonedTime, format as formatZoned } from "date-fns-tz";
import { parseISO, addMinutes, isBefore, isAfter, setHours, setMinutes, isSameDay } from "date-fns";

export const SALON_TIMEZONE = "Asia/Kolkata";

/**
 * Returns current date/time converted to Asia/Kolkata
 */
export function getNowInKolkata(): Date {
  return toZonedTime(new Date(), SALON_TIMEZONE);
}

/**
 * Formats a date in Asia/Kolkata timezone
 */
export function formatInKolkata(date: Date | string, formatPattern: string): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatZoned(d, formatPattern, { timeZone: SALON_TIMEZONE });
}

/**
 * Parses "HH:mm" time string into minutes from midnight (e.g. "09:30" => 570)
 */
export function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Converts minutes from midnight into "HH:mm" time string
 */
export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export interface ExistingBooking {
  startTime: string; // "10:00"
  endTime: string;   // "11:00"
  status: string;    // "PENDING", "CONFIRMED", etc.
  stylistId?: string | null;
}

export interface StylistWorkingSchedule {
  dayOfWeek: number;
  startTime: string; // "09:00"
  endTime: string;   // "19:00"
  isWorkingDay: boolean;
}

export interface TimeOffRecord {
  startDate: Date;
  endDate: Date;
  type: string;
}

export interface GenerateSlotsOptions {
  dateStr: string; // "YYYY-MM-DD"
  durationMinutes: number; // e.g. 45
  schedule?: StylistWorkingSchedule | null;
  salonOpen?: string;  // "09:00"
  salonClose?: string; // "20:00"
  existingBookings: ExistingBooking[];
  timeOffs?: TimeOffRecord[];
  slotIntervalMinutes?: number; // default 30 min increments
}

/**
 * Generate bookable time slots for a given date, respecting:
 * 1. Working hours
 * 2. Day off / Time off
 * 3. Existing booked appointments (prevent overlaps)
 * 4. Past time if the booking date is today in Asia/Kolkata
 * 5. Minimum duration required to finish before salon closes
 */
export function generateAvailableSlots(options: GenerateSlotsOptions): {
  time: string;
  endTime: string;
  isAvailable: boolean;
  reason?: string;
}[] {
  const {
    dateStr,
    durationMinutes,
    schedule,
    salonOpen = "09:00",
    salonClose = "20:00",
    existingBookings,
    timeOffs = [],
    slotIntervalMinutes = 30,
  } = options;

  // Determine working boundaries
  if (schedule && !schedule.isWorkingDay) {
    return []; // Stylist has day off
  }

  const startTimeStr = schedule?.startTime ?? salonOpen;
  const endTimeStr = schedule?.endTime ?? salonClose;

  const startMinutes = timeStringToMinutes(startTimeStr);
  const endMinutes = timeStringToMinutes(endTimeStr);

  const selectedDate = new Date(`${dateStr}T00:00:00.000Z`);
  const nowKolkata = getNowInKolkata();
  const todayStr = formatInKolkata(new Date(), "yyyy-MM-dd");
  const isToday = dateStr === todayStr;
  const currentMinutesToday = nowKolkata.getHours() * 60 + nowKolkata.getMinutes();

  // Check if date falls in time off
  for (const to of timeOffs) {
    const toStart = new Date(to.startDate);
    const toEnd = new Date(to.endDate);
    if (selectedDate >= toStart && selectedDate <= toEnd) {
      return []; // Entire date is blocked
    }
  }

  // Active bookings filter
  const activeBookings = existingBookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "PENDING"
  );

  const slots: {
    time: string;
    endTime: string;
    isAvailable: boolean;
    reason?: string;
  }[] = [];

  for (let current = startMinutes; current + durationMinutes <= endMinutes; current += slotIntervalMinutes) {
    const slotStartStr = minutesToTimeString(current);
    const slotEndMinutes = current + durationMinutes;
    const slotEndStr = minutesToTimeString(slotEndMinutes);

    // Rule: Past time blocking for today (+15 mins buffer)
    if (isToday && current <= currentMinutesToday + 15) {
      slots.push({
        time: slotStartStr,
        endTime: slotEndStr,
        isAvailable: false,
        reason: "Time has passed",
      });
      continue;
    }

    // Rule: Check overlap with active bookings
    // Two intervals [A_start, A_end] and [B_start, B_end] overlap if A_start < B_end and B_start < A_end
    let hasConflict = false;
    for (const b of activeBookings) {
      const bStart = timeStringToMinutes(b.startTime);
      const bEnd = timeStringToMinutes(b.endTime);

      if (current < bEnd && bStart < slotEndMinutes) {
        hasConflict = true;
        break;
      }
    }

    if (hasConflict) {
      slots.push({
        time: slotStartStr,
        endTime: slotEndStr,
        isAvailable: false,
        reason: "Already booked",
      });
    } else {
      slots.push({
        time: slotStartStr,
        endTime: slotEndStr,
        isAvailable: true,
      });
    }
  }

  return slots;
}
