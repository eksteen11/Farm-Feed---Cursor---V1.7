# 🎯 Cursor AI Setup Guide for Farm Feed

## Quick Start

Your project now has comprehensive AI coding rules configured! Here's how to use them effectively with Cursor.

---

## 📁 Files Created

### 1. `.cursorrules` 
**Location**: Project root  
**Purpose**: Main rules file that Cursor AI automatically reads  
**Contains**: Coding standards, architecture rules, do's and don'ts

### 2. `PROJECT_RULES.md`
**Location**: Project root  
**Purpose**: Detailed documentation for developers  
**Contains**: Complete guidelines, examples, patterns

---

## ⚙️ Cursor Settings Configuration

### Step 1: Enable .cursorrules

The `.cursorrules` file is **automatically detected** by Cursor. No setup needed!

### Step 2: Verify Rules Are Active

1. Open Cursor
2. Press `Cmd/Ctrl + Shift + P` (Command Palette)
3. Type "Cursor Settings"
4. Under "Rules for AI", you should see `.cursorrules` is active

### Step 3: Configure Additional Settings

**Recommended Cursor Settings:**

```json
{
  "cursor.ai.model": "claude-3.5-sonnet",
  "cursor.ai.useRules": true,
  "cursor.ai.includeDocs": true,
  "cursor.ai.contextLength": "long",
  
  // TypeScript settings
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  
  // Editor settings
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  
  // Tailwind CSS
  "tailwindCSS.experimental.classRegex": [
    ["className\\s*[:=]\\s*['\"`]([^'\"`]*)['\"`]", "([^'\"`]*)"]
  ]
}
```

---

## 🤖 How to Use AI Effectively

### Basic Commands

#### 1. General Code Generation
Just describe what you need:
```
Create a new offer card component that shows listing details
```

Cursor will follow the rules automatically!

#### 2. Ask About Project Standards
```
What's the correct way to create an API route in this project?
```

```
How should I handle authentication in this codebase?
```

```
Show me the pattern for creating a new form
```

#### 3. Code Review
Select code and ask:
```
Does this code follow the project rules?
```

```
Refactor this to match our coding standards
```

### Advanced Usage

#### Reference Documentation
Cursor can access your project docs:
```
Using the BRAND_GUIDE.md, what colors should I use for buttons?
```

```
Based on BLUEPRINT.md, explain the unified user system
```

#### Multi-file Operations
```
Create a new feature module for reviews following the project structure
```

```
Add a new subscription tier following the existing pattern
```

---

## 📋 Key Rules Summary (Quick Reference)

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **State**: Zustand + React Query

### Path Aliases
```typescript
@/*           // src directory
@/shared/*    // shared utilities
@/entities/*  // business entities
@/features/*  // feature modules
```

### Colors (Two-Color System)
- **Forest Green** (`#3D693D`) - Primary brand
- **Harvest Red** (`#DB4A39`) - Secondary brand
- **Neutrals** - Gray scale

### Button Classes
```tsx
.btn-primary    // Main actions
.btn-secondary  // Alternative actions
.btn-ghost      // Subtle actions
```

### Typography
```tsx
.text-display   // Hero titles
.text-headline  // Page titles
.text-title     // Section headers
.text-body      // Body text
.text-caption   // Small text
```

### Spacing
```tsx
.space-section   // 3rem between sections
.space-content   // 2rem between content
.space-elements  // 1.5rem between elements
```

---

## 💡 Example Prompts

### Creating Components
```
Create a listing card component following the design system.
Include: image, title, price, location, and CTA button.
Use proper TypeScript types from @/types.
```

### API Routes
```
Create an API route for updating offer status.
Follow the pattern in app/api, include Zod validation,
error handling, and proper response format.
```

### Forms
```
Create a create-listing form with React Hook Form and Zod.
Include: title, description, price, quantity, location, category.
Follow the form pattern from PROJECT_RULES.md.
```

### Database Operations
```
Create a function to fetch user offers with Supabase.
Include RLS check, proper typing, and error handling.
```

---

## 🔍 Debugging with AI

### TypeScript Errors
```
I'm getting this TypeScript error: [paste error]
Fix it according to our strict mode rules.
```

### Design Issues
```
This component doesn't match the design system.
Refactor it to use our brand colors and spacing.
```

### Performance
```
This component is slow. Optimize it following
React Query patterns and best practices.
```

---

## 📚 When AI Needs Context

### Reference Key Files
Cursor can read these automatically:
- `.cursorrules` - Main coding rules
- `PROJECT_RULES.md` - Detailed guidelines
- `BLUEPRINT.md` - System architecture
- `BRAND_GUIDE.md` - Design standards
- `design-system.json` - Design tokens
- `src/types/index.ts` - Type definitions

### How to Reference
```
Based on the unified user system in BLUEPRINT.md,
create a capability check component.
```

```
Following the API pattern in PROJECT_RULES.md,
create an endpoint for transport quotes.
```

---

## ⚡ Productivity Tips

### 1. Use Multi-line Commands
```
Create a complete offer management feature:
1. Component to display offers
2. Modal to create new offer
3. API route to handle offer creation
4. Types and validation schemas
Follow all project rules and patterns.
```

### 2. Iterative Refinement
```
Initial: "Create a user profile component"
Refine: "Add edit mode with form validation"
Polish: "Add loading states and error handling"
```

### 3. Batch Operations
```
Update all button components to use the new
.btn-primary class from the design system.
```

### 4. Documentation Generation
```
Generate JSDoc comments for this component
following our documentation standards.
```

---

## 🚫 Common Mistakes to Avoid

### ❌ Vague Prompts
```
"Make a component"
```

### ✅ Specific Prompts
```
"Create a ListingCard component that displays
a product listing with image, title, price, 
location, and a CTA button. Use types from @/types
and follow the design system."
```

### ❌ Ignoring Rules
```
"Use any CSS you want"
```

### ✅ Following Rules
```
"Use Tailwind classes and our design system tokens"
```

---

## 🔄 Updating Rules

When you need to update project rules:

1. **Edit `.cursorrules`** for AI behavior
2. **Edit `PROJECT_RULES.md`** for documentation
3. **Reload Cursor** to apply changes
4. **Test with a prompt** to verify

---

## 📊 Rule Categories

### 🏗️ Architecture Rules
- Project structure (feature-sliced design)
- Import patterns
- Component organization
- File naming

### 🎨 Design Rules
- Color system (two-color approach)
- Typography (Inter + Poppins)
- Spacing scale
- Component styles

### 💾 Database Rules
- Supabase patterns
- RLS policies
- Type safety
- API routes

### 🔒 Security Rules
- Authentication
- FICA verification
- Input validation
- Error handling

### 💼 Business Rules
- Unified user system
- Subscription tiers
- Platform fees
- Workflows

---

## 🎯 Success Checklist

When using Cursor AI, verify:

- [ ] Code follows TypeScript strict mode
- [ ] Uses path aliases (@/shared, @/features)
- [ ] Follows design system (colors, typography, spacing)
- [ ] Includes proper error handling
- [ ] Has loading and error states
- [ ] Is mobile responsive
- [ ] Follows established patterns
- [ ] Includes proper types from @/types
- [ ] No console.log statements
- [ ] Proper comments for complex logic

---

## 🆘 Troubleshooting

### AI Not Following Rules
1. Check `.cursorrules` exists in root
2. Reload Cursor window
3. Verify "Use Rules" is enabled in settings
4. Be more specific in prompts

### Inconsistent Responses
1. Reference specific files: "Based on PROJECT_RULES.md..."
2. Provide more context
3. Show existing code examples
4. Break complex requests into smaller parts

### Wrong Patterns Used
1. Explicitly mention the pattern: "Follow the API route pattern"
2. Reference exact file: "Like in app/api/offers/create/route.ts"
3. Correct and teach: "Actually, we use Zustand for state, not Context API"

---

## 📱 Quick Commands Cheat Sheet

```bash
# Check types
npm run typecheck

# Lint code
npm run lint

# Build project
npm run build

# Start dev server
npm run dev

# Start production
npm run start
```

---

## 🎓 Learning Resources

### Internal Docs
- `BLUEPRINT.md` - System architecture
- `BRAND_GUIDE.md` - Branding rules
- `COMPREHENSIVE_WORKFLOW_MATRIX.md` - User workflows
- `SUPABASE_SETUP_GUIDE.md` - Database setup

### External Docs
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase](https://supabase.com/docs)

---

## 🚀 You're All Set!

Your Cursor AI is now configured with:

✅ Comprehensive coding rules  
✅ Design system guidelines  
✅ Architecture patterns  
✅ Security best practices  
✅ Business logic rules  

**Start coding with confidence!** Cursor AI will help you build consistent, high-quality code that follows all project standards.

---

## 💬 Example Conversation

**You**: 
```
Create a new transport quote component
```

**Cursor AI** (using .cursorrules):
```typescript
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/ui/Button'
import type { TransportRequest } from '@/types'

const QuoteSchema = z.object({
  price: z.number().positive(),
  estimatedDays: z.number().int().positive(),
  vehicleType: z.string().min(3),
  message: z.string().optional(),
})

type QuoteFormData = z.infer<typeof QuoteSchema>

interface TransportQuoteFormProps {
  request: TransportRequest
  onSubmit: (data: QuoteFormData) => Promise<void>
}

export function TransportQuoteForm({ 
  request, 
  onSubmit 
}: TransportQuoteFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<QuoteFormData>({
    resolver: zodResolver(QuoteSchema),
    defaultValues: {
      price: 0,
      estimatedDays: 1,
      vehicleType: '',
      message: '',
    }
  })
  
  const handleSubmit = async (data: QuoteFormData) => {
    try {
      setIsLoading(true)
      await onSubmit(data)
      toast.success('Quote submitted successfully!')
      form.reset()
    } catch (error) {
      toast.error('Failed to submit quote')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form 
      onSubmit={form.handleSubmit(handleSubmit)} 
      className="space-content"
    >
      <div className="space-elements">
        <div>
          <label className="text-caption font-medium">
            Quote Price (R)
          </label>
          <input
            type="number"
            {...form.register('price', { valueAsNumber: true })}
            className="input-field"
            placeholder="3500"
          />
        </div>
        
        {/* More fields... */}
      </div>
      
      <Button
        type="submit"
        className="btn-primary"
        disabled={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Submit Quote'}
      </Button>
    </form>
  )
}
```

**See?** Perfect code following all the rules! 🎉

---

*Happy coding with Cursor AI! 🚀*


