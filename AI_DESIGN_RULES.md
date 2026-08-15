# HostelHub — AI Frontend Design Rules

Project: Hostel Life Utility Manager
App Name: HostelHub
Document: Master AI Frontend Design Specification
Purpose: Single source of truth for all AI coding agents working on the frontend.

## 1. Critical instruction for all AI agents

You are one of three AI coding agents working on the SAME HostelHub application.

The application must look and feel like it was created by one professional frontend team, not three independent developers.

Before writing, modifying, or generating ANY frontend UI code:

1. Read this entire AI_DESIGN_RULES.md file.
2. Inspect the existing project structure.
3. Inspect the existing theme and shared components.
4. Reuse existing components whenever possible.
5. Follow the colors, typography, spacing, sizing, iconography, cards, navigation and interaction rules defined here.
6. Do NOT invent a new visual style for your feature.
7. Do NOT introduce new colors unless explicitly approved by the team.
8. Do NOT introduce a different font.
9. Do NOT create duplicate versions of existing shared components.
10. Do NOT redesign components already implemented by another team member.
11. Do NOT modify another member's feature unless it is required for integration.
12. Keep all screens visually consistent with the reference screenshots supplied by the team.
13. Use mock/local data for the frontend prototype unless backend integration has explicitly been requested.
14. Keep the UI architecture ready for future API/backend integration.
15. Do not add unnecessary packages or dependencies.
16. Do not change the global theme to make one particular page look better.
17. If a requirement conflicts with this document, follow this document unless the team explicitly changes the design system.
18. Before finishing, inspect the affected screens and verify that they visually belong to the same application.

MOST IMPORTANT RULE

Do not invent UI styles.

Use the existing design system and shared components first.

## 2. Reference screens

The references define the application’s visual hierarchy, colors, typography, spacing, card style, navigation, icon style, rounded corners, shadows, section layout, and overall visual personality.

All future screens must look like they belong to these screens.

## 3. Product structure

- Entry: Splash, Onboarding, Login
- Main app: Home, Schedule, Alerts, Profile
- Hostel services: Room, Mess, Laundry, Repair, Events, Resources
- Secondary: Hamburger Menu, Settings, Notification Preferences, Help & Support, Report a Problem, About

There is NO fee/payment feature in this application.

## 4. Design philosophy

HostelHub should feel modern, clean, friendly, minimal, student-oriented, organized, lightweight, easy to scan, and visually calm.

Use mostly white + very light backgrounds + dark text + blue primary accents + soft service colors.

## 5. Primary color system

Primary Blue
- Primary: #326DF0
- Primary Dark: #1D43B6
- Primary Light: #94B9F2
- Deep Navy: #061258

Blue is the main brand/action color.

## 6. Base colors

- Background: #FAFCFF
- Surface: #FFFFFF
- Surface Soft: #F4F8FF
- Border: #DDE7F5
- Primary Text: #061258
- Secondary Text: #5B6B85
- Tertiary Text: #8A98AD
- Disabled Text: #B6C0CF
- Divider: #E6EDF7

## 7. Semantic colors

- Success / Green: #26A66A / #EAF8F1
- Warning / Orange: #F2A51A / #FFF5DE
- Error / Red: #E34D59 / #FFF0F1
- Blue: #326DF0 / #EEF5FF

## 8. Service color language

- Room: icon #1D43B6, background #EEF4FF
- Mess: icon #326DF0, background #F0F6FF
- Laundry: icon #061258, background #EAF1FF
- Repair: icon #E04B55, background #FFF0F1
- Events: icon #35A86F, background #EDF9F2
- Resources: icon #22A6A6, background #EDFAFA

## 9. Typography

Use Inter or a system sans-serif fallback.

- Display/Hero: 28px, 700
- Page Title: 24px, 700
- Section Heading: 20px, 700
- Card Heading: 16px, 600
- Body: 15px, 400
- Body Medium: 15px, 500
- Small / Supporting: 13px, 400
- Caption: 12px, 500
- Navigation Label: 13px, 500

## 10. General spacing system

Use consistent 4-point spacing:

- 4 XS
- 8 SM
- 12 MD
- 16 LG
- 20 XL
- 24 XXL
- 32 XXXL

Preferred page horizontal padding: 16–20px.

## 11. Border radius

- Small components: 8px
- Buttons: 12px
- Standard cards: 16px
- Large cards: 18–20px
- Bottom sheets: 24px

## 12. Card system

Default card: white background, border 1px, radius 16px, padding 16px, subtle shadow only if necessary.

## 13. Service cards

Service cards should contain an icon, service name, short description, and a navigation affordance.

## 14. Header / app bar

Main app header pattern:

- Hamburgermenu on left, title + subtitle, action on right
- Clean and lightweight
- No oversized or colored app bars unless required

## 15. Branding

HostelHub
- Hostel dark
- Hub primary blue

Subtitle: Your hostel, organized.

## 16. Home page design

Order:

Header → Greeting + Date → Weather Card → Room Snapshot → For You → Quick Access → Today’s Schedule → Today’s Menu → Active Repair → Important Notice → Upcoming Event → Bottom Navigation

## 17. Greeting

Good Morning, Sid 👋
Friday, 14 August 2025

Greeting: 24px / 700
Date: 15px / 400

## 18. Weather card

Compact, soft card with temperature and city.

## 19. Room snapshot

Soft blue-tinted card showing block, room, floor, roommates.

## 20. For You section

For You + View All

Cards can use soft service colors.

## 21. Quick access

Six services: Room, Mess, Laundry, Repair, Events, Resources.

## 22. Today’s schedule

Compact schedule preview with category, time, and short labels.

## 23. Today’s menu

Display Breakfast, Lunch, Snacks, Dinner.

## 24. Active repair

Compact status tracker with completion states.

## 25. Important notice

Use a soft red/pink background when urgent.

## 26. Upcoming events

Use green event color language.

## 27. Bottom navigation

Four items only: Home, Schedule, Alerts, Profile.

- Active item uses primary blue
- Inactive uses neutral gray
- Icons above labels
- Alerts may display unread badge

## 28. Schedule page

Follow the reference schedule layout:

- Header with menu and calendar
- Tabs: Today | Tomorrow | This Week
- Filter chips: All, Mess, Laundry, Repair, Events
- Chronological timeline / cards

## 29. Schedule cards

Every schedule item includes time, icon, title, category, location, duration, status.

## 30. Hamburger menu

Drawer with sections:

- Account: My Profile, My Hostel Details
- Activity: Notifications, All Notices, My Schedule
- Preferences: Settings, Notification Preferences
- Support: Help & Support, Report a Problem, About HostelHub
- Logout

## 31. Hamburger menu visual style

- White background
- 80–90% screen width
- Rounded corners on the drawer edge
- Dimmed overlay
- Primary blue for key icons
- Subtle dividers
- Clear close button
- Logout uses red semantic color

## 32. Profile page

Display profile image, student name, student ID, course, batch, block, room, floor, and preferences sections.

## 33. Alerts page

All, Smart Alerts, Notices, Updates

Unread alerts use clear but subtle indicator.

## 34. Smart alerts

The frontend should support proactive personalized messages without hard-coding AI into every screen.

## 35. Entry screens

Splash: minimal HostelHub branding
Onboarding: three key benefits
Login: email/student ID + password + primary button

## 36. Button system

- Primary: blue background, white text, height 48px, radius 12px
- Secondary: primary light background, primary text
- Outlined: transparent background, blue border, blue text

## 37. Input fields

- Height 48–52px
- Radius 12px
- Border #DDE7F5
- Focused border primary blue
- Error border red

## 38. Iconography

Use one consistent icon family with clean, rounded outlines and consistent stroke weight.

## 39. Responsive design

Support mobile sizes with flexible widths, safe areas, and scrolling.

## 40. Scrolling

Content should scroll vertically without hiding content behind bottom navigation.

## 41. Loading states

Architect sections for future loading placeholders and skeletons.

## 42. Empty states

List features should include friendly empty states.

## 43. Error states

Errors should be clear and friendly.

## 44. Animations

Subtle and purpose-driven only.

## 45. Accessibility

Readable contrast, large tap targets, semantic labels, accessible buttons, and non-color-only status indicators.

## 46. Component reuse

Before creating a component, search the existing project and reuse shared components.

Examples:
- AppHeader
- AppBottomNavigation
- AppCard
- ServiceCard
- SectionHeader
- PrimaryButton
- SecondaryButton
- StatusBadge
- ScheduleCard
- AlertCard
- EmptyState
- LoadingState
- ProfileHeader

## 47. Theme architecture

Centralize design values in theme files and shared widget components.

## 48. Do not hardcode design values repeatedly

Use theme tokens and shared components instead of scattered raw values.

## 49. Mock data

Use realistic mock data for the prototype, centralized in one place.

## 50. Future backend compatibility

Keep UI decoupled from business logic where possible so backend integration is manageable.

## 51. Team ownership

- Member 1: Core + Home
- Member 2: Hostel Services
- Member 3: Personal + Communication

## 52. File ownership rule

Do not unnecessarily modify another member’s files.

## 53. Git / collaboration rule

Pull changes, avoid overwriting teammates’ work, and preserve intended features during merges.

## 54. AI agent workflow

Read design rules → Inspect project → Inspect existing components → Identify reusable components → Plan feature → Implement → Test → Check design consistency → Report changes

## 55. AI agent response requirement

After completing a task, report:

1. Files created
2. Files modified
3. Components reused
4. Components created
5. Navigation added/changed
6. Mock data added
7. Dependencies added, if any
8. Any unresolved issues

## 56. Strict do not list

- Add payments
- Add fees
- Add billing
- Add wallet functionality
- Add unnecessary features
- Change the primary color
- Change the font family
- create a second design system
- create random card styles
- create random button styles
- use random gradients
- use excessive shadows
- use excessive animations
- mix unrelated icon libraries
- redesign another member’s page
- remove existing functionality without approval
- change navigation without approval
- create duplicate shared components
- hard-code repeated design values
- use fixed screen-sized layouts
- add backend logic unless requested
- add external services unless requested

## 57. Quality check before finishing

Before declaring a frontend task complete, verify visual, functional, and code consistency.

## 58. Final design principle

The goal is not to make every screen identical. The goal is to make every screen feel like it belongs to the same product.

All AI agents must treat this file as the single source of truth for the HostelHub frontend design.
