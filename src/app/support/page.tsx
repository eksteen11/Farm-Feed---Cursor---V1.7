'use client'

import React from 'react'
import { Card, CardContent, CardTitle } from '@/shared/ui/Card'
import Button from '@/shared/ui/Button'
import { Mail, Phone, MessageCircle, HelpCircle } from 'lucide-react'

export default function SupportPage() {
  const faqs = [
    {
      question: "How do I create a listing?",
      answer: "Sign up as a seller, verify your account, and use the 'Create Listing' button in your dashboard."
    },
    {
      question: "How do I make an offer?",
      answer: "Browse listings, click 'Make Offer', enter your price and quantity, and submit your offer."
    },
    {
      question: "What are the subscription fees?",
      answer: "We offer a simple R10/month subscription that gives you access to all trading features."
    },
    {
      question: "How do I arrange transport?",
      answer: "Once a deal is confirmed, you can request transport quotes from our verified transporters."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Support Center
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get help with your Farm Feed account, trading questions, and technical support
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardContent className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary-600" />
              </div>
              <CardTitle className="text-lg mb-2">Email Support</CardTitle>
              <p className="text-gray-600 mb-4">
                Send us a detailed message and we'll respond within 24 hours
              </p>
              <Button variant="secondary">
                Send Email
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary-600" />
              </div>
              <CardTitle className="text-lg mb-2">Phone Support</CardTitle>
              <p className="text-gray-600 mb-4">
                Call us directly for immediate assistance
              </p>
              <Button variant="secondary">
                Call Now
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-primary-600" />
              </div>
              <CardTitle className="text-lg mb-2">WhatsApp Chat</CardTitle>
              <p className="text-gray-600 mb-4">
                Chat with our support team on WhatsApp
              </p>
              <Button variant="secondary">
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Find quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg mb-2">
                        {faq.question}
                      </CardTitle>
                      <p className="text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <Card>
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Get in Touch
              </h2>
              <p className="text-gray-600">
                Our support team is here to help you succeed
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary-600" />
                    <span className="text-gray-600">info@farmfeed.co.za</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <span className="text-gray-600">+27 11 123 4567</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Business Hours
                </h3>
                <div className="space-y-2 text-gray-600">
                  <div>Monday - Friday: 8:00 AM - 6:00 PM</div>
                  <div>Saturday: 9:00 AM - 2:00 PM</div>
                  <div>Sunday: Closed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
