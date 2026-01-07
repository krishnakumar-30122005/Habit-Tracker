# Changelog

## [2.0.0] - System 2.0 Upgrade
Major update introducing Admin capabilities, AI integration, and Social features.

### ✨ New Features

#### 🧠 AI Habit Coach
- **Smart Analysis**: Personalized habit insights using LLMs.
- **Coach Dashboard**: Dedicated view (`/coach`) showing Strengths, Patterns, and Goals.
- **Fallback Logic**: Robust system that works even if the AI API is unavailable.

#### 👥 Social Community
- **Community Hub**: New section (`/social`) for user interaction.
- **Public Challenges**: "30-Day Mindfulness", "75 Hard", etc.
- **Activity Feed**: Real-time updates of community progress.

#### 📊 Analytics 2.0
- **Heatmap**: Yearly consistency visualization (GitHub-style).
- **Radar Charts**: Day-of-week focus analysis.
- **Premium UI**: "Dark Glass" aesthetic for all charts.

#### 🛡️ Admin Portal
- **Dashboard**: High-level system statistics.
- **User Management**: Search, view, and delete users.
- **System Settings**: Global controls for registrations and maintenance.
- **Role-Based Access**: Secure middleware protecting admin routes.

### 🛠️ Technical Improvements
- **Robust Layouts**: Moved away from pure utility classes to dedicated CSS Grid layouts for Admin pages.
- **Database Stability**: Forced IPv4 connection to resolve MongoDB Atlas dropouts.
- **Gamification**: Added XP and Leveling system foundation.

### 🐛 Bug Fixes
- Fixed "packed together" layout issues in Admin Dashboard and Users page.
- Resolved MongoDB `ServerSelectionError` via IP whitelist and IPv4 enforcement.
