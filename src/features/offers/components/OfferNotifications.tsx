'use client'

import { useState, useEffect } from 'react'
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  RotateCcw,
  Clock,
  Package,
  DollarSign,
  X
} from 'lucide-react'
import Badge from '@/shared/ui/Badge'
import Button from '@/shared/ui/Button'
import { Offer, User } from '@/types'
import { formatDate } from '@/shared/utils/utils'

interface OfferNotification {
  id: string
  type: 'offer_received' | 'offer_accepted' | 'offer_rejected' | 'counter_offer' | 'offer_expired'
  title: string
  message: string
  offer: Offer
  isRead: boolean
  createdAt: Date
}

interface OfferNotificationsProps {
  offers: Offer[]
  currentUser: User
  onMarkAsRead: (notificationId: string) => void
  onMarkAllAsRead: () => void
}

export default function OfferNotifications({ 
  offers, 
  currentUser, 
  onMarkAsRead, 
  onMarkAllAsRead 
}: OfferNotificationsProps) {
  const [notifications, setNotifications] = useState<OfferNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Generate notifications from offers
  useEffect(() => {
    const newNotifications: OfferNotification[] = []
    
    offers.forEach(offer => {
      // Only show notifications for recent activity (last 7 days)
      const offerDate = new Date(offer.updatedAt)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      
      if (offerDate >= weekAgo) {
        if (currentUser.role === 'seller' && offer.status === 'pending') {
          newNotifications.push({
            id: `notification-${offer.id}-received`,
            type: 'offer_received',
            title: 'New Offer Received',
            message: `You received a new offer for R${offer.price.toLocaleString()}/ton`,
            offer,
            isRead: false,
            createdAt: offer.createdAt
          })
        }
        
        if (offer.status === 'accepted') {
          newNotifications.push({
            id: `notification-${offer.id}-accepted`,
            type: 'offer_accepted',
            title: currentUser.role === 'buyer' ? 'Offer Accepted!' : 'Buyer Accepted Your Offer!',
            message: currentUser.role === 'buyer' 
              ? 'Your offer has been accepted by the seller'
              : 'The buyer has accepted your offer',
            offer,
            isRead: false,
            createdAt: offer.updatedAt
          })
        }
        
        if (offer.status === 'rejected') {
          newNotifications.push({
            id: `notification-${offer.id}-rejected`,
            type: 'offer_rejected',
            title: currentUser.role === 'buyer' ? 'Offer Rejected' : 'Buyer Rejected Your Offer',
            message: currentUser.role === 'buyer' 
              ? 'Your offer was rejected by the seller'
              : 'The buyer rejected your offer',
            offer,
            isRead: false,
            createdAt: offer.updatedAt
          })
        }
        
        if (offer.status === 'counter-offered' && offer.counterOffer) {
          newNotifications.push({
            id: `notification-${offer.id}-counter`,
            type: 'counter_offer',
            title: currentUser.role === 'buyer' ? 'Counter Offer Received' : 'Counter Offer Sent',
            message: currentUser.role === 'buyer'
              ? `Seller countered with R${offer.counterOffer.price.toLocaleString()}/ton`
              : `You sent a counter offer for R${offer.counterOffer.price.toLocaleString()}/ton`,
            offer,
            isRead: false,
            createdAt: offer.counterOffer.createdAt
          })
        }
      }
    })
    
    // Sort by most recent first
    newNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setNotifications(newNotifications)
  }, [offers, currentUser.role])

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleMarkAsRead = (notificationId: string) => {
    onMarkAsRead(notificationId)
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    )
  }

  const handleMarkAllAsRead = () => {
    onMarkAllAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'offer_received': return <Package className="w-5 h-5 text-green-600" />
      case 'offer_accepted': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'offer_rejected': return <XCircle className="w-5 h-5 text-red-600" />
      case 'counter_offer': return <RotateCcw className="w-5 h-5 text-red-600" />
      case 'offer_expired': return <Clock className="w-5 h-5 text-gray-600" />
      default: return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'offer_received': return 'bg-green-50 border-green-200'
      case 'offer_accepted': return 'bg-green-50 border-green-200'
      case 'offer_rejected': return 'bg-red-50 border-red-200'
      case 'counter_offer': return 'bg-red-50 border-red-200'
      case 'offer_expired': return 'bg-gray-50 border-gray-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 min-w-[20px] h-5 text-xs bg-red-500 text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-l-4 ${
                  notification.isRead ? 'opacity-75' : ''
                } ${getNotificationColor(notification.type)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        {notification.isRead ? 'Read' : 'Mark read'}
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>
                        {notification.offer.quantity} tons • R{notification.offer.price.toLocaleString()}/ton
                      </span>
                      <span>{formatDate(notification.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-sm"
              onClick={() => setIsOpen(false)}
            >
              View All Notifications
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
