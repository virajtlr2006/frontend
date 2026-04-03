// User role definitions for the e-commerce platform
export enum UserRole {
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  ADMIN = 'admin',
}

// Type alias for easier usage
export type Roles = UserRole | 'customer' | 'vendor' | 'admin'

// Role permissions mapping
export const ROLE_PERMISSIONS = {
  [UserRole.CUSTOMER]: [
    'view_products',
    'add_to_cart',
    'place_orders',
    'view_own_orders',
    'manage_own_profile',
    'leave_reviews',
    'use_wishlist',
    'chat_support'
  ],
  [UserRole.VENDOR]: [
    'manage_products',
    'view_own_products',
    'manage_inventory',
    'view_own_orders',
    'view_analytics',
    'manage_promotions',
    'communicate_customers',
    'manage_vendor_profile',
    'access_vendor_dashboard'
  ],
  [UserRole.ADMIN]: [
    'manage_all_users',
    'manage_vendors',
    'moderate_content',
    'view_platform_analytics',
    'manage_categories',
    'handle_disputes',
    'system_configuration',
    'access_admin_dashboard',
    'manage_roles'
  ]
} as const

// Helper function to check if a role has a specific permission
export const hasPermission = (role: Roles, permission: string): boolean => {
  return ROLE_PERMISSIONS[role as UserRole]?.includes(permission as any) || false
}

// Helper function to get all permissions for a role
export const getRolePermissions = (role: Roles): readonly string[] => {
  return ROLE_PERMISSIONS[role as UserRole] || []
}

// Role hierarchy for upgrade/downgrade logic
export const ROLE_HIERARCHY = {
  [UserRole.CUSTOMER]: 0,
  [UserRole.VENDOR]: 1,
  [UserRole.ADMIN]: 2,
} as const

// Helper function to check if role A can manage role B
export const canManageRole = (managerRole: Roles, targetRole: Roles): boolean => {
  const managerLevel = ROLE_HIERARCHY[managerRole as UserRole]
  const targetLevel = ROLE_HIERARCHY[targetRole as UserRole]
  return managerLevel > targetLevel
}

// Default role for new users
export const DEFAULT_ROLE = UserRole.CUSTOMER

// Role display names for UI
export const ROLE_DISPLAY_NAMES = {
  [UserRole.CUSTOMER]: 'Customer',
  [UserRole.VENDOR]: 'Vendor',
  [UserRole.ADMIN]: 'Administrator',
} as const

// Role descriptions for UI
export const ROLE_DESCRIPTIONS = {
  [UserRole.CUSTOMER]: 'Shop for products, manage orders, and leave reviews',
  [UserRole.VENDOR]: 'Sell products, manage inventory, and track sales analytics',
  [UserRole.ADMIN]: 'Manage platform operations, users, and system configuration',
} as const

// Vendor-specific metadata interface
export interface VendorMetadata {
  businessName: string
  businessType?: string
  businessAddress?: string
  phone?: string
  gst?: string
  panCard?: string
  bankAccountNumber?: string
  bankIfscCode?: string
  isApproved: boolean
  subscriptionTier: 'basic' | 'premium' | 'enterprise'
  subscriptionExpiresAt?: string
}

// User metadata interface extending Clerk's metadata structure
export interface UserMetadata {
  role: Roles
  onboardingComplete?: boolean
  vendorInfo?: VendorMetadata
  preferences?: {
    language?: 'en' | 'hi'
    currency?: 'INR'
    notifications?: boolean
  }
  lastLoginAt?: string
  registrationSource?: string
}