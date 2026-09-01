# Budget Tracker App

A React-based budget tracking application with Firebase authentication and Firestore database integration. Track your income and expenses with real-time data persistence and over-time statistics.

## Features

- **User Authentication**: Sign in with Google using Firebase Authentication
- **Budget Tracking**: Add income and expense transactions with descriptions
- **Real-time Updates**: Changes sync instantly across devices via Firestore
- **Statistics**: View total income, expenses, and net savings over time
- **Monthly Breakdown**: See your financial data organized by month
- **Responsive Design**: Clean, modern UI adapted from the original budget app

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Firebase project

## Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Google Analytics (optional)

2. **Enable Authentication**
   - In Firebase Console, go to "Authentication" → "Sign-in method"
   - Enable "Google" sign-in provider
   - Add your project's authorized domain (localhost for development)
   - Click "Save"

3. **Create Firestore Database**
   - Go to "Firestore Database" → "Create database"
   - Choose "Start in test mode" (for development)
   - Select a location close to your users
   - Click "Create"

4. **Get Firebase Configuration**
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps" section
   - Click the web icon (</>)
   - Register your app (name it "budget-tracker")
   - Copy the firebaseConfig object

5. **Update Firebase Configuration**
   - Open `src/firebaseConfig.js`
   - Replace the placeholder values with your actual Firebase credentials:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_ACTUAL_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

6. **Set Firestore Rules**
   - In Firestore Console, go to "Rules" tab
   - Update rules to secure user data:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /transactions/{transactionId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   - The app will be available at `http://localhost:5173`

## Usage

1. **Sign In**
   - Navigate to `/login`
   - Click "Sign in with Google"
   - Complete the Google authentication flow

2. **Add Transactions**
   - Choose "+" for income or "-" for expense
   - Enter a description
   - Enter the amount
   - Click "Submit"

3. **View Statistics**
   - Scroll down to see over-time statistics
   - View monthly breakdowns
   - Track net savings

4. **Delete Transactions**
   - Hover over any transaction
   - Click the "X" button to delete

## Project Structure

```
src/
├── components/
│   ├── AddTransaction.jsx       # Transaction input form
│   ├── AddTransaction.css
│   ├── auth.css                 # Authentication styles
│   ├── BudgetDisplay.jsx        # Budget summary display
│   ├── BudgetDisplay.css
│   ├── Dashboard.jsx            # Main dashboard component
│   ├── Dashboard.css
│   ├── Login.jsx                # Google sign-in page
│   ├── Statistics.jsx           # Over-time statistics
│   ├── Statistics.css
│   └── TransactionList.jsx      # Transaction list display
│       └── TransactionList.css
├── context/
│   └── AuthContext.jsx          # Authentication context
├── firebaseConfig.js             # Firebase configuration
├── App.jsx                      # Main app with routing
├── index.css                    # Global styles
└── main.jsx                     # React entry point
```

## Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Firebase** - Authentication and database
- **React Router** - Client-side routing
- **Firestore** - NoSQL database for real-time data

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

To deploy this app, you can use:

- **Firebase Hosting**: `firebase deploy`
- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `dist` folder
- Any static hosting service

## Security Notes

- Never commit your actual Firebase credentials to version control
- The `firebaseConfig.js` file contains placeholders - replace with your own credentials
- For production, update Firestore rules to be more restrictive
- Consider implementing additional security measures like email verification

## Troubleshooting

**Firebase Authentication Errors**
- Ensure Google sign-in is enabled in Firebase Console
- Add localhost to authorized domains for development
- Check that your Firebase configuration is correct
- Verify your Firestore rules allow read/write operations

**Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Ensure Node.js version is 16 or higher

**Firestore Connection Issues**
- Verify Firestore database is created
- Check that your location rules are properly configured
- Ensure your Firebase project is not in a suspended state
