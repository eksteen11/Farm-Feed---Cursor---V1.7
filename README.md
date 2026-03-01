# Farm Feed - South African Grain & Feed Trading Platform

A modern, responsive web application built with Next.js and Tailwind CSS for connecting South African farmers and buyers in the agricultural trading space.

## 🚀 Features

### Core Functionality
- **Unified User System**: Every user can sell, buy, AND transport from a single account
- **Enhanced Product Listings**: Browse with multiple images, videos, certificates, grades, and packaging options
- **Advanced Trading System**: Make offers, negotiate deals, and complete transactions
- **Comprehensive Dashboards**: Unified interfaces with document management
- **Transport Marketplace**: Integrated transport requests, quotes, and backload listings
- **Document Management**: Automatic contract/invoice generation and email notifications
- **Real-time Communication**: Listing-specific messages and email notifications
- **Enhanced Product Details**: Detailed specifications with packaging, grade, ME Energy, fibre, and payment terms

### User Capabilities
- **Public Users**: Browse listings without registration
- **Unified Users**: Can sell, buy, AND transport from single account
- **Enhanced Sellers**: Create listings with images, certificates, grades, packaging options
- **Advanced Buyers**: Make offers, negotiate, view messages, manage documents
- **Smart Transporters**: Submit quotes, create backload listings, optimize routes
- **Administrators**: Full platform management, document oversight, and analytics

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **State Management**: Zustand for efficient state handling
- **Component Library**: Reusable UI components following design system
- **Document Management**: PDF generation, email notifications, dashboard attachments
- **Enhanced Data Models**: Images, videos, certificates, grades, packaging, backload listings
- **Mock Data**: Fully functional with realistic sample data
- **SEO Optimized**: Public pages are search engine friendly
that make these two corners round againmake
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion
- **Development**: ESLint, PostCSS, Autoprefixer

## 📁 Project Structure

```
farm-feed/
├── src/
│   ├── app/              # Next.js app directory (pages & routes)
│   ├── features/         # Feature modules (exchange, feed-nutrition, transport)
│   ├── shared/           # Shared utilities and components
│   ├── store/            # Zustand state management
│   └── types/            # TypeScript type definitions
├── docs/
│   └── archive/          # Historical documentation
├── AGENT_COORDINATION.md # Agent coordination hub
├── IMPLEMENTATION_STATUS.md # Build status
├── BLUEPRINT.md          # System architecture
├── PROJECT_RULES.md      # Development standards
├── BRAND_GUIDE.md        # Design system
└── DOCUMENTATION.md      # Documentation index
```

## 📚 Documentation

**🎯 Source of Truth:**
- **[FARM_FEED_MASTER_CANONICAL_PLAN_V1_2.md](./docs/FARM_FEED_MASTER_CANONICAL_PLAN_V1_2.md)** - **THE CANONICAL PLAN** (Read this first!)
- **[README_CANONICAL.md](./docs/README_CANONICAL.md)** - Documentation guide

**Essential Docs:**
- [BLUEPRINT.md](./BLUEPRINT.md) - Architecture (archived, see canonical plan)
- [DESIGN_AND_UX_MASTER.md](./DESIGN_AND_UX_MASTER.md) - Design system (archived, see canonical plan)

**All planning, UX, design, and workflow documentation has been consolidated into the canonical plan above.**

## 🎨 Design System

The application follows a comprehensive design system with:

- **Color Palette**: Primary greens (#3D693D), secondary reds (#DB4A39), and neutral grays
- **Typography**: Inter for body text, Poppins for headings
- **Components**: Consistent button styles, card layouts, and form elements
- **Spacing**: 8px grid system with responsive breakpoints
- **Shadows**: Subtle elevation with hover effects
- **Animations**: Smooth transitions and micro-interactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd farm-feed
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## 🔐 Demo Accounts

For testing purposes, the following demo accounts are available:

### Buyer Account
- **Email**: sarah@feedmill.co.za
- **Password**: password

### Seller Account
- **Email**: john@maizefarm.co.za
- **Password**: password

### Admin Account
- **Email**: admin@farmfeed.co.za
- **Password**: password

## 📱 Pages & Routes

### Public Pages
- `/` - Home page with hero section and featured listings
- `/listings` - Browse all product listings with filters and enhanced product cards
- `/listings/[id]` - Detailed product listing with images, videos, specifications, and payment terms
- `/support` - Help center and contact information
- `/transport` - Transport marketplace with requests and backload listings
- `/maps` - Interactive maps for location-based services

### Authentication
- `/login` - User sign in
- `/register` - User registration

### Protected Pages
- `/dashboard` - Unified user dashboard with all capabilities
- `/seller/create-listing` - Create product listings with enhanced form fields
- `/seller/dashboard` - Seller-specific dashboard and analytics
- `/buyer/dashboard` - Buyer-specific dashboard and analytics
- `/transport/create-backload` - Create transport backload listings
- `/transport/my-requests` - Manage transport requests
- `/transport/available` - Browse available transport opportunities
- `/profile` - User profile management
- `/notifications` - User notifications
- `/subscription` - Subscription management
- `/fica` - FICA verification and document upload

## 🏗 Component Architecture

### UI Components
- **Button**: Primary, secondary, ghost, and danger variants
- **Input**: Form inputs with validation states and icons
- **Card**: Flexible card layouts with headers, content, and footers
- **Navigation**: Responsive navigation with mobile menu
- **Footer**: Comprehensive footer with links and company info

### Layout Components
- **Navigation**: Top navigation bar with user menu
- **Footer**: Site footer with links and contact info
- **Sidebar**: Dashboard sidebar navigation (coming soon)

## 🔄 State Management

The application uses Zustand for state management with the following stores:

- **User State**: Authentication, user profile, and preferences
- **Listings State**: Product listings, filters, and search
- **Offers State**: User offers and negotiations
- **Deals State**: Completed transactions and deal management
- **Notifications State**: User notifications and alerts

## 🎯 Future Enhancements

### Phase 2 Features
- **Real-time Chat**: In-app messaging for negotiations
- **Payment Integration**: Paystack integration for subscriptions
- **Rating System**: User reviews and ratings
- **Advanced Analytics**: Dashboard analytics and reporting
- **Mobile App**: React Native mobile application

### Phase 3 Features
- **AI Recommendations**: Smart product suggestions
- **Market Insights**: Price trends and market analysis
- **Export/Import**: Data export and bulk operations
- **API Integration**: Third-party service integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: info@farmfeed.co.za
- **Phone**: +27 11 123 4567
- **Documentation**: [Coming Soon]

## 🙏 Acknowledgments

- **Design Inspiration**: Modern agricultural and SaaS platforms
- **Icons**: Lucide React for beautiful, consistent icons
- **UI Framework**: Tailwind CSS for rapid development
- **Community**: Next.js and React communities for excellent tooling

---

**Built with ❤️ in South Africa for the agricultural community**






# Latest deployment: Wed Sep 24 17:58:07 SAST 2025
# Trigger Vercel deployment - Thu Sep 25 13:18:45 SAST 2025
