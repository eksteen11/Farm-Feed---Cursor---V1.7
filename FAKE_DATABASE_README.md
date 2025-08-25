# Farm Feed - Fake Database System

This document describes the comprehensive fake database system built for testing and development purposes before migrating to Airtable.

## Overview

The fake database system provides a complete simulation of all the data operations needed for the Farm Feed application, including:

- **User Authentication & Management**
- **Product Listings & Management**
- **Offers & Negotiations**
- **Transport Requests & Quotes**
- **Dashboard Analytics & Metrics**
- **Market Depth & Trading Data**

## Architecture

### 1. Mock Data (`lib/mockData.ts`)
Contains all the static data and helper functions for database operations.

### 2. Authentication Service (`lib/authService.ts`)
Handles all authentication operations including login, registration, profile management, and role-based access control.

### 3. Database Service (`lib/databaseService.ts`)
Provides a clean API for all data operations with proper error handling and pagination support.

### 4. Store (`store/useStore.ts`)
Zustand store that manages application state and integrates with the fake database services.

## Data Models

### Users
```typescript
interface User {
  id: string
  email: string
  name: string
  role: 'buyer' | 'seller' | 'transporter' | 'admin'
  company?: string
  location: string
  phone?: string
  avatar?: string
  isVerified: boolean
  subscriptionStatus: 'active' | 'inactive' | 'expired'
  subscriptionExpiry?: Date
  createdAt: Date
  updatedAt: Date
}
```

### Listings
```typescript
interface Listing {
  id: string
  sellerId: string
  seller: User
  product: Product
  title: string
  description: string
  price: number
  currency: 'ZAR' | 'USD'
  quantity: number
  availableQuantity: number
  location: string
  images: string[]
  isActive: boolean
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

### Products
```typescript
interface Product {
  id: string
  name: string
  category: 'grain' | 'feed' | 'seed' | 'fertilizer' | 'other'
  subcategory?: string
  description: string
  specifications: Record<string, any>
  unit: 'kg' | 'ton' | 'bag' | 'liter'
  minQuantity: number
  maxQuantity?: number
}
```

### Offers
```typescript
interface Offer {
  id: string
  listingId: string
  listing: Listing
  buyerId: string
  buyer: User
  price: number
  quantity: number
  message?: string
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'cancelled'
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}
```

### Transport
```typescript
interface TransportRequest {
  id: string
  dealId?: string
  deal?: Deal
  requesterId: string
  requester: User
  pickupLocation: string
  deliveryLocation: string
  quantity: number
  unit: string
  preferredDate: Date
  budget?: number
  status: 'open' | 'quoted' | 'accepted' | 'in_progress' | 'completed'
  productType?: string
  specialRequirements?: string
  contactPhone?: string
  urgent?: boolean
  createdAt: Date
  updatedAt: Date
}
```

## Authentication

### Login
```typescript
import { authService } from '@/lib/authService'

const response = await authService.login({
  email: 'john@maizefarm.co.za',
  password: 'password' // All test users use 'password'
})
```

### Registration
```typescript
const response = await authService.register({
  email: 'newuser@farm.co.za',
  password: 'password',
  name: 'New User',
  role: 'buyer',
  company: 'New Farm',
  location: 'Gauteng, South Africa',
  phone: '+27 82 123 4567'
})
```

### Role-Based Access Control
```typescript
// Check specific role
if (authService.isSeller()) {
  // User is a seller
}

// Check multiple roles
if (authService.hasAnyRole(['buyer', 'seller'])) {
  // User is either buyer or seller
}

// Admin check
if (authService.isAdmin()) {
  // User is admin
}
```

## Database Operations

### Fetching Data
```typescript
import { databaseService } from '@/lib/databaseService'

// Get all listings with filters
const listings = await databaseService.getListings({
  category: 'grain',
  minPrice: 1000,
  maxPrice: 10000,
  location: 'Free State',
  sortBy: 'price',
  sortOrder: 'asc',
  page: 1,
  limit: 20
})

// Get user-specific data
const userListings = await databaseService.getListingsBySeller(userId)
const userOffers = await databaseService.getOffersByUser(userId)
const userDeals = await databaseService.getDealsByUser(userId)
```

### Search Functionality
```typescript
// Search listings
const searchResults = await databaseService.searchListings('maize', {
  category: 'grain',
  minPrice: 1000,
  page: 1,
  limit: 10
})
```

### Analytics & Dashboard
```typescript
// Get dashboard metrics
const metrics = await databaseService.getDashboardMetrics()

// Get market depth
const marketDepth = await databaseService.getMarketDepth()

// Get user analytics
const userAnalytics = await databaseService.getAnalytics(userId)
```

## Store Integration

The Zustand store automatically integrates with the fake database:

```typescript
import { useStore } from '@/store/useStore'

const { 
  currentUser, 
  isAuthenticated, 
  listings, 
  offers, 
  deals,
  login, 
  logout, 
  register,
  fetchListings,
  createListing,
  updateListing,
  deleteListing
} = useStore()

// Login
await login('john@maizefarm.co.za', 'password')

// Fetch data
fetchListings({ category: 'grain' })

// Create listing
createListing({
  product: productData,
  title: 'Premium Maize',
  description: 'High-quality maize for sale',
  price: 5000,
  currency: 'ZAR',
  quantity: 100,
  availableQuantity: 100,
  location: 'Free State, South Africa',
  images: ['image1.jpg', 'image2.jpg'],
  isActive: true,
  expiresAt: new Date('2024-12-31')
})
```

## Test Data

### Pre-loaded Users
All test users use the password `password`:

- **john@maizefarm.co.za** - Seller (Maize Farm)
- **sarah@feedmill.co.za** - Buyer (Feed Mill)
- **mike@wheatfarm.co.za** - Seller (Wheat Farm)
- **lisa@livestock.co.za** - Buyer (Livestock Farm)
- **peter@transport.co.za** - Transporter
- **maria@soybean.co.za** - Seller (Soybean Farm)
- **david@dairy.co.za** - Buyer (Dairy Farm)
- **admin@farmfeed.co.za** - Admin

### Sample Data
- **Products**: 6 different agricultural products
- **Listings**: 5 active listings across different categories
- **Offers**: 3 sample offers in various states
- **Deals**: 2 completed deals
- **Transport**: 2 transport requests with quotes
- **Notifications**: 4 sample notifications

## Testing Scenarios

### 1. User Authentication Flow
1. Register new user
2. Login with credentials
3. Access protected routes
4. Update profile
5. Logout

### 2. Listing Management
1. Create new listing
2. Edit existing listing
3. Deactivate listing
4. Search and filter listings
5. View listing details

### 3. Trading Flow
1. Browse listings
2. Make offer
3. Seller accepts/rejects offer
4. Complete deal
5. Arrange transport

### 4. Transport Services
1. Create transport request
2. Transporter submits quote
3. Buyer accepts quote
4. Track delivery status

### 5. Dashboard & Analytics
1. View metrics
2. Check market depth
3. Monitor user activity
4. Review notifications

## Error Handling

All services include comprehensive error handling:

```typescript
const response = await databaseService.getListings()

if (response.success) {
  // Handle success
  const listings = response.data
} else {
  // Handle error
  console.error(response.message)
}
```

## Pagination Support

Most list operations support pagination:

```typescript
const response = await databaseService.getListings({
  page: 1,
  limit: 20
})

// Response includes pagination metadata
const { data, meta } = response
console.log(`Page ${meta.page} of ${meta.totalPages}`)
console.log(`Showing ${data.length} of ${meta.total} items`)
```

## Performance Considerations

- All data is stored in memory for fast access
- No network latency simulation
- Large datasets are handled efficiently with pagination
- Search operations are optimized for small to medium datasets

## Migration Path to Airtable

When ready to migrate to Airtable:

1. **Replace Service Calls**: Update service methods to call Airtable API instead of mock data
2. **Data Mapping**: Map Airtable fields to existing interfaces
3. **Authentication**: Implement Airtable authentication
4. **Real-time Updates**: Add webhook support for real-time data updates
5. **Error Handling**: Update error handling for network failures
6. **Caching**: Implement proper caching strategies

## Development Workflow

1. **Start Development Server**: `npm run dev`
2. **Test Features**: Use the fake database to test all functionality
3. **Debug Issues**: Check console logs and network tab
4. **Iterate**: Make changes and test immediately
5. **Stabilize**: Ensure all features work correctly
6. **Migrate**: Move to Airtable when ready

## Troubleshooting

### Common Issues

1. **Hydration Errors**: Ensure all dynamic content is wrapped in `ClientOnly`
2. **Authentication Issues**: Check if user exists in mock data
3. **Data Not Loading**: Verify store integration and service calls
4. **Performance Issues**: Check for infinite loops or excessive re-renders

### Debug Tools

- Browser DevTools for state inspection
- Console logs for service calls
- Network tab for API simulation
- React DevTools for component debugging

## Conclusion

This fake database system provides a robust foundation for testing and developing the Farm Feed application. It simulates real-world scenarios while maintaining fast development cycles. When ready for production, the migration to Airtable will be straightforward due to the clean service layer architecture.

For questions or issues, refer to the service implementations or create new mock data as needed for specific testing scenarios.
