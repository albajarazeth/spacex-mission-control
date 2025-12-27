# SpaceX Mission Control Dashboard

A modern, responsive dashboard built with Next.js and React for tracking SpaceX launch data using the SpaceX-API.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository (or navigate to the project directory)

2. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000). The root route automatically redirects to `/dashboard`.

## Technologies & Libraries

This project is built with modern web technologies and carefully selected libraries to create a polished, production-ready dashboard experience.

### Core Framework & Runtime

- **Next.js 16.1.0** - I chose Next.js for this project because it's the industry standard for React applications in production environments. While I was primarily familiar with React without a framework, learning Next.js was valuable for working with modern tooling.

- **React 19.2.3** - The foundation of the application. React's component-based architecture makes it straightforward to build reusable UI elements and manage complex state across the dashboard.

- **TypeScript 5** - Type safety is crucial for maintaining code quality, especially as projects grow. TypeScript helps catch errors early and makes the codebase more self-documenting.

### UI & Styling

- **Tailwind CSS 4** - I used Tailwind for rapid UI development and consistent styling. The utility-first approach makes it easy to build responsive layouts and maintain design consistency across components. The dark mode support integrates seamlessly with the theme system.

- **Framer Motion 11.18.2** - For smooth animations and transitions throughout the application. I've used Framer Motion in previous projects and found it to be the most reliable solution for React animations. It provides excellent performance and a clean API for animating modals, page transitions, and interactive elements.

### Data Visualization

- **Recharts 2.15.4** - I selected Recharts for the dashboard charts because I've worked with it before and found it to be the most React-friendly charting library. It integrates naturally with React's component lifecycle and provides excellent customization options. The pie chart for rocket usage and line chart for success rates over time are both built with Recharts, and it handles responsive sizing beautifully.

### Icons & Assets

- **React Icons 5.3.0** - A comprehensive icon library that provides consistent iconography across the application. I used icons from the Font Awesome and Simple Icons sets for navigation, actions, and visual indicators.

### PDF Generation

- **jsPDF 2.5.2** - For generating PDF reports on the Reports page. I've used jsPDF in previous projects for client-side PDF generation, and it's reliable for creating formatted documents without requiring a backend. It allows users to download analytics reports directly from the browser.

### Development Tools

- **Vitest 4.0.16** - Modern testing framework that's fast and compatible with Vite. I chose Vitest over Jest because it has better TypeScript support out of the box and integrates well with the development workflow.

- **ESLint** - Code quality and consistency. The Next.js ESLint configuration provides sensible defaults for React and Next.js best practices.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server (requires build first)
- `npm run lint` - Run ESLint to check code quality
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once

## Architecture

This project uses the **Next.js App Router** with a feature-based file structure:

```
app/
├── (main)/                    # Route group with shared layout (sidebar + theme toggle)
│   ├── dashboard/             # /dashboard route
│   │   ├── page.tsx           # Dashboard entry point
│   │   ├── Panel.tsx          # Main dashboard component
│   │   ├── Filters.tsx        # Glassmorphism filter modal
│   │   ├── UpcomingLaunches.tsx
│   │   ├── MostUsedRocketsChart.tsx
│   │   └── OverTimeChart.tsx
│   ├── launches/              # /launches route
│   │   ├── page.tsx           # Launches page entry point
│   │   └── LaunchesPage.tsx   # All launches with search & filters
│   ├── reports/               # /reports route
│   │   ├── page.tsx           # Reports page entry point
│   │   └── ReportsPage.tsx    # Analytics reports with PDF export
│   ├── layout.tsx             # Shared layout with sidebar & theme
│   ├── Sidebar.tsx            # Collapsible sidebar navigation
│   ├── ThemeToggle.tsx        # Light/dark mode toggle
│   └── ThemeContext.tsx       # Theme state provider
├── components/                # Reusable UI components
│   ├── LaunchDetailsModal.tsx # Shared modal for launch details
│   ├── LaunchCardSkeleton.tsx
│   ├── LaunchListSkeleton.tsx
│   ├── LoadingCircle.tsx
│   └── SkeletonLoader.tsx
├── globals.css                # Global styles & Tailwind config
├── layout.tsx                 # Root layout
└── page.tsx                   # Root page (redirects to /dashboard)

services/
├── service.tsx                # SpaceX API calls
└── launchpadService.tsx       # Launchpad data fetching

hooks/
└── useDashboardMetrics.tsx    # Dashboard metrics hook

utils/
├── dateFormatter.ts           # Date formatting utilities
├── metrics.ts                 # Metrics calculation functions
└── pdfGenerator.ts            # PDF report generation utility

types/
└── index.ts                   # TypeScript interfaces
```

### Key Architectural Decisions

- **Route Groups**: The `(main)` folder groups routes that share a common layout (sidebar, theme toggle) without affecting the URL structure
- **Feature-based Organization**: Dashboard and launches each have their own folder with related components
- **Reusable Components**: Skeleton loaders and common UI elements live in `app/components/`
- **Services Layer**: API calls are abstracted into the `services/` folder
- **Type Safety**: All data structures are typed in `types/index.ts`

## Features

### Dashboard (`/dashboard`)

The main dashboard is built around the `Panel` component, which serves as the Mission Control center. It's organized into two main sections:

**Left Side — Latest Launches**
- Displays a timeline of recent SpaceX launches
- Each launch is clickable and opens a detailed modal showing mission information, video links, payload details, and more
- Paginated with Previous/Next navigation to browse through launch history at the bottom

**Right Side — Analytics**
- **Total Rocket Launches**: Overall count of all recorded launches
- **Success Rate**: Percentage of successful missions
- **Upcoming Launches**: Table of scheduled launches with mission names and dates
- **Most Used Rocket**: Pie chart showing rocket usage distribution (Falcon 9, Falcon Heavy, etc.)
- **Success Rate Over Time**: Line chart tracking launch success/failure trends by year

**Component Composition**

The Dashboard composes the following components to render its interface:

| Component | Location | Description |
|-----------|----------|-------------|
| `Panel.tsx` | `dashboard/` | Core layout component that orchestrates the dashboard view |
| `UpcomingLaunches.tsx` | `dashboard/` | Scrollable table displaying scheduled launch missions |
| `MostUsedRocketsChart.tsx` | `dashboard/` | Pie chart visualization built with Recharts |
| `OverTimeChart.tsx` | `dashboard/` | Line chart tracking success/failure trends over time |
| `LaunchDetailsModal.tsx` | `components/` | Shared modal for displaying comprehensive launch information |

### All Launches (`/launches`)

A dedicated page for exploring the complete SpaceX launch catalog with powerful filtering capabilities:

- **Search**: Find launches by mission name or details
- **Filter by Status**: View all, successful, or failed launches
- **Filter by Date Range**: Narrow down launches within specific dates
- **Filter by Rocket**: Filter by rocket type (Falcon 1, Falcon 9, Falcon Heavy, Starship)
- **Filter by Video**: Show only launches that have video available

Results are displayed in a paginated card grid. Clicking any launch card opens the detailed modal view.

**Component Composition**

The All Launches page utilizes the following components:

| Component | Location | Description |
|-----------|----------|-------------|
| `LaunchesPage.tsx` | `launches/` | Main page component handling search, filters, and pagination |
| `Filters.tsx` | `dashboard/` | Glassmorphism-styled modal for applying filter criteria |
| `LaunchDetailsModal.tsx` | `components/` | Shared modal component (reused across routes) |

### Reports (`/reports`)

A dedicated page for generating and downloading analytics reports in PDF format. The Reports page displays:

- **Summary Metrics**: Visual cards showing total launches, success rate, upcoming launches, and most used rocket
- **Chart Visualizations**: 
  - Most Used Rocket pie chart
  - Success Rate Over Time line chart
- **PDF Export**: One-click download button to generate a comprehensive PDF report containing all summary metrics with a formatted timestamp

The PDF export feature uses `jsPDF` to generate client-side PDF documents that include:
- Report title and generation timestamp
- All summary metrics (total launches, success rate, upcoming launches, most used rocket, successful/failed counts)
- Clean, professional formatting suitable for sharing or archiving

**Component Composition**

The Reports page utilizes the following components:

| Component | Location | Description |
|-----------|----------|-------------|
| `ReportsPage.tsx` | `reports/` | Main page component displaying metrics and charts with PDF export functionality |
| `MostUsedRocketsChart.tsx` | `dashboard/` | Pie chart visualization (reused from dashboard) |
| `OverTimeChart.tsx` | `dashboard/` | Line chart visualization (reused from dashboard) |

### Shared Components

Components in `app/components/` are shared across multiple routes:

| Component | Description |
|-----------|-------------|
| `LaunchDetailsModal.tsx` | Modal displaying mission patches, embedded video, launch site, payload manifests, core recovery data, and external links |
| `LaunchCardSkeleton.tsx` | Loading skeleton for launch card grids |
| `LaunchListSkeleton.tsx` | Loading skeleton for the launch timeline |
| `LoadingCircle.tsx` | Compact loading spinner for metrics |
| `SkeletonLoader.tsx` | Generic skeleton loader for tables |

## UX/UI Design & Accessibility

This application was designed with a focus on modern user experience principles, responsive design, and accessibility standards. The goal was to create an interface that feels polished, professional, and inclusive.

### Responsive Design

The dashboard is built to work seamlessly across a wide range of screen sizes, from mobile devices to large desktop displays. I prioritized responsive design by implementing targeted media queries for the most challenging screen sizes, ensuring the layout adapts gracefully at every breakpoint.

Key responsive considerations:

- **Mobile-first approach**: The layout is designed to work on smaller screens first, then enhanced for larger displays
- **Flexible grid systems**: Dashboard metrics and charts use CSS Grid with responsive column counts that adjust based on viewport width
- **Adaptive spacing**: Margins, padding, and component sizes scale appropriately to maintain visual hierarchy across screen sizes
- **Timeline layout**: The dashboard timeline uses custom media queries to ensure the timeline line remains centered with rocket icons properly aligned, even on smaller screens
- **Sidebar behavior**: The collapsible sidebar adapts its width and interaction patterns based on available screen space

By testing and optimizing for the most challenging screen sizes first, I ensured that the application provides an excellent experience regardless of the device or viewport dimensions.

### Accessibility Standards

Accessibility was a core consideration throughout development. The application adheres to WCAG guidelines and provides a fully keyboard-navigable experience.

**Keyboard Navigation**:
- All interactive elements are keyboard accessible
- Launch cards support Enter and Space key activation
- Modals and filters can be closed with the Escape key
- Focus management ensures keyboard users can navigate efficiently

**ARIA Attributes**:
- Proper `role` attributes on modals (`dialog`), buttons, and interactive elements
- `aria-label` attributes provide context for screen reader users
- `aria-expanded` states communicate sidebar and filter states
- `aria-labelledby` connects modal titles to their content

**Focus Management**:
- Focus trapping within modals to keep keyboard navigation contained
- Focus restoration returns focus to the triggering element when modals close
- Visible focus indicators on all interactive elements
- Skip link allows users to jump directly to main content

**Form Accessibility**:
- All form inputs have associated labels using `htmlFor` attributes
- Date inputs include `aria-label` for additional context
- Select dropdowns are properly labeled and keyboard navigable

**Semantic HTML**:
- Proper heading hierarchy for screen reader navigation
- Semantic elements (`<button>`, `<nav>`, `<main>`) used throughout
- Images include descriptive `alt` text

These accessibility features ensure that the application is usable by everyone, regardless of their abilities or the tools they use to interact with the web.

### Modern Design System

The visual design follows contemporary UI/UX principles, creating an interface that feels both professional and approachable.

**Design Philosophy**:
- **Soft, premium aesthetic**: Rounded corners, subtle shadows, and muted color palettes create a calm, modern feel
- **Glassmorphism effects**: Frosted glass surfaces with backdrop blur add depth without visual clutter
- **Consistent spacing**: Generous padding and margins create breathing room and clear visual hierarchy
- **Subtle animations**: Smooth transitions and micro-interactions provide feedback without being distracting

**Color System**:
- Light mode uses warm off-white backgrounds with soft gradients
- Dark mode features deep purple tones that maintain readability and visual interest
- Accent colors are used sparingly to highlight important actions and states

**Typography**:
- Custom Google Fonts (Instrument Sans, Inter Tight, Google Sans) provide a modern, clean aesthetic
- Clear font size hierarchy ensures information is scannable and readable
- Proper line heights and letter spacing optimize readability

### Tailwind CSS & Design Variables

I leveraged Tailwind CSS's utility-first approach combined with CSS custom properties to create a flexible, maintainable styling system.

**CSS Variables**:
- Theme-aware variables for backgrounds, colors, and spacing
- Centralized color definitions that adapt to light/dark modes
- Reusable design tokens that ensure consistency across components

**Utility Classes**:
- Tailwind's responsive utilities (`sm:`, `md:`, `lg:`) enable mobile-first responsive design
- Dark mode variants (`dark:`) are used conditionally through theme context
- Custom utility classes extend Tailwind's default set for project-specific patterns

**Benefits of This Approach**:
- **Consistency**: Design variables ensure colors, spacing, and typography remain consistent across the entire application
- **Maintainability**: Changes to design tokens propagate automatically throughout the UI
- **Performance**: Tailwind's purging removes unused styles, keeping bundle sizes small
- **Developer Experience**: Utility classes make it easy to build responsive, accessible interfaces quickly

This combination of Tailwind CSS and CSS variables provides the flexibility to iterate on design while maintaining a cohesive visual language throughout the application.

## Theming

### Theme Context (`ThemeContext.tsx`)

The application supports light and dark modes through a React Context-based theming system. The `ThemeContext` provides the current theme state to all components in the application tree.

```tsx
const { theme } = useTheme(); // Returns "light" or "dark"
```

The context is initialized in the shared layout (`app/(main)/layout.tsx`) and wraps all route content via the `ThemeProvider`. Theme persistence is handled through `localStorage`, and a blocking script in the root layout prevents flash of incorrect theme on page load.

### Theme Toggle (`ThemeToggle.tsx`)

A pill-style toggle component that allows users to switch between light and dark modes. Features:

- Animated sliding indicator with sun/moon icons
- Smooth color transitions
- Persists preference to `localStorage`
- Accessible with proper ARIA labels

## Custom Hooks

### `useDashboardMetrics`

A custom React hook that computes dashboard analytics from launch data. Located in `hooks/useDashboardMetrics.tsx`.

```tsx
const metrics = useDashboardMetrics(launches);
// Returns: { totalLaunches, upcomingLaunches, successRate, mostUsedRocket }
```

This hook uses `useMemo` to optimize performance by only recalculating metrics when the launch data changes. It delegates the actual calculations to utility functions in `utils/metrics.ts`.

**Used in**: `Panel.tsx` (Dashboard)

## Services

The `services/` folder abstracts all external API calls, keeping components focused on presentation logic.

### `service.tsx`

Primary service for fetching SpaceX launch data from the [SpaceX API v5](https://github.com/r-spacex/SpaceX-API).

| Function | Description |
|----------|-------------|
| `getLatestLaunches()` | Fetches the 10 most recent completed launches, sorted by date descending |
| `getAllLaunches()` | Fetches all launches across all pages using pagination (used for metrics and the All Launches page) |
| `getUpcomingLaunches()` | Fetches 2022 launches (used for the Upcoming Launches table — note: SpaceX API is no longer actively maintained) |

All functions use the `/launches/query` POST endpoint with pagination support.

### `launchpadService.tsx`

Service for resolving launchpad IDs to human-readable names.

| Function | Description |
|----------|-------------|
| `getLaunchpadName(id)` | Fetches launchpad details from the API and returns the name |
| `getCachedLaunchpadName(id)` | Wrapper with in-memory caching to avoid redundant API calls |

The caching mechanism ensures that once a launchpad name is fetched, subsequent requests for the same ID return instantly from memory.

## Types

All TypeScript interfaces are centralized in `types/index.ts` for consistency and reusability.

| Interface | Description |
|-----------|-------------|
| `Launch` | Complete launch object including id, name, date, success status, rocket, launchpad, details, payloads, cores (with landing info), and links (patch, webcast, article, Wikipedia, Reddit, Flickr) |
| `Rocket` | Basic rocket information (id, name, type) |
| `DashboardMetrics` | Computed metrics shape: totalLaunches, upcomingLaunches, successRate, mostUsedRocket |

## Utilities

### `dateFormatter.ts`

Formats ISO date strings into human-readable formats while respecting the API's date precision field.

| Function | Description |
|----------|-------------|
| `formatDate(dateString, options)` | Core formatter with support for short/long/relative formats, time inclusion, and precision |
| `formatLaunchCardDate(dateString, precision)` | Short format for launch cards (e.g., "Jan 6, 2022") |
| `formatDashboardDateTime(dateString)` | Includes time for dashboard displays |
| `formatUpcomingLaunchDate(dateString, precision)` | Relative format (e.g., "in 3 days", "2 months ago") |

Handles edge cases like invalid dates and respects precision levels (`year`, `month`, `day`, `hour`).

### `metrics.ts`

Pure functions for calculating dashboard analytics from launch data.

| Function | Description |
|----------|-------------|
| `calculateTotalLaunches(launches)` | Returns the total count of launches |
| `calculateUpcomingLaunches(launches)` | Counts 2022 launches (demonstration data) |
| `calculateSuccessRate(launches)` | Computes success percentage from completed launches only |
| `calculateMostUsedRocket(launches)` | Finds the rocket with the highest launch count, maps ID to name |
| `calculateAllMetrics(launches)` | Aggregates all metrics into a single `DashboardMetrics` object |

### `pdfGenerator.ts`

Utility function for generating PDF reports from dashboard metrics. Uses `jsPDF` to create client-side PDF documents.

| Function | Description |
|----------|-------------|
| `generateAnalyticsPdf(options)` | Generates a PDF report with title, timestamp, summary metrics, and formatted layout. Accepts metrics and optional filter state. Returns a downloadable PDF file with filename format: `spacex-analytics-report-YYYY-MM-DD.pdf` |

The PDF generator creates professional, formatted reports suitable for sharing or archiving analytics data.

## Testing

Unit tests are implemented for core utility functions using [Vitest](https://vitest.dev/). The test suite focuses on the business logic and data transformation utilities that power the dashboard.

### `metrics.test.ts`

Tests for dashboard metrics calculation functions verify the accuracy of analytics computations:

- **Total launches calculation**: Validates correct counting of launch arrays, including edge cases like empty arrays
- **Success rate calculation**: Ensures proper percentage computation from completed launches, correctly excluding upcoming and null-success launches
- **Most used rocket identification**: Verifies rocket counting, ID-to-name mapping for known rockets, and handling of unknown rocket IDs
- **2022 launches counting**: Confirms the filtering logic that treats 2022 launches as "upcoming" for demonstration purposes
- **Integrated metrics**: Tests the aggregation function that combines all metrics into a single `DashboardMetrics` object

### `dateFormatter.test.ts`

Tests for date formatting utilities ensure consistent and accurate date representation across the application:

- **Invalid date handling**: Verifies that malformed or empty date strings return "Date TBD" gracefully
- **Precision levels**: Tests date formatting with different precision levels (year, month, day, hour) to respect API date precision fields
- **Relative time formatting**: Validates relative time calculations (e.g., "2 days ago", "in 3 months") with mocked system time for consistency
- **Launch card date formatting**: Ensures launch cards display dates in the correct short format with optional precision
- **Dashboard date-time formatting**: Confirms that dashboard displays include time information when required

Run tests with:
```bash
npm test
```

## Scalability & Future Enhancements

If this solution were to grow in scale—handling more launches, historical data, or additional SpaceX-related datasets—I would focus on improving data flow, state management, and architectural organization.

### 1. Data Preparation & Preprocessing

Currently, the frontend consumes raw data directly from the SpaceX API. For scalability, I would introduce a data preprocessing layer before the data reaches the React application.

This could be implemented as:

- A backend service or serverless function
- A data transformation pipeline that cleans, normalizes, and formats API responses

By delivering clean, predictable, and frontend-ready data, the React app can remain focused on rendering and user interaction rather than performing heavy transformations or calculations. This reduces complexity, improves performance, and makes the UI more resilient to API changes.

### 2. State Management at Scale

While React Context is sufficient for the current scope, at larger scale I would migrate to a more robust state management solution such as Redux Toolkit (or a similar predictable state container).

This would:

- Centralize launch data, filters, and UI state
- Improve debugging and traceability
- Prevent prop drilling and scattered logic as features grow
- Better support caching, pagination, and derived state

### 3. Component & Folder Architecture

As the UI expands—especially with charts and data visualizations, I would further modularize the component structure.

For example:

- A dedicated `charts/` directory to house reusable chart components
- Shared UI primitives (cards, pills, loaders) abstracted into a design system layer

This ensures the codebase remains organized, discoverable, and easy to extend, even as multiple developers contribute.

### 4. Performance & UX Considerations

At scale, I would also explore:

- Data pagination or virtualization for large launch lists
- Memoization of expensive computations
- Pre-aggregated datasets for charts to avoid recalculations on render

### Testing Strategy & Production Safety

As the application grows, testing becomes increasingly important to ensure stability and prevent regressions.

Currently, the focus is on testing utility functions to validate core data logic. As the UI and feature set expand, I would significantly enhance the testing strategy by introducing component-level and end-to-end testing.

### 5. Component & UI Testing

To validate that the UI behaves as expected, I would add component tests to ensure:

- Components render correctly with various data states (loading, error, empty)
- Props and conditional rendering behave as intended
- Refactors or styling changes do not break functionality

This creates confidence when iterating on UI components and enables safer refactoring over time.

### 6. End-to-End Testing with Cypress

For broader production safety, I would introduce end-to-end tests using Cypress to simulate real user behavior and verify critical user flows.

This would include:

- Verifying that launch lists render correctly after API responses
- Ensuring clicking a launch opens the correct details panel or modal
- Catching unexpected UI or layout changes before deployment

By testing the application from the user's perspective, these tests help detect regressions that unit tests alone cannot catch, reducing the risk of UI-breaking changes reaching production.

## Deployment & Infrastructure

### Current Deployment

For this project, I chose Vercel for deployment.

Vercel makes it easy to ship a frontend application quickly while keeping the workflow simple. It handles builds, deployments, and preview environments automatically, which allowed me to focus on building and polishing the UI rather than managing infrastructure.

It's a great fit for this stage of the project because:

- Deployment is fast and reliable
- Every change can be previewed easily
- Performance is handled out of the box

### Thinking About Growth & Scalability

If this application were to grow beyond a small demo, I would start thinking differently about how and where it runs.

One change I would consider in the future is moving parts of the system to a more customizable cloud setup, such as running services on AWS (EC2).

The reason for this wouldn't be "more tech," but more control.

For example:

- If the app started handling larger amounts of data
- If some data needed to be cleaned or prepared before reaching the frontend
- Or if additional backend logic was introduced

In those cases, having a dedicated server would allow that work to happen before the data reaches the React app. This keeps the frontend lighter, simpler, and easier to maintain as the app grows.

### Why I'd Consider EC2 in the Future

Using something like EC2 would make sense when:

- The app needs more flexibility than a simple frontend deployment
- There's a need to process or format data ahead of time
- The system grows beyond a single frontend application

It also provides a clearer path for scaling later, without committing to that complexity too early.

### Overall Approach

My goal would be to keep things simple early on, and only introduce more infrastructure when the problem actually requires it.

Starting with Vercel allows for fast development and iteration, while leaving room to evolve into a more robust setup if the project grows in scope or usage.

## Challenges & Trade-offs

### API Challenges

One of the primary challenges I faced was understanding how the [SpaceX API](https://github.com/r-spacex/SpaceX-API) handles pagination, sorting, and filtering. The API requires specific parameters and ordering to return the expected results, which wasn't immediately obvious from initial exploration.

The API uses POST requests with query objects for filtering and options objects for pagination and sorting, rather than the more common query string approach. This structure required careful study of the [API documentation](https://github.com/r-spacex/SpaceX-API) and experimentation to understand the correct request format.

To solve this:

- I carefully reviewed the API documentation to understand the request structure
- I experimented with different request formats until I understood the correct parameter structure
- I centralized all API logic into the `services/` folder to keep components clean and make future changes easier

### Framework Learning Curve: Next.js

I chose to build this project with Next.js despite having no prior experience with the framework. My background was in React applications without a framework layer, so this presented a valuable learning opportunity and a way to work with a modern, industry-standard toolset.

Next.js was the preferred choice for several reasons:

- It's widely adopted in production React applications, making the skills transferable
- The App Router provides powerful routing and layout capabilities that fit well with this dashboard structure
- Server and client components offer performance benefits and flexibility
- Built-in optimizations for images, fonts, and code splitting improve the final product

The learning curve involved understanding several Next.js concepts:

- **App Router vs. Pages Router**: Understanding the file-based routing system and the difference between server and client components
- **Route Groups**: Using `(main)` to create shared layouts without affecting URL structure
- **Layouts and Nested Routes**: Organizing the sidebar and shared theme context effectively
- **Server vs. Client Components**: Determining when to use `"use client"` and when server-side rendering was appropriate

While this added initial complexity compared to a pure React setup, it ultimately resulted in a more scalable architecture and provided valuable experience with a widely-used framework. The structured approach to routing and layouts proved beneficial for organizing the dashboard and launches pages with shared components.

### Animation & User Experience Enhancements

To create smooth, polished interactions throughout the application, I integrated [Framer Motion](https://www.framer.com/motion/) for animations. This was a new library for me, so I spent time with both the [Framer Motion documentation](https://www.framer.com/motion/introduction/) and [Tailwind CSS documentation](https://tailwindcss.com/docs) to understand how to effectively combine them.

I implemented animations in several key areas:

- **Modal Animations**: Smooth fade and scale transitions when opening and closing the launch details modal, with subtle upward motion for a polished entrance effect
- **Card Animations**: Staggered fade-in animations for launch cards in the All Launches page, with hover effects (slight lift and scale) and tap feedback for better interactivity
- **Timeline Animations**: Dashboard timeline items slide in from the left with a staggered delay, creating a smooth sequential appearance
- **Page Transitions**: Subtle fade and slide animations when navigating between Dashboard and All Launches pages using `AnimatePresence` for smooth route changes
- **Sidebar Interactions**: Enhanced menu item animations with smooth hover states and refined spring animations for the sidebar expansion

All animations use carefully tuned easing curves (`[0.4, 0, 0.2, 1]`) for natural, professional motion that feels responsive without being distracting. The implementation required balancing animation performance with visual polish, ensuring interactions feel smooth on all devices.

### Trade-offs & Time Constraints

Given the time constraints of this project, I made several pragmatic trade-offs to balance functionality with development speed:

- **Native Fetch vs. Axios**: I used the native `fetch` API instead of a library like Axios. With more time, I would have preferred Axios for its built-in request/response interceptors, better error handling, automatic request/response transformations, and more intuitive timeout/retry mechanisms. This would make the service layer more robust and easier to maintain.

- **Frontend Data Formatting**: Some data formatting and transformation logic lives directly in components for speed and clarity. With more time, I would abstract this into a more robust data layer to reduce repetition and improve maintainability.

- **API Service Layer**: While the services are functional, they could be enhanced with better error handling, retry logic, request cancellation, and more comprehensive TypeScript types. An Axios-based service layer would make this easier to implement.

### What I'd Improve With More Time

Given additional development time, I would focus on:

- **Enhanced API Service Layer**: Refactor services to use Axios for better error handling, request interceptors, and built-in retry/timeout mechanisms
- **Improved Error Handling**: Add comprehensive error boundaries, user-friendly error messages, and retry mechanisms for failed API calls
- **Better Data Abstraction**: Create a more robust data transformation layer to handle API responses consistently across the application
- **Utility Refactoring**: Make utilities more descriptive, reusable, and better documented
- **Advanced UX**: Enhance animations and micro-interactions for an even more polished user experience
- **API Documentation Integration**: Build TypeScript types directly from the API schema to ensure type safety and reduce manual type maintenance

These improvements would make the codebase more maintainable, resilient, and production-ready.

## AI Usage (Transparency)

I used AI tools (such as ChatGPT, Cursor) as a supportive assistant, not as a replacement for my own decision-making.

Specifically, I used AI in the following ways:

- **Debugging a theme context issue**: I was stuck on a bug related to context and theme toggling. I used AI to help reason through the issue, review the documentation, and validate possible fixes

- **Brainstorming UI and layout decisions**: I used AI to explore different layout ideas (e.g. sidebar vs. card-based views) and evaluate which approach best fit the project requirements and user experience goals.

- **TypeScript validation and cleanup**: I used AI to audit TypeScript types and interfaces to ensure consistency and correctness across components.

- **Testing support**: AI helped me generate testing ideas and examples, which I then adapted and reviewed before adding them to the project.

- **Accessibility audit**: I used AI to run an accessibility audit and identify areas for improvement. Based on the audit findings, I implemented keyboard navigation support, ARIA attributes, focus management, form label associations, and skip links to ensure the application is accessible to all users.

- **README documentation**: I used AI to help combine my ideas and structure the documentation effectively. However, all decisions regarding content organization, what information to include, which challenges to highlight, and the overall narrative flow were made by me based on my experience developing the project.

All final architectural, design, implementation, and documentation decisions were made by me, with AI acting as a productivity and learning tool that helped refine and organize my thoughts.
