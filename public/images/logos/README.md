# Farm Feed Logo Assets

## Logo Files Required

Please add the following logo files to this directory:

### 1. Color Logo (for light backgrounds)
- **File**: `farm-feed-logo-color.png`
- **Usage**: White/light backgrounds
- **Colors**: Forest Green (#3D693D) and Harvest Red (#DB4A39)
- **Format**: PNG with transparent background
- **Recommended size**: 200x80px (or higher resolution)

### 2. White Logo (for dark backgrounds)
- **File**: `farm-feed-logo-white.png`
- **Usage**: Dark backgrounds
- **Colors**: White with subtle outline
- **Format**: PNG with transparent background
- **Recommended size**: 200x80px (or higher resolution)

## Logo Design Specifications

The logo should feature:
- **Graphic Element**: Stylized plant/sprout with Forest Green leaves and Harvest Red bud
- **Text**: "FARM FEED" in bold sans-serif typeface
- **Colors**: 
  - Primary: Forest Green (#3D693D)
  - Secondary: Harvest Red (#DB4A39)
  - Accent: White outline for contrast
- **Background**: Transparent

## Implementation Notes

The Logo component automatically selects the appropriate variant based on the `variant` prop:
- `variant="color"` → Uses color logo for light backgrounds
- `variant="white"` → Uses white logo for dark backgrounds

Size options available: `sm`, `md`, `lg`, `xl`
