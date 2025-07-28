/**
 * Check if user can access specific client data
 */
export function canAccessClient(userRole: string, userClientId: string, targetClientId: string): boolean {
  if (userRole === 'admin') {
    return true // Admins can access all clients
  }
  
  if (userRole === 'client') {
    return userClientId === targetClientId // Clients can only access their own data
  }
  
  return false
}

/**
 * Generate random password
 */
export function generateRandomPassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  
  return password
}