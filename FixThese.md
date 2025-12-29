# Frontend Issues to Fix

This document contains a comprehensive list of issues that need to be fixed for the application to work properly.

## 🔴 Critical Issues (Application Won't Work Without These)

### 1. Environment Variable Inconsistencies
**Location:** `src/components/Dashboard/Dashboard.tsx` (lines 35-36)

**Issue:** Using `REACT_APP_*` prefix instead of `VITE_APP_*` prefix. This is a Vite project, not Create React App.

**Current Code:**
```typescript
export const CLIENT_ID = import.meta.env.REACT_APP_DISCORD_CLIENT_ID!;
export const REDIRECT_URI = import.meta.env.REACT_APP_DISCORD_REDIRECT_URI!;
```

**Fix:** Change to:
```typescript
export const CLIENT_ID = import.meta.env.VITE_APP_DISCORD_CLIENT_ID!;
export const REDIRECT_URI = import.meta.env.VITE_APP_DISCORD_REDIRECT_URI!;
```

**Impact:** Discord OAuth will not work on the Dashboard page.

---

### 2. Missing Environment Variables Configuration
**Location:** Root directory

**Issue:** No `.env` file exists. The application requires these environment variables:
- `VITE_APP_DISCORD_CLIENT_ID`
- `VITE_APP_DISCORD_REDIRECT_URI`
- `VITE_APP_API_ENDPOINT`

**Fix:** Create a `.env` file in the root directory with:
```
VITE_APP_DISCORD_CLIENT_ID=your_discord_client_id
VITE_APP_DISCORD_REDIRECT_URI=your_redirect_uri
VITE_APP_API_ENDPOINT=your_api_endpoint
```

**Impact:** Application will crash or fail silently when these variables are accessed.

---

### 3. JWT Token Not Updated After Sign In
**Location:** `src/context/AuthProvider.tsx` (lines 70-82)

**Issue:** After `userSignIn` completes, the JWT token is not fetched and set in state. Only the user object is updated.

**Current Code:**
```typescript
const userSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try{    
        await signIn({username: email, password: password})
        const user = await getCurrentUser();
        const name = (await fetchUserAttributes()).name;
        setCurrentUser({...user, name});
        // Missing: Fetch and set JWT token
    } 
    finally{
        setIsLoading(false);
    }   
}
```

**Fix:** Add token fetching after sign in:
```typescript
const { tokens } = await fetchAuthSession();
if (tokens) {
    setJWToken(tokens.idToken?.toString());
}
```

**Impact:** Protected API calls will fail after sign in because `jwtToken` is not set.

---

### 4. Incorrect Response Handling in `handleAddLocation`
**Location:** `src/components/Dashboard/Dashboard.tsx` (lines 77-86)

**Issue:** `checkTokensAndFetch` returns the parsed JSON response, not a Response object. The code checks `res.ok` which doesn't exist on a JSON object.

**Current Code:**
```typescript
const res = await checkTokensAndFetch(`${API_ENDPOINT}/locations`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newLocationForDB),
});

if (!res.ok) {  // ❌ res is JSON, not Response object
    throw new Error(`Request failed: ${res.status}`)
}
```

**Fix:** Remove the `res.ok` check since `checkTokensAndFetch` already handles errors. Also add the new location to state:
```typescript
const res = await checkTokensAndFetch(`${API_ENDPOINT}/locations`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(newLocationForDB),
});

if (res) {
    // Add to local state
    const normalizedLocation = normalizeCoords(res);
    setLocations((prev) => [...prev, normalizedLocation]);
}
```

**Impact:** Adding locations will fail silently, and new locations won't appear in the UI.

---

### 5. Missing Dependency in `useEffect` Hooks
**Location:** Multiple files

**Issues:**
- `src/components/CallbackPage/CallbackPage.tsx` (line 72): Missing `authReady` and `searchParams` in dependency array
- `src/components/Dashboard/Dashboard.tsx` (line 60): Missing `API_ENDPOINT` in dependency array (or handle undefined case)

**Fix:** Add missing dependencies to useEffect dependency arrays.

**Impact:** Components may not re-render when dependencies change, causing stale data or missed updates.

---

### 6. ProtectedRoute Doesn't Wait for Auth Ready
**Location:** `src/components/ProtectedRoute/ProtectedRoute.tsx`

**Issue:** Checks `currentUser` immediately without waiting for `authReady`, which can cause false redirects on initial page load.

**Current Code:**
```typescript
export const ProtectedRoute = ({children} : {children: ReactNode}) => {
    const {currentUser} = useAuth();
    return currentUser !== null ? children : <Navigate to="/"/>
}
```

**Fix:** Wait for auth to be ready:
```typescript
export const ProtectedRoute = ({children} : {children: ReactNode}) => {
    const {currentUser, authReady} = useAuth();
    
    if (!authReady) {
        return <div>Loading...</div>; // or a loading spinner
    }
    
    return currentUser !== null ? children : <Navigate to="/"/>
}
```

**Impact:** Users may be incorrectly redirected to home page even when authenticated.

---

### 7. Incorrect Parameter Type in `onDelete` Call
**Location:** `src/components/Dashboard/LocationCard/LocationCard.tsx` (line 137)

**Issue:** `onDelete` is called with `id` (string) but the function signature expects `locationName` (string).

**Current Code:**
```typescript
<button onClick={() => onDelete(id)} className="location-card-button location-card-button-delete">
```

**Function Signature:**
```typescript
onDelete: (locationName: string) => void;
```

**Fix:** Either:
1. Change `handleDelete` to accept `id` instead of `locationName`
2. Pass `location_name` instead of `id` to `onDelete`

**Impact:** Delete functionality will not work correctly.

---

## 🟡 Important Issues (Features Don't Work Properly)

### 8. Incomplete Delete Functionality
**Location:** `src/components/Dashboard/Dashboard.tsx` (lines 98-111)

**Issue:** `handleDelete` function is completely commented out and doesn't make API calls or update state.

**Fix:** Implement the delete functionality:
```typescript
const handleDelete = async (locationId: string) => {
    try {
        await checkTokensAndFetch(`${API_ENDPOINT}/locations/${locationId}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        setLocations((prev) => prev.filter((loc) => loc.id !== locationId));
    } catch (error) {
        console.error('Delete failed:', error);
    }
};
```

**Impact:** Users cannot delete locations.

---

### 9. Incomplete Edit Functionality
**Location:** `src/components/Dashboard/Dashboard.tsx` (lines 113-131)

**Issue:** `handleEdit` only updates local state but doesn't make API calls to persist changes.

**Current Code:**
```typescript
const handleEdit = async (id: string, updates: ...) => {
    // API call is commented out
    setLocations((prev) => prev.map((loc) => (loc.id === id ? { ...loc, ...updates } : loc)));
};
```

**Fix:** Implement the PUT request:
```typescript
const handleEdit = async (id: string, updates: Pick<Location, 'location_name' | 'type' | 'xCoord' | 'yCoord' | 'zCoord'>) => {
    try {
        const { xCoord, yCoord, zCoord, ...rest } = updates;
        const locationForDB = {
            id,
            ...rest,
            coords: `${xCoord}, ${yCoord}, ${zCoord}`
        };
        
        await checkTokensAndFetch(`${API_ENDPOINT}/locations`, {
            method: 'PUT',
            credentials: 'include',
            body: JSON.stringify(locationForDB),
        });
        
        setLocations((prev) => prev.map((loc) => (loc.id === id ? { ...loc, ...updates } : loc)));
    } catch (error) {
        console.error('Edit failed:', error);
    }
};
```

**Impact:** Edits are not persisted to the backend.

---

### 10. Image Upload Doesn't Actually Upload
**Location:** `src/components/Dashboard/Dashboard.tsx` (lines 93-96)

**Issue:** `handleImageUpload` only creates a local object URL but doesn't upload to S3 or make API calls.

**Current Code:**
```typescript
const handleImageUpload = (id: string, file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setLocations((prev) => prev.map((loc) => (loc.id === id ? { ...loc, imageUrl: objectUrl } : loc)));
};
```

**Fix:** Implement actual image upload:
```typescript
const handleImageUpload = async (id: string, file: File) => {
    try {
        // Get presigned URL or upload directly
        const formData = new FormData();
        formData.append('image', file);
        formData.append('locationId', id);
        
        const response = await checkTokensAndFetch(`${API_ENDPOINT}/locations/${id}/image`, {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });
        
        if (response?.imageUrl) {
            setLocations((prev) => prev.map((loc) => 
                (loc.id === id ? { ...loc, imageUrl: response.imageUrl } : loc)
            ));
        }
    } catch (error) {
        console.error('Image upload failed:', error);
    }
};
```

**Impact:** Images are not persisted and will be lost on page refresh.

---

### 11. Missing Discord OAuth Connection Check
**Location:** `src/components/Dashboard/Dashboard.tsx` (lines 138-147)

**Issue:** The "Connect to Discord" button is always shown. According to comments, it should only show if the user hasn't connected Discord.

**Fix:** Add a check to see if user has connected Discord:
```typescript
const [isDiscordConnected, setIsDiscordConnected] = useState(false);

useEffect(() => {
    const checkDiscordConnection = async () => {
        try {
            const response = await checkTokensAndFetch(`${API_ENDPOINT}/auth/discord-status`, {
                method: 'GET',
            });
            setIsDiscordConnected(response?.connected || false);
        } catch (error) {
            setIsDiscordConnected(false);
        }
    };
    checkDiscordConnection();
}, []);

// Then conditionally render button:
{!isDiscordConnected && (
    <button onClick={buildDiscordAuthUrl}>Connect to Discord</button>
)}
```

**Impact:** Users see "Connect to Discord" button even after connecting.

---

### 12. Error Handling in Location Fetching
**Location:** `src/components/Dashboard/Dashboard.tsx` (lines 44-60)

**Issue:** `getUserLocationsOnLoad` doesn't handle cases where:
- API returns an error
- API returns empty/null response
- `normalizeCoords` receives invalid data

**Fix:** Add proper error handling:
```typescript
const getUserLocationsOnLoad = async () => {
    try {
        const retrieveLocations = await checkTokensAndFetch(`${API_ENDPOINT}/locations`, {
            method: "GET",
            credentials: "include"
        });
        
        if (retrieveLocations && Array.isArray(retrieveLocations)) {
            const userLocations = normalizeCoords(retrieveLocations);
            setLocations(userLocations);
        } else {
            setLocations([]);
        }
    } catch (error) {
        console.error('Failed to fetch locations:', error);
        setLocations([]);
    }
}
```

**Impact:** Application may crash or show incorrect data if API returns unexpected response.

---

### 13. Incorrect Redirect in `checkToken.ts`
**Location:** `src/utils/checkToken.ts` (line 53)

**Issue:** Redirects to `/login` but there's no login route. Should redirect to `/`.

**Current Code:**
```typescript
window.location.href = "/login";
```

**Fix:**
```typescript
window.location.href = "/";
```

**Impact:** Users will see a 404 page instead of being redirected to home.

---

### 14. Missing Error Handling for Undefined Environment Variables
**Location:** `src/utils/OAuth.ts`, `src/components/CallbackPage/CallbackPage.tsx`, `src/components/Dashboard/Dashboard.tsx`

**Issue:** Environment variables are accessed with `!` (non-null assertion) but could be undefined, causing runtime errors.

**Fix:** Add validation:
```typescript
const CLIENT_ID = import.meta.env.VITE_APP_DISCORD_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_APP_DISCORD_REDIRECT_URI;

if (!CLIENT_ID || !REDIRECT_URI) {
    throw new Error('Missing required environment variables: VITE_APP_DISCORD_CLIENT_ID, VITE_APP_DISCORD_REDIRECT_URI');
}
```

**Impact:** Application will crash with cryptic errors if env vars are missing.

---

## 🟢 Minor Issues (Code Quality & UX)

### 15. JWT Token State Type Inconsistency
**Location:** `src/context/AuthProvider.tsx` (line 13)

**Issue:** `jwtToken` is initialized as empty string `""` but type allows `string | undefined`.

**Fix:** Initialize as `undefined`:
```typescript
const [jwtToken, setJWToken] = useState<string | undefined>(undefined);
```

---

### 16. Missing Loading State in CallbackPage
**Location:** `src/components/CallbackPage/CallbackPage.tsx`

**Issue:** While waiting for `authReady`, the component shows "loading" but doesn't indicate it's waiting for auth.

**Fix:** Check `authReady` before processing:
```typescript
if (!authReady) {
    return <h1>Initializing...</h1>;
}
```

---

### 17. Missing User Feedback After Adding Location
**Location:** `src/components/Dashboard/Dashboard.tsx`

**Issue:** After successfully adding a location, there's no visual feedback. The modal just closes.

**Fix:** Add success message or toast notification.

---

### 18. No Error Display for Failed API Calls
**Location:** `src/components/Dashboard/Dashboard.tsx`

**Issue:** Errors are only logged to console. Users don't see error messages.

**Fix:** Add error state and display error messages to users.

---

### 19. Missing Validation for API_ENDPOINT
**Location:** `src/components/Dashboard/Dashboard.tsx`, `src/components/CallbackPage/CallbackPage.tsx`

**Issue:** `API_ENDPOINT` could be undefined, causing API calls to fail with cryptic errors.

**Fix:** Add validation at the top of components:
```typescript
const API_ENDPOINT = import.meta.env.VITE_APP_API_ENDPOINT;
if (!API_ENDPOINT) {
    throw new Error('VITE_APP_API_ENDPOINT is not defined');
}
```

---

### 20. TypeScript Type for utility.js
**Location:** `src/utils/utility.js`

**Issue:** JavaScript file in TypeScript project. Should be converted to TypeScript or at least have type definitions.

**Fix:** Convert to TypeScript or add JSDoc types.

---

### 21. Missing Error Handling in AuthProvider
**Location:** `src/context/AuthProvider.tsx` (line 22)

**Issue:** `fetchUserAttributes()` could fail, but error is not handled.

**Fix:** Add try-catch:
```typescript
try {
    const name = (await fetchUserAttributes()).name;
    setCurrentUser({...user, name});
} catch (error) {
    console.error('Failed to fetch user attributes:', error);
    setCurrentUser(user); // Set user without name
}
```

---

### 22. Commented Code Should Be Removed
**Location:** Multiple files

**Issue:** There are commented-out code blocks that should either be implemented or removed for code clarity.

**Fix:** Remove commented code or implement the functionality.

---

## 📝 Summary

**Total Issues:** 22
- **Critical (7):** Must fix for basic functionality
- **Important (7):** Features won't work without these
- **Minor (8):** Code quality and UX improvements

**Priority Order:**
1. Fix environment variable inconsistencies (#1, #2)
2. Fix JWT token not updating after sign in (#3)
3. Fix ProtectedRoute auth ready check (#6)
4. Fix handleAddLocation response handling (#4)
5. Implement missing API functionality (#8, #9, #10)
6. Add error handling and validation (#12, #13, #14, #19)
7. Fix remaining issues (#5, #7, #11, and minor issues)

