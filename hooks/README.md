# useClerkJWT Hook - Easy JWT Access

A simple React hook to easily access Clerk JWT tokens in any client component.

## 🚀 Quick Usage

```tsx
'use client'
import { useClerkJWT } from '../hooks/useClerkJWT'

function MyComponent() {
  const { getJWT, isSignedIn } = useClerkJWT()

  const handleClick = async () => {
    // Get JWT token easily
    const token = await getJWT()
    console.log('JWT Token:', token)
  }

  if (!isSignedIn) return <div>Please sign in</div>

  return (
    <button onClick={handleClick}>
      Get JWT Token
    </button>
  )
}
```

## 📋 API Reference

### `useClerkJWT()`

Returns an object with:

- **`getJWT(options?)`** - Function to get JWT token
- **`isSignedIn`** - Boolean indicating if user is signed in
- **`isLoaded`** - Boolean indicating if Clerk is loaded

### `getJWT(options?)`

Options:
- **`template?`** - Custom JWT template name (configured in Clerk dashboard)
- **`logToConsole?`** - Boolean to log token details to console

Returns: `Promise<string | null>`

## 💡 Usage Examples

### Basic Usage
```tsx
const { getJWT } = useClerkJWT()

const token = await getJWT()
```

### With Console Logging
```tsx
const token = await getJWT({ logToConsole: true })
```

### Custom JWT Template
```tsx
const token = await getJWT({ 
  template: 'supabase',
  logToConsole: true 
})
```

### API Calls
```tsx
const handleApiCall = async () => {
  const token = await getJWT()
  
  const response = await fetch('/api/data', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}
```

## 🎯 Benefits

- ✅ **Simple**: One line to get JWT token
- ✅ **Reusable**: Use in any client component
- ✅ **Type Safe**: Full TypeScript support
- ✅ **Error Handling**: Built-in error handling
- ✅ **Console Logging**: Optional debug logging
- ✅ **Custom Templates**: Support for custom JWT templates