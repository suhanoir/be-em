import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  referralCode: z.string().optional(),
  hp_website: z.string().optional(), // Honeypot field for bot protection
  formTimestamp: z.number().optional(), // Bot submission speed check
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  hp_website: z.string().optional(),
});

export const bookingItemSchema = z.object({
  serviceId: z.string().optional(),
  bridalPackageId: z.string().optional(),
  mehendiDesignId: z.string().optional(),
  name: z.string(),
  price: z.number().nonnegative(),
  durationMinutes: z.number().int().positive(),
});

export const createBookingSchema = z.object({
  customerName: z.string().min(2, "Customer name is required"),
  customerEmail: z.string().email("Valid email required"),
  customerPhone: z.string().min(10, "Valid 10-digit phone required"),
  stylistId: z.string().nullable().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be HH:mm"),
  items: z.array(bookingItemSchema).min(1, "At least one service/package must be selected"),
  isBridal: z.boolean().default(false),
  isHomeVisit: z.boolean().default(false),
  venueAddress: z.string().optional(),
  distanceKm: z.number().default(0),
  groupSize: z.number().int().min(1).default(1),
  notes: z.string().optional(),
  lookBoardId: z.string().optional(),
  promoCode: z.string().optional(),
  loyaltyPointsToRedeem: z.number().int().min(0).default(0),
  payDepositOnly: z.boolean().default(false),
  paymentMethod: z.enum(["SALON", "UPI", "MOCK_PAYMENT", "CASH_AT_SALON"]).default("SALON"),
  utrNumber: z.string().trim().optional(),
  screenshotUrl: z.string().optional(),
  hp_website: z.string().optional(), // Honeypot field
  formTimestamp: z.number().optional(), // Form render timestamp for bot detection
});

export const adminPaymentVerifySchema = z.object({
  action: z.enum(["CONFIRM", "REJECT"]),
  rejectionReason: z.string().optional(),
});

export const customerProfileSchema = z.object({
  allergies: z.string().optional(),
  skinType: z.string().optional(),
  hairType: z.string().optional(),
  scalpType: z.string().optional(),
  beautyGoals: z.string().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional(),
});

export const createReviewSchema = z.object({
  appointmentId: z.string().optional(),
  serviceId: z.string().optional(),
  stylistId: z.string().optional(),
  customerName: z.string().min(2),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5, "Review comment must be at least 5 characters"),
  photoUrl: z.string().optional(),
});

export const resetPasswordWithCodeSchema = z.object({
  email: z.string().email("Valid email required"),
  code: z.string().min(6, "Reset code must be at least 6 digits").max(10),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});
