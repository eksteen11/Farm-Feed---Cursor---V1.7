# Quick Start Guide for Agents

## 🚀 Getting Started

1. **Read the Plan**: `Farm Feed - Real Development Plan`
2. **Check Coordination**: `AGENT_COORDINATION.md`
3. **See Status**: `IMPLEMENTATION_STATUS.md`
4. **Start Working**: Follow your workstream assignment

## 📁 Key Files

- **Types**: `src/types/index.ts` - All TypeScript types
- **Plan**: `.cursor/plans/farm_feed_-_real_development_plan_*.plan.md`
- **Coordination**: `AGENT_COORDINATION.md`
- **Status**: `IMPLEMENTATION_STATUS.md`

## 🎯 Your Workstream

Check `AGENT_COORDINATION.md` for your assignment. Each workstream has:
- Location (where to put files)
- Tasks (what to build)
- Interfaces (what to use/export)
- Dependencies (what you need)

## ✅ Before You Code

1. Check if types exist in `src/types/index.ts`
2. Check if UI components exist in `src/shared/ui/`
3. Check existing patterns in `src/features/`
4. Follow design system (Forest Green #3D693D, Harvest Red #DB4A39)

## 🔧 Common Tasks

### Adding a New Type
```typescript
// Add to src/types/index.ts
export interface MyNewType {
  id: string
  // ... fields
}
```

### Creating a Component
```typescript
// src/features/[feature]/components/MyComponent.tsx
'use client'

import type { MyType } from '@/types'
import { Card } from '@/shared/ui/Card'
import Button from '@/shared/ui/Button'

export default function MyComponent() {
  // Component code
}
```

### Creating an API Route
```typescript
// src/app/api/[feature]/[action]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const Schema = z.object({
  // validation
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = Schema.parse(body)
    // Process
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
```

## 🚫 Don't

- ❌ Create duplicate types
- ❌ Modify shared files without checking
- ❌ Use inline styles
- ❌ Skip error handling
- ❌ Break existing functionality

## ✅ Do

- ✅ Use existing types from `@/types`
- ✅ Use shared UI components
- ✅ Follow Tailwind CSS patterns
- ✅ Add proper error handling
- ✅ Update status files when done

## 📞 Need Help?

1. Check `AGENT_COORDINATION.md` for your workstream
2. Check `IMPLEMENTATION_STATUS.md` for what's done
3. Review existing code in `src/features/` for patterns
4. Check the plan file for requirements

## 🎼 Remember

You're part of an orchestra. Follow the conductor (the plan), play your part (your workstream), and stay in sync (coordination files).

Let's build something amazing! 🚀

