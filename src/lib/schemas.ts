import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().trim().min(1, "Full Name is required"),
  emailAddress: z
    .string()
    .trim()
    .email("Invalid email format")
    .min(1, "Email is required"),
  password: z
    .string()
    .trim()
    .min(8, "Password must contain at least 8 characters"),
  confirmPassword: z
    .string()
    .trim()
    .min(1, "Password Confirmation is required")
}).refine(data => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

export const loginSchema = z.object({
  emailAddress: z
    .string()
    .trim()
    .email("Invalid email format")
    .min(1, "Input must contain at least 1 character(s)"),
  password: z
    .string()
    .trim()
    .min(8, "Password must contain at least 8 characters"),
});

export const forgotPasswordSchema = z.object({
  emailAddress: z
    .string()
    .trim()
    .email("Invalid email format")
    .min(1, "Email is required"),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .trim()
    .min(8, "Password must contain at least 8 characters"),
  confirmPassword: z
    .string()
    .trim()
    .min(1, "Password Confirmation is required"),
}).refine(data => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
})

export const accountSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  emailAddress: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format"),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(
      /^(\+?\d{1,4}[\s-]?)?(\(?\d{3}\)?[\s-]?)?[\d\s-]{7,10}$/,
      "Invalid phone number format"
    ),
  gender: z.enum(["male", "female", ""]),
  dateOfBirth: z.string().regex(/^(?:\d{4}-\d{2}-\d{2}|)$/, 'Invalid date format'),
  address: z.string().trim(),
  state: z.string().trim(),
  country: z.string().trim(),
  postCode: z.string().trim(),
});

export const deleteAccountSchema = z.object({
  reason: z.string().trim().min(1, "Input must contain at least 1 character(s)"),
});

export const shippingSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  emailAddress: z.string().trim().min(1, "Email is required").email("Invalid email format"),
  phoneNumber: z
    .string().trim()
    .min(1, "Phone number is required")
    .regex(
      /^(\+?\d{1,4}[\s-]?)?(\(?\d{3}\)?[\s-]?)?[\d\s-]{7,10}$/,
      "Invalid phone number format"
    ),
  // houseNumber: z
  //   .string().trim()
  //   .regex(
  //     /^[0-9]+[a-zA-Z]?([- ]?[0-9a-zA-Z]+)*$/,
  //     "Invalid house number format"
  //   ).optional(),
 houseNumber: z
  .string()
  .trim()
  .regex(/^[0-9]+[a-zA-Z]?([- ]?[0-9a-zA-Z]+)*$/, "Invalid house number format")
  .optional()
  .or(z.literal("")),
  address: z.string().trim().min(1, "Street address is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  postCode: z.string().trim().min(1, "Postal code is required"),
  country: z.string().trim().min(1, "Country is required")
});

export const trackOrderSchema = z.object({
  orderId: z.string().trim().min(1, "Order ID is required"),
});

const userSchema = z.object({
  fullName: z.string().trim().min(1),
  address: z.string().trim().min(1),
  phoneNumber: z.string().trim().min(1),
});

const deliverySchema = z.object({
  type: z.string().trim().min(1),
  address: z.string().trim().min(1),
});

const cardSchema = z.object({
  type: z.string().trim().min(1, "Card type is required"),
  holder: z.string().trim().min(1, "Card holder is required"),
  number: z
    .string().trim()
    .min(16, "Card number must be at least 16 digits")
    .regex(/^\d{4}(?: \d{4})*$/, "Invalid card number format"),
  expiry: z
    .string().trim()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Invalid expiry date format"),
  cvv: z.string().trim().length(3, "CVV must be 3 digits"),
});

export const paymentSchema = z.object({
  user: userSchema,
  // user: accountSchema,
  delivery: deliverySchema,
  // card: cardSchema,
});

export const shopmateSchema = z.object({
  // shopmateId: z.string().trim().min(1, "Shopmate ID is required"),
  // name: z.string().trim().min(1, "Name is required"),
  phoneNumber: z.string().trim().min(1, "Phone number is required"),
  emailAddress: z.string().trim().min(1, "Email is required").email("Invalid email format"),
  // address: z.string().trim().min(1, "Address is required"),
  deliveryNote: z.string().trim().optional(),
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
});