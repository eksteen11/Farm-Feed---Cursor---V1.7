// Real Email Service using Resend API
// This service actually sends emails through Resend

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key-for-build')

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export class RealEmailService {
  private static instance: RealEmailService

  static getInstance(): RealEmailService {
    if (!RealEmailService.instance) {
      RealEmailService.instance = new RealEmailService()
    }
    return RealEmailService.instance
  }

  async sendEmail(data: EmailData): Promise<boolean> {
    try {
      console.log('📧 Sending email to:', data.to)
      
      const result = await resend.emails.send({
        from: 'Farm Feed <noreply@farmfeed.co.za>',
        to: [data.to],
        subject: data.subject,
        html: data.html,
        text: data.text
      })

      console.log('✅ Email sent successfully:', result.data?.id)
      return true
    } catch (error) {
      console.error('❌ Failed to send email:', error)
      return false
    }
  }

  // Send offer received notification
  async sendOfferReceivedEmail(
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
  ): Promise<boolean> {
    const totalValue = (offerPrice * offerQuantity).toLocaleString()
    
    const html = `
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
            <h2>Great news, ${sellerName}!</h2>
            <p>You've received a new offer on your listing: <strong>${listingTitle}</strong></p>
            
            <div class="offer-details">
              <h3>Offer Details:</h3>
              <ul>
                <li><strong>Price:</strong> <span class="highlight">R${offerPrice.toLocaleString()}/ton</span></li>
                <li><strong>Quantity:</strong> ${offerQuantity} tons</li>
                <li><strong>Total Value:</strong> <span class="highlight">R${totalValue}</span></li>
                <li><strong>Delivery:</strong> ${deliveryType}</li>
                <li><strong>Buyer:</strong> ${buyerName} (${buyerCompany})</li>
              </ul>
              ${offerMessage ? `
              <p><strong>Message from buyer:</strong></p>
              <p style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981; margin-top: 10px;">
                "${offerMessage}"
              </p>
              ` : ''}
            </div>
            
            <p>This offer expires on <strong>${expiryDate}</strong>. Don't miss out!</p>
            
            <div style="text-align: center;">
              <a href="${offerLink}" class="button">View & Respond to Offer</a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              You're receiving this email because someone made an offer on your Farm Feed listing. 
              Respond quickly to secure the sale!
            </p>
          </div>
          <div class="footer">
            <p>Farm Feed - Connecting Farmers & Buyers</p>
            <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${sellerEmail}">Unsubscribe</a> | <a href="${process.env.NEXT_PUBLIC_BASE_URL}/settings/notifications">Email Settings</a></p>
          </div>
        </div>
      </body>
      </html>
    `

    const text = `
      New Offer Received - Farm Feed
      
      Hi ${sellerName},
      
      You've received a new offer on your listing: ${listingTitle}
      
      Offer Details:
      - Price: R${offerPrice.toLocaleString()}/ton
      - Quantity: ${offerQuantity} tons
      - Total Value: R${totalValue}
      - Delivery: ${deliveryType}
      - Buyer: ${buyerName} (${buyerCompany})
      
      ${offerMessage ? `Message from buyer: "${offerMessage}"` : ''}
      
      This offer expires on ${expiryDate}.
      
      View and respond to the offer: ${offerLink}
      
      Farm Feed - Connecting Farmers & Buyers
    `

    return await this.sendEmail({
      to: sellerEmail,
      subject: '🎯 New Offer Received on Your Listing - Farm Feed',
      html,
      text
    })
  }

  // Send offer accepted notification
  async sendOfferAcceptedEmail(
    buyerEmail: string,
    buyerName: string,
    sellerName: string,
    sellerCompany: string,
    listingTitle: string,
    offerPrice: number,
    offerQuantity: number,
    deliveryType: string,
    dealLink: string
  ): Promise<boolean> {
    const totalValue = (offerPrice * offerQuantity).toLocaleString()
    
    const html = `
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
            <h2>Great news, ${buyerName}!</h2>
            <p>The seller has accepted your offer on <strong>${listingTitle}</strong>!</p>
            
            <div class="success-details">
              <h3>Deal Confirmed:</h3>
              <ul>
                <li><strong>Product:</strong> ${listingTitle}</li>
                <li><strong>Price:</strong> <span class="highlight">R${offerPrice.toLocaleString()}/ton</span></li>
                <li><strong>Quantity:</strong> ${offerQuantity} tons</li>
                <li><strong>Total Value:</strong> <span class="highlight">R${totalValue}</span></li>
                <li><strong>Seller:</strong> ${sellerName} (${sellerCompany})</li>
                <li><strong>Delivery:</strong> ${deliveryType}</li>
              </ul>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Arrange transport and delivery details</li>
              <li>Coordinate payment terms</li>
              <li>Confirm final delivery date</li>
            </ol>
            
            <div style="text-align: center;">
              <a href="${dealLink}" class="button">View Deal Details</a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
              A deal has been created and both parties can now communicate directly through the platform.
            </p>
          </div>
          <div class="footer">
            <p>Farm Feed - Connecting Farmers & Buyers</p>
            <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${buyerEmail}">Unsubscribe</a> | <a href="${process.env.NEXT_PUBLIC_BASE_URL}/settings/notifications">Email Settings</a></p>
          </div>
        </div>
      </body>
      </html>
    `

    const text = `
      Offer Accepted - Farm Feed
      
      Hi ${buyerName},
      
      Great news! The seller has accepted your offer on ${listingTitle}.
      
      Deal Confirmed:
      - Product: ${listingTitle}
      - Price: R${offerPrice.toLocaleString()}/ton
      - Quantity: ${offerQuantity} tons
      - Total Value: R${totalValue}
      - Seller: ${sellerName} (${sellerCompany})
      - Delivery: ${deliveryType}
      
      Next Steps:
      1. Arrange transport and delivery details
      2. Coordinate payment terms
      3. Confirm final delivery date
      
      View deal details: ${dealLink}
      
      Farm Feed - Connecting Farmers & Buyers
    `

    return await this.sendEmail({
      to: buyerEmail,
      subject: '✅ Your Offer Has Been Accepted! - Farm Feed',
      html,
      text
    })
  }
}

// Export singleton instance
export const realEmailService = RealEmailService.getInstance()
