# Farm Feed - South African Grain & Feed Trading Platform

A modern, responsive web application built with Next.js and Tailwind CSS for connecting South African farmers and buyers in the agricultural trading space.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login/registration system with role-based access
- **Product Listings**: Browse and search agricultural products with advanced filtering
- **Trading System**: Make offers, negotiate deals, and complete transactions
- **User Dashboards**: Separate interfaces for buyers, sellers, and transporters
- **Transport Marketplace**: Integrated transport request and quote system
- **Real-time Notifications**: Stay updated on offers, deals, and platform activities

### User Roles
- **Public Users**: Browse listings without registration
- **Buyers**: Subscribe to make offers, negotiate, and complete purchases
- **Sellers**: Create listings, manage offers, and handle sales
- **Transporters**: Provide transport quotes and manage deliveries
- **Administrators**: Full platform management and analytics access

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **State Management**: Zustand for efficient state handling
- **Component Library**: Reusable UI components following design system
- **Mock Data**: Fully functional with realistic sample data
- **SEO Optimized**: Public pages are search engine friendly

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand
- **UI Components**: Custom component library with Lucide React icons
- **Forms**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion
- **Development**: ESLint, PostCSS, Autoprefixer

## 📁 Project Structure

```
farm-feed/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and Tailwind imports
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Home page
│   ├── listings/          # Listings page
│   ├── login/             # Authentication pages
│   └── register/          # User registration
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components (Button, Input, Card)
│   └── layout/           # Layout components (Navigation, Footer)
├── lib/                  # Utility functions and mock data
├── store/                # Zustand state management
├── types/                # TypeScript type definitions
├── design-system.json    # Design system specifications
└── package.json          # Dependencies and scripts
```

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
- `/listings` - Browse all product listings with filters
- `/support` - Help center and contact information
- `/transport` - Transport marketplace (coming soon)

### Authentication
- `/login` - User sign in
- `/register` - User registration

### Protected Pages
- `/dashboard` - User dashboard (role-based)
- `/profile` - User profile management
- `/notifications` - User notifications
- `/subscription` - Subscription management

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



