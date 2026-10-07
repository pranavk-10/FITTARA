import { z } from 'zod';

export const SessionIdParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid session ID format. Must be a valid UUID.' }),
});

export const BodyInputSchema = z.object({
  heightCm: z
    .number({ required_error: 'Height is required' })
    .min(100, { message: 'Height must be at least 100 cm' })
    .max(250, { message: 'Height must not exceed 250 cm' }),
  weightKg: z
    .number({ required_error: 'Weight is required' })
    .min(30, { message: 'Weight must be at least 30 kg' })
    .max(300, { message: 'Weight must not exceed 300 kg' }),
  bodyShape: z.enum(['masculine', 'feminine', 'neutral']).optional().default('neutral'),
  shoulderCm: z
    .number()
    .min(25, { message: 'Shoulder width must be between 25 and 80 cm' })
    .max(80, { message: 'Shoulder width must be between 25 and 80 cm' })
    .optional(),
  chestCm: z
    .number()
    .min(50, { message: 'Chest circumference must be between 50 and 180 cm' })
    .max(180, { message: 'Chest circumference must be between 50 and 180 cm' })
    .optional(),
  waistCm: z
    .number()
    .min(45, { message: 'Waist circumference must be between 45 and 180 cm' })
    .max(180, { message: 'Waist circumference must be between 45 and 180 cm' })
    .optional(),
  hipCm: z
    .number()
    .min(50, { message: 'Hip circumference must be between 50 and 180 cm' })
    .max(180, { message: 'Hip circumference must be between 50 and 180 cm' })
    .optional(),
  inseamCm: z
    .number()
    .min(40, { message: 'Inseam must be between 40 and 110 cm' })
    .max(110, { message: 'Inseam must be between 40 and 110 cm' })
    .optional(),
  armLengthCm: z
    .number()
    .min(30, { message: 'Arm length must be between 30 and 100 cm' })
    .max(100, { message: 'Arm length must be between 30 and 100 cm' })
    .optional(),
  // Optional base64 body photo preview or data URL for calibration
  bodyImageDataUrl: z
    .string()
    .regex(/^data:image\/(jpeg|png|webp);base64,/, {
      message: 'Body photo must be a valid JPEG, PNG, or WebP base64 data URL',
    })
    .max(15 * 1024 * 1024, { message: 'Image payload exceeds 15MB limit' })
    .optional(),
});

export const FaceInputSchema = z.object({
  faceImageDataUrl: z
    .string()
    .regex(/^data:image\/(jpeg|png|webp);base64,/, {
      message: 'Face photo must be a valid JPEG, PNG, or WebP base64 data URL',
    })
    .max(10 * 1024 * 1024, { message: 'Face image payload exceeds 10MB limit' }),
  likenessConsent: z.boolean().refine((val) => val === true, {
    message: 'Explicit temporary likeness consent is required for optional face processing',
  }),
});

export const GarmentInputSchema = z.object({
  category: z.enum(['tshirt', 'jacket'], {
    errorMap: () => ({ message: "Only 'tshirt' and 'jacket' categories are currently supported" }),
  }),
  garmentImageDataUrl: z
    .string()
    .regex(/^data:image\/(jpeg|png|webp);base64,/, {
      message: 'Garment image must be a valid JPEG, PNG, or WebP data URL',
    })
    .max(15 * 1024 * 1024, { message: 'Garment image exceeds 15MB limit' })
    .optional(),
  fabricType: z.enum(['cotton', 'denim', 'wool', 'synthetic', 'blend']).optional().default('cotton'),
});

export type ValidatedBodyInput = z.infer<typeof BodyInputSchema>;
export type ValidatedFaceInput = z.infer<typeof FaceInputSchema>;
export type ValidatedGarmentInput = z.infer<typeof GarmentInputSchema>;
