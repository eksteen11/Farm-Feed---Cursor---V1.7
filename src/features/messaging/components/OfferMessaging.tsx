'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video,
  CheckCircle,
  Clock,
  User,
  Package,
  DollarSign,
  AlertCircle,
  Star
} from 'lucide-react'
import Button from '@/shared/ui/Button'
import Input from '@/shared/ui/Input'
import { useStore } from '@/store/useStore'
import { Offer, User as UserType, Message } from '@/types'
import { formatDate } from '@/shared/utils/utils

interface OfferMessagingProps {
  offer: Offer
  currentUser: UserType
  otherUser: UserType
  isOpen: boolean
  onClose: () => void
}

export default function OfferMessaging({ 
  offer, 
  currentUser, 
  otherUser, 
  isOpen, 
  onClose 
}: OfferMessagingProps) {
  const { messages, addMessage, updateMessage } = useStore()
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get messages for this offer
  const offerMessages = messages.filter(msg => 
    msg.offerId === offer.id || 
    (msg.senderId === currentUser.id && msg.receiverId === otherUser.id) ||
    (msg.senderId === otherUser.id && msg.receiverId === currentUser.id)
  ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [offerMessages])

  useEffect(() => {
    if (isOpen) {
      // Mark messages as read when opening
      offerMessages.forEach(msg => {
        if (msg.receiverId === currentUser.id && !msg.isRead) {
          updateMessage(msg.id, { ...msg, isRead: true })
        }
      })
    }
  }, [isOpen, offerMessages, currentUser.id, updateMessage])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || isLoading) return

    setIsLoading(true)
    
    try {
      const message: Message = {
        id: `msg-${Date.now()}`,
        offerId: offer.id,
        senderId: currentUser.id,
        receiverId: otherUser.id,
        message: newMessage.trim(),
        messageType: 'offer-discussion',
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      addMessage(message)
      setNewMessage('')
      
      // Simulate typing indicator for other user
      setIsTyping(true)
      setTimeout(() => setIsTyping(false), 2000)
      
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMessageStatus = (message: Message) => {
    if (message.senderId === currentUser.id) {
      return message.isRead ? (
        <CheckCircle className="w-4 h-4 text-blue-500" />
      ) : (
        <Clock className="w-4 h-4 text-gray-400" />
      )
    }
    return null
  }

  const getOfferStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      case 'counter-offered': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-emerald-50 to-slate-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Offer Discussion - {offer.id}
              </h2>
              <p className="text-sm text-slate-600">
                {otherUser.name} • {otherUser.company || 'Individual'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getOfferStatusColor(offer.status)}`}>
              {offer.status.replace('-', ' ')}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Offer Summary */}
        <div className="p-4 bg-slate-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-gray-500">Price:</span>
                <span className="ml-1 font-semibold">R{offer.price.toLocaleString()}/ton</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-gray-500">Quantity:</span>
                <span className="ml-1 font-semibold">{offer.quantity} tons</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-gray-500">Expires:</span>
                <span className="ml-1 font-semibold">{formatDate(offer.expiresAt)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-gray-500">Total:</span>
                <span className="ml-1 font-semibold">R{(offer.price * offer.quantity).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Offer Details Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-blue-900">Offer Created</span>
                  <span className="text-xs text-blue-600">{formatDate(offer.createdAt)}</span>
                </div>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Price:</strong> R{offer.price.toLocaleString()}/ton</p>
                  <p><strong>Quantity:</strong> {offer.quantity} tons</p>
                  <p><strong>Delivery:</strong> {offer.deliveryType.replace('-', ' ')}</p>
                  {offer.deliveryAddress && (
                    <p><strong>Address:</strong> {offer.deliveryAddress}</p>
                  )}
                  {offer.message && (
                    <div className="mt-2 p-2 bg-white rounded border">
                      <p><strong>Message:</strong> {offer.message}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          {offerMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.senderId === currentUser.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{message.message}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs opacity-70">
                    {formatDate(message.createdAt)}
                  </span>
                  {getMessageStatus(message)}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="pr-12"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={!newMessage.trim() || isLoading}
              className="px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="secondary" size="sm" leftIcon={<Phone className="w-4 h-4" />}>
                Call
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<Video className="w-4 h-4" />}>
                Video
              </Button>
            </div>
            <div className="text-xs text-gray-500">
              Messages are encrypted and secure
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
