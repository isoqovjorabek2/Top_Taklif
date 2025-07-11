# TopRaklif - AI-Powered Deals Platform

## Authentication Setup

To enable authentication features, you need to configure the following services:

### Firebase Setup (Google & Facebook Login)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication and configure providers:
   - **Google**: Enable Google provider
   - **Facebook**: Enable Facebook provider and add your Facebook App ID and secret
4. Get your Firebase config and update `src/config/firebase.ts`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### Telegram Bot Setup

1. Create a bot with [@BotFather](https://t.me/botfather)
2. Get your bot token
3. Set up domain for Telegram Login Widget
4. Update the bot name in `AuthModal.tsx`:

```javascript
<TelegramLoginButton
  botName="your_bot_name" // Replace with your bot username
  onAuth={handleTelegramAuth}
  disabled={loading}
/>
```

### Facebook App Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs
5. Get your App ID and App Secret for Firebase configuration

## Features

- ✅ Google OAuth Login
- ✅ Facebook OAuth Login  
- ✅ Telegram Login Widget
- ✅ Email/Password Authentication
- ✅ User Profile Management
- ✅ Persistent Authentication State
- ✅ Beautiful UI with Dark Mode Support

## Usage

1. Install dependencies: `npm install`
2. Configure authentication providers (see above)
3. Start development server: `npm run dev`
4. Users can now register/login with multiple providers

## Security Notes

- Never commit your Firebase config with real credentials to public repositories
- Use environment variables for production deployments
- Implement proper server-side validation for Telegram authentication
- Set up proper CORS and domain restrictions for all providers