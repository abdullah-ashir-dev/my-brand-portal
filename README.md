# Barter Exchange - Skill Trading Platform

Exchange Skills, Not Money. A professional, ultra-premium barter exchange app built with React, Vite, Tailwind CSS, and Firebase.

## Features

- **Home Page** - Hero section, stats, how it works, recent listings
- **Explore Page** - Browse all listings with search and category filters
- **Post Page** - Create or edit skill exchange listings
- **My Listings** - Manage your own listings (edit/delete)
- **Profile Page** - View and edit your profile, account info
- **Real-time Updates** - Listings update in real-time via Firebase
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Premium Dark Theme** - Glassmorphism cards, gradient accents, smooth animations

## Tech Stack

- **React 18** - UI framework
- **Vite 6** - Build tool
- **Tailwind CSS 3** - Styling
- **Firebase** - Database (Firestore) & Authentication (Anonymous)
- **Lucide React** - Icons
- **Vercel** - Deployment

## Quick Setup

### Step 1: Install Node.js
Download and install Node.js from https://nodejs.org (LTS version recommended)

### Step 2: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Create a project"** (e.g., name it "barter-exchange")
3. Go to **Project Settings** (gear icon, top left) > **General** tab
4. Scroll to **"Your apps"** > Click the **Web icon** (</>)
5. Give it a nickname > Click **"Register app"**
6. **COPY** the `firebaseConfig` object that appears
7. **PASTE** it into `src/App.jsx` replacing the placeholder values
8. Go to **"Firestore Database"** in the left sidebar
9. Click **"Create database"** > Choose **"Start in test mode"** > Pick a location > **Done**

### Step 3: Install & Run

Open a terminal/command prompt and run:

```bash
# Navigate to the project folder
cd barter-exchange-app

# Install all dependencies
npm install

# Start the development server
npm run dev
```

The app will open at http://localhost:3000

### Step 4: Deploy to Vercel

1. Push your code to a GitHub repository
2. Go to https://vercel.com
3. Sign in with your GitHub account
4. Click **"Add New" > "Project"**
5. Import your GitHub repository
6. Click **"Deploy"**
7. Done! Your app is live on the internet

## How to Add Features

This app uses a **single-file architecture**. To add or modify features, you only need to edit `src/App.jsx`. All other files stay the same.

### File Structure

```
barter-exchange-app/
├── package.json          # Dependencies (DO NOT CHANGE)
├── vite.config.js        # Build config (DO NOT CHANGE)
├── tailwind.config.js    # Tailwind theme (optional to change)
├── postcss.config.js     # PostCSS config (DO NOT CHANGE)
├── vercel.json           # Vercel deploy config (DO NOT CHANGE)
├── index.html            # HTML entry point (DO NOT CHANGE)
├── .gitignore            # Git ignore rules (DO NOT CHANGE)
├── src/
│   ├── main.jsx          # React entry point (DO NOT CHANGE)
│   ├── index.css         # Global styles (optional to change)
│   └── App.jsx           # THE ONLY FILE TO UPDATE
```

### App.jsx Sections

The file is organized into clearly labeled sections:

1. **SECTION 1: Imports** - React, Firebase, Lucide icons
2. **SECTION 2: Firebase Configuration** - Your Firebase config (replace placeholders)
3. **SECTION 3: Constants & Categories** - Add new categories here
4. **SECTION 4: Helper Functions** - timeAgo, getInitials, etc.
5. **SECTION 5: Small Reusable Components** - Toast, Modal, Skeleton, SkillCard
6. **SECTION 6: Page Components** - Home, Explore, Post, MyListings, Profile
7. **SECTION 7: Main App Component** - State, auth, data, navigation
8. **SECTION 8: Main Layout (JSX)** - Header, Sidebar, Bottom Nav, Modals

### Adding a New Page

To add a new page/tab:

1. In **SECTION 6**, create a new component:
```jsx
function NewPage({ listings, userId }) {
  return (
    <div className="page-enter">
      <h2 className="text-2xl font-bold text-white mb-6">New Page</h2>
      {/* Your content here */}
    </div>
  );
}
```

2. In **SECTION 7**, add the new tab to the `tabs` array:
```jsx
{ id: 'newpage', label: 'New Page', icon: Star },
```

3. In **SECTION 7**, add a case in `renderPage()`:
```jsx
case 'newpage':
  return <NewPage listings={listings} userId={userId} />;
```

### Adding a New Category

In **SECTION 3**, add to the `CATEGORIES` array:
```jsx
{ id: 'newcat', label: 'New Category', icon: SomeIcon, color: 'text-rose-400' },
```

And add its style to `CATEGORY_STYLES`:
```jsx
newcat: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
```

## Firestore Data Structure

### Collection: listings
```json
{
  "id": "auto-generated",
  "userName": "Ashir Raza",
  "userId": "firebase-uid",
  "skillOffered": "Logo Design",
  "skillWanted": "Web Development Help",
  "category": "design",
  "description": "I can design professional logos...",
  "contactInfo": "WhatsApp: 0312-xxxxxxx",
  "createdAt": "firebase-timestamp",
  "updatedAt": "firebase-timestamp"
}
```

## Future Feature Ideas

- Exchange request system (accept/decline)
- Chat/messaging between users
- Ratings and reviews
- Push notifications
- User profiles with portfolio
- Location-based filtering
- Image uploads for listings
- Dark/Light theme toggle
- Multi-language support

## License

MIT - Use freely for personal or commercial projects.
