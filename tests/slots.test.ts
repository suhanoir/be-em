import { describe, it, expect } from "vitest";
import { generateAvailableSlots, timeStringToMinutes, minutesToTimeString } from "../lib/slots";

describe("Slot Generation & Conflict Engine (Asia/Kolkata)", () => {
  it("converts time string to minutes and back accurately", () => {
    expect(timeStringToMinutes("09:00")).toBe(540);
    expect(timeStringToMinutes("14:30")).toBe(870);
    expect(minutesToTimeString(540)).toBe("09:00");
    expect(minutesToTimeString(870)).toBe("14:30");
  });

  it("generates correct slots within salon working hours", () => {
    const slots = generateAvailableSlots({
      dateStr: "2027-01-10", // future date to avoid today past-time filter
      durationMinutes: 45,
      salonOpen: "09:00",
      salonClose: "12:00",
      existingBookings: [],
      slotIntervalMinutes: 30,
    });

    // Slots generated: 09:00 (ends 09:45), 09:30 (ends 10:15), 10:00 (ends 10:45), 10:30 (ends 11:15), 11:00 (ends 11:45)
    // 11:30 cannot finish before 12:00 (11:30 + 45 = 12:15 > 12:00)
    expect(slots.length).toBe(5);
    expect(slots[0].time).toBe("09:00");
    expect(slots[0].endTime).toBe("09:45");
    expect(slots[0].isAvailable).toBe(true);
    expect(slots[slots.length - 1].time).toBe("11:00");
  });

  it("marks overlapping slots as unavailable when an existing booking exists", () => {
    const existingBookings = [
      {
        startTime: "10:00",
        endTime: "11:00",
        status: "CONFIRMED",
      },
    ];

    const slots = generateAvailableSlots({
      dateStr: "2027-01-10",
      durationMinutes: 45,
      salonOpen: "09:00",
      salonClose: "12:00",
      existingBookings,
      slotIntervalMinutes: 30,
    });

    const slot0900 = slots.find((s) => s.time === "09:00");
    const slot0930 = slots.find((s) => s.time === "09:30"); // ends 10:15 => overlaps with 10:00-11:00
    const slot1000 = slots.find((s) => s.time === "10:00"); // ends 10:45 => overlaps with 10:00-11:00
    const slot1030 = slots.find((s) => s.time === "10:30"); // ends 11:15 => overlaps with 10:00-11:00
    const slot1100 = slots.find((s) => s.time === "11:00"); // ends 11:45 => does not overlap

    expect(slot0900?.isAvailable).toBe(true);
    expect(slot0930?.isAvailable).toBe(false);
    expect(slot1000?.isAvailable).toBe(false);
    expect(slot1030?.isAvailable).toBe(false);
    expect(slot1100?.isAvailable).toBe(true);
  });

  it("returns zero slots when stylist is on a scheduled day off", () => {
    const slots = generateAvailableSlots({
      dateStr: "2027-01-10",
      durationMinutes: 45,
      schedule: {
        dayOfWeek: 0,
        startTime: "09:00",
        endTime: "19:00",
        isWorkingDay: false, // Day off
      },
      existingBookings: [],
    });

    expect(slots).toEqual([]);
  });

  it("blocks slots during time off / holiday leave", () => {
    const slots = generateAvailableSlots({
      dateStr: "2027-01-10",
      durationMinutes: 45,
      existingBookings: [],
      timeOffs: [
        {
          startDate: new Date("2027-01-09T00:00:00Z"),
          endDate: new Date("2027-01-11T23:59:59Z"),
          type: "HOLIDAY",
        },
      ],
    });

    expect(slots).toEqual([]);
  });
});
