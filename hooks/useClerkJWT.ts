'use client'
import { useAuth } from '@clerk/nextjs'
import { useCallback } from 'react'

export function useClerkJWT() {
  const { getToken, isSignedIn, isLoaded } = useAuth()

  // Simple function to get JWT token
  const getJWT = useCallback(async (options?: {
    template?: string
    logToConsole?: boolean
  }) => {
    if (!isSignedIn) {
      console.warn('User not signed in')
      return null
    }

    try {
      const token = await getToken({ template: options?.template })

      if (options?.logToConsole && token) {
        // Decode and log token info
        const payload = JSON.parse(atob(token.split('.')[1]))
        console.group('🔑 JWT Token')
        console.log('Token:', token)
        console.log('User ID:', payload.sub)
        console.log('Session ID:', payload.sid)
        console.log('Expires:', new Date(payload.exp * 1000))
        console.groupEnd()
      }

      return token
    } catch (error) {
      console.error('Error getting JWT:', error)
      return null
    }
  }, [getToken, isSignedIn])

  return {
    getJWT,
    isSignedIn,
    isLoaded
  }
}