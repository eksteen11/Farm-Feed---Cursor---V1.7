'use client'

import { useState, useEffect } from 'react'
import { 
  Bell, 
  X, 
  Package, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Truck,
  Calendar,
  Star,
  Eye,
  ExternalLink
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Notification, User } from '@/types'
import { formatDate } from '@/shared/utils/utils'

interface NotificationSystemProps {
  currentUser: User
}

export default function NotificationSystem({ currentUser }: NotificationSystemProps) {
  const { notifications, markNotificationAsRead, deleteNotification } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Filter notifications for current user
  const userNotifications = notifications.filter(notif => 
    notif.userId === currentUser.id
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  useEffect(() => {
    const unread = userNotifications.filter(notif => !notif.isRead).length
    setUnreadCount(unread)
  }, [userNotifications])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'offer': return <Package className="w-5 h-5 text-blue-600" />
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-orange-600" />
      case 'message': return <MessageSquare className="w-5 h-5 text-blue-600" />
      case 'payment': return <DollarSign className="w-5 h-5 text-green-600" />
      case 'transport': return <Truck className="w-5 h-5 text-purple-600" />
      case 'info': return <Bell className="w-5 h-5 text-blue-600" />
      default: return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'offer': return 'bg-blue-50 border-blue-200'
      case 'success': return 'bg-green-50 border-green-200'
      case 'error': return 'bg-red-50 border-red-200'
      case 'warning': return 'bg-orange-50 border-orange-200'
      case 'message': return 'bg-blue-50 border-blue-200'
      case 'payment': return 'bg-green-50 border-green-200'
      case 'transport': return 'bg-purple-50 border-purple-200'
      case 'info': return 'bg-blue-50 border-blue-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      markNotificationAsRead(notification.id)
    }

    // Handle navigation based on type and relatedId
    if (notification.relatedId && notification.relatedType) {
      switch (notification.relatedType) {
        case 'offer':
          window.location.href = `/dashboard/offers?offer=${notification.relatedId}`
          break
        case 'deal':
          window.location.href = `/dashboard/deals?deal=${notification.relatedId}`
          break
        case 'transport':
          window.location.href = `/dashboard/transport?request=${notification.relatedId}`
          break
        case 'listing':
          window.location.href = `/listings/${notification.relatedId}`
          break
        default:
          window.location.href = '/dashboard'
      }
    }
  }

  const handleMarkAllAsRead = () => {
    userNotifications.forEach(notif => {
      if (!notif.isRead) {
        markNotificationAsRead(notif.id)
      }
    })
  }

  const handleDeleteNotification = (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteNotification(notificationId)
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
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-emerald-50 to-slate-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {userNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {userNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        !notification.isRead ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <span className="text-xs text-gray-500">
                                  {formatDate(notification.createdAt)}
                                </span>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                                {notification.relatedId && (
                                  <ExternalLink className="w-3 h-3 text-gray-400" />
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => handleDeleteNotification(notification.id, e)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {userNotifications.length > 0 && (
              <div className="p-4 border-t bg-gray-50">
                <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium w-full text-center">
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
