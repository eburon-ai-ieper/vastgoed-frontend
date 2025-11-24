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

- **Renter**: Creates maintenance requests
- **Broker**: Manages requests, schedules appointments
- **Owner**: Selects contractors for their properties
- **Contractor**: Receives assignments and appointment notifications

## 📋 Features

- ✅ User authentication (JWT)
- ✅ Role-based access control
- ✅ Maintenance request creation and management
- ✅ Contractor selection
- ✅ Appointment scheduling
- ✅ Workflow history tracking
- ✅ Real-time status updates

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

