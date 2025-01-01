# hiremepls.com

This repository hosts the source code for hiremepls.com, a web application built with Next.js to facilitate resume sharing and management.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Development Guide](#development-guide)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

### Key Folders and Files

- `src/components/ui`: Shared UI components like buttons, alerts, and input fields.
- `src/lib`: Utility functions and Firebase configuration.
- `src/app`: Application pages and layouts.
- `next.config.ts`: Next.js configuration.
- `firebase.json`: Firebase hosting configuration.
- `tailwind.config.js`: TailwindCSS configuration.

## Features

- **Resume Upload and Sharing**: Upload resumes as PDF files and generate shareable links.
- **QR Code Generation**: Create and download QR codes for shared resumes.
- **Firebase Integration**: Store resumes in Firebase Storage and manage metadata in Firestore.
- **TailwindCSS**: Responsive and modern UI with customizable themes.

## Technologies Used

- **Frontend**: Next.js, React, TypeScript
- **Styling**: TailwindCSS
- **Backend**: Firebase (Firestore, Storage)
- **Utilities**: Radix UI, Lucide Icons

## Setup and Installation

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/jok4/hiremepls.com.git
    cd hiremepls.com
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:  
   This project uses Firebase. If you wish to test the functionality locally you may need to set up your own [Firebase Project](https://firebase.google.com/). Afterwards Create a `.env.local` file in the root directory with the following keys from your project:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=<your-firebase-api-key>
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-firebase-project-id>
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-firebase-messaging-sender-id>
   NEXT_PUBLIC_FIREBASE_APP_ID=<your-firebase-app-id>
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<your-firebase-measurement-id>
   NEXT_PUBLIC_FIREBASE_COLLECTION_NAME=<your-collection-name>
   NEXT_PUBLIC_STORAGE_FOLDER=<your-storage-folder>
   NEXT_PUBLIC_DEFAULT_DELETION_CODE=<your-default-deletion-code>
