# Personal CRM

<div align="center">
  <p>
    <a href="https://nextjs.org">
      <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    </a>
    <a href="https://reactjs.org">
      <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    </a>
    <a href="https://firebase.google.com">
      <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
    </a>
    <a href="https://vercel.com">
      <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
    </a>
  </p>
</div>

A modern, personal CRM built with Next.js, React, and Firebase, featuring a Kanban board interface for efficient pipeline management. Perfect for managing professional contacts and tracking follow-ups.

## Features

- Kanban board interface for visual pipeline management
- Real-time updates using Firebase
- Secure authentication with approved email list
- Follow-up date tracking
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Vercel account (for deployment)

### Installation

1. Clone the repository

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_EMAILS=email1@domain.com,email2@domain.com
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

## Deployment

The application can be easily deployed using Vercel:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel project settings
4. Deploy!

