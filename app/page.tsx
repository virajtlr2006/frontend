'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const page = () => {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    // Only check redirect logic once user is loaded and we haven't already redirected
    if (!isLoaded || hasRedirected) return

    // If user is signed in but hasn't completed onboarding, redirect to get-started
    if (user && !user.publicMetadata?.onboardingComplete) {
      console.log('🎯 Redirecting new user to get-started')
      setHasRedirected(true)
      router.push('/get-started')
      return
    }

    // Check URL parameters for post-signup redirect
    const urlParams = new URLSearchParams(window.location.search)
    if (user && (urlParams.has('__clerk_db_jwt') || urlParams.has('__clerk_status'))) {
      console.log('🎯 New signup detected, redirecting to get-started')
      setHasRedirected(true)
      router.push('/get-started')
      return
    }
  }, [user, isLoaded, router, hasRedirected])

  // Show loading while checking redirect logic
  if (!isLoaded || (user && !user.publicMetadata?.onboardingComplete && !hasRedirected)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-4xl font-bold mb-8">E-Commerce App</h1>

      {user && (
        <div className="mb-6 text-center">
          <p className="text-lg text-gray-700">
            Welcome back, {user.publicMetadata?.displayName || user.firstName}!
          </p>
          {user.publicMetadata?.role && (
            <p className="text-sm text-gray-500">
              Role: <span className="font-semibold text-blue-600">{user.publicMetadata.role}</span>
            </p>
          )}
        </div>
      )}

      <div className="space-y-4">
        <Link
          href="/token"
          className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
        >
          🔐 JWT Token Logger
        </Link>

        {user && (
          <Link
            href="/get-started"
            className="block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-center"
          >
            ⚙️ Account Settings
          </Link>
        )}
      </div>
    </div>
  )
}

export default page