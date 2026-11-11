import { describe, it, expect } from "vitest";
import { timeStringToMinutes } from "../lib/slots";

describe("Double-Booking Prevention Logic", () => {
  function checkSlotCollision(
    existingAppts: { startTime: string; endTime: string }[],
    newStartTime: string,
    newEndTime: string
  ): boolean {
    const newStart = timeStringToMinutes(newStartTime);
    const newEnd = timeStringToMinutes(newEndTime);

    return existingAppts.some((appt) => {
      const apptStart = timeStringToMinutes(appt.startTime);
      const apptEnd = timeStringToMinutes(appt.endTime);
      // Collides if newStart < apptEnd && apptStart < newEnd
      return newStart < apptEnd && apptStart < newEnd;
    });
  }

  it("detects exact collision with an existing booking", () => {
    const existing = [{ startTime: "10:00", endTime: "11:00" }];
    const hasCollision = checkSlotCollision(existing, "10:00", "11:00");
    expect(hasCollision).toBe(true);
  });

  it("detects partial overlap when new booking starts during an active booking", () => {
    const existing = [{ startTime: "10:00", endTime: "11:00" }];
    const hasCollision = checkSlotCollision(existing, "10:30", "11:30");
    expect(hasCollision).toBe(true);
  });

  it("detects overlap when new booking encompasses an existing booking", () => {
    const existing = [{ startTime: "10:15", endTime: "10:45" }];
    const hasCollision = checkSlotCollision(existing, "10:00", "11:00");
    expect(hasCollision).toBe(true);
  });

  it("allows back-to-back bookings with zero gap without collision", () => {
    const existing = [{ startTime: "10:00", endTime: "11:00" }];
    // Booking starting right when the previous finishes
    const afterBooking = checkSlotCollision(existing, "11:00", "12:00");
    expect(afterBooking).toBe(false);

    // Booking finishing right when the next starts
    const beforeBooking = checkSlotCollision(existing, "09:00", "10:00");
    expect(beforeBooking).toBe(false);
  });
});
