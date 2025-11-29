# RespAI - AI-Powered API Analysis Platform

![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black?style=for-the-badge&logo=next.js)
![Redux](https://img.shields.io/badge/Redux-5.0.0-764ABC?style=for-the-badge&logo=redux)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![RTK Query](https://img.shields.io/badge/RTK_Query-2.0-764ABC?style=for-the-badge&logo=redux)

## Project Overview

RespAI is a modern, full-stack web application built with Next.js that provides users with AI-powered analysis of API responses. The platform offers a comprehensive suite of tools for developers to analyze, monitor, and manage their API interactions with intelligent insights powered by artificial intelligence.

## Key Features

### 🤖 AI-Powered Analysis

- **Smart Response Analysis**: Leverage AI to gain deep insights into API responses
- **Toggle AI Features**: Users can enable/disable AI analysis based on their preferences
- **Intelligent Recommendations**: Get actionable insights from your API interactions

### 🔐 Authentication & Security

- **Complete Auth Flow**: Full login/signup functionality with protected routes
- **OAuth Integration**: Seamless Google authentication support
- **Token Management**: Automatic token refresh with secure re-authentication
- **Route Protection**: Comprehensive route guarding for authenticated areas

### 📊 API Client & Management

- **RTK Query Integration**: Efficient data fetching and caching
- **Request History**: Complete history of all API interactions
- **Advanced Filtering**: Filter by HTTP methods, status codes, and search queries
- **Real-time Monitoring**: Live tracking of API requests and responses

### 👤 User Profile Management

- **Profile Customization**: Edit personal information and preferences
- **AI Settings**: Control AI analysis features from profile settings
- **Session Management**: Secure user session handling

### 🎨 User Experience

- **Responsive Design**: Fully responsive across all device sizes
- **Toast Notifications**: Elegant notification system using Sonner
- **Typewriter Effects**: Engaging text animations for better UX
- **Clipboard Integration**: Easy copy-paste functionality

## Project Structure

├── 📁 app/ # Next.js App Router pages
│ ├── page.tsx # Landing page
│ ├── layout.tsx # Root layout
│ ├── oauth/
│ │ └── page.tsx # OAuth callback handler
│ └── dashboard/
│ ├── profile/ # User profile management
│ └── history/ # API request history
│
├── 📁 components/ # React components
│ ├── reusable/ # Shared UI components
│ ├── landingPage/ # Landing page components
│ ├── dashboard/ # Dashboard components
│ └── auth/ # Authentication components
│
├── 📁 redux/ # State management
│ ├── apis/ # RTK Query API definitions
│ ├── slices/ # Redux slices
│ ├── apiSettings.ts # Base query configurations
│ └── store.ts # Redux store setup
│
├── 📁 providers/ # Application providers
│ ├── ContextsProviders.tsx # Main context aggregator
│ ├── ModalsProvider.tsx # Modal management
│ ├── ProfileProvider.tsx # Profile data provider
│ ├── ProtectedRoute.tsx # Route protection
│ ├── ReduxProvider.tsx # Redux store provider
│ └── SonnerProvider.tsx # Toast notifications
│
├── 📁 hooks/ # Custom React hooks
│ ├── useAnalysisRequest.tsx # AI analysis API handling
│ ├── useAuth.tsx # Authentication logic
│ ├── useCopyToClipboard.tsx # Clipboard utilities
│ ├── useEditProfile.tsx # Profile management
│ ├── useNavigationHook.tsx # Routing utilities
│ ├── useRedux.tsx # Redux helpers
│ ├── useResizer.tsx # Responsive layout
│ ├── useTypeWriter.tsx # Text animations
│ └── useValidations.tsx # Form validations
│
├── 📁 contexts/ # React contexts
│ ├── AuthContext.tsx # Authentication state
│ └── PaginationContext.tsx # Pagination and filtering
│
└── 📁 data/ # Static data and constants
└── httpStatusCodes.ts # HTTP status code definitions

## Technology Stack

- **Frontend Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **Authentication**: JWT with OAuth support
- **Styling**: Tailwind CSS
- **Notifications**: Sonner toast library
- **Validation**: Zod schemas
- **Routing**: Next.js App Router

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API endpoint (for full functionality)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/jamaldeen09/RespAi-frontend.git
   ```

2. **Install dependencies**
   npm install
   # or
   yarn install

3. **Environment Setup**
   NEXT_PUBLIC_GOOGLE_AUTH_LINK=your backend google auth endpoint
   NEXT_PUBLIC_BACKEND_URL=your backend url

4. **Run the developemnt server**
  npm run dev
  # or
  yarn dev

**Building for Production**
 # npm run build
 # npm start

**Key Configuration Files**

## Redux Store (/redux/store.ts)
  - Configures the Redux store with RTK Query
  - Sets up middleware and enhancers
  - Integrates with Next.js hydration

## API Settings (/redux/apiSettings.ts)
  - baseQuery: Standard API query configuration
  - baseQueryWithReAuth: Enhanced query with automatic token refresh
  - Error handling and re-authentication logic

## Providers (/providers/)
  - ContextsProviders: Aggregates all context providers
  - ProtectedRoute: Guards authenticated routes
  - SonnerProvider: Global notification system

## Available Scripts
  - npm run dev - Start development server
  - npm run build - Build for production
  - npm run start - Start production server
  - npm run lint - Run ESLint
  - npm run type-check - Run TypeScript compiler


**RespAI - Making API analysis smarter, one request at a time**