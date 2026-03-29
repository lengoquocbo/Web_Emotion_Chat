// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/Home/HomePage'
import GroupsPage from './pages/Groups/GroupsPage'
import AnalyticsPage from './pages/Analytics/AnalyticsPage'
import AISupportPage from './pages/AISupport/AISupportPage'
import ChatFriendPage from './pages/ChatFriend/ChatFriendPage'
import ProfilePage from './pages/Profile/ProfilePage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<AppLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/ai" element={<AISupportPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/friends" element={<ChatFriendPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

export default App
