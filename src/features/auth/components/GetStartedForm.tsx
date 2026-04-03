'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useClerkJWT } from '../hooks/useClerkJWT'
import { getStartedSchema, GetStartedFormData } from '../schemas/authSchemas'
import { AuthService } from '../services/authService'

interface GetStartedFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

/**
 * GetStartedForm component for user onboarding
 * Uses React Hook Form with Zod validation and Clerk JWT authentication
 */
export function GetStartedForm({ onSuccess, onError }: GetStartedFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { getJWT, isLoaded, isSignedIn } = useClerkJWT()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<GetStartedFormData>({
    resolver: zodResolver(getStartedSchema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (data: GetStartedFormData) => {
    if (!isLoaded || !isSignedIn) {
      const error = 'Please sign in to continue'
      setSubmitError(error)
      onError?.(error)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Get JWT token from Clerk
      const jwtToken = await getJWT()
      if (!jwtToken) {
        throw new Error('Failed to get authentication token')
      }

      // Call the complete signup API
      const response = await AuthService.completeSignup(data, jwtToken)

      if (response.success) {
        onSuccess?.()
        // Redirect to the main application
        router.push('/')
      } else {
        throw new Error(response.message || 'Failed to complete signup')
      }
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'An unexpected error occurred'
      setSubmitError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-red-600 mb-4">
          Authentication Required
        </h2>
        <p className="text-gray-600">
          Please sign in to complete your account setup.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            What's your name?
          </label>
          <input
            {...register('name')}
            id="name"
            type="text"
            placeholder="Enter your full name"
            className={`
              w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${errors.name ? 'border-red-500' : 'border-gray-300'}
            `}
            disabled={isSubmitting}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-sm text-red-600" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        {submitError && (
          <div
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
            role="alert"
          >
            <p className="text-sm text-red-800">{submitError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-colors
            ${
              isValid && !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Completing Setup...
            </span>
          ) : (
            'Complete Setup'
          )}
        </button>
      </form>
    </div>
  )
}