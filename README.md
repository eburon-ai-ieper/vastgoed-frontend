# Vastgoed & Partners - Frontend

Property Management System Frontend - React application for managing maintenance requests.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Frontend will run on http://localhost:3000

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 👥 User Roles

- **Renter**: Creates maintenance requests with available times (required field)
- **Broker**: Views and manages requests (cannot schedule appointments)
- **Owner**: Selects contractors for their properties via email link
- **Contractor**: Receives assignments and schedules appointments via email link

## 📋 Features

- ✅ User authentication (JWT)
- ✅ Role-based access control
- ✅ Maintenance request creation with flexible availability options:
  - Specific date/time ranges
  - Weekday availability (with time ranges)
  - Weekend availability (with time ranges)
  - **Available times are required** for all requests
- ✅ Token-based contractor selection (public link, no login required)
- ✅ Token-based appointment scheduling (public link, no login required)
- ✅ Workflow history tracking with proper date formatting
- ✅ Real-time status updates with color-coded messages (orange for pending, green for scheduled)
- ✅ In-app notification system with badge counts
- ✅ Demo account credentials displayed on login page
- ✅ Request details show renter name, property address, and available times
- ✅ Form submission protection (prevents multiple submissions)

## 🛠️ Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router
- **HTTP Client**: Axios

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔗 Backend API

The frontend connects to the backend API running on `http://localhost:3001` (configured in `vite.config.js` proxy settings).

## 📄 License

ISC

