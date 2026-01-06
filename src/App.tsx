
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { DailyView, WeeklyView, CalendarView, AnalyticsView, SettingsView, Login, Signup, CoachView, LeaderboardView } from './pages';
import { ThreeDBackground } from './components/ui/ThreeDBackground';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { HabitProvider } from './context/HabitContext';
import { TodoProvider } from './context/TodoContext';

import { LoadingSpinner } from './components/ui/LoadingSpinner';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <div className="fade-in">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }>
          <Route index element={<DailyView />} />
          <Route path="weekly" element={<WeeklyView />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="analytics" element={<AnalyticsView />} />
          <Route path="coach" element={<CoachView />} />
          <Route path="leaderboard" element={<LeaderboardView />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ThreeDBackground />
        <HabitProvider>
          <TodoProvider>
            <AppRoutes />
          </TodoProvider>
        </HabitProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
