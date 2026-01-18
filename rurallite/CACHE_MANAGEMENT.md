# Cache Management System

## Overview
The cache management system automatically handles cache clearing on hard refresh and provides manual cache control for better performance and fresh data.

## Features

### 1. **Automatic Hard Refresh Detection**
- Detects `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Automatically clears all caches on hard refresh
- Clears:
  - Service Worker caches
  - localStorage (preserves auth tokens)
  - sessionStorage
  - IndexedDB
  - SWR cache

### 2. **Daily Automatic Maintenance**
- Clears offline/stale data once per 24 hours
- Removes expired localStorage items
- Cleans up runtime caches
- Keeps critical precache intact

### 3. **Manual Cache Control**
- **Location**: Profile page → Account Settings
- **Button**: "Clear Cache & Offline Data"
- **Action**: Clears all caches and reloads the page
- **Use case**: When experiencing data issues or want fresh data

### 4. **Service Worker Integration**
- Message-based cache clearing
- Version-based cache invalidation
- Automatic old cache cleanup

## How It Works

### Hard Refresh Flow
```
User presses Ctrl+Shift+R
→ sessionStorage marks 'hardRefresh'
→ Page reloads
→ Layout detects hard refresh
→ clearAllCaches() executes
→ All caches cleared
→ Page loads with fresh data
```

### Daily Maintenance Flow
```
User visits app
→ Check lastCacheCleared timestamp
→ If > 24 hours
  → clearOfflineData()
  → Remove expired data
  → Update timestamp
```

### Manual Clear Flow
```
User clicks "Clear Cache & Offline Data"
→ Confirmation dialog
→ manualClearCache()
→ All caches cleared
→ Page automatically reloads
```

## Cache Types Managed

### 1. Service Worker Caches
- **Precache**: Critical assets (manifest, offline page)
- **Runtime Cache**: Dynamic API responses
- **Action**: Complete clearing on hard refresh

### 2. localStorage
- **Quiz history cache**
- **User preferences**
- **Offline data**
- **Action**: Clear except auth tokens

### 3. sessionStorage
- **Temporary session data**
- **Action**: Complete clearing

### 4. IndexedDB
- **Large offline datasets**
- **Action**: Complete database deletion

### 5. SWR Cache
- **React data fetching cache**
- **Action**: Clear all SWR keys

## Implementation Files

```
lib/utils/cacheManager.js      - Core cache utilities
app/layout.js                   - Hard refresh detection setup
public/sw.js                    - Service worker cache handling
app/profile/page.jsx            - Manual clear button
```

## Usage Examples

### Programmatic Cache Clearing
```javascript
import { clearAllCaches, clearOfflineData, clearSWRCache } from '@/lib/utils/cacheManager';

// Clear everything
await clearAllCaches();

// Clear only offline data
await clearOfflineData();

// Clear only SWR cache
clearSWRCache();
```

### In Components
```javascript
import { manualClearCache } from '@/lib/utils/cacheManager';

const handleClearCache = async () => {
  const confirmed = confirm('Clear all cached data?');
  if (confirmed) {
    await manualClearCache(); // Clears and reloads
  }
};
```

## Benefits

### Performance
- ✅ Removes stale cached data
- ✅ Reduces cache bloat
- ✅ Faster load times with fresh data

### Data Freshness
- ✅ Ensures latest content after hard refresh
- ✅ Prevents outdated data display
- ✅ Automatic daily maintenance

### User Control
- ✅ Manual clear option in profile
- ✅ Clear confirmation dialog
- ✅ Feedback with toast notifications

## Troubleshooting

### Cache Not Clearing?
1. Check browser console for errors
2. Verify service worker is active
3. Try manual clear from profile page

### Auth Token Lost?
- Auth tokens are preserved during cache clear
- If lost, check localStorage protection logic

### Slow Performance?
- Use manual cache clear
- Check lastCacheCleared timestamp
- May need to clear browser cache manually

## Best Practices

1. **Users should know:**
   - Hard refresh (`Ctrl+Shift+R`) clears cache
   - Manual clear available in profile
   - Data reloads after clearing

2. **Developers should:**
   - Don't store critical data only in cache
   - Use versioned cache names
   - Test cache clearing regularly

3. **Maintenance:**
   - Monitor cache sizes
   - Update cache versions when needed
   - Clear test data regularly

## Cache Versioning

Current version: `rurallite-v1.1`

To force cache update:
1. Increment version in `public/sw.js`
2. Update `CACHE_NAME` constant
3. Deploy changes
4. Old caches auto-deleted on activation
