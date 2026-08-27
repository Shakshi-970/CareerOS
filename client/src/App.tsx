import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { SplashPage } from '@/pages/SplashPage'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { DnaReportPage } from '@/pages/DnaReportPage'
import { SkillGapPage } from '@/pages/SkillGapPage'
import { LearningPage } from '@/pages/LearningPage'
import { JobMatchPage } from '@/pages/JobMatchPage'
import { InterviewPage } from '@/pages/InterviewPage'
import { ConnectPage } from '@/pages/ConnectPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/report" element={<DnaReportPage />} />
          <Route path="/skills" element={<SkillGapPage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/jobs" element={<JobMatchPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
