'use client'

import React, { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { Card, CardContent } from './Card'

interface FAQItem {
  question: string
  answer: string
  category?: string
}

interface FAQSectionProps {
  faqs: FAQItem[]
  title?: string
  subtitle?: string
  className?: string
}

export default function FAQSection({ 
  faqs, 
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about Farm Feed",
  className = '' 
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className={`relative py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden ${className}`}>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3D693D]/10 rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-[#3D693D]" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <Card 
                key={index} 
                variant="elevated" 
                className="overflow-hidden transition-all duration-300 hover:shadow-xl"
              >
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 md:px-8 md:py-6 text-left flex items-center justify-between group hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg md:text-xl font-bold text-gray-900 pr-8 group-hover:text-[#3D693D] transition-colors">
                      {faq.question}
                    </span>
                    <ChevronDown 
                      className={`w-6 h-6 text-[#3D693D] flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Help Link */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions?
          </p>
          <a 
            href="/contact" 
            className="text-[#3D693D] font-semibold hover:text-[#2A4A2A] transition-colors inline-flex items-center gap-2"
          >
            Contact our support team
            <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
          </a>
        </div>
      </div>
    </section>
  )
}







