# Morphing Role Selection Animation Guide

## What Should Happen

When you click the **"Start Trading"** button in the hero section:

1. **Morph Animation (1.2 seconds)**
   - Hero content (headline, subheadline, icon) scales down and fades out
   - Background image blurs and darkens
   - Particles accelerate toward the center
   - Hero elements rotate slightly (3D effect)

2. **Role Selection Cards Appear (0.8 seconds)**
   - Three floating 3D cards emerge from the center
   - Cards are positioned in a triangle formation (desktop) or vertical stack (mobile)
   - Each card represents: Buyer, Seller, or Transporter
   - Cards have gradient backgrounds, icons, and hover effects

3. **Card Selection**
   - Hover over a card to see 3D rotation and glow effects
   - Click a card to select it
   - Selected card scales up and centers
   - Other cards fade out

4. **Page Transformation**
   - Page content smoothly transitions to role-specific content
   - Sections fade and slide based on selected role
   - All content updates to match the selected role

## How to Test

1. **Open the homepage** (`/`)
2. **Make sure you're NOT logged in** (logged-in users see "Go to Dashboard" instead)
3. **Click the "Start Trading" button** in the hero section
4. **Watch for:**
   - Hero content fading/scaling down
   - Background blurring
   - Three role cards appearing
   - Cards can be hovered and clicked

## Debug Mode

In development mode, you'll see a debug indicator in the top-left corner showing:
- Morphing status
- Show Cards status  
- Paused status

## Troubleshooting

### If you don't see anything:

1. **Check the browser console** for error messages
2. **Check if you're logged in** - logged-in users won't see the morph
3. **Look for the debug indicator** in the top-left (development only)
4. **Try refreshing the page** and clicking again
5. **Check browser console** for the debug logs:
   - `🚀 Start Trading clicked`
   - `✨ Morphing started`
   - `🎯 Showing role selection cards`
   - `🎴 RoleSelectionCards is now visible`

### Common Issues:

- **Cards not appearing**: Check z-index (should be z-[100])
- **Animation not working**: Check if framer-motion is installed
- **Button not responding**: Check browser console for errors
- **Cards too small/large**: Check responsive breakpoints

## Technical Details

- **Morph Duration**: 1.2 seconds
- **Card Animation**: 0.8 seconds with stagger
- **Z-Index**: Role cards use z-[100], hero uses z-10
- **Responsive**: Cards adapt to mobile/tablet/desktop
- **Performance**: Particle count reduced on mobile

## Files Modified

- `src/shared/ui/TornadoHero.tsx` - Hero component with morph logic
- `src/shared/ui/RoleSelectionCards.tsx` - Role selection cards component
- `src/app/page.tsx` - Homepage with role state management






