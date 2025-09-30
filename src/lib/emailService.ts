// Email Service for Farm Feed Platform
// This service handles email notifications for offers, deals, and messages

export interface EmailNotification {
  to: string
  subject: string
  html: string
  type: 'offer-received' | 'offer-accepted' | 'offer-rejected' | 'offer-countered' | 'message-received' | 'deal-created'
  priority: 'high' | 'normal' | 'low'
}

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

// Email Templates
const emailTemplates: Record<string, EmailTemplate> = {
  'offer-received': {
    subject: '🎯 New Offer Received on Your Listing - Farm Feed',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Offer Received</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; font-size: 14px; color: #6b7280; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .offer-details { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .highlight { color: #10b981; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 New Offer Received!</h1>
            <p>Someone is interested in your listing</p>
          </div>
          <div class="content">
            <h2>Great news, {{sellerName}}!</h2>
            <p>You've received a new offer on your listing: <strong>{{listingTitle}}</strong></p>
            
            <div class="offer-details">
              <h3>Offer Details:</h3>
              <ul>
                <li><strong>Price:</strong> <span class="highlight">R{{offerPrice}}/ton</span></li>
                <li><strong>Quantity:</strong> {{offerQuantity}} tons</li>
                <li><strong>Total Value:</strong> <span class="highlight">R{{totalValue}}</span></li>
                <li><strong>Delivery:</strong> {{deliveryType}}</li>
                <li><strong>Buyer:</strong> {{buyerName}} ({{buyerCompany}})</li>
              </ul>
              {{#if offerMessage}}
              <p><strong>Message from buyer:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981; margin-top: 10px;">
                "{{offerMessage}}"
              </p>
              {{/if}}
            </div>
            
            <p>This offer expires on <strong>{{expiryDate}}</strong>. Don't miss out!</p>
            
            <div style="text-align: center;">
              <a href="{{offerLink}}" class="button">View & Respond to Offer</a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              You're receiving this email because someone made an offer on your Farm Feed listing. 
              Respond quickly to secure the sale!
            </p>
          </div>
          <div class="footer">
            <p>Farm Feed - Connecting Farmers & Buyers</p>
            <p><a href="{{unsubscribeLink}}">Unsubscribe</a> | <a href="{{settingsLink}}">Email Settings</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      New Offer Received - Farm Feed
      
      Hi {{sellerName}},
      
      You've received a new offer on your listing: {{listingTitle}}
      
      Offer Details:
      - Price: R{{offerPrice}}/ton
      - Quantity: {{offerQuantity}} tons
      - Total Value: R{{totalValue}}
      - Delivery: {{deliveryType}}
      - Buyer: {{buyerName}} ({{buyerCompany}})
      
      {{#if offerMessage}}
      Message from buyer: "{{offerMessage}}"
      {{/if}}
      
      This offer expires on {{expiryDate}}.
      
      View and respond to the offer: {{offerLink}}
      
      Farm Feed - Connecting Farmers & Buyers
    `
  },

  'offer-accepted': {
    subject: '✅ Your Offer Has Been Accepted! - Farm Feed',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offer Accepted</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; font-size: 14px; color: #6b7280; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .success-details { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .highlight { color: #10b981; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
            <p>Your offer has been accepted</p>
          </div>
          <div class="content">
            <h2>Great news, {{buyerName}}!</h2>
            <p>The seller has accepted your offer on <strong>{{listingTitle}}</strong>!</p>
            
            <div class="success-details">
              <h3>Deal Confirmed:</h3>
              <ul>
                <li><strong>Product:</strong> {{listingTitle}}</li>
                <li><strong>Price:</strong> <span class="highlight">R{{offerPrice}}/ton</span></li>
                <li><strong>Quantity:</strong> {{offerQuantity}} tons</li>
                <li><strong>Total Value:</strong> <span class="highlight">R{{totalValue}}</span></li>
                <li><strong>Seller:</strong> {{sellerName}} ({{sellerCompany}})</li>
                <li><strong>Delivery:</strong> {{deliveryType}}</li>
              </ul>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Arrange transport and delivery details</li>
              <li>Coordinate payment terms</li>
              <li>Confirm final delivery date</li>
            </ol>
            
            <div style="text-align: center;">
              <a href="{{dealLink}}" class="button">View Deal Details</a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              A deal has been created and both parties can now communicate directly through the platform.
            </p>
          </div>
          <div class="footer">
            <p>Farm Feed - Connecting Farmers & Buyers</p>
            <p><a href="{{unsubscribeLink}}">Unsubscribe</a> | <a href="{{settingsLink}}">Email Settings</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Offer Accepted - Farm Feed
      
      Hi {{buyerName}},
      
      Great news! The seller has accepted your offer on {{listingTitle}}.
      
      Deal Confirmed:
      - Product: {{listingTitle}}
      - Price: R{{offerPrice}}/ton
      - Quantity: {{offerQuantity}} tons
      - Total Value: R{{totalValue}}
      - Seller: {{sellerName}} ({{sellerCompany}})
      - Delivery: {{deliveryType}}
      
      Next Steps:
      1. Arrange transport and delivery details
      2. Coordinate payment terms
      3. Confirm final delivery date
      
      View deal details: {{dealLink}}
      
      Farm Feed - Connecting Farmers & Buyers
    `
  },

  'offer-countered': {
    subject: '🔄 Counter Offer Received - Farm Feed',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Counter Offer Received</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f9fafb; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; font-size: 14px; color: #6b7280; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .counter-details { background: #fffbeb; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .highlight { color: #f59e0b; font-weight: 600; }
          .original { text-decoration: line-through; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔄 Counter Offer Received</h1>
            <p>The seller has made a counter offer</p>
          </div>
          <div class="content">
            <h2>Hi {{buyerName}},</h2>
            <p>The seller has responded to your offer on <strong>{{listingTitle}}</strong> with a counter offer.</p>
            
            <div class="counter-details">
              <h3>Counter Offer Details:</h3>
              <ul>
                <li><strong>Your Original Price:</strong> <span class="original">R{{originalPrice}}/ton</span></li>
                <li><strong>Seller's Counter Price:</strong> <span class="highlight">R{{counterPrice}}/ton</span></li>
                <li><strong>Quantity:</strong> {{offerQuantity}} tons</li>
                <li><strong>Total Value:</strong> <span class="highlight">R{{totalValue}}</span></li>
                <li><strong>Seller:</strong> {{sellerName}} ({{sellerCompany}})</li>
              </ul>
              {{#if counterMessage}}
              <p><strong>Message from seller:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; margin-top: 10px;">
                "{{counterMessage}}"
              </p>
              {{/if}}
            </div>
            
            <p>You can accept this counter offer, make your own counter offer, or decline.</p>
            
            <div style="text-align: center;">
              <a href="{{offerLink}}" class="button">Respond to Counter Offer</a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              Counter offers typically have a shorter response time. Respond quickly to keep the negotiation active!
            </p>
          </div>
          <div class="footer">
            <p>Farm Feed - Connecting Farmers & Buyers</p>
            <p><a href="{{unsubscribeLink}}">Unsubscribe</a> | <a href="{{settingsLink}}">Email Settings</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Counter Offer Received - Farm Feed
      
      Hi {{buyerName}},
      
      The seller has responded to your offer on {{listingTitle}} with a counter offer.
      
      Counter Offer Details:
      - Your Original Price: R{{originalPrice}}/ton
      - Seller's Counter Price: R{{counterPrice}}/ton
      - Quantity: {{offerQuantity}} tons
      - Total Value: R{{totalValue}}
      - Seller: {{sellerName}} ({{sellerCompany}})
      
      {{#if counterMessage}}
      Message from seller: "{{counterMessage}}"
      {{/if}}
      
      You can accept this counter offer, make your own counter offer, or decline.
      
      Respond to counter offer: {{offerLink}}
      
      Farm Feed - Connecting Farmers & Buyers
    `
  }
}

// Template rendering function
function renderTemplate(template: string, variables: Record<string, any>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] || match
  })
}

// Email service class
export class EmailService {
  private static instance: EmailService
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_EMAIL_API_KEY || ''
    this.baseUrl = process.env.NEXT_PUBLIC_EMAIL_BASE_URL || 'https://api.emailservice.com'
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  // Send email notification
  async sendNotification(notification: EmailNotification): Promise<boolean> {
    try {
      // In a real implementation, this would call your email service API
      console.log('📧 Sending email notification:', {
        to: notification.to,
        subject: notification.subject,
        type: notification.type,
        priority: notification.priority
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Log for development
      console.log('✅ Email sent successfully')
      return true
    } catch (error) {
      console.error('❌ Failed to send email:', error)
      return false
    }
  }

  // Generate offer received notification
  generateOfferReceivedEmail(
    sellerEmail: string,
    sellerName: string,
    buyerName: string,
    buyerCompany: string,
    listingTitle: string,
    offerPrice: number,
    offerQuantity: number,
    deliveryType: string,
    offerMessage: string,
    expiryDate: string,
    offerLink: string
  ): EmailNotification {
    const template = emailTemplates['offer-received']
    const totalValue = (offerPrice * offerQuantity).toLocaleString()
    
    const variables = {
      sellerName,
      buyerName,
      buyerCompany,
      listingTitle,
      offerPrice: offerPrice.toLocaleString(),
      offerQuantity,
      totalValue,
      deliveryType,
      offerMessage,
      expiryDate,
      offerLink,
      unsubscribeLink: `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${sellerEmail}`,
      settingsLink: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/notifications`
    }

    return {
      to: sellerEmail,
      subject: template.subject,
      html: renderTemplate(template.html, variables),
      type: 'offer-received',
      priority: 'high'
    }
  }

  // Generate offer accepted notification
  generateOfferAcceptedEmail(
    buyerEmail: string,
    buyerName: string,
    sellerName: string,
    sellerCompany: string,
    listingTitle: string,
    offerPrice: number,
    offerQuantity: number,
    deliveryType: string,
    dealLink: string
  ): EmailNotification {
    const template = emailTemplates['offer-accepted']
    const totalValue = (offerPrice * offerQuantity).toLocaleString()
    
    const variables = {
      buyerName,
      sellerName,
      sellerCompany,
      listingTitle,
      offerPrice: offerPrice.toLocaleString(),
      offerQuantity,
      totalValue,
      deliveryType,
      dealLink,
      unsubscribeLink: `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${buyerEmail}`,
      settingsLink: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/notifications`
    }

    return {
      to: buyerEmail,
      subject: template.subject,
      html: renderTemplate(template.html, variables),
      type: 'offer-accepted',
      priority: 'high'
    }
  }

  // Generate counter offer notification
  generateCounterOfferEmail(
    buyerEmail: string,
    buyerName: string,
    sellerName: string,
    sellerCompany: string,
    listingTitle: string,
    originalPrice: number,
    counterPrice: number,
    offerQuantity: number,
    counterMessage: string,
    offerLink: string
  ): EmailNotification {
    const template = emailTemplates['offer-countered']
    const totalValue = (counterPrice * offerQuantity).toLocaleString()
    
    const variables = {
      buyerName,
      sellerName,
      sellerCompany,
      listingTitle,
      originalPrice: originalPrice.toLocaleString(),
      counterPrice: counterPrice.toLocaleString(),
      offerQuantity,
      totalValue,
      counterMessage,
      offerLink,
      unsubscribeLink: `${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${buyerEmail}`,
      settingsLink: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/notifications`
    }

    return {
      to: buyerEmail,
      subject: template.subject,
      html: renderTemplate(template.html, variables),
      type: 'offer-countered',
      priority: 'high'
    }
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance()

// Helper function to send offer notifications
export async function sendOfferNotification(
  type: 'offer-received' | 'offer-accepted' | 'offer-countered',
  data: any
): Promise<boolean> {
  const service = emailService
  
  let notification: EmailNotification
  
  switch (type) {
    case 'offer-received':
      notification = service.generateOfferReceivedEmail(
        data.sellerEmail,
        data.sellerName,
        data.buyerName,
        data.buyerCompany,
        data.listingTitle,
        data.offerPrice,
        data.offerQuantity,
        data.deliveryType,
        data.offerMessage,
        data.expiryDate,
        data.offerLink
      )
      break
      
    case 'offer-accepted':
      notification = service.generateOfferAcceptedEmail(
        data.buyerEmail,
        data.buyerName,
        data.sellerName,
        data.sellerCompany,
        data.listingTitle,
        data.offerPrice,
        data.offerQuantity,
        data.deliveryType,
        data.dealLink
      )
      break
      
    case 'offer-countered':
      notification = service.generateCounterOfferEmail(
        data.buyerEmail,
        data.buyerName,
        data.sellerName,
        data.sellerCompany,
        data.listingTitle,
        data.originalPrice,
        data.counterPrice,
        data.offerQuantity,
        data.counterMessage,
        data.offerLink
      )
      break
      
    default:
      throw new Error(`Unknown notification type: ${type}`)
  }
  
  return await service.sendNotification(notification)
}
