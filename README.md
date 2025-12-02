# Event Management Application

A modern, interactive event management platform built with React, TypeScript, and Recoil. Create, customize, and publish events with a beautiful, user-friendly interface.

## Features

- **Event Creation**: Create events with title, date/time, location, cost, and description
- **Live Flyer Preview**: Upload and preview event flyer images in real-time
- **Background Customization**: Set custom backgrounds for your event pages
- **Auto-Save**: Automatic draft saving with debounced updates (500ms)
- **Dynamic Modules**: Add customizable modules like capacity, photo gallery, links, RSVP, announcements, and privacy settings
- **Form Validation**: Real-time validation with helpful error messages
- **Toast Notifications**: User-friendly notifications for all actions
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Recoil with localStorage persistence
- **Data Fetching**: TanStack React Query v5
- **Styling**: CSS Modules with CSS Variables
- **Build Tool**: Vite
- **API Mocking**: Mock Service Worker (MSW)
- **Type Safety**: TypeScript with strict mode

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shubhssays/event-management.git
cd event-management
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── assets/           # SVG icons and images
├── components/       # React components
│   ├── atoms/       # Basic UI components (Button, Input)
│   ├── molecules/   # Composite components (FormInput, ModuleRenderer)
│   └── organisms/   # Complex components (EventForm, FlyerSection)
├── config/          # Module configurations
├── hooks/           # Custom React hooks
├── lib/             # Third-party library configurations
├── mocks/           # MSW handlers for API mocking
├── pages/           # Page components
├── services/        # API service layer
├── store/           # Recoil state management
├── styles/          # Global styles and CSS variables
└── types/           # TypeScript type definitions
```

## Key Components

- **EventForm**: Main form for creating events with auto-save functionality
- **FlyerSection**: Image upload and preview component
- **QuickLinksPanel**: Dynamic module management system
- **ModuleRenderer**: Renders different module types dynamically
- **ToastContainer**: Global notification system
- **ConfirmModal**: Reusable confirmation dialog

## State Management

The application uses Recoil for state management with the following key atoms:

- `eventFormAtom` - Event form data
- `flyerImageAtom` - Flyer image data
- `backgroundImageAtom` - Background image data
- `activeModulesAtom` - Active module IDs
- `moduleDataAtom` - Module-specific data
- `toastsAtom` - Toast notifications queue

All state is persisted to localStorage for data recovery.

## API Integration

Currently using Mock Service Worker (MSW) for development. The API layer is abstracted through `services/api.ts`, making it easy to switch to a real backend.

### Available Endpoints

- `POST /api/events/draft` - Save event draft
- `GET /api/events/draft/:id` - Get draft by ID
- `POST /api/events` - Publish event
- `POST /api/events/validate` - Validate event data
- `POST /api/upload` - Upload images
- `GET /api/modules/configs` - Get module configurations
- `POST /api/modules/:id` - Save module data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Author

Built by [shubhssays](https://github.com/shubhssays)
