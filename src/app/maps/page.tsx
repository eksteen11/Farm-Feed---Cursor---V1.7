import { UserProvider } from '@/components/maps/UserContext'
import UserTypeSelector from '@/components/maps/UserTypeSelector'
import EnhancedGoogleMaps from '@/components/maps/EnhancedGoogleMaps'

export default function MapsPage() {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Farm Feed Maps</h1>
          <p className="text-gray-600 mb-6">
            Explore the agricultural marketplace across South Africa with interactive maps and spatial intelligence
          </p>
          
          {/* User Type Selector */}
          <UserTypeSelector />
          
          {/* Interactive Google Maps */}
          <div className="mb-8">
            <EnhancedGoogleMaps height="600px" />
          </div>
          

        </div>
      </div>
    </UserProvider>
  )
}