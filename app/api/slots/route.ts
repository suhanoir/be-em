import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  generateAvailableSlots,
  timeStringToMinutes,
  minutesToTimeString,
  autoReleaseExpiredBridalHolds,
} from "@/lib/slots";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get("date");
    const durationMinutes = parseInt(searchParams.get("duration") || "45", 10);
    const stylistId = searchParams.get("stylistId");

    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json(
        { error: "Valid date query parameter (YYYY-MM-DD) is required" },
        { status: 400 }
      );
    }

    // Auto-release any expired bridal holds before slot calculations
    await autoReleaseExpiredBridalHolds();

    const selectedDate = new Date(`${dateStr}T00:00:00.000Z`);
    const dayOfWeek = selectedDate.getUTCDay();

    // Fetch salon hours from settings
    const openSetting = await db.setting.findUnique({ where: { key: "working_hours_open" } });
    const closeSetting = await db.setting.findUnique({ where: { key: "working_hours_close" } });
    const salonOpen = openSetting?.value || "09:00";
    const salonClose = closeSetting?.value || "20:00";

    // Salon-wide time-offs / holidays
    const salonTimeOffs = await db.timeOff.findMany({
      where: {
        startDate: { lte: selectedDate },
        endDate: { gte: selectedDate },
        reason: { contains: "Holiday" },
      },
    });

    if (salonTimeOffs.length > 0) {
      return NextResponse.json({
        date: dateStr,
        isHoliday: true,
        reason: salonTimeOffs[0].reason,
        slots: [],
      });
    }

    const activeStatuses = ["PENDING", "PENDING_PAYMENT", "PAYMENT_SUBMITTED", "CONFIRMED"];

    // If specific stylist selected:
    if (stylistId && stylistId !== "any") {
      const stylist = await db.stylist.findUnique({
        where: { id: stylistId },
        include: {
          schedules: { where: { dayOfWeek } },
          timeOffs: {
            where: {
              startDate: { lte: selectedDate },
              endDate: { gte: selectedDate },
            },
          },
        },
      });

      if (!stylist || !stylist.isActive) {
        return NextResponse.json({ error: "Stylist not found or inactive" }, { status: 404 });
      }

      const schedule = stylist.schedules[0] || null;

      // Existing appointments for this stylist on date
      const existingAppointments = await db.appointment.findMany({
        where: {
          stylistId,
          date: selectedDate,
          status: { in: activeStatuses },
        },
        select: {
          startTime: true,
          endTime: true,
          status: true,
          stylistId: true,
        },
      });

      const slots = generateAvailableSlots({
        dateStr,
        durationMinutes,
        schedule,
        salonOpen,
        salonClose,
        existingBookings: existingAppointments,
        timeOffs: stylist.timeOffs,
      });

      return NextResponse.json({ date: dateStr, stylistId, slots });
    }

    // If "Any available" or no specific stylist:
    const activeStylists = await db.stylist.findMany({
      where: { isActive: true },
      include: {
        schedules: { where: { dayOfWeek } },
        timeOffs: {
          where: {
            startDate: { lte: selectedDate },
            endDate: { gte: selectedDate },
          },
        },
      },
    });

    // All active appointments on that date
    const allAppointments = await db.appointment.findMany({
      where: {
        date: selectedDate,
        status: { in: activeStatuses },
      },
      select: {
        startTime: true,
        endTime: true,
        status: true,
        stylistId: true,
      },
    });

    // Compute slot pool
    const startM = timeStringToMinutes(salonOpen);
    const endM = timeStringToMinutes(salonClose);

    const consolidatedSlotsMap = new Map<
      string,
      { time: string; endTime: string; isAvailable: boolean; availableStylists: string[] }
    >();

    for (let cur = startM; cur + durationMinutes <= endM; cur += 30) {
      const time = minutesToTimeString(cur);
      const endTime = minutesToTimeString(cur + durationMinutes);
      consolidatedSlotsMap.set(time, {
        time,
        endTime,
        isAvailable: false,
        availableStylists: [],
      });
    }

    // For each stylist, test which slots are available
    for (const stylist of activeStylists) {
      const schedule = stylist.schedules[0] || null;
      const stylistAppointments = allAppointments.filter((a) => a.stylistId === stylist.id);

      const stylistSlots = generateAvailableSlots({
        dateStr,
        durationMinutes,
        schedule,
        salonOpen,
        salonClose,
        existingBookings: stylistAppointments,
        timeOffs: stylist.timeOffs,
      });

      for (const slot of stylistSlots) {
        if (slot.isAvailable) {
          const entry = consolidatedSlotsMap.get(slot.time);
          if (entry) {
            entry.isAvailable = true;
            entry.availableStylists.push(stylist.name);
          }
        }
      }
    }

    const slots = Array.from(consolidatedSlotsMap.values());

    return NextResponse.json({
      date: dateStr,
      stylistId: "any",
      slots,
    });
  } catch (error: any) {
    console.error("Slots API error:", error);
    return NextResponse.json(
      { error: "Failed to generate slots", message: error.message },
      { status: 500 }
    );
  }
}
