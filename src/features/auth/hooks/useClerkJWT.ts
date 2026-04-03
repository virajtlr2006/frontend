import { useAuth } from '@clerk/nextjs'
import { useCallback } from 'react'

/**
 * Custom hook to handle JWT tokens from Clerk
 * Provides easy access to JWT tokens for API authentication
 */
export function useClerkJWT() {
  const { getToken, isLoaded, isSignedIn } = useAuth()

  /**
   * Get JWT token from Clerk
   * @param template Optional JWT template name for custom claims
   * @returns Promise<string | null> JWT token or null if not authenticated
   */
  const getJWT = useCallback(async (template?: string): Promise<string | null> => {
    if (!isLoaded || !isSignedIn) {
      return null
    }

    try {
      const token = await getToken(template ? { template } : undefined)
      return token
    } catch (error) {
      console.error('Error getting JWT token:', error)
      return null
    }
  }, [getToken, isLoaded, isSignedIn])

  return {
    getJWT,
    isLoaded,
    isSignedIn,
  }
}