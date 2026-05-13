// ============================================================
// FILE: src/App.jsx
// PURPOSE: The ENTIRE SkillSwap app lives in this one file.
//   - We use a simple "currentPage" state instead of a router
//   - Each page is its own component below the main App()
//   - We'll build each page one by one together!
// ============================================================

import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

// ============================================================
// 🏠 MAIN APP COMPONENT — controls which page is shown
// ============================================================
export default function App() {
  // "page" tells us which screen to show
  // Options: "landing", "login", "dashboard", "browse",
  //          "skill-detail", "profile", "chat", "notifications"
  const [currentPage, setCurrentPage] = useState("landing");

  // "user" holds the logged-in user object (null if not logged in)
  const [user, setUser] = useState(null);

  // "loading" prevents a flash of wrong content on startup
  const [loading, setLoading] = useState(true);

  // ✅ Firebase listener: automatically detects login/logout
  // This runs once when the app starts, and updates "user"
  // whenever the auth state changes (login/logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);    // Save the user (or null)
      setLoading(false);        // Done checking auth

      // Auto-redirect: if user logs in, go to dashboard
      // If user logs out, go to landing page
      if (firebaseUser) {
        setCurrentPage("dashboard");
      } else {
        setCurrentPage("landing");
      }
    });

    // Cleanup: stop listening when app unmounts
    return () => unsubscribe();
  }, []);

  // ✅ Navigate function — call this to change pages
  // Example: navigate("browse") takes user to Browse Skills page
  const navigate = (page) => setCurrentPage(page);

  // Show nothing while checking if user is logged in
  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gold font-display">SkillSwap</p>
        </div>
      </div>
    );
  }

  // ✅ Page Router — shows the right page based on currentPage
  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Show different pages based on currentPage state */}
      {currentPage === "landing"       && <LandingPage       navigate={navigate} user={user} />}
      {currentPage === "login"         && <LoginPage         navigate={navigate} />}
      {currentPage === "dashboard"     && <DashboardPage     navigate={navigate} user={user} />}
      {currentPage === "browse"        && <BrowsePage        navigate={navigate} user={user} />}
      {currentPage === "skill-detail"  && <SkillDetailPage   navigate={navigate} user={user} />}
      {currentPage === "profile"       && <ProfilePage       navigate={navigate} user={user} />}
      {currentPage === "chat"          && <ChatPage          navigate={navigate} user={user} />}
      {currentPage === "notifications" && <NotificationsPage navigate={navigate} user={user} />}
    </div>
  );
}

// ============================================================
// 🌐 NAVIGATION BAR — shared across all logged-in pages
// Props: navigate (function), user (object), currentPage
// ============================================================
function Navbar({ navigate, user, currentPage }) {
  return (
    <nav className="border-b border-dark-border sticky top-0 z-50"
         style={{ background: "rgba(10,10,10,0.95)", backdropFilter: "blur(10px)" }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => navigate(user ? "dashboard" : "landing")}
          className="font-display text-xl text-gold hover:text-gold-light transition-colors"
        >
          SkillSwap
        </button>

        {/* Navigation links — only show when logged in */}
        {user && (
          <div className="flex items-center gap-6">
            <NavLink label="Browse"        page="browse"        currentPage={currentPage} navigate={navigate} />
            <NavLink label="Chat"          page="chat"          currentPage={currentPage} navigate={navigate} />
            <NavLink label="Notifications" page="notifications" currentPage={currentPage} navigate={navigate} />
            <NavLink label="Profile"       page="profile"       currentPage={currentPage} navigate={navigate} />
          </div>
        )}
      </div>
    </nav>
  );
}

// Small helper for nav links with active state
function NavLink({ label, page, currentPage, navigate }) {
  const isActive = currentPage === page;
  return (
    <button
      onClick={() => navigate(page)}
      className={`text-sm transition-colors ${
        isActive ? "text-gold font-medium" : "text-gray-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

// ============================================================
// PAGE 1: 🏠 LANDING PAGE
// Status: Placeholder — we'll build the full version next!
// ============================================================
function LandingPage({ navigate, user }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="font-display text-5xl gradient-text mb-4">SkillSwap</h1>
      <p className="text-gray-400 text-lg mb-8">Exchange skills, not money.</p>
      <div className="flex gap-4">
        <button className="btn-gold" onClick={() => navigate("login")}>
          Get Started
        </button>
        <button className="btn-outline" onClick={() => navigate("browse")}>
          Browse Skills
        </button>
      </div>
    </div>
  );
}

// ============================================================
// PAGE 2: 🔐 LOGIN / SIGNUP PAGE
// Status: Placeholder — coming in Phase 2
// ============================================================
function LoginPage({ navigate }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="card-dark p-8 w-full max-w-md text-center">
        <h2 className="font-display text-2xl text-gold mb-2">Welcome Back</h2>
        <p className="text-gray-400 mb-6">Sign in to SkillSwap</p>
        <p className="text-gray-500 text-sm">
          🔨 Login page coming in Phase 2
        </p>
        <button
          onClick={() => navigate("landing")}
          className="btn-outline mt-6 w-full justify-center"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

// ============================================================
// PAGE 3: 📊 DASHBOARD
// Status: Placeholder — coming in Phase 3
// ============================================================
function DashboardPage({ navigate, user }) {
  return (
    <div>
      <Navbar navigate={navigate} user={user} currentPage="dashboard" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl text-gold mb-2">
          Welcome, {user?.displayName || "Skill Swapper"}!
        </h1>
        <p className="text-gray-400">🔨 Dashboard coming in Phase 3</p>
      </div>
    </div>
  );
}

// ============================================================
// PAGE 4: 🔍 BROWSE SKILLS
// Status: Placeholder — coming in Phase 4
// ============================================================
function BrowsePage({ navigate, user }) {
  return (
    <div>
      <Navbar navigate={navigate} user={user} currentPage="browse" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl text-gold mb-2">Browse Skills</h1>
        <p className="text-gray-400">🔨 Browse page coming in Phase 4</p>
      </div>
    </div>
  );
}

// ============================================================
// PAGE 5: 📋 SKILL DETAIL
// Status: Placeholder — coming in Phase 5
// ============================================================
function SkillDetailPage({ navigate, user }) {
  return (
    <div>
      <Navbar navigate={navigate} user={user} currentPage="skill-detail" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl text-gold mb-2">Skill Detail</h1>
        <p className="text-gray-400">🔨 Skill detail coming in Phase 5</p>
      </div>
    </div>
  );
}

// ============================================================
// PAGE 6: 👤 MY PROFILE
// Status: Placeholder — coming in Phase 6
// ============================================================
function ProfilePage({ navigate, user }) {
  return (
    <div>
      <Navbar navigate={navigate} user={user} currentPage="profile" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl text-gold mb-2">My Profile</h1>
        <p className="text-gray-400">🔨 Profile page coming in Phase 6</p>
      </div>
    </div>
  );
}

// ============================================================
// PAGE 7: 💬 CHAT / MESSAGES
// Status: Placeholder — coming in Phase 7
// ============================================================
function ChatPage({ navigate, user }) {
  return (
    <div>
      <Navbar navigate={navigate} user={user} currentPage="chat" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl text-gold mb-2">Messages</h1>
        <p className="text-gray-400">🔨 Chat coming in Phase 7</p>
      </div>
    </div>
  );
}

// ============================================================
// PAGE 8: 🔔 NOTIFICATIONS
// Status: Placeholder — coming in Phase 8
// ============================================================
function NotificationsPage({ navigate, user }) {
  return (
    <div>
      <Navbar navigate={navigate} user={user} currentPage="notifications" />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl text-gold mb-2">Notifications</h1>
        <p className="text-gray-400">🔨 Notifications coming in Phase 8</p>
      </div>
    </div>
  );
}
