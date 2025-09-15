

# 🚀 Farm Feed Demo Testing Guide

## 📋 **Demo Account Credentials**

| Role | Email | Password | Purpose |
|------|--------|----------|---------|
| **Buyer** | `buyer@demo.com` | `demo123` | Test offer creation and management |
| **Seller** | `
` | `demo123` | Test listing management and offer responses |
| **Transporter** | `transporter@demo.com` | `demo123` | Test transport requests and quotes |
| **Admin** | `admin@demo.com` | `demo123` | Test system overview and analytics |

---

## 🎯 **Complete Workflow Testing**

### **Phase 1: Buyer Experience** 🛒

1. **Login as Buyer** (`buyer@demo.com`)
   - Navigate to `/login`
   - Use credentials: `buyer@demo.com` / `demo123`

2. **Browse Listings**
   - Go to `/listings` to see available products
   - You'll see 2 listings from `seller@demo.com`:
     - Barley (64 tons available) - with images, videos, and enhanced specifications
     - Wheat (1000 tons available) - with images, videos, and enhanced specifications

3. **Create an Offer**
   - Click on any listing (e.g., Barley or Wheat)
   - View the detailed listing page with images, videos, and specifications
   - Click "Make Offer" button
   - Fill out the comprehensive offer form:
     - Price: R2,800/ton (below asking price)
     - Quantity: 50 tons
     - Delivery: Delivered to Address
     - Message: "Interested in your grain. Can you deliver to our feedlot?"
     - Terms: "Payment within 7 days of delivery"
   - Submit the offer
   - **Expected**: Seller receives email notification immediately

4. **View Your Offers & Messages**
   - Go to `/buyer/dashboard`
   - Click "Offers" tab
   - You'll see your new offer with "pending" status
   - **View Messages**: Check listing detail page for message threads
   - **Dashboard Messages**: View all messages pertaining to specific listings

---

### **Phase 2: Seller Experience** 🏪

1. **Login as Seller** (`seller@demo.com`)
   - Navigate to `/login`
   - Use credentials: `seller@demo.com` / `demo123`

2. **View Incoming Offers**
   - Go to `/seller/dashboard`
   - Click "Offers" tab
   - You'll see the offer from `buyer@demo.com`

3. **Respond to Offer**
   - **Option A: Accept the Offer**
     - Click "Accept Offer"
     - Confirm the action
     - This creates a confirmed deal automatically
   
   - **Option B: Make Counter Offer**
     - Click "Counter Offer"
     - Set new price: R3,000/ton
     - Add message: "Price increased due to delivery costs. Still competitive."
     - Send counter offer

   - **Option C: Reject the Offer**
     - Click "Reject"
     - Confirm the action

4. **View Created Deals & Documents**
   - In the dashboard, you'll see the deal if accepted
   - Check the "Deals" tab for transaction details
   - **Document Management**: View contracts, invoices, and transport agreements
   - **Email Notifications**: All parties receive documents via email
   - **Dashboard Attachments**: All documents attached to relevant dashboards

---

### **Phase 3: Transport Experience** 🚛

1. **Login as Transporter** (`transporter@demo.com`)
   - Navigate to `/login`
   - Use credentials: `transporter@demo.com` / `demo123`

2. **View Transport Requests**
   - Go to `/transport` or check dashboard
   - You'll see transport requests from buyers/sellers

3. **Submit Transport Quotes**
   - Click on a transport request
   - Provide your quote details:
     - Price: R3,200
     - Estimated days: 2
     - Message: "Available for immediate pickup. Covered transport with GPS tracking."
   - Submit quote

4. **Create Backload Listings**
   - Go to transport dashboard
   - Create empty truck space listings:
     - Route: Johannesburg → Cape Town
     - Available date: Tomorrow
     - Capacity: 20 tons
     - Price: R2.80/km
   - List backload opportunities for other users to book

---

### **Phase 4: Admin Experience** 👨‍💼

1. **Login as Admin** (`admin@demo.com`)
   - Navigate to `/login`
   - Use credentials: `admin@demo.com` / `demo123`

2. **View System Overview**
   - Check dashboard for system metrics
   - View total users, transactions, and revenue
   - Monitor platform activity

---

## 🔄 **Real-time Data Flow Testing**

### **Test Scenario 1: Offer Creation Flow**
1. **Buyer creates offer** → Seller sees it immediately
2. **Seller accepts offer** → Deal is created, buyer is notified
3. **Transport request created** → Transporter sees new opportunity

### **Test Scenario 2: Counter Offer Flow**
1. **Seller makes counter offer** → Buyer receives notification
2. **Buyer accepts counter** → Deal is created with new terms
3. **All parties updated** → Real-time status changes

### **Test Scenario 3: Transport Integration**
1. **Deal confirmed** → Transport request automatically created
2. **Transporter quotes** → Buyer/seller can compare options
3. **Transport selected** → Complete logistics chain

---

## 📊 **Expected Data Relationships**

### **Current Demo Data:**
- **2 Active Listings** (both from `seller@demo.com`)
  - Barley (64 tons) - with images, videos, enhanced specifications
  - Wheat (1000 tons) - with images, videos, enhanced specifications
- **3 Offers** (2 pending, 1 accepted, 1 counter-offered)
- **1 Confirmed Deal** (Wheat, 25 tons)
- **2 Transport Requests** (1 related to deal, 1 standalone)
- **2 Transport Quotes** (from `transporter@demo.com`)
- **1 Invoice & Contract** (for the confirmed deal)

### **Data Consistency:**
- All offers reference actual listings
- All deals reference actual offers
- All transport requests reference actual deals/listings
- All notifications reference actual activities
- Platform fees calculated correctly (R1/ton)

---

## 🧪 **Testing Checklist**

### **Buyer Account Testing:**
- [ ] Can browse listings
- [ ] Can create offers with all fields
- [ ] Can view offer status updates
- [ ] Can respond to counter offers
- [ ] Can track deal progress

### **Seller Account Testing:**
- [ ] Can view incoming offers
- [ ] Can accept/reject offers
- [ ] Can make counter offers
- [ ] Can see created deals
- [ ] Can manage listings

### **Transporter Account Testing:**
- [ ] Can view transport requests
- [ ] Can submit transport quotes
- [ ] Can track quote status
- [ ] Can see deal-related requests

### **Admin Account Testing:**
- [ ] Can view system overview
- [ ] Can see all user activities
- [ ] Can monitor platform metrics
- [ ] Can access system data

---

## 🚨 **Troubleshooting**

### **Common Issues:**
1. **Offer not appearing**: Check if you're logged in with correct account
2. **Data not updating**: Refresh the page or check browser console
3. **Navigation errors**: Ensure you're using the correct URLs
4. **Form validation**: Fill all required fields properly

### **Data Reset:**
- All demo data is stored in `lib/mockData.ts`
- Changes persist during the session
- Refresh page to see updated data
- Check browser console for any errors

---

## 🎉 **Success Indicators**

### **Complete Workflow Success:**
✅ Buyer creates offer → Seller receives notification  
✅ Seller responds (accept/reject/counter) → Buyer sees update  
✅ Deal created → Transport request generated  
✅ Transporter quotes → Buyer/seller can select  
✅ All data relationships maintained  
✅ Platform fees calculated correctly  
✅ Real-time updates working  

---

## 🌟 **Advanced Testing**

### **Edge Cases to Test:**
1. **Multiple offers** on same listing
2. **Counter offer chains** (multiple rounds)
3. **Transport quote comparisons**
4. **Notification systems** across all accounts
5. **Data consistency** during rapid changes

### **Performance Testing:**
1. **Large data sets** (create many offers)
2. **Concurrent users** (multiple browser tabs)
3. **Real-time updates** (check responsiveness)
4. **Error handling** (test invalid inputs)

---

**🎯 Happy Testing! The system is designed to provide a realistic, interconnected experience across all demo accounts.**
