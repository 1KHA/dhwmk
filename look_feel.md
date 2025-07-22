# Admin Dashboard Design System

This document outlines the design system used for the Admin Hackathon Dashboard, focusing on the modernized Mentors page. It serves as a reference for maintaining design consistency across the application.

## Color Palette

### Primary Colors
- **Blue**: 
  - Primary: `#3b82f6` (blue-500)
  - Light: `#eff6ff` (blue-50)
  - Medium: `#bfdbfe` (blue-200)
  - Dark: `#1e40af` (blue-800)
  - Used for: Primary buttons, headers, important actions, and highlights

### Secondary Colors
- **Green**:
  - Primary: `#22c55e` (green-500)
  - Light: `#f0fdf4` (green-50)
  - Medium: `#bbf7d0` (green-200)
  - Dark: `#166534` (green-800)
  - Used for: Success states, active status, positive metrics

- **Yellow**:
  - Primary: `#eab308` (yellow-500)
  - Light: `#fefce8` (yellow-50)
  - Medium: `#fef08a` (yellow-200)
  - Dark: `#854d0e` (yellow-800)
  - Used for: Warnings, pending status, ratings

- **Purple**:
  - Primary: `#a855f7` (purple-500)
  - Light: `#faf5ff` (purple-50)
  - Medium: `#e9d5ff` (purple-200)
  - Dark: `#6b21a8` (purple-800)
  - Used for: Alternative highlights, availability status

- **Red**:
  - Primary: `#ef4444` (red-500)
  - Light: `#fee2e2` (red-100)
  - Dark: `#991b1b` (red-800)
  - Used for: Error states, destructive actions, unavailable status

### Neutral Colors
- **Gray**:
  - Light: `#f9fafb` (gray-50)
  - Medium Light: `#f3f4f6` (gray-100)
  - Medium: `#9ca3af` (gray-400)
  - Dark: `#374151` (gray-700)
  - Used for: Text, borders, backgrounds, disabled states

## Typography

### Font Family
- Primary font: System font stack (Tailwind's default sans-serif)
- Arabic text is properly supported with RTL direction

### Font Sizes
- Page Title: `text-3xl` (1.875rem)
- Card Titles: `text-sm` (0.875rem)
- Card Values: `text-3xl` (1.875rem)
- Table Headers: Default size with medium font weight
- Table Content: Default size
- Secondary Information: `text-xs` (0.75rem)

### Font Weights
- Bold: `font-bold` for important numbers and headings
- Medium: `font-medium` for card titles and emphasized text
- Regular: Default weight for most text content

## Component Styling

### Cards
- **Stat Cards**:
  - No borders: `border-0`
  - Subtle shadow: `shadow-sm`
  - Hover effect: `hover:shadow-md transition-shadow duration-200`
  - Gradient backgrounds: `bg-gradient-to-br from-white to-[color]-50`
  - Compact padding: Header `pb-2`, standard padding for content
  - Icons in card titles: `h-5 w-5` with corresponding color

### Buttons
- **Primary Action Button**:
  - Blue background: `bg-blue-600`
  - Hover state: `hover:bg-blue-700`
  - Rounded corners: `rounded-full`
  - Icon + text layout with gap: `flex items-center gap-1`

- **Secondary/Outline Button**:
  - Transparent background with colored border: `border-blue-200`
  - Colored text: `text-blue-600`
  - Hover state: `hover:bg-blue-50`
  - Rounded corners: `rounded-full`
  - Icon + text layout with gap: `flex items-center gap-1`

- **Icon Buttons**:
  - Ghost variant for subtle actions: `variant="ghost"`
  - Compact size: `h-8 w-8 p-0`

### Tables
- **Table Header**:
  - Light blue background: `bg-blue-50`
  - Consistent hover state: `hover:bg-blue-50`

- **Table Rows**:
  - Hover effect: `hover:bg-gray-50 transition-colors duration-150`
  - Clean borders between rows

- **Table Cells**:
  - Primary content with secondary information below
  - Icons paired with text: `flex items-center gap-2`
  - Right-aligned action buttons: `justify-end`

### Inputs and Filters
- **Search Input**:
  - Rounded full: `rounded-full`
  - Icon positioning: Absolute positioning with transform
  - Border color: `border-blue-100`
  - Focus state: `focus:border-blue-300`
  - Right padding for icon: `pr-10`

- **Select Dropdowns**:
  - Rounded full: `rounded-full`
  - Consistent border colors with inputs
  - Appropriate width based on content

### Badges
- **Status Badges**:
  - Color-coded by status:
    - Active: Green (`bg-green-100 text-green-800`)
    - Pending: Yellow (`bg-yellow-100 text-yellow-800`)
    - Inactive: Gray (`bg-gray-100 text-gray-800`)
  - Compact and rounded by default

### Dialogs
- **Modal Dialogs**:
  - No borders: `border-0`
  - Enhanced shadow: `shadow-lg`
  - Rounded corners: `rounded-lg`
  - Clean, white background
  - Structured header, content, and footer sections
  - Appropriate max-width based on content type

## Visual Effects

### Shadows
- **Card Shadows**:
  - Default: `shadow-sm`
  - Hover: `hover:shadow-md`
  - Transition: `transition-shadow duration-200`

- **Dialog Shadows**:
  - Enhanced: `shadow-lg`

### Gradients
- **Card Backgrounds**:
  - Direction: `bg-gradient-to-br`
  - Colors: `from-white to-[color]-50`
  - Subtle effect that enhances visual hierarchy

### Hover Effects
- **Cards**: Shadow enhancement on hover
- **Buttons**: Background color change on hover
- **Table Rows**: Background color change on hover

### Transitions
- Shadow transitions: `transition-shadow duration-200`
- Color transitions: `transition-colors duration-150`

## Layout and Spacing

### Grid System
- **Stat Cards**: `grid grid-cols-1 md:grid-cols-4 gap-4`
- **Form Layouts**: `grid grid-cols-4 items-center gap-4`

### Margins and Padding
- Page container: `p-8`
- Section spacing: `mb-8`
- Card content: Standard padding with `pt-6` for top-heavy content
- Form fields: `gap-4` between items

### Alignment
- **RTL Support**: `dir="rtl"` for Arabic text direction
- Vertical alignment: `items-center`
- Horizontal spacing: `gap-2` or `gap-4` depending on context
- Action buttons: Right-aligned with `justify-end`

## Responsive Design

### Breakpoints
- Mobile-first approach with responsive adjustments at:
  - `md`: Medium screens (768px and above)

### Responsive Patterns
- **Filter Layout**:
  - Mobile: `flex-col`
  - Desktop: `md:flex-row`

- **Card Grid**:
  - Mobile: Single column
  - Desktop: Four columns

## RTL Support Considerations

- Page container has `dir="rtl"` attribute
- Text alignment follows RTL conventions
- Icon placement adjusted for RTL (icons appear on the right side of text)
- Form labels positioned on the right side
- Calendar component configured with `rtl={true}`
- Arabic localization for dates and calendar navigation

## Accessibility

### Color Contrast
- Text colors maintain appropriate contrast with backgrounds
- Status indicators use both color and text for clarity

### Interactive Elements
- Buttons and interactive elements have appropriate hover/focus states
- Icons include `sr-only` text for screen readers where needed

## Calendar Component Styling

- Full-height container: `height: '70vh'`
- White background with padding: `backgroundColor: 'white', padding: '20px'`
- Rounded corners: `borderRadius: '8px'`
- Arabic localization for all calendar text
- RTL support enabled

---

This design system should be applied consistently across all admin dashboard pages to maintain a cohesive user experience.
