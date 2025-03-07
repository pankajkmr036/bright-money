import { delay } from "@/utils/delay"
import type { LoginCredentials, AuthResponse } from "@/services/api/mockApi/authTypes"

/**
 * A mock API client to simulate backend server responses
 */
class MockApiClient {
  /**
   * Mock API delay to simulate network requests
   * Adjust this to simulate different network conditions
   */
  private apiDelay = 500

  /**
   * Mock login API endpoint
   *
   * @param credentials - The login credentials
   * @returns Promise resolving to auth data or rejecting with error
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API network delay
    await delay(this.apiDelay)

    // For demo purposes, accept any username/password with minimum lengths
    if (credentials.username.length >= 3 && credentials.password.length >= 6) {
      return {
        user: {
          id: "user-123",
          username: credentials.username,
          name: "Demo User",
          email: `${credentials.username}@example.com`,
        },
        token: `mock-jwt-token-${Date.now()}`,
      }
    }

    // Simulate server error response
    throw new Error("Invalid credentials")
  }

  /**
   * Mock current user API endpoint
   *
   * @param token - The authentication token
   * @returns Promise resolving to user data or rejecting with error
   */
  async getCurrentUser(token: string): Promise<AuthResponse["user"]> {
    // Simulate API network delay
    await delay(this.apiDelay)

    // Validate token (this is mock validation)
    if (!token || !token.startsWith("mock-jwt-token-")) {
      throw new Error("Invalid token")
    }

    // Return mock user data
    return {
      id: "user-123",
      username: "demouser",
      name: "Demo User",
      email: "demo@example.com",
    }
  }

  /**
   * Sets the simulated API delay
   *
   * @param ms - Delay in milliseconds
   */
  setDelay(ms: number): void {
    this.apiDelay = ms
  }
}

// Export a singleton instance
export const mockApiClient = new MockApiClient()
