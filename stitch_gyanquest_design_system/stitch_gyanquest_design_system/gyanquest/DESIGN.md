---
name: GyanQuest
colors:
  surface: '#101413'
  surface-dim: '#101413'
  surface-bright: '#363a39'
  surface-container-lowest: '#0b0f0e'
  surface-container-low: '#181c1b'
  surface-container: '#1c201f'
  surface-container-high: '#272b2a'
  surface-container-highest: '#313635'
  on-surface: '#e0e3e1'
  on-surface-variant: '#bdcac0'
  inverse-surface: '#e0e3e1'
  inverse-on-surface: '#2d3130'
  outline: '#87948b'
  outline-variant: '#3e4942'
  surface-tint: '#71daa7'
  primary: '#71daa7'
  on-primary: '#003823'
  primary-container: '#35a373'
  on-primary-container: '#00311e'
  inverse-primary: '#006c47'
  secondary: '#f8bd45'
  on-secondary: '#412d00'
  secondary-container: '#bc8709'
  on-secondary-container: '#392600'
  tertiary: '#b5c9d8'
  on-tertiary: '#20333e'
  tertiary-container: '#8093a1'
  on-tertiary-container: '#192c37'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#8ef7c1'
  primary-fixed-dim: '#71daa7'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005235'
  secondary-fixed: '#ffdea7'
  secondary-fixed-dim: '#f8bd45'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5e4200'
  tertiary-fixed: '#d1e5f5'
  tertiary-fixed-dim: '#b5c9d8'
  on-tertiary-fixed: '#091e29'
  on-tertiary-fixed-variant: '#364955'
  background: '#101413'
  on-background: '#e0e3e1'
  surface-variant: '#313635'
typography:
  display-hero:
    fontFamily: Syne
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Syne
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Syne
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  ui-action-lg:
    fontFamily: Sora
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.5'
    letterSpacing: 0.02em
  body-main:
    fontFamily: Sora
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  bengali-support:
    fontFamily: Noto Sans Bengali
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.8'
  label-caps:
    fontFamily: Sora
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1280px
---

## Brand & Style
The design system embodies "Monsoon Lab" - a fusion of high-tech laboratory precision and the humid, vibrant energy of a Bangladeshi dusk. It rejects the sterilized "International Style" of typical SaaS platforms in favor of a "Rickshaw Neon Science" aesthetic: high-contrast, tactile, and deeply rooted in local atmosphere.

The platform targets curious students through a "Mission Game" lens, using "Coach Energy" to motivate. The visual language balances the grit of wet-asphalt reflections with the glowing clarity of neon instrumentation. It is immersive and nationalistic without being cliché, utilizing localized textures and a "Humid Dusk" atmosphere to create a premium, high-stakes learning environment.

## Colors
The palette is rooted in the "Deep Teal Night" of a monsoon sky, providing a high-contrast foundation for glowing action elements.

- **Primary (Mango-Leaf Green):** Used for growth, success, and laboratory "active" states. It should feel organic yet luminous.
- **Secondary (Marigold Action):** Reserved for mission-critical interactions, "Quest" buttons, and essential alerts. It mimics the warmth of rickshaw art highlights.
- **Tertiary (Deep Teal Night):** The core background color. All "wet-asphalt" surfaces are derived from this hue.
- **Neutral (Chalk-White):** A high-legibility off-white used for all primary reading zones to ensure maximum accessibility for younger users.

Color is applied through high-contrast blocking rather than soft gradients. "Neon" effects are achieved through tight, high-intensity outer glows (5-10px) on green and gold elements against the teal backdrop.

## Typography
The typographic hierarchy creates an "Expressive Science" feel. 

- **Display & Headings:** Syne provides a brutalist, wide-stanced energy for mission titles and achievement badges. It should be used at heavy weights (700-800).
- **UI & Interaction:** Sora is the workhorse for buttons, navigation, and data points, chosen for its geometric clarity and "tech-forward" spirit.
- **Instructional Body:** Noto Sans Bengali is paired alongside Sora to ensure seamless bilingual support. Line heights for Bengali text are increased to 1.8 to prevent glyph clipping.
- **Reading Zones:** Maintain a minimum of 16px for all mission briefs to ensure kid-friendly readability under varying light conditions.

## Layout & Spacing
The layout follows a **Fixed Grid** model for mission dashboards and a **Fluid Content** model for learning modules. 

- **Grid:** A 12-column desktop grid with wide 24px gutters to allow elements "room to breathe" amidst the high-contrast aesthetic.
- **Rhythm:** An 8px base unit drives all spacing. Components should use 16px, 32px, and 48px increments to maintain a structural, "lab-built" feel.
- **Responsive Behavior:** On mobile, margins shrink to 16px. Cards reflow from horizontal to vertical stacks. "Kid-readable zones" (main content areas) expand to 100% width with generous internal padding (24px) to prevent accidental taps.

## Elevation & Depth
This design system avoids traditional drop shadows in favor of **Tonal Layers** and **Wet-Asphalt Reflections**.

1.  **Base Layer:** Deep Teal Night (#0B1F2A) background.
2.  **Surface Layer:** A slightly lighter teal-grey with a 1px solid border (Mango-Leaf Green at 20% opacity) to define "containers."
3.  **The "Glow" Elevation:** Active quest items or primary buttons do not cast shadows; they emit a "Neon" glow using a concentrated outer shadow of their own color (e.g., #2F9E6F at 40% blur).
4.  **Reflections:** Use linear gradients (top-to-bottom) on larger containers that transition from a slightly lighter teal to the base color, mimicking the sheen of rain-slicked pavement.

## Shapes
The shape language is **Soft (0.25rem)**. This provides a balance between "Scientific Precision" (sharpness) and "Kid-Friendly Safety" (roundedness).

- **Standard Buttons/Inputs:** 4px (0.25rem) radius.
- **Quest Cards:** 8px (0.5rem) radius to feel like physical handheld tablets.
- **Status Pills:** Fully rounded (pill-shaped) to distinguish them from interactive buttons.
- **Interactive Elements:** Use heavy 2px borders to emphasize tactile "push-ability."

## Components
- **Mission Buttons:** High-contrast blocks using Marigold (#F4B942). They feature a 2px bottom "offset border" to create a tactile, mechanical feel. When pressed, the button shifts 2px down.
- **Input Fields:** Deep Teal background with a Chalk-White 1px border. On focus, the border glows Mango-Leaf Green.
- **Quest Cards:** These use the "Wet-Asphalt" reflection gradient. They must include a "Progress Micro-Bar" at the bottom using the Primary Green.
- **Chips/Badges:** Small, technical-looking labels with monospaced-style Sora typography. Used for categorizing subjects (Math, Science, History).
- **Navigation Rail:** A slim, vertical sidebar on desktop that uses iconography only, glowing faintly when a section is active.
- **The "Coach" Bubble:** A distinctive UI component for mission guidance, using a Mango-Leaf Green border and Chalk-White text, appearing at the bottom-right of the screen.