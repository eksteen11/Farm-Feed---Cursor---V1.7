import { User, UserRole } from '@/types'
import { 
  authenticateUser, 
  createUser, 
  updateUser, 
  deleteUser, 
  getUserByEmail,
  getUserById 
} from '@/shared/utils/mockData'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  role: UserRole
  company?: string
  location: string
  phone?: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
  token?: string
}

export interface ProfileUpdateData {
  name?: string
  company?: string
  location?: string
  phone?: string
  avatar?: string
}

class AuthService {
  private currentUser: User | null = null
  private isAuthenticated: boolean = false

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const user = authenticateUser(credentials.email, credentials.password)
      
      if (user) {
        this.currentUser = user
        this.isAuthenticated = true
        
        // In a real app, you'd get a JWT token here
        const token = this.generateMockToken(user)
        
        return {
          success: true,
          user,
          token
        }
      } else {
        return {
          success: false,
          error: 'Invalid email or password'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Login failed. Please try again.'
      }
    }
  }

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = getUserByEmail(data.email)
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists'
        }
      }

      // Create new user
      const newUser = createUser({
        email: data.email,
        name: data.name,
        role: data.role,
        company: data.company,
        location: data.location,
        phone: data.phone
      })

      this.currentUser = newUser
      this.isAuthenticated = true

      // Generate mock token
      const token = this.generateMockToken(newUser)

      return {
        success: true,
        user: newUser,
        token
      }
    } catch (error) {
      return {
        success: false,
        error: 'Registration failed. Please try again.'
      }
    }
  }

  // Logout user
  async logout(): Promise<AuthResponse> {
    try {
      this.currentUser = null
      this.isAuthenticated = false

      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: 'Logout failed'
      }
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser
  }

  // Check if user is authenticated
  isUserAuthenticated(): boolean {
    return this.isAuthenticated
  }

  // Update user profile
  async updateProfile(updates: ProfileUpdateData): Promise<AuthResponse> {
    try {
      if (!this.currentUser) {
        return {
          success: false,
          error: 'No user logged in'
        }
      }

      const updatedUser = updateUser(this.currentUser.id, updates)
      if (updatedUser) {
        this.currentUser = updatedUser
        return {
          success: true,
          user: updatedUser
        }
      } else {
        return {
          success: false,
          error: 'Failed to update profile'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Profile update failed'
      }
    }
  }

  // Delete user account
  async deleteAccount(): Promise<AuthResponse> {
    try {
      if (!this.currentUser) {
        return {
          success: false,
          error: 'No user logged in'
        }
      }

      const success = deleteUser(this.currentUser.id)
      if (success) {
        this.currentUser = null
        this.isAuthenticated = false
        return {
          success: true
        }
      } else {
        return {
          success: false,
          error: 'Failed to delete account'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Account deletion failed'
      }
    }
  }

  // Change user password (mock implementation)
  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      if (!this.currentUser) {
        return {
          success: false,
          error: 'No user logged in'
        }
      }

      // In a real app, you'd verify the current password and hash the new one
      // For now, we'll just return success
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: 'Password change failed'
      }
    }
  }

  // Verify user email (mock implementation)
  async verifyEmail(verificationCode: string): Promise<AuthResponse> {
    try {
      if (!this.currentUser) {
        return {
          success: false,
          error: 'No user logged in'
        }
      }

      // In a real app, you'd verify the code and update the user
      const updatedUser = updateUser(this.currentUser.id, { isVerified: true })
      if (updatedUser) {
        this.currentUser = updatedUser
        return {
          success: true,
          user: updatedUser
        }
      } else {
        return {
          success: false,
          error: 'Verification failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: 'Email verification failed'
      }
    }
  }

  // Request password reset (mock implementation)
  async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      const user = getUserByEmail(email)
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        }
      }

      // In a real app, you'd send a reset email
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: 'Password reset request failed'
      }
    }
  }

  // Reset password (mock implementation)
  async resetPassword(resetToken: string, newPassword: string): Promise<AuthResponse> {
    try {
      // In a real app, you'd verify the reset token and update the password
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: 'Password reset failed'
      }
    }
  }

  // Check if user has specific role
  hasRole(role: UserRole): boolean {
    return this.currentUser?.role === role
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: UserRole[]): boolean {
    return this.currentUser ? roles.includes(this.currentUser.role) : false
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole('admin')
  }

  // Check if user is seller
  isSeller(): boolean {
    return this.hasRole('seller')
  }

  // Check if user is buyer
  isBuyer(): boolean {
    return this.hasRole('buyer')
  }

  // Check if user is transporter
  isTransporter(): boolean {
    return this.hasRole('transporter')
  }

  // Get user by ID (for admin purposes)
  async getUserById(id: string): Promise<User | null> {
    try {
      return getUserById(id) || null
    } catch (error) {
      return null
    }
  }

  // Get all users (for admin purposes)
  async getAllUsers(): Promise<User[]> {
    try {
      // In a real app, this would be paginated
      return []
    } catch (error) {
      return []
    }
  }

  // Generate mock JWT token (for testing purposes)
  private generateMockToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }
    
    // In a real app, this would be signed with a secret key
    return `mock_token_${btoa(JSON.stringify(payload))}`
  }

  // Validate mock token (for testing purposes)
  validateToken(token: string): User | null {
    try {
      if (!token.startsWith('mock_token_')) {
        return null
      }

      const payload = JSON.parse(atob(token.replace('mock_token_', '')))
      const now = Math.floor(Date.now() / 1000)

      if (payload.exp < now) {
        return null
      }

      const user = getUserById(payload.userId)
      if (user) {
        this.currentUser = user
        this.isAuthenticated = true
        return user
      }

      return null
    } catch (error) {
      return null
    }
  }

  // Refresh token (mock implementation)
  async refreshToken(): Promise<AuthResponse> {
    try {
      if (!this.currentUser) {
        return {
          success: false,
          error: 'No user logged in'
        }
      }

      const newToken = this.generateMockToken(this.currentUser)
      return {
        success: true,
        user: this.currentUser,
        token: newToken
      }
    } catch (error) {
      return {
        success: false,
        error: 'Token refresh failed'
      }
    }
  }
}

// Export singleton instance
export const authService = new AuthService()

// Export the class for testing purposes
export default AuthService
