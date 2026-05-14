// ============================================
// BARTER EXCHANGE APP - App.jsx
// ============================================
// THIS IS THE ONLY FILE YOU NEED TO UPDATE!
// All features, pages, and components are here.
// Other files (main.jsx, index.css, etc.) stay the same.
// To add new features, just edit this file.
// ============================================

// ============================================
// SECTION 1: IMPORTS
// ============================================
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import {
  Home, Search, PlusCircle, User, ArrowRight,
  ArrowLeftRight, Edit3, Trash2, Send, Check, X,
  Clock, Layers, Sparkles, Zap, Globe, Palette,
  Code, Briefcase, Languages, Music, GraduationCap,
  Heart, Camera, PenTool, MoreHorizontal, LogOut,
  TrendingUp, Users, Award, Loader2, MessageCircle,
  AlertCircle
} from 'lucide-react';

// ============================================
// SECTION 2: FIREBASE CONFIGURATION
// ============================================
// INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com
// 2. Click "Create a project" -> give it a name (e.g., "barter-exchange")
// 3. Go to "Project Settings" (gear icon top left) -> "General" tab
// 4. Scroll to "Your apps" -> Click the Web icon (</>)
// 5. Give it a nickname -> click "Register app"
// 6. You will see a firebaseConfig object -> COPY it
// 7. PASTE it below, replacing the placeholder values
// 8. Go to "Firestore Database" in left sidebar -> "Create database"
//    -> Choose "Start in test mode" -> pick a location -> Done
// ============================================

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase (DO NOT CHANGE BELOW)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ============================================
// SECTION 3: CONSTANTS & CATEGORIES
// ============================================
// Add new categories here to expand the app!
// Each category needs: id, label, icon, color

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Layers, color: 'text-gray-400' },
  { id: 'design', label: 'Design & Creative', icon: Palette, color: 'text-pink-400' },
  { id: 'tech', label: 'Programming & Tech', icon: Code, color: 'text-blue-400' },
  { id: 'business', label: 'Business & Marketing', icon: Briefcase, color: 'text-amber-400' },
  { id: 'language', label: 'Language & Translation', icon: Languages, color: 'text-green-400' },
  { id: 'music', label: 'Music & Audio', icon: Music, color: 'text-purple-400' },
  { id: 'education', label: 'Education & Tutoring', icon: GraduationCap, color: 'text-cyan-400' },
  { id: 'fitness', label: 'Health & Fitness', icon: Heart, color: 'text-red-400' },
  { id: 'photo', label: 'Photography & Video', icon: Camera, color: 'text-orange-400' },
  { id: 'writing', label: 'Writing & Content', icon: PenTool, color: 'text-teal-400' },
  { id: 'other', label: 'Other', icon: MoreHorizontal, color: 'text-gray-400' },
];

// Get category info by ID
function getCategoryInfo(catId) {
  return CATEGORIES.find(c => c.id === catId) || CATEGORIES[CATEGORIES.length - 1];
}

// Category badge color styles
const CATEGORY_STYLES = {
  all: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  design: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  tech: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  business: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  language: 'bg-green-500/20 text-green-300 border-green-500/30',
  music: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  education: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  fitness: 'bg-red-500/20 text-red-300 border-red-500/30',
  photo: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  writing: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  other: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

// ============================================
// SECTION 4: HELPER FUNCTIONS
// ============================================

// Convert Firestore timestamp to readable time
function timeAgo(timestamp) {
  if (!timestamp) return 'just now';
  try {
    const now = new Date();
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
    return date.toLocaleDateString();
  } catch (e) {
    return 'recently';
  }
}

// Get initials from name for avatar display
function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ============================================
// SECTION 5: SMALL REUSABLE COMPONENTS
// ============================================
// These are small UI pieces used across pages

// --- Toast Notification ---
function Toast({ toast, onClose }) {
  if (!toast.show) return null;

  const colors = {
    success: 'bg-emerald-500/90 border-emerald-400/50',
    error: 'bg-red-500/90 border-red-400/50',
    info: 'bg-blue-500/90 border-blue-400/50',
  };

  return (
    <div className={
      'fixed top-20 right-4 z-[100] ' +
      (colors[toast.type] || colors.info) +
      ' text-white px-5 py-3 rounded-xl border backdrop-blur-sm shadow-2xl flex items-center gap-3 slide-up'
    }>
      {toast.type === 'success' && <Check className="w-5 h-5" />}
      {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
      {toast.type === 'info' && <MessageCircle className="w-5 h-5" />}
      <span className="text-sm font-medium">{toast.message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded-full p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// --- Welcome / Name Modal (shown on first visit) ---
function NameModal({ onSave, currentName }) {
  const [name, setName] = useState(currentName || '');

  const handleSave = () => {
    if (name.trim().length < 2) return;
    onSave(name.trim());
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-strong rounded-2xl p-8 w-full max-w-md slide-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-brand-500/20 flex items-center justify-center">
            <User className="w-6 h-6 text-brand-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Welcome to Barter Exchange!</h2>
            <p className="text-dark-400 text-sm">Set your display name to get started</p>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-dark-300 mb-2">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="Enter your full name..."
            className="w-full bg-dark-800/80 border border-dark-600/50 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all"
            autoFocus
          />
        </div>

        <button
          onClick={handleSave}
          disabled={name.trim().length < 2}
          className="mt-6 w-full bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

// --- Delete Confirmation Modal ---
function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-strong rounded-2xl p-6 w-full max-w-sm slide-up">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-dark-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-dark-700 hover:bg-dark-600 text-white py-2.5 rounded-xl font-medium transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500/80 hover:bg-red-500 text-white py-2.5 rounded-xl font-medium transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Loading Skeleton (shown while data loads) ---
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="glass rounded-2xl p-5 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 w-24 bg-dark-700 rounded-full" />
            <div className="h-5 w-16 bg-dark-700 rounded-full" />
          </div>
          <div className="h-6 w-3/4 bg-dark-700 rounded-lg mb-3" />
          <div className="h-5 w-2/3 bg-dark-700 rounded-lg mb-4" />
          <div className="h-12 w-full bg-dark-700 rounded-lg mb-4" />
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 bg-dark-700 rounded-full" />
            <div className="h-4 w-16 bg-dark-700 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Empty State (shown when no data) ---
function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-dark-800/80 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-dark-500" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-dark-400 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}

// --- Skill Card (displays one listing) ---
function SkillCard({ listing, onEdit, onDelete, isOwner, onContact }) {
  const catInfo = getCategoryInfo(listing.category);
  const catStyle = CATEGORY_STYLES[listing.category] || CATEGORY_STYLES.other;
  const CatIcon = catInfo.icon;

  return (
    <div className="glass rounded-2xl p-5 hover:bg-white/[0.08] transition-all duration-300 group">
      {/* Category badge + time */}
      <div className="flex items-center justify-between mb-4">
        <span className={
          'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ' +
          catStyle
        }>
          <CatIcon className="w-3 h-3" />
          {catInfo.label}
        </span>
        <span className="flex items-center gap-1 text-xs text-dark-500">
          <Clock className="w-3 h-3" />
          {timeAgo(listing.createdAt)}
        </span>
      </div>

      {/* Skill offered (green) + Skill wanted (blue) */}
      <div className="mb-3">
        <div className="flex items-start gap-2 mb-2">
          <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <div>
            <p className="text-xs text-dark-500 uppercase tracking-wider font-medium">I Offer</p>
            <p className="text-white font-semibold text-lg leading-tight">{listing.skillOffered}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="mt-1.5 w-2 h-2 rounded-full bg-sky-400 shrink-0" />
          <div>
            <p className="text-xs text-dark-500 uppercase tracking-wider font-medium">I Want</p>
            <p className="text-white font-semibold text-lg leading-tight">{listing.skillWanted}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      {listing.description && (
        <p className="text-dark-400 text-sm mb-4 line-clamp-2">{listing.description}</p>
      )}

      {/* Contact info */}
      {listing.contactInfo && (
        <div className="flex items-center gap-2 text-sm text-dark-400 mb-4 bg-dark-800/50 rounded-lg px-3 py-2">
          <Send className="w-3.5 h-3.5 text-brand-400" />
          <span className="truncate">{listing.contactInfo}</span>
        </div>
      )}

      {/* Bottom: user name + actions */}
      <div className="flex items-center justify-between pt-3 border-t border-dark-700/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
            {getInitials(listing.userName)}
          </div>
          <span className="text-sm text-dark-300 font-medium">{listing.userName}</span>
        </div>

        {isOwner ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(listing)}
              className="p-2 rounded-lg hover:bg-dark-700/80 text-dark-400 hover:text-brand-400 transition-all"
              title="Edit"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(listing)}
              className="p-2 rounded-lg hover:bg-red-500/20 text-dark-400 hover:text-red-400 transition-all"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onContact(listing)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 text-brand-400 text-sm font-medium transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Contact
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================
// SECTION 6: PAGE COMPONENTS
// ============================================
// Each tab/page is a separate component below.
// To add a NEW page, create a new component here
// and add it to the tabs array in the App component.

// --- HOME PAGE ---
function HomePage({ listings, setActiveTab, userName }) {
  const recentListings = listings.slice(0, 3);
  const uniqueUsers = new Set(listings.map(l => l.userId)).size;

  return (
    <div className="page-enter">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl p-8 md:p-12 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-purple-600/10 to-dark-900" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Skill Trading Platform</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black mb-4">
            <span className="gradient-text">Barter Exchange</span>
          </h1>
          <p className="text-dark-300 text-lg md:text-xl mb-2 max-w-2xl">
            Exchange Skills, Not Money.
          </p>
          <p className="text-dark-500 text-sm md:text-base mb-8 max-w-xl">
            {userName ? 'Welcome back, ' + userName + '! ' : ''}
            Post what you know, find what you need. Trade your expertise with our community.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('explore')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all glow-sm"
            >
              Explore Skills
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('post')}
              className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Post Your Skill
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
        {[
          { label: 'Skills Listed', value: listings.length, icon: Layers, color: 'text-brand-400' },
          { label: 'Community', value: uniqueUsers, icon: Users, color: 'text-emerald-400' },
          { label: 'Categories', value: CATEGORIES.length - 1, icon: TrendingUp, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-4 text-center">
            <stat.icon className={'w-5 h-5 ' + stat.color + ' mx-auto mb-1'} />
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-dark-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              step: '01',
              title: 'Post Your Skill',
              desc: 'Share what you are great at and what you would like to learn or exchange.',
              icon: PlusCircle,
              color: 'from-brand-500 to-brand-600'
            },
            {
              step: '02',
              title: 'Browse & Discover',
              desc: 'Explore skills from our community. Filter by category to find your perfect match.',
              icon: Search,
              color: 'from-purple-500 to-purple-600'
            },
            {
              step: '03',
              title: 'Connect & Exchange',
              desc: 'Reach out to people, negotiate terms, and exchange your skills with each other!',
              icon: ArrowLeftRight,
              color: 'from-emerald-500 to-emerald-600'
            },
          ].map((item, i) => (
            <div key={i} className="glass rounded-2xl p-6 hover:bg-white/[0.08] transition-all group">
              <div className={
                'w-12 h-12 rounded-xl bg-gradient-to-br ' +
                item.color +
                ' flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'
              }>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-xs font-bold text-dark-500 mb-1">STEP {item.step}</div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-dark-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Listings */}
      {recentListings.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Recent Listings
            </h2>
            <button
              onClick={() => setActiveTab('explore')}
              className="text-sm text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentListings.map(listing => (
              <SkillCard key={listing.id} listing={listing} onContact={() => {}} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- EXPLORE PAGE ---
function ExplorePage({ listings, userId, onContact }) {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Filter listings based on search query and category
  const filtered = listings.filter(l => {
    const query = search.toLowerCase();
    const matchesSearch = !search ||
      l.skillOffered.toLowerCase().includes(query) ||
      l.skillWanted.toLowerCase().includes(query) ||
      l.userName.toLowerCase().includes(query) ||
      (l.description && l.description.toLowerCase().includes(query));
    const matchesCat = selectedCat === 'all' || l.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="page-enter">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills, people, categories..."
            className="w-full bg-dark-800/80 border border-dark-700/50 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isActive = selectedCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ' +
                (isActive
                  ? 'bg-brand-500/30 text-brand-300 border border-brand-500/40'
                  : 'glass text-dark-400 hover:text-white hover:bg-white/10')
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <p className="text-sm text-dark-500 mb-4">
        {filtered.length} {filtered.length === 1 ? 'listing' : 'listings'} found
      </p>

      {/* Listings Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(listing => (
            <SkillCard
              key={listing.id}
              listing={listing}
              isOwner={listing.userId === userId}
              onContact={onContact}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No listings found"
          description={
            search || selectedCat !== 'all'
              ? 'Try adjusting your search or category filter'
              : 'Be the first to post a skill exchange!'
          }
        />
      )}
    </div>
  );
}

// --- POST / EDIT PAGE ---
function PostPage({ userName, userId, onPostSuccess, editingListing, onCancelEdit }) {
  const [form, setForm] = useState({
    skillOffered: '',
    skillWanted: '',
    category: '',
    description: '',
    contactInfo: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Pre-fill form when editing
  useEffect(() => {
    if (editingListing) {
      setForm({
        skillOffered: editingListing.skillOffered || '',
        skillWanted: editingListing.skillWanted || '',
        category: editingListing.category || '',
        description: editingListing.description || '',
        contactInfo: editingListing.contactInfo || '',
      });
    }
  }, [editingListing]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form before submitting
  const validate = () => {
    const newErrors = {};
    if (!form.skillOffered.trim() || form.skillOffered.trim().length < 3) {
      newErrors.skillOffered = 'Please enter at least 3 characters';
    }
    if (!form.skillWanted.trim() || form.skillWanted.trim().length < 3) {
      newErrors.skillWanted = 'Please enter at least 3 characters';
    }
    if (!form.category) {
      newErrors.category = 'Please select a category';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const listingData = {
        userName,
        userId,
        skillOffered: form.skillOffered.trim(),
        skillWanted: form.skillWanted.trim(),
        category: form.category,
        description: form.description.trim(),
        contactInfo: form.contactInfo.trim(),
        updatedAt: serverTimestamp(),
      };

      if (editingListing) {
        // UPDATE existing listing
        const ref = doc(db, 'listings', editingListing.id);
        await updateDoc(ref, listingData);
        onPostSuccess('Listing updated successfully!');
        onCancelEdit();
      } else {
        // CREATE new listing
        listingData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'listings'), listingData);
        onPostSuccess('Skill posted successfully!');
      }

      // Reset form
      setForm({
        skillOffered: '',
        skillWanted: '',
        category: '',
        description: '',
        contactInfo: '',
      });
    } catch (err) {
      console.error('Error saving listing:', err);
      onPostSuccess('Error saving listing. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Input field styling helper
  const inputClass = (field) => {
    return (
      'w-full bg-dark-800/80 border rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all ' +
      (errors[field]
        ? 'border-red-500/50 focus:border-red-500/50'
        : 'border-dark-600/50 focus:border-brand-500/50')
    );
  };

  return (
    <div className="page-enter max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
          {editingListing
            ? <Edit3 className="w-6 h-6 text-white" />
            : <PlusCircle className="w-6 h-6 text-white" />
          }
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            {editingListing ? 'Edit Listing' : 'Post Your Skill'}
          </h2>
          <p className="text-dark-400 text-sm">
            {editingListing
              ? 'Update your skill exchange listing'
              : 'Share your skills and find what you need'
            }
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-5">
        {/* Skill Offered */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Skill You Offer
            </span>
          </label>
          <input
            type="text"
            value={form.skillOffered}
            onChange={(e) => handleChange('skillOffered', e.target.value)}
            placeholder="e.g., Logo Design, Web Development, Guitar Lessons..."
            className={inputClass('skillOffered')}
          />
          {errors.skillOffered && (
            <p className="text-red-400 text-xs mt-1">{errors.skillOffered}</p>
          )}
        </div>

        {/* Skill Wanted */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              Skill You Want
            </span>
          </label>
          <input
            type="text"
            value={form.skillWanted}
            onChange={(e) => handleChange('skillWanted', e.target.value)}
            placeholder="e.g., Mobile App Help, English Speaking, Photography..."
            className={inputClass('skillWanted')}
          />
          {errors.skillWanted && (
            <p className="text-red-400 text-xs mt-1">{errors.skillWanted}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Category</label>
          <select
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={
              inputClass('category') +
              ' appearance-none cursor-pointer' +
              (!form.category ? ' text-dark-500' : '')
            }
          >
            <option value="" disabled>Select a category...</option>
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-400 text-xs mt-1">{errors.category}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Description (optional)</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Tell people more about your skill, experience level, availability..."
            rows={4}
            className="w-full bg-dark-800/80 border border-dark-600/50 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
          />
        </div>

        {/* Contact Info */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">Contact Info (optional)</label>
          <input
            type="text"
            value={form.contactInfo}
            onChange={(e) => handleChange('contactInfo', e.target.value)}
            placeholder="e.g., WhatsApp: 0312-xxxxxxx, email, Discord..."
            className="w-full bg-dark-800/80 border border-dark-600/50 rounded-xl px-4 py-3 text-white placeholder-dark-500 focus:outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
          <p className="text-dark-600 text-xs mt-1">This will be visible to everyone</p>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-2">
          {editingListing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-6 py-3 glass hover:bg-white/10 text-dark-300 font-medium rounded-xl transition-all"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : editingListing ? (
              'Update Listing'
            ) : (
              <>
                <Send className="w-4 h-4" />
                Post Skill
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- MY LISTINGS PAGE ---
function MyListingsPage({ listings, userId, onEdit, onDelete, setActiveTab }) {
  const myListings = listings.filter(l => l.userId === userId);

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">My Listings</h2>
          <p className="text-dark-400 text-sm">
            {myListings.length} {myListings.length === 1 ? 'listing' : 'listings'}
          </p>
        </div>
        <button
          onClick={() => setActiveTab('post')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-all text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          New
        </button>
      </div>

      {myListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myListings.map(listing => (
            <SkillCard
              key={listing.id}
              listing={listing}
              isOwner={true}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="No listings yet"
          description="You haven't posted any skills yet. Start by posting your first skill exchange!"
          action={
            <button
              onClick={() => setActiveTab('post')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Post Your First Skill
            </button>
          }
        />
      )}
    </div>
  );
}

// --- PROFILE PAGE ---
function ProfilePage({ userName, userId, listings, onUpdateName, onLogout }) {
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(userName);
  const myListings = listings.filter(l => l.userId === userId);

  const handleSave = () => {
    if (newName.trim().length >= 2) {
      onUpdateName(newName.trim());
      setEditing(false);
    }
  };

  return (
    <div className="page-enter max-w-lg mx-auto">
      {/* Profile Header */}
      <div className="glass rounded-2xl p-8 text-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 via-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white mx-auto mb-4 glow">
          {getInitials(userName)}
        </div>

        {editing ? (
          <div className="flex items-center gap-2 justify-center mt-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="bg-dark-800/80 border border-dark-600/50 rounded-xl px-4 py-2 text-white text-center focus:outline-none focus:border-brand-500/50"
              autoFocus
            />
            <button onClick={handleSave} className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setEditing(false); setNewName(userName); }}
              className="p-2 rounded-lg bg-dark-700 text-dark-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-white">{userName || 'Anonymous'}</h2>
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1 text-sm text-dark-400 hover:text-brand-400 mt-1 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit name
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="glass rounded-xl p-4 text-center">
          <Layers className="w-5 h-5 text-brand-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">{myListings.length}</p>
          <p className="text-xs text-dark-500">My Listings</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <Award className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-dark-500">Exchanges</p>
        </div>
      </div>

      {/* Account Info */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Account Info</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-dark-400">User ID</span>
            <span className="text-xs text-dark-500 font-mono bg-dark-800 px-2 py-1 rounded">
              {userId ? userId.slice(0, 16) + '...' : 'Loading...'}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-dark-400">Platform</span>
            <span className="text-sm text-dark-300">Barter Exchange v1.0</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-dark-400">Database</span>
            <span className="text-sm text-dark-300">Firebase Firestore</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-dark-800/80 border border-dark-700/50 text-dark-400 hover:text-red-400 hover:border-red-500/30 rounded-xl transition-all text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Reset Account
        </button>
      </div>
    </div>
  );
}

// ============================================
// SECTION 7: MAIN APP COMPONENT
// ============================================
// This is the root component that ties everything together.
// It manages: auth, data, navigation, modals, and state.

export default function App() {
  // ---- STATE VARIABLES ----
  const [activeTab, setActiveTab] = useState('home');    // Current active tab/page
  const [listings, setListings] = useState([]);           // All listings from Firestore
  const [loading, setLoading] = useState(true);           // Loading state
  const [userName, setUserName] = useState(               // User display name
    () => localStorage.getItem('barterUserName') || ''
  );
  const [userId, setUserId] = useState('');               // Firebase anonymous user ID
  const [showNameModal, setShowNameModal] = useState(false); // Show welcome modal
  const [toast, setToast] = useState({                    // Toast notification state
    show: false, message: '', type: 'success'
  });
  const [editingListing, setEditingListing] = useState(null); // Listing being edited
  const [deleteTarget, setDeleteTarget] = useState(null);     // Listing to delete
  const [contactInfo, setContactInfo] = useState(null);       // Contact info to show

  // ---- FIREBASE AUTH ----
  // Sign in anonymously on app load
  useEffect(() => {
    signInAnonymously(auth).catch(console.error);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Show name modal if user has no name yet
  useEffect(() => {
    if (userId && !userName) {
      setShowNameModal(true);
    }
  }, [userId, userName]);

  // ---- FIRESTORE REAL-TIME LISTENER ----
  // Automatically updates when listings change
  useEffect(() => {
    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setListings(data);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore error:', err);
        setListings([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ---- HELPER FUNCTIONS ----

  // Show a toast notification
  const showToast = (message, type) => {
    type = type || 'success';
    setToast({ show: true, message: message, type: type });
    setTimeout(function () {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Save user name
  const handleSaveName = (name) => {
    setUserName(name);
    localStorage.setItem('barterUserName', name);
    setShowNameModal(false);
    showToast('Welcome, ' + name + '!');
  };

  // After posting/updating a listing
  const handlePostSuccess = (message, type) => {
    type = type || 'success';
    showToast(message, type);
    if (type === 'success' && !editingListing) {
      setActiveTab('my');
    }
  };

  // Start editing a listing
  const handleEdit = (listing) => {
    setEditingListing(listing);
    setActiveTab('post');
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingListing(null);
  };

  // Confirm and delete a listing
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(db, 'listings', deleteTarget.id));
      showToast('Listing deleted');
    } catch (err) {
      showToast('Error deleting listing', 'error');
    }
    setDeleteTarget(null);
  };

  // Show contact info modal
  const handleContact = (listing) => {
    if (listing.contactInfo) {
      setContactInfo(listing);
    } else {
      showToast('No contact info provided for this listing', 'info');
    }
  };

  // Reset account (clear name, show welcome modal again)
  const handleLogout = () => {
    localStorage.removeItem('barterUserName');
    setUserName('');
    setShowNameModal(true);
    setActiveTab('home');
    showToast('Account reset');
  };

  // ---- NAVIGATION TABS ----
  // To add a new tab/page:
  // 1. Create a new component in SECTION 6
  // 2. Add it to this array
  // 3. Add a case in renderPage() below
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'post', label: 'Post', icon: PlusCircle },
    { id: 'my', label: 'My Listings', icon: Layers },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // ---- RENDER ACTIVE PAGE ----
  const renderPage = () => {
    if (loading) return <LoadingSkeleton />;

    switch (activeTab) {
      case 'home':
        return <HomePage listings={listings} setActiveTab={setActiveTab} userName={userName} />;
      case 'explore':
        return <ExplorePage listings={listings} userId={userId} onContact={handleContact} />;
      case 'post':
        return (
          <PostPage
            userName={userName}
            userId={userId}
            onPostSuccess={handlePostSuccess}
            editingListing={editingListing}
            onCancelEdit={handleCancelEdit}
          />
        );
      case 'my':
        return (
          <MyListingsPage
            listings={listings}
            userId={userId}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
            setActiveTab={setActiveTab}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            userName={userName}
            userId={userId}
            listings={listings}
            onUpdateName={function (name) {
              setUserName(name);
              localStorage.setItem('barterUserName', name);
              showToast('Name updated!');
            }}
            onLogout={handleLogout}
          />
        );
      default:
        return <HomePage listings={listings} setActiveTab={setActiveTab} userName={userName} />;
    }
  };

  // ============================================
  // SECTION 8: MAIN LAYOUT (JSX)
  // ============================================
  return (
    <div className="min-h-screen bg-dark-950 text-white">

      {/* ===== TOP HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 glass-strong border-b border-dark-700/30">
        <div className="h-full flex items-center justify-between px-4 md:px-6 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">
                Barter<span className="text-brand-400">Exchange</span>
              </h1>
              <p className="text-[10px] text-dark-500 leading-tight hidden sm:block">
                Skills, Not Money
              </p>
            </div>
          </div>

          {userName && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/30 to-purple-600/30 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-300">
                {getInitials(userName)}
              </div>
              <span className="text-sm text-dark-300 hidden sm:block">{userName}</span>
            </div>
          )}
        </div>
      </header>

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-20 lg:w-64 flex-col glass-strong border-r border-dark-700/30 z-40">
        <nav className="flex-1 py-4 px-2 lg:px-3">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={function () {
                  setActiveTab(tab.id);
                  setEditingListing(null);
                }}
                className={
                  'w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 transition-all group ' +
                  (isActive
                    ? 'bg-brand-500/20 text-brand-300'
                    : 'text-dark-500 hover:text-white hover:bg-white/5')
                }
              >
                <Icon className={
                  'w-5 h-5 shrink-0 ' +
                  (isActive ? 'text-brand-400' : 'group-hover:text-white')
                } />
                <span className="hidden lg:block text-sm font-medium">{tab.label}</span>
                {isActive && (
                  <span className="hidden lg:block w-1.5 h-1.5 rounded-full bg-brand-400 ml-auto" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 lg:p-4 border-t border-dark-700/30">
          <div className="glass rounded-xl p-3 lg:p-4">
            <p className="text-xs text-dark-500 hidden lg:block mb-2">Need help?</p>
            <p className="text-xs text-dark-400 hidden lg:block">
              Check the README.md for setup instructions and how to add features.
            </p>
            <Sparkles className="w-5 h-5 text-brand-400 mx-auto lg:mx-0" />
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT AREA ===== */}
      <main className="pt-16 min-h-screen md:ml-20 lg:ml-64 pb-20 md:pb-6">
        <div className="p-4 md:p-6 lg:p-8 max-w-[1200px]">
          {renderPage()}
        </div>
      </main>

      {/* ===== MOBILE BOTTOM NAVIGATION ===== */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-dark-700/30">
        <div className="flex items-center justify-around h-16 px-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={function () {
                  setActiveTab(tab.id);
                  setEditingListing(null);
                }}
                className={
                  'flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ' +
                  (isActive ? 'text-brand-400' : 'text-dark-500')
                }
              >
                <div className={'p-1 rounded-lg transition-all ' + (isActive ? 'bg-brand-500/20' : '')}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ===== MODALS ===== */}
      {/* Toast Notification */}
      <Toast
        toast={toast}
        onClose={function () {
          setToast({ show: false, message: '', type: 'success' });
        }}
      />

      {/* Welcome / Name Modal */}
      {showNameModal && <NameModal onSave={handleSaveName} currentName={userName} />}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Listing?"
          message={
            'Are you sure you want to delete "' +
            deleteTarget.skillOffered +
            '"? This action cannot be undone.'
          }
          onConfirm={handleDeleteConfirm}
          onCancel={function () { setDeleteTarget(null); }}
        />
      )}

      {/* Contact Info Modal */}
      {contactInfo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-sm slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Contact Info</h3>
                <p className="text-dark-400 text-sm">{contactInfo.userName}</p>
              </div>
            </div>
            <div className="bg-dark-800/50 rounded-xl p-4 mb-4">
              <p className="text-white">{contactInfo.contactInfo}</p>
            </div>
            <div className="text-sm text-dark-400 mb-4">
              <p className="mb-1">
                <span className="text-emerald-400 font-medium">Offers:</span> {contactInfo.skillOffered}
              </p>
              <p>
                <span className="text-sky-400 font-medium">Wants:</span> {contactInfo.skillWanted}
              </p>
            </div>
            <button
              onClick={function () { setContactInfo(null); }}
              className="w-full bg-dark-700 hover:bg-dark-600 text-white py-2.5 rounded-xl font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
