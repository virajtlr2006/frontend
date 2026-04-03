import { z } from 'zod'

/**
 * Validation schema for the get started form
 * Validates name input with proper constraints
 */
export const getStartedSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .trim()
})

/**
 * TypeScript type inference from the Zod schema
 */
export type GetStartedFormData = z.infer<typeof getStartedSchema>

/**
 * API response schema for the complete signup endpoint
 */
export const completeSignupResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: z.object({
    id: z.string(),
    role: z.string(),
    onboardingComplete: z.boolean(),
  }).optional()
})

export type CompleteSignupResponse = z.infer<typeof completeSignupResponseSchema>