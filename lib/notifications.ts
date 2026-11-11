// Notification & WhatsApp Messaging Service
// 100% key-free: generates direct wa.me click-to-chat links with zero third-party API keys or accounts.
import { db } from "@/lib/db";

export interface NotificationPayload {
  userId?: string | null;
  recipient: string; // phone or email
  type: "APPOINTMENT_CONFIRMED" | "REMINDER_24H" | "REMINDER_2H" | "PAYMENT_SUCCESS" | "CANCELLATION" | "PROMO";
  channel?: "WHATSAPP" | "SMS" | "EMAIL" | "IN_APP";
  title: string;
  message: string;
}

export function generateWhatsAppLink(phone: string, text: string): string {
  // Clean phone number (e.g. remove spaces, dashes)
  const cleanPhone = phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
  const formattedPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${formattedPhone}?text=${encodedText}`;
}

export function getSalonWhatsAppUrl(customMessage?: string): string {
  const salonPhone = process.env.NEXT_PUBLIC_SALON_WHATSAPP || "+919876543210";
  const defaultText = customMessage || "Hello BEEM Salon! I would like to inquire about booking an appointment.";
  return generateWhatsAppLink(salonPhone, defaultText);
}

export async function sendNotification(payload: NotificationPayload) {
  const { userId, recipient, type, channel = "WHATSAPP", title, message } = payload;

  console.log(`\n================== [BEEM NOTIFICATION LOG] ==================`);
  console.log(`Type:     ${type}`);
  console.log(`Channel:  ${channel}`);
  console.log(`To:       ${recipient}`);
  console.log(`Title:    ${title}`);
  console.log(`Message:  ${message}`);
  console.log(`============================================================\n`);

  try {
    const record = await db.notification.create({
      data: {
        userId: userId ?? null,
        type,
        channel,
        recipient,
        title,
        message,
        status: "SENT",
        sentAt: new Date(),
      },
    });
    return record;
  } catch (error) {
    console.error("Failed to log notification to database:", error);
    return null;
  }
}

export function buildAppointmentConfirmedMessage(data: {
  appointmentNumber: string;
  customerName: string;
  dateStr: string;
  timeStr: string;
  services: string[];
  stylistName: string;
  totalAmount: number;
  balanceDue: number;
}) {
  return `✨ *BEEM (Beauty Empire) Appointment Confirmed!* ✨\n\nDear ${data.customerName},\nYour appointment *#${data.appointmentNumber}* has been confirmed!\n\n📅 *Date:* ${data.dateStr}\n⏰ *Time:* ${data.timeStr}\n💇‍♀️ *Stylist:* ${data.stylistName}\n💅 *Services:* ${data.services.join(", ")}\n💰 *Total:* ₹${data.totalAmount} (Balance due: ₹${data.balanceDue})\n📍 *Location:* Luxury Promenade, 100 Feet Rd, Indiranagar, Bengaluru\n\nNeed to reschedule or have questions? Reply to this chat anytime! We look forward to pampering you.`;
}

export function buildAppointmentReminderMessage(data: {
  appointmentNumber: string;
  customerName: string;
  timeStr: string;
  services: string[];
  stylistName: string;
}) {
  return `✨ *BEEM Beauty Empire Appointment Reminder* ✨\n\nDear ${data.customerName},\nFriendly reminder of your appointment *#${data.appointmentNumber}* today at *${data.timeStr}* with ${data.stylistName}.\n\n💇‍♀️ *Treatments:* ${data.services.join(", ")}\n📍 *Location:* 100 Feet Rd, Indiranagar, Bengaluru\nDirections: https://www.google.com/maps/search/?api=1&query=BEEM+Salon+Indiranagar+Bengaluru\n\nSee you soon at the salon!`;
}
