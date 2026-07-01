# Security Studio Frontend Design Guidelines

## Goal
The application should feel like a premium developer tool used by professional security engineers. It is heavily inspired by tools like Vercel, GitHub, Linear, Arc Browser, Warp, VS Code, and Docker Desktop.

## Design Philosophy
- **Minimal:** No unnecessary elements.
- **Elegant:** Premium feel, sharp corners (except for standard subtle rounding).
- **Fast:** Instant feedback.
- **Professional:** Dense but readable with excellent spacing.
- **No visual clutter:** Every pixel must have a purpose.

## Overall Feeling
"GitHub built a cybersecurity toolkit."

## Color Palette
- Background: `#09090B`
- Secondary Background: `#111318`
- Surface: `#161B22`
- Border: `#27272A`
- Muted: `#71717A`
- Primary: `#2F81F7`
- Success: `#22C55E`
- Warning: `#EAB308`
- Danger: `#EF4444`
- Text Primary: `#FAFAFA`
- Text Secondary: `#A1A1AA`

*Rule: Never use colorful gradients as backgrounds.*

## Typography
- Primary: `Geist`
- Fallback: `Inter`
- Code: `IBM Plex Mono`

*Rule: Hierarchy should rely strictly on weight, spacing, and size. NOT color.*

## Layout Guidelines
Use a professional desktop application layout:
- **Spacing:** Everything must align to an 8px spacing system.
- **Sidebar:** Compact, collapsible, icon-focused, active indicator, subtle hover, no shadows, clean hierarchy.
- **Cards:** Flat, subtle borders, very light shadows, rounded 12px max. No glassmorphism, no glowing effects, generous spacing.
- **Buttons:** Solid (Primary), Outline (Secondary), Red (Danger), Transparent (Ghost). Hover animations max 150ms. No oversized padding.
- **Inputs:** Rounded, subtle border, primary color focus ring, no heavy glow.

## Tools Standard Structure
Every tool must follow exactly this structure:
1. Title & Description
2. Input
3. Options
4. Output
5. Actions (Copy, Download, Save, Favorite)

## Do NOT Use
- Bootstrap styling
- Material UI styling
- Glassmorphism / Neumorphism
- Colorful gradients
- Oversized icons
- Cartoon illustrations
- Thick shadows
- Flashy animations (keep motions subtle: 150ms fades, 200ms slides)
