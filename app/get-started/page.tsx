'use client'

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { GetStartedForm } from '../../src/features/auth/components/GetStartedForm'

/**
 * Get Started page for new user onboarding
 * Redirects users who are already set up and shows onboarding form for new users
 */
export default function GetStartedPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    // Redirect if user is not loaded yet or not signed in
    if (isLoaded && !user) {
      router.push('/sign-in')
      return
    }

    // Check if user has already completed onboarding
    if (user?.publicMetadata?.onboardingComplete) {
      router.push('/')
      return
    }
  }, [user, isLoaded, router])

  // Show loading spinner while user data is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth required message if user is not signed in
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to complete your account setup.
          </p>
          <button
            onClick={() => router.push('/sign-in')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    )
  }

  const handleSuccess = () => {
    console.log('Onboarding completed successfully')
    // The form component handles the redirect
  }

  const handleError = (error: string) => {
    console.error('Onboarding error:', error)
    // Error is already displayed in the form component
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to our platform!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Let's get you set up with your account
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 text-center">
              Complete Your Profile
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Tell us a bit about yourself to personalize your experience
            </p>
          </div>

          <GetStartedForm onSuccess={handleSuccess} onError={handleError} />
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By completing your profile, you agree to our terms of service
          </p>
        </div>
      </div>
    </div>
  )
}