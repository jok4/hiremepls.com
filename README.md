# hiremepls.com

A modern web application built with Next.js that simplifies resume sharing and management through an intuitive interface and powerful features.

## Table of Contents

- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

HireMePls.com streamlines the resume sharing process by providing secure file uploads, custom sharing links, and QR code generation. Built with modern web technologies, it offers a seamless experience for both job seekers and recruiters.

## Directory Structure

```
├── autoume/
│   ├── .eslintrc.json
│   ├── public/
│   ├── next.config.ts
│   ├── postcss.config.js
│   ├── package.json
│   ├── README.md
│   ├── firebase.json
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/
│   │   ├── lib/
│   │   └── app/
└── LICENSE
```

### Key Components

- `src/components/ui`: Reusable UI components (buttons, forms, modals)
- `src/lib`: Core utilities and Firebase configuration
- `src/app`: Application routes and page components
- `next.config.ts`: Next.js configuration settings
- `firebase.json`: Firebase hosting and configuration
- `tailwind.config.js`: TailwindCSS theme customization

## Features

- **Secure Resume Management**
  - Upload and store resumes in PDF format
  - Generate unique sharing links
  - Set custom access controls and expiration dates

- **Enhanced Sharing Options**
  - QR code generation for easy mobile access
  - Direct download links for recruiters
  - Social media integration

- **Modern User Interface**
  - Responsive design for all devices
  - Dark/light mode support
  - Customizable themes via TailwindCSS

## Technology Stack

### Frontend
- Next.js 14
- React 18
- TypeScript 5
- TailwindCSS 3

### Backend & Services
- Firebase Storage
- Firebase Firestore
- Firebase Authentication

### Utilities
- Radix UI Components
- Lucide Icons
- QR Code Generation Library

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm or yarn package manager
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hiremepls.com.git
cd hiremepls.com
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
This project uses Firebase. If you wish to test the functionality locally you may need to set up your own [Firebase Project](https://firebase.google.com/). Afterwards, Create a `.env.local` file in the root directory with the following keys from your project:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
NEXT_PUBLIC_FIREBASE_COLLECTION_NAME=your-collection
NEXT_PUBLIC_STORAGE_FOLDER=your-folder
NEXT_PUBLIC_DEFAULT_DELETION_CODE=your-deletion-code
```

4. Start the development server:
```bash
npm run dev
```

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Create production build
- `npm run start`: Run production server
- `npm run lint`: Run ESLint checks
- `npm run test`: Execute test suite

### Code Structure

- Pages and Routes:
  - `src/app/upload/page.tsx`: Resume upload interface
  - `src/app/[hash]/page.tsx`: Resume viewing page
  - `src/app/search/page.tsx`: Search functionality

- Components:
  - `src/components/ui/`: Shared UI components
  - `src/lib/`: Utility functions and configurations

### Best Practices

- Run linting before commits: `npm run lint`
- Follow TypeScript strict mode guidelines
- Maintain component documentation
- Write unit tests for new features

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to Firebase:
```bash
firebase deploy
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

3. Commit your changes:
```bash
git commit -m 'Add some feature'
```

4. Push to your branch:
```bash
git push origin feature/your-feature-name
```

5. Submit a pull request

### Pull Request Guidelines

- Include a clear description of changes
- Add tests for new features
- Ensure all tests pass
- Update documentation as needed
- Post screenshots of your changes on the pull-request channel on the discord server!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
