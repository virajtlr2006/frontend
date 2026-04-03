import { CompleteSignupResponse, GetStartedFormData } from '../schemas/authSchemas'

/**
 * Auth service for handling signup completion API calls
 */
export class AuthService {
  private static readonly BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://your-api-domain.com' // Replace with your production API URL
    : 'http://localhost:3001'

  /**
   * Complete user signup by sending name and JWT token to backend
   * @param data Form data containing user's name
   * @param jwtToken JWT token from Clerk
   * @returns Promise with the API response
   */
  static async completeSignup(
    data: GetStartedFormData,
    jwtToken: string
  ): Promise<CompleteSignupResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/api/auth/complete-signup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result as CompleteSignupResponse
    } catch (error) {
      console.error('Error completing signup:', error)
      throw error
    }
  }
}