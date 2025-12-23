# GettUpp Design System
## Extracted from Production Audit - Working Patterns

---

## 🎨 COLOR PALETTE

### Primary Colors
```css
--brand-ink: #0B0B0D;    /* Dark backgrounds */
--brand-gold: #D9AE43;   /* Primary accent */
--brand-pink: #FF3C93;   /* Secondary accent */
```

### Gold Gradient (Premium Elements)
```css
background: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);
```

### Text Colors
```css
--text-white: #FFFFFF;
--text-gray-300: #D1D5DB;  /* Body text */
--text-gray-400: #9CA3AF;  /* Secondary */
--text-gray-500: #6B7280;  /* Muted */
```

---

## 📝 TYPOGRAPHY

### Headings (Oswald)
- **H1 (Hero)**: 80-120px, weight 900, uppercase, line-height 0.9
- **H2 (Sections)**: 48-64px, weight 800, uppercase
- **H3 (Cards)**: 24-32px, weight 700

### Body (Inter)
- **Body**: 18-20px, weight 400, line-height 1.6
- **Small**: 14px, weight 400
- **Label**: 12px, weight 500, uppercase, tracking wide

### Gold Gradient Text
```css
.text-gold-gradient {
  background: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 🎴 CARD STYLES

### GlassCard (Glassmorphism)
```css
backdrop-blur: 10px;
background: rgba(11, 11, 13, 0.5);
border: 1px solid rgba(217, 174, 67, 0.2);
border-radius: 16px;
padding: 24px;
```

### Premium Pricing Card
```css
background: linear-gradient(135deg, #1a1a1c, #0B0B0D);
border: 2px solid #D4AF37;
border-radius: 16px;
box-shadow: 0 20px 50px rgba(212, 175, 55, 0.2);
```

### Hover Glow Effect
```css
.card-glow:hover::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728);
  filter: blur(20px);
  opacity: 0.2;
}
```

---

## 🔘 BUTTON STYLES

### Primary (Gold Gradient)
```css
background: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728);
color: #0B0B0D;
font-weight: 800;
text-transform: uppercase;
padding: 18px 40px;
border-radius: 12px;
box-shadow: 0 10px 30px rgba(212, 175, 55, 0.4);
transition: all 0.3s ease;

&:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(212, 175, 55, 0.5);
}
```

### Secondary (Outline)
```css
background: transparent;
border: 2px solid #D4AF37;
color: #D4AF37;
padding: 18px 40px;
border-radius: 12px;

&:hover {
  background: linear-gradient(135deg, #BF953F, #FCF6BA, #B38728);
  color: #0B0B0D;
}
```

### MagneticButton (Framer Motion)
```tsx
whileHover={{ scale: 1.08 }}
whileTap={{ scale: 1.0 }}
transition={{ type: 'spring', stiffness: 400, damping: 17 }}
```

---

## 📐 SECTION LAYOUTS

### Hero Section
- Full viewport height on mobile, auto on desktop
- Center-aligned text
- Background: brand-ink with subtle gradient overlay
- Stats/proof chips below CTA
- Trust badges at bottom

### ROI Math Section
- 3-column grid (Cost VS Value)
- Large numbers with gold gradient
- "BREAKEVEN: 3" banner with gradient border
- Subtle background accent

### Pricing Section
- 4-column grid on desktop, stack on mobile
- Popular tier highlighted with gold ring
- "MOST POPULAR" badge floats above card
- VIP shows "BREAKEVEN: 3 CUSTOMERS" badge

---

## ✅ WORKING PROMPTS

### Landing Page Hero
```
Create landing page with:

Hero Section:
- Headline: "We don't just post. We pack venues."
- Subheadline: "24-72h delivery. Real ROI. Zero excuses."
- CTA: MagneticButton → "Start Your Pilot ($345)"
- Proof chips: "79.7K views (90 days)" • "24-72h delivery" • "Minneapolis specialist"
- Trust strip: "Stripe Verified" • "Non-exclusive license" • "MN tax aligned"

Background: brand.ink
All text: white or brand.gold
```

### ROI Math Section
```
Create "The Math Is Simple" ROI section:

Layout: 3-column (VIP Cost | VS | Avg Regular Value)
Numbers: $995 vs $350
Result: "BREAKEVEN: 3 NEW CUSTOMERS"

Styling:
- Gold gradient borders on stat boxes
- Large numbers (7xl on desktop)
- VS badge with gold gradient fill
- Bottom banner with gradient border showing "3"

Animation: Fade in on scroll, stagger columns
```

### Premium Pricing Card
```
Create credit-card style pricing cards:

- Gold gradient border (2px)
- Metallic sheen overlay (5% gold gradient)
- Glow effect on hover (blur 20px)
- VIP badge: "BREAKEVEN: 3 CUSTOMERS"
- BEST VALUE badge on T2

Price display: 5xl gold gradient text
Features: Checkmark list with gold icons
CTA: Full-width button at bottom
```

### Pilot Intake Form
```
Create simplified pilot booking form:

Scarcity banner: "Only X/3 Pilot slots left this month" (amber)

Form fields:
1. Venue Name (required)
2. Contact Name (required)
3. Email (required, validated)
4. Phone (required)
5. Preferred Night (select: Fri/Sat/Flexible)
6. Notes (optional textarea)

Sidebar: Package summary card showing Pilot features
Submit: "Claim Your Pilot - $345"
Validation: Zod schema with field-level errors
```

---

## 🔧 COMPONENT CHECKLIST

- [x] MagneticButton
- [x] GlassCard
- [x] Typography (H1, H2, H3, Body, Small)
- [x] RoiMath section
- [ ] JohnnyCage section
- [x] PricingCard (premium style)
- [ ] ShotClock section
- [ ] TestimonialCarousel
- [ ] ProofBadges
- [ ] Footer (4-column)

---

## 📱 RESPONSIVE BREAKPOINTS

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Mobile Adjustments
- Hero text: 3xl → 5xl on desktop
- Pricing grid: 1 col → 4 col
- ROI Math: Stack vertically on mobile
- Cards: Full width on mobile
