// ============================================================
// SECTION 1: IMPORTS
// ============================================================
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Home, Compass, MessageSquare, PlusSquare, Heart, List, Trophy, User,
  BarChart2, LogOut, Bell, Search, X, Send, Star, StarHalf, ChevronDown,
  ChevronRight, ChevronLeft, ChevronUp, Eye, Edit, Trash2, Share2, Flag,
  Shield, Lock, Unlock, ArrowUp, Check, AlertCircle, Info, Zap, Award,
  TrendingUp, Users, Layers, Coffee, Code, Music, Camera, Pen, Dumbbell,
  BookOpen, Briefcase, Palette, Globe, Cpu, Languages, Smile, Copy,
  MoreVertical, Clock, Calendar, Filter, SortAsc, Image, Tag, MapPin,
  PhoneCall, Mail, ExternalLink, Flame, RefreshCw, Moon, Sun, Menu,
  ArrowLeft, MessageCircle, Hash, Activity, Target, Upload, Download,
  Sparkles, Crown, Gem, Medal, Gift, ThumbsUp, AlertTriangle, Settings,
  UserPlus, UserX, EyeOff, Key, Trash, CheckCircle, XCircle, Play,
  Maximize2, ZoomIn
} from "lucide-react";
import { initializeApp } from "firebase/app";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut, GoogleAuthProvider,
  signInWithPopup, updateProfile, sendPasswordResetEmail, deleteUser
} from "firebase/auth";
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, where, orderBy, serverTimestamp, getDoc,
  setDoc, getDocs, limit, increment, arrayUnion, arrayRemove
} from "firebase/firestore";

// ============================================================
// SECTION 2: FIREBASE CONFIG
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyAjAgUdBwyu820JqxtAr3546J90trnNImI",
  authDomain: "skillswap-48163.firebaseapp.com",
  projectId: "skillswap-48163",
  storageBucket: "skillswap-48163.firebasestorage.app",
  messagingSenderId: "953886423467",
  appId: "1:953886423467:web:47dcc723d89d9765de7aee"
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();

// ============================================================
// SECTION 3: CONSTANTS
// ============================================================
const CATEGORIES = [
  { id: "tech", label: "Technology", icon: Cpu, color: "from-blue-500 to-cyan-400" },
  { id: "design", label: "Design", icon: Palette, color: "from-pink-500 to-rose-400" },
  { id: "music", label: "Music", icon: Music, color: "from-purple-500 to-violet-400" },
  { id: "photo", label: "Photography", icon: Camera, color: "from-amber-500 to-yellow-400" },
  { id: "writing", label: "Writing", icon: Pen, color: "from-emerald-500 to-teal-400" },
  { id: "fitness", label: "Fitness", icon: Dumbbell, color: "from-red-500 to-orange-400" },
  { id: "education", label: "Education", icon: BookOpen, color: "from-indigo-500 to-blue-400" },
  { id: "business", label: "Business", icon: Briefcase, color: "from-slate-500 to-zinc-400" },
  { id: "language", label: "Languages", icon: Languages, color: "from-teal-500 to-green-400" },
  { id: "cooking", label: "Cooking", icon: Coffee, color: "from-orange-500 to-amber-400" },
  { id: "art", label: "Art", icon: Smile, color: "from-fuchsia-500 to-pink-400" },
  { id: "code", label: "Coding", icon: Code, color: "from-lime-500 to-emerald-400" },
];

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "post", label: "Post", icon: PlusSquare },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "mylistings", label: "My Listings", icon: List },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "profile", label: "Profile", icon: User },
];

const MOBILE_NAV = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "post", label: "Post", icon: PlusSquare },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "profile", label: "Profile", icon: User },
];

const HOW_IT_WORKS = [
  { step: 1, title: "Post Your Skill", desc: "Share what you can offer and what you'd like to learn. No money involved.", icon: PlusSquare, color: "from-indigo-500 to-blue-500" },
  { step: 2, title: "Browse & Match", desc: "Discover skills that match what you want. Filter by category, skill level, and more.", icon: Compass, color: "from-purple-500 to-pink-500" },
  { step: 3, title: "Connect & Exchange", desc: "Message your match, agree on terms, and start your skill exchange journey.", icon: MessageSquare, color: "from-emerald-500 to-teal-500" },
];

const BADGES = [
  { id: "first_step", label: "First Step", desc: "Posted your first listing", icon: Zap, color: "from-blue-400 to-indigo-400" },
  { id: "social_butterfly", label: "Social Butterfly", desc: "Sent 10+ messages", icon: MessageCircle, color: "from-pink-400 to-rose-400" },
  { id: "top_contributor", label: "Top Contributor", desc: "5+ active listings", icon: Award, color: "from-amber-400 to-yellow-400" },
  { id: "community_star", label: "Community Star", desc: "Received 5+ reviews", icon: Star, color: "from-purple-400 to-violet-400" },
  { id: "legendary", label: "Legendary", desc: "Trust Score 90+", icon: Crown, color: "from-yellow-400 to-amber-400" },
  { id: "chatterbox", label: "Chatterbox", desc: "Sent 50+ messages", icon: MessageSquare, color: "from-cyan-400 to-blue-400" },
  { id: "collector", label: "Collector", desc: "Favorited 10+ listings", icon: Heart, color: "from-rose-400 to-pink-400" },
  { id: "on_fire", label: "On Fire", desc: "7-day activity streak", icon: Flame, color: "from-orange-400 to-red-400" },
];

const TITLES = [
  { min: 0, max: 19, label: "Beginner", color: "text-slate-400" },
  { min: 20, max: 39, label: "Exchanger", color: "text-blue-400" },
  { min: 40, max: 59, label: "Expert Trader", color: "text-indigo-400" },
  { min: 60, max: 79, label: "Master", color: "text-purple-400" },
  { min: 80, max: 100, label: "Legend", color: "text-amber-400" },
];

const ACHIEVEMENTS = [
  { id: "a1", title: "First Exchange", desc: "Complete your first skill exchange", target: 1, unit: "exchange" },
  { id: "a2", title: "Listing Pro", desc: "Post 5 listings", target: 5, unit: "listings" },
  { id: "a3", title: "Popular", desc: "Get 100 total views on listings", target: 100, unit: "views" },
  { id: "a4", title: "Social", desc: "Start 5 conversations", target: 5, unit: "chats" },
  { id: "a5", title: "Well Reviewed", desc: "Receive 3 five-star reviews", target: 3, unit: "5-star reviews" },
  { id: "a6", title: "Collector", desc: "Favorite 10 listings", target: 10, unit: "favorites" },
  { id: "a7", title: "Explorer", desc: "Browse all 12 categories", target: 12, unit: "categories" },
  { id: "a8", title: "Networker", desc: "Connect with 10 unique users", target: 10, unit: "connections" },
  { id: "a9", title: "Quick Responder", desc: "Reply within 1 hour, 5 times", target: 5, unit: "quick replies" },
  { id: "a10", title: "Legend", desc: "Reach Trust Score of 90", target: 90, unit: "score" },
];

const MOCK_TESTIMONIALS = [
  { name: "Ayesha K.", title: "Graphic Designer", text: "I traded my design skills for coding lessons. Best decision ever! This platform is amazing.", avatar: "AK", grad: "from-pink-500 to-rose-400", rating: 5 },
  { name: "Bilal R.", title: "Software Engineer", text: "SkillSwap helped me learn guitar without spending a dime. Just exchanged my Python skills!", avatar: "BR", grad: "from-blue-500 to-indigo-400", rating: 5 },
  { name: "Sara M.", title: "Fitness Trainer", text: "Found a photographer to shoot my portfolio in exchange for fitness coaching. Love this!", avatar: "SM", grad: "from-emerald-500 to-teal-400", rating: 5 },
  { name: "Omar H.", title: "Chef", text: "Teaching cooking to a web developer. Now I have my own website. Real barter economy!", avatar: "OH", grad: "from-amber-500 to-orange-400", rating: 4 },
];

const MOCK_STATS = [
  { label: "Skills Listed", value: "12,847", icon: List, color: "from-indigo-500 to-blue-500" },
  { label: "Community Members", value: "5,231", icon: Users, color: "from-purple-500 to-pink-500" },
  { label: "Exchanges Completed", value: "3,912", icon: CheckCircle, color: "from-emerald-500 to-teal-500" },
  { label: "Categories", value: "12", icon: Layers, color: "from-amber-500 to-orange-500" },
];

const SKILL_LEVELS = ["Beginner", "Intermediate", "Expert"];
const EXCHANGE_TYPES = ["In-person", "Online", "Both"];

// ============================================================
// SECTION 4: HELPER FUNCTIONS
// ============================================================
const timeAgo = (ts) => {
  if (!ts) return "just now";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 604800)}w ago`;
};

const getCat = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];

const initials = (name) => {
  if (!name) return "??";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

const USER_GRADS = [
  "from-indigo-500 to-purple-500",
  "from-pink-500 to-rose-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-blue-500 to-cyan-500",
  "from-violet-500 to-fuchsia-500",
  "from-teal-500 to-green-500",
  "from-red-500 to-pink-500",
];

const userGrad = (userId) => {
  if (!userId) return USER_GRADS[0];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  return USER_GRADS[Math.abs(hash) % USER_GRADS.length];
};

const trunc = (text, length = 80) => {
  if (!text) return "";
  return text.length > length ? text.slice(0, length) + "..." : text;
};

const trustScore = (listings = 0, reviews = 0, avgRating = 0) => {
  const score = listings * 1 + reviews * 2 + avgRating * 3;
  return Math.min(Math.round(score), 100);
};

const userTitle = (score) => {
  const t = TITLES.find((t) => score >= t.min && score <= t.max);
  return t || TITLES[0];
};

const todayKey = () => new Date().toISOString().split("T")[0];

const isBlocked = (blockedUsers = [], userId) => blockedUsers.includes(userId);

const heatmapData = (activityLog = {}) => {
  const weeks = 12;
  const days = weeks * 7;
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    result.push({ date: key, count: activityLog[key] || 0 });
  }
  return result;
};

const heatColor = (count) => {
  if (count === 0) return "bg-white/5";
  if (count < 3) return "bg-indigo-900/60";
  if (count < 6) return "bg-indigo-600/70";
  if (count < 10) return "bg-indigo-400/80";
  return "bg-indigo-300";
};

const trendingCats = (listings = []) => {
  const counts = {};
  listings.forEach((l) => { counts[l.category] = (counts[l.category] || 0) + 1; });
  return CATEGORIES
    .map((c) => ({ ...c, count: counts[c.id] || 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
};

const matchingSuggestions = (listings = [], userId, userData = {}) => {
  if (!userId || !userData) return listings.slice(0, 4);
  return listings
    .filter((l) => l.userId !== userId)
    .slice(0, 6);
};

const leaderboardData = (listings = [], reviews = []) => {
  const userMap = {};
  listings.forEach((l) => {
    if (!userMap[l.userId]) userMap[l.userId] = { userId: l.userId, name: l.userName || "User", listings: 0, reviews: 0, totalRating: 0, reviewCount: 0 };
    userMap[l.userId].listings++;
  });
  reviews.forEach((r) => {
    if (!userMap[r.toUserId]) userMap[r.toUserId] = { userId: r.toUserId, name: r.toUserName || "User", listings: 0, reviews: 0, totalRating: 0, reviewCount: 0 };
    userMap[r.toUserId].reviewCount++;
    userMap[r.toUserId].totalRating += r.rating || 0;
  });
  return Object.values(userMap)
    .map((u) => ({ ...u, avgRating: u.reviewCount > 0 ? u.totalRating / u.reviewCount : 0, score: trustScore(u.listings, u.reviewCount, u.reviewCount > 0 ? u.totalRating / u.reviewCount : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
};

const getUnlockedBadges = (score, listings = [], reviews = [], favorites = [], messages = [], streak = 0) => {
  const unlocked = [];
  if (listings.length >= 1) unlocked.push("first_step");
  if (messages.length >= 10) unlocked.push("social_butterfly");
  if (listings.length >= 5) unlocked.push("top_contributor");
  if (reviews.length >= 5) unlocked.push("community_star");
  if (score >= 90) unlocked.push("legendary");
  if (messages.length >= 50) unlocked.push("chatterbox");
  if (favorites.length >= 10) unlocked.push("collector");
  if (streak >= 7) unlocked.push("on_fire");
  return unlocked;
};

const passwordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score: 2, label: "Medium", color: "bg-amber-500" };
  return { score: 3, label: "Strong", color: "bg-emerald-500" };
};

// ============================================================
// SECTION 5: SMALL COMPONENTS
// ============================================================

// Toast Notification
const Toast = ({ toast, onClose }) => {
  const icons = { success: CheckCircle, error: XCircle, info: Info, warning: AlertTriangle };
  const colors = { success: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", error: "text-red-400 border-red-500/30 bg-red-500/10", info: "text-blue-400 border-blue-500/30 bg-blue-500/10", warning: "text-amber-400 border-amber-500/30 bg-amber-500/10" };
  const Icon = icons[toast.type] || Info;
  return (
    <div className={`fixed bottom-24 md:bottom-6 right-4 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl border glass-strong ${colors[toast.type]} shadow-2xl max-w-xs animate-fade-in`} style={{ animation: "slideInRight 0.3s ease" }}>
      <Icon size={18} />
      <span className="text-sm font-medium text-white/90">{toast.message}</span>
      <button onClick={onClose} className="ml-2 text-white/40 hover:text-white/80"><X size={14} /></button>
    </div>
  );
};

// Rating Stars
const RatingStars = ({ rating = 0, size = 14 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star key={s} size={size} className={s <= rating ? "text-amber-400 fill-amber-400" : "text-white/20"} />
    ))}
  </div>
);

// Trust Score Ring
const TrustRing = ({ score = 0, size = 60 }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#trustGrad)" strokeWidth="6" strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round" />
        <defs>
          <linearGradient id="trustGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-xs font-bold text-white">{score}</span>
    </div>
  );
};

// Password Strength
const PasswordStrengthBar = ({ password }) => {
  const str = passwordStrength(password);
  if (!password) return null;
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= str.score ? str.color : "bg-white/10"}`} />
        ))}
      </div>
      <span className={`text-xs ${str.score === 1 ? "text-red-400" : str.score === 2 ? "text-amber-400" : "text-emerald-400"}`}>{str.label}</span>
    </div>
  );
};

// Badges Row
const BadgesRow = ({ unlockedBadges = [] }) => (
  <div className="flex flex-wrap gap-2">
    {BADGES.map((b) => {
      const unlocked = unlockedBadges.includes(b.id);
      const Icon = b.icon;
      return (
        <div key={b.id} title={b.desc} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${unlocked ? `bg-gradient-to-r ${b.color} text-white shadow-sm` : "bg-white/5 text-white/20"}`}>
          <Icon size={11} />
          {b.label}
        </div>
      );
    })}
  </div>
);

// Loading Skeleton
const LoadingSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array(count).fill(0).map((_, i) => (
      <div key={i} className="glass rounded-2xl p-5 space-y-3 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 bg-white/10 rounded w-24" />
            <div className="h-2.5 bg-white/5 rounded w-16" />
          </div>
        </div>
        <div className="h-3 bg-white/10 rounded w-full" />
        <div className="h-3 bg-white/10 rounded w-4/5" />
        <div className="flex gap-2">
          <div className="h-6 bg-white/10 rounded-full w-16" />
          <div className="h-6 bg-white/10 rounded-full w-20" />
        </div>
      </div>
    ))}
  </div>
);

// Empty State
const EmptyState = ({ icon: Icon = Search, title = "Nothing here yet", desc = "Check back later.", cta, onCta }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4 glow-sm">
      <Icon size={28} className="text-indigo-400" />
    </div>
    <h3 className="text-lg font-bold text-white/80 mb-2">{title}</h3>
    <p className="text-sm text-white/40 mb-5 max-w-xs">{desc}</p>
    {cta && <button onClick={onCta} className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity">{cta}</button>}
  </div>
);

// Notification Panel
const NotifPanel = ({ notifications = [], onClose, onMarkRead }) => (
  <div className="absolute top-12 right-0 w-80 glass-strong border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden" style={{ animation: "fadeInDown 0.2s ease" }}>
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
      <span className="font-semibold text-white text-sm">Notifications</span>
      <button onClick={onClose} className="text-white/40 hover:text-white"><X size={14} /></button>
    </div>
    <div className="max-h-72 overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="py-8 text-center text-white/30 text-sm">No notifications</div>
      ) : notifications.map((n, i) => (
        <div key={i} className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${!n.read ? "bg-indigo-500/5" : ""}`}>
          <p className="text-xs text-white/70">{n.message}</p>
          <p className="text-xs text-white/30 mt-0.5">{timeAgo(n.createdAt)}</p>
        </div>
      ))}
    </div>
  </div>
);

// Skill Card
const SkillCard = ({ listing, currentUserId, favorites = [], onFavorite, onContact, onEdit, onDelete, onReport, onViewProfile, isOwner = false }) => {
  const cat = getCat(listing.category);
  const Icon = cat.icon;
  const isFav = favorites.includes(listing.id);
  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-3 hover:bg-white/[0.07] transition-all duration-200 group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-3xl bg-gradient-to-bl ${cat.color} opacity-10 pointer-events-none`} />
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <button onClick={() => onViewProfile && onViewProfile(listing.userId)} className={`w-9 h-9 rounded-full bg-gradient-to-br ${userGrad(listing.userId)} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
            {initials(listing.userName || "U")}
          </button>
          <div>
            <p className="text-xs font-semibold text-white/80 leading-tight">{listing.userName || "Unknown"}</p>
            <p className="text-[10px] text-white/30">{timeAgo(listing.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onFavorite && onFavorite(listing.id)} className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${isFav ? "text-rose-400" : "text-white/30"}`}>
            <Heart size={14} className={isFav ? "fill-rose-400" : ""} />
          </button>
          {!isOwner && <button onClick={() => onReport && onReport(listing)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/20 hover:text-white/50 transition-colors"><Flag size={14} /></button>}
          {isOwner && <button onClick={() => onEdit && onEdit(listing)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 transition-colors"><Edit size={14} /></button>}
          {isOwner && <button onClick={() => onDelete && onDelete(listing)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/20 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>}
        </div>
      </div>
      {/* Category badge */}
      <div className="flex items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r ${cat.color} text-white`}>
          <Icon size={9} />{cat.label}
        </span>
        {listing.skillLevel && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-white/60">{listing.skillLevel}</span>}
        {listing.exchangeType && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-white/60">{listing.exchangeType}</span>}
      </div>
      {/* Skills */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/40 text-xs w-14 shrink-0">Offering:</span>
          <span className="font-semibold text-white/90 truncate">{listing.skillOffered}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white/40 text-xs w-14 shrink-0">Wants:</span>
          <span className="font-medium text-indigo-300 truncate">{listing.skillWanted}</span>
        </div>
      </div>
      {/* Description */}
      {listing.description && <p className="text-xs text-white/40 leading-relaxed">{trunc(listing.description, 90)}</p>}
      {/* Tags */}
      {listing.tags && listing.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {listing.tags.slice(0, 3).map((t, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px]">#{t}</span>
          ))}
        </div>
      )}
      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
        <div className="flex items-center gap-2 text-white/30 text-[10px]">
          <Eye size={11} /><span>{listing.views || 0}</span>
          <Heart size={11} /><span>{listing.favoritesCount || 0}</span>
        </div>
        {!isOwner && (
          <button onClick={() => onContact && onContact(listing)} className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-xs font-semibold text-white hover:opacity-90 transition-opacity flex items-center gap-1">
            <MessageSquare size={11} /> Contact
          </button>
        )}
      </div>
    </div>
  );
};

// Scroll To Top
const ScrollToTop = ({ show }) => {
  if (!show) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-24 md:bottom-8 left-4 z-50 w-10 h-10 glass-strong border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all shadow-lg">
      <ArrowUp size={16} />
    </button>
  );
};

// User Card (for leaderboard/profile)
const UserCard = ({ user, rank }) => {
  const title = userTitle(user.score || 0);
  const rankColors = { 1: "from-amber-400 to-yellow-300", 2: "from-slate-300 to-slate-400", 3: "from-amber-600 to-amber-500" };
  return (
    <div className={`glass rounded-2xl p-4 flex items-center gap-4 ${rank <= 3 ? "border border-white/10" : ""}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rank <= 3 ? `bg-gradient-to-br ${rankColors[rank]} text-white shadow-lg` : "bg-white/10 text-white/50"}`}>
        {rank}
      </div>
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${userGrad(user.userId)} flex items-center justify-center text-sm font-bold text-white`}>
        {initials(user.name)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white/90 text-sm truncate">{user.name}</p>
        <p className={`text-xs font-medium ${title.color}`}>{title.label}</p>
      </div>
      <TrustRing score={user.score || 0} size={44} />
      <div className="text-right text-xs text-white/40">
        <div>{user.listings} listings</div>
        <div>{user.reviewCount} reviews</div>
      </div>
    </div>
  );
};

// Heatmap
const Heatmap = ({ activityLog = {} }) => {
  const data = heatmapData(activityLog);
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) weeks.push(data.slice(i, i + 7));
  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {weeks.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((day, di) => (
            <div key={di} title={`${day.date}: ${day.count} activities`} className={`w-3 h-3 rounded-sm ${heatColor(day.count)} transition-colors`} />
          ))}
        </div>
      ))}
    </div>
  );
};

// Modals
const WelcomeModal = ({ onSubmit }) => {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass-strong border border-white/10 rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl" style={{ animation: "slideUp 0.3s ease" }}>
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-3 glow"><Zap size={24} className="text-white" /></div>
          <h2 className="text-xl font-bold text-white mb-1">Welcome to SkillSwap!</h2>
          <p className="text-sm text-white/50">What should we call you?</p>
        </div>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your display name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-500 transition-colors mb-4" />
        <button onClick={() => name.trim() && onSubmit(name.trim())} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity">Let's Go!</button>
      </div>
    </div>
  );
};

const DeleteModal = ({ onConfirm, onCancel, itemName = "this listing" }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="glass-strong border border-white/10 rounded-2xl p-7 w-full max-w-sm mx-4 shadow-2xl" style={{ animation: "slideUp 0.3s ease" }}>
      <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-400" /></div>
      <h3 className="text-lg font-bold text-white text-center mb-2">Delete Listing?</h3>
      <p className="text-sm text-white/50 text-center mb-6">Are you sure you want to delete {itemName}? This cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-white/10 text-white/70 font-medium text-sm hover:bg-white/15 transition-colors">Cancel</button>
        <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors">Delete</button>
      </div>
    </div>
  </div>
);

const ContactModal = ({ listing, onClose, onMessage }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
    <div className="glass-strong border border-white/10 rounded-2xl p-7 w-full max-w-sm mx-4 shadow-2xl" style={{ animation: "slideUp 0.3s ease" }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-white text-lg">Contact Info</h3>
        <button onClick={onClose} className="text-white/40 hover:text-white"><X size={18} /></button>
      </div>
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${userGrad(listing?.userId)} flex items-center justify-center font-bold text-white`}>{initials(listing?.userName)}</div>
        <div>
          <p className="font-semibold text-white">{listing?.userName}</p>
          <p className="text-xs text-white/40">Offering: {listing?.skillOffered}</p>
        </div>
      </div>
      {listing?.contactInfo ? (
        <div className="bg-white/5 rounded-xl p-4 text-sm text-white/70 mb-4">{listing.contactInfo}</div>
      ) : (
        <p className="text-sm text-white/40 mb-4 text-center">No contact info provided. Send a message instead!</p>
      )}
      <button onClick={() => onMessage && onMessage(listing)} className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
        <MessageSquare size={15} /> Send Message
      </button>
    </div>
  </div>
);

const ReportModal = ({ listing, onSubmit, onClose }) => {
  const [reason, setReason] = useState("");
  const reasons = ["Spam or misleading", "Inappropriate content", "Scam or fraud", "Duplicate listing", "Other"];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass-strong border border-white/10 rounded-2xl p-7 w-full max-w-sm mx-4 shadow-2xl" style={{ animation: "slideUp 0.3s ease" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white text-lg">Report Listing</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={18} /></button>
        </div>
        <div className="space-y-2 mb-5">
          {reasons.map((r) => (
            <button key={r} onClick={() => setReason(r)} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${reason === r ? "bg-indigo-500/20 border border-indigo-500/40 text-indigo-300" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>{r}</button>
          ))}
        </div>
        <button onClick={() => reason && onSubmit(reason)} disabled={!reason} className="w-full py-2.5 bg-red-500 rounded-xl font-semibold text-white text-sm hover:bg-red-600 transition-colors disabled:opacity-40">Submit Report</button>
      </div>
    </div>
  );
};

const ReviewModal = ({ targetUser, onSubmit, onClose }) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glass-strong border border-white/10 rounded-2xl p-7 w-full max-w-sm mx-4 shadow-2xl" style={{ animation: "slideUp 0.3s ease" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white text-lg">Write a Review</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={18} /></button>
        </div>
        <div className="flex justify-center gap-2 mb-5">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} onClick={() => setRating(s)} className="transition-transform hover:scale-110">
              <Star size={28} className={s <= rating ? "text-amber-400 fill-amber-400" : "text-white/20"} />
            </button>
          ))}
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share your experience..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-500 transition-colors resize-none mb-4" />
        <button onClick={() => onSubmit(rating, text)} className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-opacity">Submit Review</button>
      </div>
    </div>
  );
};

const UserProfileModal = ({ userId, listings = [], reviews = [], onClose, onMessage }) => {
  const userListings = listings.filter((l) => l.userId === userId);
  const userReviews = reviews.filter((r) => r.toUserId === userId);
  const avgRating = userReviews.length > 0 ? userReviews.reduce((a, r) => a + r.rating, 0) / userReviews.length : 0;
  const score = trustScore(userListings.length, userReviews.length, avgRating);
  const title = userTitle(score);
  const name = userListings[0]?.userName || userReviews[0]?.toUserName || "Unknown User";
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-strong border border-white/10 rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl overflow-y-auto max-h-[90vh]" style={{ animation: "slideUp 0.3s ease" }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-white text-lg">User Profile</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X size={18} /></button>
        </div>
        <div className="flex flex-col items-center mb-5">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${userGrad(userId)} flex items-center justify-center text-xl font-bold text-white mb-3`}>{initials(name)}</div>
          <h4 className="font-bold text-white text-lg">{name}</h4>
          <span className={`text-sm font-medium ${title.color}`}>{title.label}</span>
          <TrustRing score={score} size={56} />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[["Listings", userListings.length], ["Reviews", userReviews.length], ["Avg Rating", avgRating.toFixed(1)]].map(([l, v]) => (
            <div key={l} className="glass rounded-xl p-3 text-center">
              <div className="font-bold text-white text-lg">{v}</div>
              <div className="text-xs text-white/40">{l}</div>
            </div>
          ))}
        </div>
        {userListings.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-white/50 mb-2 uppercase tracking-wide">Listings</p>
            <div className="space-y-2">
              {userListings.slice(0, 3).map((l) => (
                <div key={l.id} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                  <span className="text-sm text-white/80 truncate">{l.skillOffered}</span>
                  <span className="text-xs text-indigo-400">→ {l.skillWanted}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <button onClick={() => onMessage && onMessage(userId, name)} className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold text-white text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <MessageSquare size={15} /> Send Message
        </button>
      </div>
    </div>
  );
};

// ============================================================
// SECTION 6: LANDING PAGE
// ============================================================
const LandingPage = ({ onLogin, onSignup }) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [counters, setCounters] = useState({ skills: 0, members: 0, exchanges: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const targets = { skills: 12847, members: 5231, exchanges: 3912 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounters({
        skills: Math.floor(targets.skills * progress),
        members: Math.floor(targets.members * progress),
        exchanges: Math.floor(targets.exchanges * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setActiveTestimonial((p) => (p + 1) % MOCK_TESTIMONIALS.length), 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-x-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[40%] right-[-15%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] rounded-full bg-indigo-800/10 blur-[80px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 glass border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center glow-sm"><Zap size={16} className="text-white" /></div>
          <span className="font-black text-white text-lg">SkillSwap</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onLogin} className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors">Login</button>
          <button onClick={onSignup} className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity glow-sm">Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-indigo-500/30 text-xs font-medium text-indigo-300 mb-8">
            <Sparkles size={12} /> Trusted by 5,000+ skill traders worldwide
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            <span className="gradient-text">Exchange Skills,</span>
            <br /><span className="text-white">Not Money.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            SkillSwap is the zero-money barter platform where your talent is currency. Trade what you know for what you want to learn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onSignup} className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl font-bold text-white text-lg hover:opacity-90 transition-all glow hover:scale-105">
              Start Swapping Free
            </button>
            <button onClick={onLogin} className="px-8 py-4 glass border border-white/10 rounded-2xl font-semibold text-white/80 text-lg hover:bg-white/10 transition-all">
              Explore Skills →
            </button>
          </div>
        </div>
        {/* Floating cards */}
        <div className="absolute bottom-10 left-4 right-4 flex justify-center gap-4 pointer-events-none">
          {["React Dev ↔ Guitar Lessons", "Spanish ↔ Photography", "Cooking ↔ Web Design"].map((swap, i) => (
            <div key={i} className="glass border border-white/10 rounded-xl px-4 py-2 text-xs text-white/60 hidden md:block" style={{ animation: `float ${2 + i * 0.5}s ease-in-out infinite alternate` }}>
              {swap}
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Skills Listed", value: counters.skills.toLocaleString(), icon: List, color: "from-indigo-500 to-blue-500" },
            { label: "Members", value: counters.members.toLocaleString(), icon: Users, color: "from-purple-500 to-pink-500" },
            { label: "Exchanges Done", value: counters.exchanges.toLocaleString(), icon: CheckCircle, color: "from-emerald-500 to-teal-500" },
            { label: "Categories", value: "12", icon: Layers, color: "from-amber-500 to-orange-500" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass rounded-2xl p-5 text-center hover:bg-white/[0.07] transition-colors">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3`}><Icon size={18} className="text-white" /></div>
                <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Why <span className="gradient-text">SkillSwap?</span></h2>
            <p className="text-white/40 max-w-xl mx-auto">A platform built on trust, community, and the simple idea that everyone has something valuable to offer.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: "Zero Cost", desc: "No money changes hands. Pure skill-for-skill exchange.", color: "from-emerald-500 to-teal-500" },
              { icon: Globe, title: "Global Community", desc: "Connect with skilled people from around the world.", color: "from-blue-500 to-indigo-500" },
              { icon: Award, title: "Trust Scores", desc: "Reputation system ensures quality exchanges.", color: "from-amber-500 to-orange-500" },
              { icon: Zap, title: "Instant Match", desc: "AI-powered matching finds your perfect skill partner.", color: "from-purple-500 to-pink-500" },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}><Icon size={22} className="text-white" /></div>
                  <h3 className="font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-white/40">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">How It <span className="gradient-text">Works</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="glass rounded-2xl p-7 text-center hover:bg-white/[0.07] transition-all relative overflow-hidden">
                  <div className="absolute top-3 right-4 text-6xl font-black text-white/[0.03]">{step.step}</div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-4 glow-sm`}><Icon size={24} className="text-white" /></div>
                  <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4"><span className="gradient-text">12 Categories</span> to Explore</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.id} className="glass rounded-xl p-4 text-center hover:bg-white/[0.07] transition-all cursor-pointer group">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}><Icon size={18} className="text-white" /></div>
                  <p className="text-xs font-medium text-white/60">{cat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">What People <span className="gradient-text">Say</span></h2>
          </div>
          <div className="glass-strong border border-white/10 rounded-3xl p-8 md:p-10">
            <div className="flex justify-center mb-4"><RatingStars rating={MOCK_TESTIMONIALS[activeTestimonial].rating} size={18} /></div>
            <p className="text-lg md:text-xl text-white/70 text-center leading-relaxed mb-6 italic">"{MOCK_TESTIMONIALS[activeTestimonial].text}"</p>
            <div className="flex items-center justify-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${MOCK_TESTIMONIALS[activeTestimonial].grad} flex items-center justify-center font-bold text-white text-sm`}>
                {MOCK_TESTIMONIALS[activeTestimonial].avatar}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{MOCK_TESTIMONIALS[activeTestimonial].name}</p>
                <p className="text-xs text-white/40">{MOCK_TESTIMONIALS[activeTestimonial].title}</p>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {MOCK_TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)} className={`w-2 h-2 rounded-full transition-all ${i === activeTestimonial ? "bg-indigo-400 w-6" : "bg-white/20"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-strong border border-indigo-500/20 rounded-3xl p-10 md:p-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to <span className="gradient-text">Start Swapping?</span></h2>
            <p className="text-white/40 mb-8">Join thousands of people exchanging skills every day. It's free, it's fair, it's fun.</p>
            <button onClick={onSignup} className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl font-bold text-white text-lg hover:opacity-90 transition-all glow hover:scale-105">
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center"><Zap size={12} className="text-white" /></div>
            <span className="font-bold text-white">SkillSwap</span>
          </div>
          <p className="text-xs text-white/30">© 2025 SkillSwap. Exchange Skills, Not Money.</p>
          <div className="flex gap-4 text-xs text-white/30">
            <span className="cursor-pointer hover:text-white/60 transition-colors">Privacy</span>
            <span className="cursor-pointer hover:text-white/60 transition-colors">Terms</span>
            <span className="cursor-pointer hover:text-white/60 transition-colors">Contact</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float { from { transform: translateY(0px); } to { transform: translateY(-12px); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

// ============================================================
// SECTION 7: LOGIN PAGE
// ============================================================
const LoginPage = ({ onLogin, onGoogleLogin, onForgotPassword, onGoSignup, error, loading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="w-full max-w-md relative">
        <div className="glass-strong border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl" style={{ animation: "slideUp 0.3s ease" }}>
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4 glow"><Zap size={24} className="text-white" /></div>
            <h1 className="text-2xl font-black text-white mb-1">Welcome Back</h1>
            <p className="text-sm text-white/40">Sign in to your SkillSwap account</p>
          </div>
          {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"><AlertCircle size={14} />{error}</div>}
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-white/50">Password</label>
                <button onClick={onForgotPassword} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot?</button>
              </div>
              <div className="relative">
                <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPass ? "text" : "password"} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500 transition-colors" />
                <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"><EyeOff size={15} /></button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <button onClick={() => setRemember(!remember)} className={`w-4 h-4 rounded border ${remember ? "bg-indigo-500 border-indigo-500" : "border-white/20"} flex items-center justify-center transition-colors`}>{remember && <Check size={11} className="text-white" />}</button>
            <span className="text-xs text-white/40">Remember me</span>
          </div>
          <button onClick={() => onLogin(email, password)} disabled={loading} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity glow-sm disabled:opacity-50 flex items-center justify-center gap-2 mb-4">
            {loading ? <RefreshCw size={16} className="animate-spin" /> : null} Sign In
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <button onClick={onGoogleLogin} className="w-full py-3 glass border border-white/10 rounded-xl font-medium text-white/80 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 mb-6">
            <Globe size={16} /> Continue with Google
          </button>
          <p className="text-center text-xs text-white/40">
            Don't have an account? <button onClick={onGoSignup} className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign Up</button>
          </p>
        </div>
      </div>
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

// ============================================================
// SECTION 8: SIGNUP PAGE
// ============================================================
const SignupPage = ({ onSignup, onGoogleLogin, onGoLogin, error, loading }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return setValidationError("Name is required");
    if (!email.includes("@")) return setValidationError("Invalid email");
    if (password.length < 6) return setValidationError("Password must be at least 6 characters");
    if (password !== confirm) return setValidationError("Passwords do not match");
    if (!agreed) return setValidationError("Please accept Terms & Conditions");
    setValidationError("");
    onSignup(name, email, password);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[100px] animate-pulse" />
      <div className="w-full max-w-md relative">
        <div className="glass-strong border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl" style={{ animation: "slideUp 0.3s ease" }}>
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4 glow"><Zap size={24} className="text-white" /></div>
            <h1 className="text-2xl font-black text-white mb-1">Join SkillSwap</h1>
            <p className="text-sm text-white/40">Create your free account today</p>
          </div>
          {(error || validationError) && <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"><AlertCircle size={14} />{error || validationError}</div>}
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Muhammad Ashir" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
              <div className="relative">
                <input value={password} onChange={(e) => setPassword(e.target.value)} type={showPass ? "text" : "password"} placeholder="Min 6 characters" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500 transition-colors" />
                <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"><EyeOff size={15} /></button>
              </div>
              <PasswordStrengthBar password={password} />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Confirm Password</label>
              <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" placeholder="Repeat password" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>
          <div className="flex items-start gap-2 mb-6">
            <button onClick={() => setAgreed(!agreed)} className={`w-4 h-4 rounded border mt-0.5 shrink-0 ${agreed ? "bg-indigo-500 border-indigo-500" : "border-white/20"} flex items-center justify-center transition-colors`}>{agreed && <Check size={11} className="text-white" />}</button>
            <span className="text-xs text-white/40">I agree to the <span className="text-indigo-400 cursor-pointer">Terms & Conditions</span> and <span className="text-indigo-400 cursor-pointer">Privacy Policy</span></span>
          </div>
          <button onClick={handleSubmit} disabled={loading} className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity glow-sm disabled:opacity-50 flex items-center justify-center gap-2 mb-4">
            {loading ? <RefreshCw size={16} className="animate-spin" /> : null} Create Account
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <button onClick={onGoogleLogin} className="w-full py-3 glass border border-white/10 rounded-xl font-medium text-white/80 hover:bg-white/10 transition-colors flex items-center justify-center gap-2 mb-6">
            <Globe size={16} /> Continue with Google
          </button>
          <p className="text-center text-xs text-white/40">
            Already have an account? <button onClick={onGoLogin} className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign In</button>
          </p>
        </div>
      </div>
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

// ============================================================
// SECTION 9: MAIN APP PAGES
// ============================================================

// --- HOME PAGE ---
const HomePage = ({ user, userData, listings, reviews, favorites, onNavigate, onFavorite, onContact, onViewProfile, onReport }) => {
  const blockedUsers = userData?.blockedUsers || [];
  const visibleListings = listings.filter((l) => !isBlocked(blockedUsers, l.userId));
  const recentListings = visibleListings.slice(0, 6);
  const suggested = matchingSuggestions(visibleListings, user?.uid, userData).slice(0, 4);
  const trending = trendingCats(visibleListings);
  const maxCount = Math.max(...trending.map((c) => c.count), 1);
  const activityLog = userData?.activityLog || {};

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/20 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <h2 className="text-2xl md:text-3xl font-black text-white mb-1">
          Welcome back, <span className="gradient-text">{user?.displayName?.split(" ")[0] || "Trader"}!</span>
        </h2>
        <p className="text-white/50 text-sm mb-4">You have {visibleListings.length} skills available to explore.</p>
        <div className="flex gap-3">
          <button onClick={() => onNavigate("post")} className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity glow-sm">Post a Skill</button>
          <button onClick={() => onNavigate("explore")} className="px-5 py-2 glass border border-white/10 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 transition-colors">Browse All</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Skills", value: listings.length, icon: List, color: "from-indigo-500 to-blue-500" },
          { label: "Community", value: "5,231+", icon: Users, color: "from-purple-500 to-pink-500" },
          { label: "Categories", value: CATEGORIES.length, icon: Layers, color: "from-emerald-500 to-teal-500" },
          { label: "Your Favorites", value: favorites.length, icon: Heart, color: "from-rose-500 to-pink-500" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass rounded-2xl p-4 hover:bg-white/[0.07] transition-colors">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}><Icon size={14} className="text-white" /></div>
              <div className="text-xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Suggested For You */}
      {suggested.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2"><Sparkles size={16} className="text-indigo-400" /> Suggested For You</h3>
            <button onClick={() => onNavigate("explore")} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">See All <ChevronRight size={12} /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggested.map((l) => (
              <SkillCard key={l.id} listing={l} currentUserId={user?.uid} favorites={favorites} onFavorite={onFavorite} onContact={onContact} onReport={onReport} onViewProfile={onViewProfile} />
            ))}
          </div>
        </div>
      )}

      {/* Trending Categories */}
      <div>
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-indigo-400" /> Trending Categories</h3>
        <div className="space-y-3">
          {trending.map((cat) => {
            const Icon = cat.icon;
            const pct = Math.round((cat.count / maxCount) * 100);
            return (
              <div key={cat.id} className="glass rounded-xl px-4 py-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center`}><Icon size={13} className="text-white" /></div>
                  <span className="text-sm font-medium text-white/80">{cat.label}</span>
                  <span className="text-xs text-white/30 ml-auto">{cat.count} listings</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Activity size={16} className="text-indigo-400" /> Your Activity</h3>
        <Heatmap activityLog={activityLog} />
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-white/30">Less</span>
          {["bg-white/5", "bg-indigo-900/60", "bg-indigo-600/70", "bg-indigo-400/80", "bg-indigo-300"].map((c, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
          ))}
          <span className="text-xs text-white/30">More</span>
        </div>
      </div>

      {/* Recent Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white flex items-center gap-2"><Clock size={16} className="text-indigo-400" /> Recent Listings</h3>
          <button onClick={() => onNavigate("explore")} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">View All <ChevronRight size={12} /></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentListings.map((l) => (
            <SkillCard key={l.id} listing={l} currentUserId={user?.uid} favorites={favorites} onFavorite={onFavorite} onContact={onContact} onReport={onReport} onViewProfile={onViewProfile} />
          ))}
        </div>
        {recentListings.length === 0 && <EmptyState icon={List} title="No listings yet" desc="Be the first to post a skill!" cta="Post Your Skill" onCta={() => onNavigate("post")} />}
      </div>
    </div>
  );
};

// --- EXPLORE PAGE ---
const ExplorePage = ({ user, listings, favorites, userData, onFavorite, onContact, onReport, onViewProfile }) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const blockedUsers = userData?.blockedUsers || [];

  const filtered = useMemo(() => {
    let result = listings.filter((l) => !isBlocked(blockedUsers, l.userId));
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((l) => l.skillOffered?.toLowerCase().includes(q) || l.skillWanted?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q) || l.tags?.some((t) => t.toLowerCase().includes(q)));
    }
    if (activeCategory !== "all") result = result.filter((l) => l.category === activeCategory);
    if (sortBy === "newest") result = [...result].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    else if (sortBy === "oldest") result = [...result].sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
    else if (sortBy === "popular") result = [...result].sort((a, b) => (b.views || 0) - (a.views || 0));
    return result;
  }, [listings, search, activeCategory, sortBy, blockedUsers]);

  return (
    <div className="space-y-5 pb-8">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search skills, categories, users..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-500 transition-colors" />
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70 outline-none focus:border-indigo-500 transition-colors">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Popular</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button onClick={() => setActiveCategory("all")} className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${activeCategory === "all" ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "glass border border-white/10 text-white/50 hover:text-white"}`}>All</button>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${activeCategory === cat.id ? `bg-gradient-to-r ${cat.color} text-white` : "glass border border-white/10 text-white/50 hover:text-white"}`}>
              <Icon size={11} />{cat.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-white/40">{filtered.length} listings found</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Search} title="No results found" desc="Try different keywords or filters." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((l) => (
            <SkillCard key={l.id} listing={l} currentUserId={user?.uid} favorites={favorites} onFavorite={onFavorite} onContact={onContact} onReport={onReport} onViewProfile={onViewProfile} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- MESSAGES PAGE ---
const MessagesPage = ({ user, messages, onSend, activeChat, setActiveChat, listings }) => {
  const [msgText, setMsgText] = useState("");
  const [searchChat, setSearchChat] = useState("");
  const messagesEndRef = useRef(null);

  // Build conversation list
  const conversations = useMemo(() => {
    if (!user) return [];
    const convMap = {};
    messages.forEach((m) => {
      const isFromMe = m.fromUserId === user.uid;
      const partnerId = isFromMe ? m.toUserId : m.fromUserId;
      const partnerName = isFromMe ? m.toUserName : m.fromUserName;
      if (!convMap[partnerId]) convMap[partnerId] = { userId: partnerId, name: partnerName || "User", messages: [], unread: 0 };
      convMap[partnerId].messages.push(m);
      if (!isFromMe && !m.read) convMap[partnerId].unread++;
    });
    return Object.values(convMap)
      .map((c) => ({ ...c, lastMsg: c.messages.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))[0] }))
      .sort((a, b) => (b.lastMsg?.createdAt?.seconds || 0) - (a.lastMsg?.createdAt?.seconds || 0))
      .filter((c) => !searchChat || c.name.toLowerCase().includes(searchChat.toLowerCase()));
  }, [messages, user, searchChat]);

  const chatMessages = useMemo(() => {
    if (!activeChat || !user) return [];
    return messages
      .filter((m) => (m.fromUserId === user.uid && m.toUserId === activeChat.userId) || (m.fromUserId === activeChat.userId && m.toUserId === user.uid))
      .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
  }, [messages, activeChat, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = () => {
    if (!msgText.trim() || !activeChat) return;
    onSend(activeChat.userId, activeChat.name, msgText.trim());
    setMsgText("");
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Conversation List */}
      <div className={`${activeChat ? "hidden md:flex" : "flex"} flex-col w-full md:w-72 glass rounded-2xl overflow-hidden shrink-0`}>
        <div className="p-4 border-b border-white/5">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2"><MessageSquare size={16} className="text-indigo-400" /> Messages</h3>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input value={searchChat} onChange={(e) => setSearchChat(e.target.value)} placeholder="Search..." className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:border-indigo-500 transition-colors" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center px-4">
              <MessageCircle size={32} className="text-white/20 mb-3" />
              <p className="text-sm text-white/40">No conversations yet</p>
              <p className="text-xs text-white/20 mt-1">Contact a listing to start chatting</p>
            </div>
          ) : conversations.map((conv) => (
            <button key={conv.userId} onClick={() => setActiveChat(conv)} className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 ${activeChat?.userId === conv.userId ? "bg-indigo-500/10" : ""}`}>
              <div className="relative">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${userGrad(conv.userId)} flex items-center justify-center text-xs font-bold text-white shrink-0`}>{initials(conv.name)}</div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-dark-950" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white/80 truncate">{conv.name}</span>
                  <span className="text-[10px] text-white/30 shrink-0 ml-2">{timeAgo(conv.lastMsg?.createdAt)}</span>
                </div>
                <p className="text-xs text-white/40 truncate">{conv.lastMsg?.text}</p>
              </div>
              {conv.unread > 0 && <span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">{conv.unread}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {activeChat ? (
        <div className="flex-1 flex flex-col glass rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
            <button onClick={() => setActiveChat(null)} className="md:hidden text-white/40 hover:text-white mr-1"><ArrowLeft size={18} /></button>
            <div className="relative">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${userGrad(activeChat.userId)} flex items-center justify-center text-xs font-bold text-white`}>{initials(activeChat.name)}</div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-dark-950" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{activeChat.name}</p>
              <p className="text-[10px] text-emerald-400">Online</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle size={32} className="text-white/20 mb-3" />
                <p className="text-sm text-white/40">Say hello to {activeChat.name}!</p>
              </div>
            )}
            {chatMessages.map((m, i) => {
              const isMe = m.fromUserId === user?.uid;
              return (
                <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${isMe ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-sm" : "bg-white/10 text-white/80 rounded-bl-sm"}`}>
                    <p>{m.text}</p>
                    <p className={`text-[10px] mt-0.5 ${isMe ? "text-white/50" : "text-white/30"}`}>{timeAgo(m.createdAt)}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <div className="px-4 py-3 border-t border-white/5 flex items-center gap-3">
            <input value={msgText} onChange={(e) => setMsgText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Type a message..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-500 transition-colors" />
            <button onClick={handleSend} disabled={!msgText.trim()} className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40">
              <Send size={15} className="text-white" />
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 glass rounded-2xl items-center justify-center">
          <div className="text-center">
            <MessageSquare size={40} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
};

// --- POST PAGE ---
const PostPage = ({ user, userData, onSubmit, editingListing, onCancelEdit }) => {
  const [form, setForm] = useState({
    skillOffered: editingListing?.skillOffered || "",
    skillWanted: editingListing?.skillWanted || "",
    category: editingListing?.category || CATEGORIES[0].id,
    description: editingListing?.description || "",
    contactInfo: editingListing?.contactInfo || "",
    tags: editingListing?.tags?.join(", ") || "",
    imageUrl: editingListing?.imageUrl || "",
    skillLevel: editingListing?.skillLevel || "Beginner",
    exchangeType: editingListing?.exchangeType || "Both",
    availability: editingListing?.availability || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.skillOffered.trim()) e.skillOffered = "Required";
    if (!form.skillWanted.trim()) e.skillWanted = "Required";
    if (!form.description.trim()) e.description = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    await onSubmit({ ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) });
    setLoading(false);
  };

  const Field = ({ label, name, placeholder, type = "text", required }) => (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-1.5">{label}{required && <span className="text-red-400 ml-1">*</span>}</label>
      <input value={form[name]} onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))} type={type} placeholder={placeholder} className={`w-full bg-white/5 border ${errors[name] ? "border-red-500/50" : "border-white/10"} rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500 transition-colors`} />
      {errors[name] && <p className="text-xs text-red-400 mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto pb-8">
      <div className="flex items-center gap-3 mb-6">
        {editingListing && <button onClick={onCancelEdit} className="text-white/40 hover:text-white"><ArrowLeft size={20} /></button>}
        <h2 className="text-xl font-black text-white">{editingListing ? "Edit Listing" : "Post a Skill"}</h2>
      </div>
      <div className="glass rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Skill Offered" name="skillOffered" placeholder="e.g., Web Development" required />
          <Field label="Skill Wanted" name="skillWanted" placeholder="e.g., Guitar Lessons" required />
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Category <span className="text-red-400">*</span></label>
          <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 transition-colors">
            {CATEGORIES.map((cat) => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5">Description <span className="text-red-400">*</span></label>
          <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Describe what you offer and what you're looking for..." rows={4} className={`w-full bg-white/5 border ${errors.description ? "border-red-500/50" : "border-white/10"} rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500 transition-colors resize-none`} />
          {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Skill Level</label>
            <div className="flex gap-2">
              {SKILL_LEVELS.map((l) => (
                <button key={l} onClick={() => setForm((f) => ({ ...f, skillLevel: l }))} className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${form.skillLevel === l ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "glass border border-white/10 text-white/50 hover:text-white"}`}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5">Exchange Type</label>
            <div className="flex gap-2">
              {EXCHANGE_TYPES.map((t) => (
                <button key={t} onClick={() => setForm((f) => ({ ...f, exchangeType: t }))} className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${form.exchangeType === t ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "glass border border-white/10 text-white/50 hover:text-white"}`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
        <Field label="Tags (comma-separated)" name="tags" placeholder="react, javascript, frontend" />
        <Field label="Contact Info (optional)" name="contactInfo" placeholder="Your WhatsApp, email, or other contact" />
        <Field label="Image URL (optional)" name="imageUrl" placeholder="https://..." />
        {form.imageUrl && (
          <div className="rounded-xl overflow-hidden bg-white/5 h-32 flex items-center justify-center">
            <img src={form.imageUrl} alt="Preview" className="h-full w-full object-cover" onError={(e) => { e.target.style.display = "none"; }} />
          </div>
        )}
        <Field label="Availability" name="availability" placeholder="e.g., Weekends, 6-8 PM daily" />
        <div className="flex gap-3 pt-2">
          {editingListing && <button onClick={onCancelEdit} className="flex-1 py-3 glass border border-white/10 rounded-xl font-medium text-white/70 hover:bg-white/10 transition-colors">Cancel</button>}
          <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity glow-sm disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <RefreshCw size={15} className="animate-spin" />}
            {editingListing ? "Update Listing" : "Post Listing"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- FAVORITES PAGE ---
const FavoritesPage = ({ user, listings, favorites, userData, onFavorite, onContact, onReport, onViewProfile, onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const favListings = listings.filter((l) => favorites.includes(l.id));
  const filtered = activeCategory === "all" ? favListings : favListings.filter((l) => l.category === activeCategory);

  return (
    <div className="space-y-5 pb-8">
      <h2 className="text-xl font-black text-white flex items-center gap-2"><Heart size={20} className="text-rose-400" /> Favorites</h2>
      {favListings.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setActiveCategory("all")} className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${activeCategory === "all" ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "glass border border-white/10 text-white/50"}`}>All ({favListings.length})</button>
          {CATEGORIES.filter((c) => favListings.some((l) => l.category === c.id)).map((cat) => {
            const Icon = cat.icon;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${activeCategory === cat.id ? `bg-gradient-to-r ${cat.color} text-white` : "glass border border-white/10 text-white/50"}`}>
                <Icon size={11} />{cat.label}
              </button>
            );
          })}
        </div>
      )}
      {filtered.length === 0 ? (
        <EmptyState icon={Heart} title="No favorites yet" desc="Browse skills and tap the heart to save them here." cta="Explore Skills" onCta={() => onNavigate("explore")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((l) => (
            <SkillCard key={l.id} listing={l} currentUserId={user?.uid} favorites={favorites} onFavorite={onFavorite} onContact={onContact} onReport={onReport} onViewProfile={onViewProfile} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- MY LISTINGS PAGE ---
const MyListingsPage = ({ user, listings, favorites, reviews, onEdit, onDelete, onNavigate }) => {
  const myListings = listings.filter((l) => l.userId === user?.uid);
  const myReviews = reviews.filter((r) => r.toUserId === user?.uid);
  const totalViews = myListings.reduce((a, l) => a + (l.views || 0), 0);
  const avgRating = myReviews.length > 0 ? myReviews.reduce((a, r) => a + r.rating, 0) / myReviews.length : 0;

  return (
    <div className="space-y-5 pb-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white flex items-center gap-2"><List size={20} className="text-indigo-400" /> My Listings</h2>
        <button onClick={() => onNavigate("post")} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-opacity flex items-center gap-1.5"><PlusSquare size={13} /> Post New</button>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[["Total Listings", myListings.length, List], ["Total Views", totalViews, Eye], ["Avg Rating", avgRating.toFixed(1), Star]].map(([l, v, Icon]) => (
          <div key={l} className="glass rounded-xl p-4 text-center">
            <Icon size={16} className="text-indigo-400 mx-auto mb-2" />
            <div className="text-xl font-black text-white">{v}</div>
            <div className="text-xs text-white/40">{l}</div>
          </div>
        ))}
      </div>
      {myListings.length === 0 ? (
        <EmptyState icon={PlusSquare} title="No listings yet" desc="Share your first skill with the community!" cta="Post Your First Skill" onCta={() => onNavigate("post")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myListings.map((l) => (
            <SkillCard key={l.id} listing={l} currentUserId={user?.uid} favorites={favorites} isOwner={true} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

// --- LEADERBOARD PAGE ---
const LeaderboardPage = ({ user, listings, reviews }) => {
  const [tab, setTab] = useState("all");
  const board = leaderboardData(listings, reviews);

  return (
    <div className="space-y-5 pb-8">
      <h2 className="text-xl font-black text-white flex items-center gap-2"><Trophy size={20} className="text-amber-400" /> Leaderboard</h2>
      <div className="flex gap-2">
        {["all", "weekly", "monthly"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${tab === t ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "glass border border-white/10 text-white/50 hover:text-white"}`}>{t}</button>
        ))}
      </div>
      {/* Podium for top 3 */}
      {board.length >= 3 && (
        <div className="flex items-end justify-center gap-4 py-6">
          {[1, 0, 2].map((idx) => {
            const u = board[idx];
            if (!u) return null;
            const heights = [28, 36, 24];
            const podHeight = heights[idx];
            const rankColors = ["from-amber-400 to-yellow-300", "from-indigo-400 to-blue-400", "from-amber-600 to-amber-500"];
            const rankIcons = [Crown, Medal, Medal];
            const Icon = rankIcons[idx];
            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${userGrad(u.userId)} flex items-center justify-center text-sm font-bold text-white border-2 border-white/20`}>{initials(u.name)}</div>
                <span className="text-xs text-white/60 font-medium max-w-[80px] truncate text-center">{u.name}</span>
                <span className="text-xs font-bold text-white">{u.score}</span>
                <div className={`w-20 rounded-t-xl bg-gradient-to-b ${rankColors[idx]} flex items-start justify-center pt-2`} style={{ height: `${podHeight * 2}px` }}>
                  <Icon size={16} className="text-white/80" />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Full board */}
      <div className="space-y-2">
        {board.map((u, i) => <UserCard key={u.userId} user={u} rank={i + 1} />)}
      </div>
      {board.length === 0 && <EmptyState icon={Trophy} title="Leaderboard is empty" desc="Be the first to post and get reviewed!" />}
    </div>
  );
};

// --- PROFILE PAGE ---
const ProfilePage = ({ user, userData, listings, reviews, favorites, messages, onUpdateProfile, onLogout, onNavigate, onBlockUser, showToast }) => {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(userData?.bio || "");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const myListings = listings.filter((l) => l.userId === user?.uid);
  const myReviews = reviews.filter((r) => r.toUserId === user?.uid);
  const avgRating = myReviews.length > 0 ? myReviews.reduce((a, r) => a + r.rating, 0) / myReviews.length : 0;
  const score = trustScore(myListings.length, myReviews.length, avgRating);
  const title = userTitle(score);
  const myMsgs = messages.filter((m) => m.fromUserId === user?.uid);
  const unlockedBadges = getUnlockedBadges(score, myListings, myReviews, favorites, myMsgs, 0);
  const blockedUsers = userData?.blockedUsers || [];

  return (
    <div className="space-y-5 pb-8 max-w-2xl">
      {/* Header */}
      <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="relative">
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${userGrad(user?.uid)} flex items-center justify-center text-2xl font-black text-white border-4 border-indigo-500/30`}>{initials(user?.displayName || "U")}</div>
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full p-1"><Zap size={12} className="text-white" /></div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          {editing ? (
            <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-white text-lg font-bold outline-none focus:border-indigo-500 w-full mb-2" />
          ) : (
            <h2 className="text-xl font-black text-white">{user?.displayName || "Anonymous"}</h2>
          )}
          <p className={`text-sm font-semibold ${title.color} mb-1`}>{title.label}</p>
          <p className="text-xs text-white/30">Member since {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"}</p>
          <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
            <TrustRing score={score} size={50} />
            <div>
              <p className="text-xs text-white/40">Trust Score</p>
              <RatingStars rating={Math.round(avgRating)} />
            </div>
          </div>
        </div>
        <button onClick={() => setEditing(!editing)} className="shrink-0 p-2.5 glass border border-white/10 rounded-xl text-white/50 hover:text-white transition-colors"><Edit size={16} /></button>
      </div>

      {/* Editing Bio */}
      {editing && (
        <div className="glass rounded-2xl p-5 space-y-3">
          <label className="text-xs font-medium text-white/50">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell the community about yourself..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-indigo-500 transition-colors resize-none" />
          <div className="flex gap-3">
            <button onClick={() => setEditing(false)} className="flex-1 py-2.5 glass border border-white/10 rounded-xl text-sm font-medium text-white/60">Cancel</button>
            <button onClick={() => { onUpdateProfile(displayName, bio); setEditing(false); }} className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl text-sm font-semibold text-white hover:opacity-90">Save</button>
          </div>
        </div>
      )}

      {/* Bio */}
      {!editing && userData?.bio && (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-semibold text-white/40 mb-2 uppercase tracking-wide">About</p>
          <p className="text-sm text-white/70 leading-relaxed">{userData.bio}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[["Listings", myListings.length, List], ["Reviews", myReviews.length, Star], ["Favorites", favorites.length, Heart], ["Messages", myMsgs.length, MessageSquare]].map(([l, v, Icon]) => (
          <div key={l} className="glass rounded-xl p-3 text-center">
            <Icon size={14} className="text-indigo-400 mx-auto mb-1.5" />
            <div className="text-lg font-black text-white">{v}</div>
            <div className="text-[10px] text-white/40">{l}</div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Award size={16} className="text-amber-400" /> Badges</h3>
        <BadgesRow unlockedBadges={unlockedBadges} />
      </div>

      {/* Activity Heatmap */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Activity size={16} className="text-indigo-400" /> Activity</h3>
        <Heatmap activityLog={userData?.activityLog || {}} />
      </div>

      {/* Achievements */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Target size={16} className="text-purple-400" /> Achievements</h3>
        <div className="space-y-3">
          {ACHIEVEMENTS.slice(0, 5).map((ach) => {
            const progress = Math.min(Math.random() * ach.target, ach.target);
            const pct = Math.round((progress / ach.target) * 100);
            const unlocked = pct >= 100;
            return (
              <div key={ach.id} className={`p-3 rounded-xl ${unlocked ? "bg-indigo-500/10 border border-indigo-500/20" : "bg-white/3"}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-sm font-semibold ${unlocked ? "text-indigo-300" : "text-white/50"}`}>{ach.title}</span>
                  <span className="text-xs text-white/30">{Math.round(progress)}/{ach.target} {ach.unit}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${unlocked ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-white/20"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews */}
      {myReviews.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Star size={16} className="text-amber-400" /> Reviews</h3>
          <div className="space-y-3">
            {myReviews.slice(0, 5).map((r, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${userGrad(r.fromUserId)} flex items-center justify-center text-xs font-bold text-white`}>{initials(r.fromUserName)}</div>
                  <span className="text-sm font-medium text-white/80">{r.fromUserName}</span>
                  <RatingStars rating={r.rating} size={12} />
                  <span className="ml-auto text-xs text-white/30">{timeAgo(r.createdAt)}</span>
                </div>
                {r.text && <p className="text-xs text-white/50 leading-relaxed">{r.text}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blocked Users */}
      {blockedUsers.length > 0 && (
        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2"><Shield size={16} className="text-red-400" /> Blocked Users ({blockedUsers.length})</h3>
          <div className="space-y-2">
            {blockedUsers.map((uid) => (
              <div key={uid} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${userGrad(uid)} flex items-center justify-center text-xs font-bold text-white`}>U</div>
                  <span className="text-sm text-white/60">{trunc(uid, 16)}</span>
                </div>
                <button onClick={() => onBlockUser(uid, false)} className="text-xs text-indigo-400 hover:text-indigo-300">Unblock</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="glass rounded-2xl p-5 border border-red-500/10">
        <h3 className="font-bold text-red-400 mb-4 flex items-center gap-2"><AlertTriangle size={16} /> Danger Zone</h3>
        <button onClick={onLogout} className="w-full py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 mb-2">
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );
};

// --- ANALYTICS PAGE ---
const AnalyticsPage = ({ user, listings, messages, reviews }) => {
  const myListings = listings.filter((l) => l.userId === user?.uid);
  const myMsgs = messages.filter((m) => m.fromUserId === user?.uid);
  const myReviews = reviews.filter((r) => r.toUserId === user?.uid);
  const totalViews = myListings.reduce((a, l) => a + (l.views || 0), 0);
  const responseRate = myMsgs.length > 0 ? Math.min(Math.round((myMsgs.length / Math.max(messages.filter((m) => m.toUserId === user?.uid).length, 1)) * 100), 100) : 0;
  const catDist = CATEGORIES.map((c) => ({ ...c, count: myListings.filter((l) => l.category === c.id).length })).filter((c) => c.count > 0);
  const maxCat = Math.max(...catDist.map((c) => c.count), 1);

  return (
    <div className="space-y-5 pb-8">
      <h2 className="text-xl font-black text-white flex items-center gap-2"><BarChart2 size={20} className="text-indigo-400" /> Analytics</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Views", value: totalViews, icon: Eye, color: "from-blue-500 to-indigo-500" },
          { label: "Messages Sent", value: myMsgs.length, icon: MessageSquare, color: "from-purple-500 to-pink-500" },
          { label: "Reviews Received", value: myReviews.length, icon: Star, color: "from-amber-500 to-orange-500" },
          { label: "Response Rate", value: `${responseRate}%`, icon: Activity, color: "from-emerald-500 to-teal-500" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass rounded-2xl p-4">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}><Icon size={16} className="text-white" /></div>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Listings Performance Bar Chart */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><BarChart2 size={16} className="text-indigo-400" /> Listing Views</h3>
        {myListings.length === 0 ? (
          <p className="text-sm text-white/30 text-center py-6">No listings yet</p>
        ) : (
          <div className="flex items-end gap-3 h-32 overflow-x-auto pb-2">
            {myListings.map((l, i) => {
              const maxV = Math.max(...myListings.map((x) => x.views || 0), 1);
              const h = Math.round(((l.views || 0) / maxV) * 100);
              return (
                <div key={l.id} className="flex flex-col items-center gap-1 shrink-0" style={{ width: 40 }}>
                  <span className="text-[9px] text-white/30">{l.views || 0}</span>
                  <div className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all duration-700" style={{ height: `${Math.max(h, 4)}%`, minHeight: 4 }} />
                  <span className="text-[9px] text-white/30 truncate w-full text-center">{trunc(l.skillOffered, 8)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Distribution */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Layers size={16} className="text-purple-400" /> Category Distribution</h3>
        {catDist.length === 0 ? (
          <p className="text-sm text-white/30 text-center py-6">No listings yet</p>
        ) : (
          <div className="space-y-3">
            {catDist.map((cat) => {
              const Icon = cat.icon;
              const pct = Math.round((cat.count / maxCat) * 100);
              return (
                <div key={cat.id} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center shrink-0`}><Icon size={12} className="text-white" /></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-white/70">{cat.label}</span>
                      <span className="text-xs text-white/40">{cat.count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${cat.color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Achievement Milestones */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Target size={16} className="text-emerald-400" /> Milestone Progress</h3>
        <div className="space-y-3">
          {[
            { label: "Views Milestone", current: totalViews, target: 1000 },
            { label: "Messages Milestone", current: myMsgs.length, target: 100 },
            { label: "Reviews Milestone", current: myReviews.length, target: 20 },
            { label: "Listings Milestone", current: myListings.length, target: 10 },
          ].map((m) => {
            const pct = Math.min(Math.round((m.current / m.target) * 100), 100);
            return (
              <div key={m.label}>
                <div className="flex justify-between text-xs text-white/50 mb-1">
                  <span>{m.label}</span>
                  <span>{m.current} / {m.target}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={() => alert("Data export coming soon!")} className="w-full py-3 glass border border-white/10 rounded-xl text-sm font-semibold text-white/60 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
        <Download size={15} /> Export Data (Coming Soon)
      </button>
    </div>
  );
};

// ============================================================
// SECTION 10: LAYOUT COMPONENTS
// ============================================================
const Header = ({ user, onNavigate, notifications, searchQuery, setSearchQuery, onLogout, darkMode, setDarkMode, unreadCount }) => {
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 glass border-b border-white/5 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("home")}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center glow-sm"><Zap size={16} className="text-white" /></div>
        <span className="font-black text-white hidden md:block">SkillSwap</span>
      </div>

      {/* Search */}
      <div className="flex-1 mx-4 max-w-md hidden md:block">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search skills..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-500 transition-colors" />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl glass border border-white/10 text-white/50 hover:text-white transition-colors">
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <div ref={notifRef} className="relative">
          <button onClick={() => setShowNotif(!showNotif)} className="relative p-2 rounded-xl glass border border-white/10 text-white/50 hover:text-white transition-colors">
            <Bell size={16} />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-[9px] font-bold text-white">{unreadCount}</span>}
          </button>
          {showNotif && <NotifPanel notifications={notifications} onClose={() => setShowNotif(false)} />}
        </div>
        <div ref={userRef} className="relative">
          <button onClick={() => setShowUserMenu(!showUserMenu)} className={`w-9 h-9 rounded-full bg-gradient-to-br ${userGrad(user?.uid)} flex items-center justify-center text-xs font-bold text-white border-2 border-white/10 hover:border-indigo-500/50 transition-colors`}>
            {initials(user?.displayName || "U")}
          </button>
          {showUserMenu && (
            <div className="absolute top-12 right-0 w-48 glass-strong border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden" style={{ animation: "fadeInDown 0.2s ease" }}>
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-xs font-semibold text-white/80 truncate">{user?.displayName || "User"}</p>
                <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
              </div>
              {[["Profile", "profile", User], ["My Listings", "mylistings", List], ["Analytics", "analytics", BarChart2]].map(([label, page, Icon]) => (
                <button key={page} onClick={() => { onNavigate(page); setShowUserMenu(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                  <Icon size={14} />{label}
                </button>
              ))}
              <div className="border-t border-white/5">
                <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </header>
  );
};

const Sidebar = ({ currentPage, onNavigate, messageCount = 0 }) => (
  <aside className="hidden md:flex flex-col w-56 lg:w-64 glass border-r border-white/5 shrink-0 py-4 overflow-y-auto">
    <nav className="flex-1 px-3 space-y-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;
        return (
          <button key={item.id} onClick={() => onNavigate(item.id)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white border border-indigo-500/20" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
            <Icon size={17} className={isActive ? "text-indigo-400" : ""} />
            {item.label}
            {item.id === "messages" && messageCount > 0 && <span className="ml-auto w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">{messageCount}</span>}
            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
          </button>
        );
      })}
    </nav>
    <div className="px-3 mt-4">
      <div className="glass-strong border border-white/5 rounded-xl p-3 text-center">
        <Sparkles size={16} className="text-indigo-400 mx-auto mb-1.5" />
        <p className="text-xs font-semibold text-white/60">Skill Economy</p>
        <p className="text-[10px] text-white/30">Trade what you know</p>
      </div>
    </div>
  </aside>
);

const BottomNav = ({ currentPage, onNavigate, messageCount = 0 }) => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/5 z-40 flex items-center px-2 py-2">
    {MOBILE_NAV.map((item) => {
      const Icon = item.icon;
      const isActive = currentPage === item.id;
      return (
        <button key={item.id} onClick={() => onNavigate(item.id)} className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-xl transition-all ${isActive ? "text-indigo-400" : "text-white/30"}`}>
          <div className="relative">
            <Icon size={20} className={isActive ? "text-indigo-400" : "text-white/30"} />
            {item.id === "messages" && messageCount > 0 && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-indigo-500 flex items-center justify-center text-[8px] font-bold text-white">{messageCount}</span>}
          </div>
          <span className={`text-[9px] font-medium ${isActive ? "text-indigo-400" : "text-white/30"}`}>{item.label}</span>
        </button>
      );
    })}
  </nav>
);

// ============================================================
// SECTION 11: MAIN APP COMPONENT
// ============================================================
export default function App() {
  // Auth & User State
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  // Navigation
  const [currentPage, setCurrentPage] = useState("landing");

  // Data State
  const [listings, setListings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // UI State
  const [toast, setToast] = useState(null);
  const [showScroll, setShowScroll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  // Modal State
  const [showWelcome, setShowWelcome] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [contactTarget, setContactTarget] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [profileTarget, setProfileTarget] = useState(null);
  const [editingListing, setEditingListing] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

  // ─── Toast Helper ───────────────────────────────────────────
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ─── Scroll tracking ────────────────────────────────────────
  useEffect(() => {
    const handler = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ─── Auth State Listener ─────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await loadUserData(firebaseUser.uid);
        setCurrentPage("home");
      } else {
        setUser(null);
        setUserData(null);
        setCurrentPage("landing");
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  // ─── Load User Data ──────────────────────────────────────────
  const loadUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setFavorites(data.favorites || []);
      }
    } catch (e) { console.error("Failed to load user data", e); }
  };

  // ─── Firestore Listeners ─────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    setDataLoading(true);

    const unsubListings = onSnapshot(
      query(collection(db, "listings"), orderBy("createdAt", "desc")),
      (snap) => { setListings(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); setDataLoading(false); },
      () => setDataLoading(false)
    );

    const unsubMessages = onSnapshot(
      query(collection(db, "messages"), orderBy("createdAt", "asc")),
      (snap) => setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    const unsubReviews = onSnapshot(
      query(collection(db, "reviews"), orderBy("createdAt", "desc")),
      (snap) => setReviews(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    const unsubNotifs = onSnapshot(
      query(collection(db, "notifications"), where("userId", "==", user.uid), orderBy("createdAt", "desc"), limit(20)),
      (snap) => setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    return () => { unsubListings(); unsubMessages(); unsubReviews(); unsubNotifs(); };
  }, [user]);

  // ─── AUTH HANDLERS ────────────────────────────────────────────
  const handleLogin = async (email, password) => {
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast("Welcome back!", "success");
    } catch (e) { setAuthError(e.message.replace("Firebase: ", "")); }
  };

  const handleSignup = async (name, email, password) => {
    setAuthError("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid, displayName: name, email, bio: "", blockedUsers: [], favorites: [],
        recentlyViewed: [], activityLog: {}, createdAt: serverTimestamp()
      });
      showToast("Account created! Welcome to SkillSwap 🎉", "success");
    } catch (e) { setAuthError(e.message.replace("Firebase: ", "")); }
  };

  const handleGoogle = async () => {
    setAuthError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const uRef = doc(db, "users", result.user.uid);
      const snap = await getDoc(uRef);
      if (!snap.exists()) {
        await setDoc(uRef, {
          uid: result.user.uid, displayName: result.user.displayName, email: result.user.email,
          bio: "", blockedUsers: [], favorites: [], recentlyViewed: [], activityLog: {}, createdAt: serverTimestamp()
        });
      }
      showToast("Signed in with Google!", "success");
    } catch (e) { setAuthError(e.message); }
  };

  const handleLogout = async () => {
    try { await signOut(auth); showToast("Signed out successfully", "info"); } catch (e) { }
  };

  const handleForgotPassword = async () => {
    const email = prompt("Enter your email address:");
    if (!email) return;
    try { await sendPasswordResetEmail(auth, email); showToast("Password reset email sent!", "success"); } catch (e) { showToast(e.message, "error"); }
  };

  // ─── LISTING HANDLERS ─────────────────────────────────────────
  const handlePostListing = async (formData) => {
    if (!user) return;
    try {
      if (editingListing) {
        await updateDoc(doc(db, "listings", editingListing.id), { ...formData, updatedAt: serverTimestamp() });
        showToast("Listing updated!", "success");
        setEditingListing(null);
      } else {
        await addDoc(collection(db, "listings"), {
          ...formData, userId: user.uid, userName: user.displayName || "Anonymous",
          createdAt: serverTimestamp(), views: 0, favoritesCount: 0
        });
        showToast("Listing posted! 🎉", "success");
        await logActivity();
      }
      setCurrentPage("mylistings");
    } catch (e) { showToast("Failed to post listing", "error"); }
  };

  const handleDeleteListing = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(db, "listings", deleteTarget.id));
      showToast("Listing deleted", "info");
      setDeleteTarget(null);
    } catch (e) { showToast("Failed to delete", "error"); }
  };

  const handleFavorite = async (listingId) => {
    if (!user) return;
    const isFav = favorites.includes(listingId);
    const updated = isFav ? favorites.filter((f) => f !== listingId) : [...favorites, listingId];
    setFavorites(updated);
    try {
      await updateDoc(doc(db, "users", user.uid), { favorites: isFav ? arrayRemove(listingId) : arrayUnion(listingId) });
      await updateDoc(doc(db, "listings", listingId), { favoritesCount: increment(isFav ? -1 : 1) });
      showToast(isFav ? "Removed from favorites" : "Added to favorites ♥", isFav ? "info" : "success");
    } catch (e) { setFavorites(favorites); }
  };

  // ─── MESSAGE HANDLERS ─────────────────────────────────────────
  const handleSendMessage = async (toUserId, toUserName, text) => {
    if (!user || !text.trim()) return;
    try {
      await addDoc(collection(db, "messages"), {
        fromUserId: user.uid, fromUserName: user.displayName || "Anonymous",
        toUserId, toUserName, text, createdAt: serverTimestamp(), read: false
      });
      await logActivity();
    } catch (e) { showToast("Failed to send message", "error"); }
  };

  const handleContact = (listing) => {
    setContactTarget(listing);
  };

  const handleMessageFromContact = (listing) => {
    setContactTarget(null);
    setActiveChat({ userId: listing.userId, name: listing.userName || "User" });
    setCurrentPage("messages");
  };

  const handleMessageFromProfile = (userId, name) => {
    setProfileTarget(null);
    setActiveChat({ userId, name });
    setCurrentPage("messages");
  };

  // ─── REPORT HANDLER ───────────────────────────────────────────
  const handleReport = async (reason) => {
    if (!user || !reportTarget) return;
    try {
      await addDoc(collection(db, "reports"), {
        listingId: reportTarget.id, reportedBy: user.uid, reason, createdAt: serverTimestamp()
      });
      showToast("Report submitted. Thank you!", "success");
      setReportTarget(null);
    } catch (e) { showToast("Failed to submit report", "error"); }
  };

  // ─── REVIEW HANDLER ───────────────────────────────────────────
  const handleReview = async (rating, text) => {
    if (!user || !reviewTarget) return;
    try {
      await addDoc(collection(db, "reviews"), {
        fromUserId: user.uid, fromUserName: user.displayName || "Anonymous",
        toUserId: reviewTarget.userId, toUserName: reviewTarget.userName,
        rating, text, createdAt: serverTimestamp()
      });
      showToast("Review submitted!", "success");
      setReviewTarget(null);
    } catch (e) { showToast("Failed to submit review", "error"); }
  };

  // ─── PROFILE UPDATE ───────────────────────────────────────────
  const handleUpdateProfile = async (name, bio) => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName: name });
      await updateDoc(doc(db, "users", user.uid), { displayName: name, bio });
      showToast("Profile updated!", "success");
    } catch (e) { showToast("Failed to update profile", "error"); }
  };

  // ─── BLOCK USER ───────────────────────────────────────────────
  const handleBlockUser = async (targetId, block = true) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), { blockedUsers: block ? arrayUnion(targetId) : arrayRemove(targetId) });
      setUserData((prev) => ({
        ...prev,
        blockedUsers: block ? [...(prev?.blockedUsers || []), targetId] : (prev?.blockedUsers || []).filter((id) => id !== targetId)
      }));
      showToast(block ? "User blocked" : "User unblocked", "info");
    } catch (e) { showToast("Action failed", "error"); }
  };

  // ─── ACTIVITY LOGGER ──────────────────────────────────────────
  const logActivity = async () => {
    if (!user) return;
    try {
      const key = todayKey();
      await updateDoc(doc(db, "users", user.uid), { [`activityLog.${key}`]: increment(1) });
    } catch (e) { }
  };

  // ─── UNREAD MESSAGE COUNT ─────────────────────────────────────
  const unreadMessages = useMemo(() => {
    if (!user) return 0;
    return messages.filter((m) => m.toUserId === user.uid && !m.read).length;
  }, [messages, user]);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  // ─── NAVIGATE ─────────────────────────────────────────────────
  const navigate = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (page !== "post") setEditingListing(null);
    if (page !== "messages") { /* keep activeChat */ }
  }, []);

  const handleEdit = (listing) => { setEditingListing(listing); navigate("post"); };

  // ─── RENDER ───────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-4 glow animate-pulse"><Zap size={28} className="text-white" /></div>
          <p className="text-white/40 text-sm animate-pulse">Loading SkillSwap...</p>
        </div>
      </div>
    );
  }

  // Pre-auth screens
  if (!user) {
    if (currentPage === "login") {
      return (
        <>
          <LoginPage onLogin={handleLogin} onGoogleLogin={handleGoogle} onForgotPassword={handleForgotPassword} onGoSignup={() => setCurrentPage("signup")} error={authError} loading={false} />
          {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
        </>
      );
    }
    if (currentPage === "signup") {
      return (
        <>
          <SignupPage onSignup={handleSignup} onGoogleLogin={handleGoogle} onGoLogin={() => setCurrentPage("login")} error={authError} loading={false} />
          {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
        </>
      );
    }
    return (
      <>
        <LandingPage onLogin={() => setCurrentPage("login")} onSignup={() => setCurrentPage("signup")} />
        {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
      </>
    );
  }

  // ─── MAIN APP ─────────────────────────────────────────────────
  const renderPage = () => {
    if (dataLoading && listings.length === 0) return <LoadingSkeleton count={6} />;
    switch (currentPage) {
      case "home":
        return <HomePage user={user} userData={userData} listings={listings} reviews={reviews} favorites={favorites} onNavigate={navigate} onFavorite={handleFavorite} onContact={handleContact} onViewProfile={(uid) => setProfileTarget(uid)} onReport={(l) => setReportTarget(l)} />;
      case "explore":
        return <ExplorePage user={user} listings={listings} favorites={favorites} userData={userData} onFavorite={handleFavorite} onContact={handleContact} onReport={(l) => setReportTarget(l)} onViewProfile={(uid) => setProfileTarget(uid)} />;
      case "messages":
        return <MessagesPage user={user} messages={messages} onSend={handleSendMessage} activeChat={activeChat} setActiveChat={setActiveChat} listings={listings} />;
      case "post":
        return <PostPage user={user} userData={userData} onSubmit={handlePostListing} editingListing={editingListing} onCancelEdit={() => { setEditingListing(null); navigate("mylistings"); }} />;
      case "favorites":
        return <FavoritesPage user={user} listings={listings} favorites={favorites} userData={userData} onFavorite={handleFavorite} onContact={handleContact} onReport={(l) => setReportTarget(l)} onViewProfile={(uid) => setProfileTarget(uid)} onNavigate={navigate} />;
      case "mylistings":
        return <MyListingsPage user={user} listings={listings} favorites={favorites} reviews={reviews} onEdit={handleEdit} onDelete={(l) => setDeleteTarget(l)} onNavigate={navigate} />;
      case "leaderboard":
        return <LeaderboardPage user={user} listings={listings} reviews={reviews} />;
      case "analytics":
        return <AnalyticsPage user={user} listings={listings} messages={messages} reviews={reviews} />;
      case "profile":
        return <ProfilePage user={user} userData={userData} listings={listings} reviews={reviews} favorites={favorites} messages={messages} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} onNavigate={navigate} onBlockUser={handleBlockUser} showToast={showToast} />;
      default:
        return <HomePage user={user} userData={userData} listings={listings} reviews={reviews} favorites={favorites} onNavigate={navigate} onFavorite={handleFavorite} onContact={handleContact} onViewProfile={(uid) => setProfileTarget(uid)} onReport={(l) => setReportTarget(l)} />;
    }
  };

  return (
    <div className={`min-h-screen bg-dark-950 text-white ${darkMode ? "" : "brightness-110"}`}>
      {/* Global Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-purple-600/5 blur-[100px]" />
      </div>

      {/* Layout */}
      <div className="relative z-10 flex flex-col h-screen">
        <Header user={user} onNavigate={navigate} notifications={notifications} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} unreadCount={unreadNotifs} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar currentPage={currentPage} onNavigate={navigate} messageCount={unreadMessages} />
          <main className="flex-1 overflow-y-auto px-4 md:px-6 lg:px-8 py-5">
            {renderPage()}
          </main>
        </div>
        <BottomNav currentPage={currentPage} onNavigate={navigate} messageCount={unreadMessages} />
      </div>

      {/* Modals */}
      {deleteTarget && <DeleteModal itemName={`"${deleteTarget.skillOffered}"`} onConfirm={handleDeleteListing} onCancel={() => setDeleteTarget(null)} />}
      {contactTarget && <ContactModal listing={contactTarget} onClose={() => setContactTarget(null)} onMessage={handleMessageFromContact} />}
      {reportTarget && <ReportModal listing={reportTarget} onSubmit={handleReport} onClose={() => setReportTarget(null)} />}
      {reviewTarget && <ReviewModal targetUser={reviewTarget} onSubmit={handleReview} onClose={() => setReviewTarget(null)} />}
      {profileTarget && <UserProfileModal userId={profileTarget} listings={listings} reviews={reviews} onClose={() => setProfileTarget(null)} onMessage={handleMessageFromProfile} />}

      {/* Toast */}
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}

      {/* Scroll to top */}
      <ScrollToTop show={showScroll} />

      <style>{`
        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(12px); }
        .glass-strong { background: rgba(255,255,255,0.06); backdrop-filter: blur(20px); }
        .gradient-text { background: linear-gradient(135deg, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .glow { box-shadow: 0 0 20px rgba(99,102,241,0.4); }
        .glow-sm { box-shadow: 0 0 10px rgba(99,102,241,0.3); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease; }
        select option { background: #0f172a; color: white; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.5); }
      `}</style>
    </div>
  );
}
