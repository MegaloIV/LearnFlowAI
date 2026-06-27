import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './app/AppLayout';
import { RequireAuth, RequireProfile, RedirectIfAuthed } from './app/guards';
import { Toaster } from './components/Toaster';

import { LandingPage } from './features/landing/LandingPage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { RecoverPage } from './features/auth/RecoverPage';
import { ProfileWizard } from './features/profile/ProfileWizard';
import { ProfilePage } from './features/profile/ProfilePage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { DiagnosticPage } from './features/diagnostic/DiagnosticPage';
import { DiagnosticResultsPage } from './features/diagnostic/DiagnosticResultsPage';
import { PathPage } from './features/paths/PathPage';
import { ModuleDetailPage } from './features/paths/ModuleDetailPage';
import { RecommendationsPage } from './features/recommendations/RecommendationsPage';
import { AssistantPage } from './features/recommendations/AssistantPage';
import { ActivitiesPage } from './features/activities/ActivitiesPage';
import { ProgressPage } from './features/progress/ProgressPage';
import { ProductivityPage } from './features/productivity/ProductivityPage';
import { GamificationPage } from './features/gamification/GamificationPage';
import { ExplorePage } from './features/explore/ExplorePage';

export default function App() {
  return (
    <>
      <Routes>
        {/* Landing */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login" element={<RedirectIfAuthed><LoginPage /></RedirectIfAuthed>} />
        <Route path="/register" element={<RedirectIfAuthed><RegisterPage /></RedirectIfAuthed>} />
        <Route path="/recover" element={<RedirectIfAuthed><RecoverPage /></RedirectIfAuthed>} />

        {/* Onboarding (requiere auth, sin perfil aún) */}
        <Route path="/onboarding" element={<RequireAuth><ProfileWizard /></RequireAuth>} />

        {/* App (requiere perfil) */}
        <Route
          element={
            <RequireProfile>
              <AppLayout />
            </RequireProfile>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/diagnostic" element={<DiagnosticPage />} />
          <Route path="/diagnostic/results" element={<DiagnosticResultsPage />} />
          <Route path="/path" element={<PathPage />} />
          <Route path="/path/module/:pathModuleId" element={<ModuleDetailPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/productivity" element={<ProductivityPage />} />
          <Route path="/gamification" element={<GamificationPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}
