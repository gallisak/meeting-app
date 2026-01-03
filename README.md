# Meeting App

A modern web application for managing meetings and schedules, developed as a technical assignment for **Insiders**. This project demonstrates a robust architecture using **React**, global state management with **Redux Toolkit**, and a serverless backend powered by **Firebase**.

## Tech Stack

- **Framework:** [React](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Backend & Database:** [Firebase](https://firebase.google.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Build Tool:** [Vite](https://vitejs.dev/)

## Key Features

- **Dashboard:** View upcoming and past meetings in an organized list.
- **CRUD Operations:** Create, update, and delete meetings seamlessly.
- **Real-time Updates:** Data is synchronized instantly across clients using Firebase.
- **Global State:** Efficient state management ensures smooth data flow and UI consistency.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## Getting Started

Follow these steps to set up the project locally.

### 1. Clone the repository

```bash
git clone [https://github.com/gallisak/meeting-app.git](https://github.com/gallisak/meeting-app.git)
```

### 2. Navigate to the directory

```
cd meeting-app
```

### 3. Install dependencies

```
npm install
# or
yarn install
```

### 4. Configure Firebase

Create a .env file in the root directory of your project and add your Firebase configuration keys. You can find these in your Firebase Console project settings.

```
VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id
VITE_MASUREMENT_Id=your_measurementId
```

### 5. Start the development server

```
npm run dev
```

Created by gallisak
