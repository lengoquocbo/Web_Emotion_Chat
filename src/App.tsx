// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/Home/HomePage'
import GroupsPage from './pages/Groups/GroupsPage'
import AnalyticsPage from './pages/Analytics/AnalyticsPage'
import AISupportPage from './pages/AISupport/AISupportPage'
import ProfilePage from './pages/Profile/ProfilePage'
import LandingPage from './pages/LandingPage'
import Bgtest from './test/bgtest'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<AppLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/ai" element={<AISupportPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

export default App