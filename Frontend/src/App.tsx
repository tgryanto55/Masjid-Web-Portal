
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './components/Layouts/PublicLayout';
import { AdminLayout } from './components/Layouts/AdminLayout';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';


import Home from './pages/public/Home';
import About from './pages/public/About';
import Events from './pages/public/Events';
import Donation from './pages/public/Donation';
import Contact from './pages/public/Contact';


import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManagePrayerTimes from './pages/admin/ManagePrayerTimes';
import ManageEvents from './pages/admin/ManageEvents';
import EditAbout from './pages/admin/EditAbout';
import ManageFinance from './pages/admin/ManageFinace';
import ManageDonation from './pages/admin/ManageDonation';
import EditContact from './pages/admin/EditContact';

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="events" element={<Events />} />
              <Route path="donation" element={<Donation />} />
              <Route path="contact" element={<Contact />} />
              <Route path="login" element={<Login />} />
            </Route>


            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="prayer-times" element={<ManagePrayerTimes />} />
              <Route path="events" element={<ManageEvents />} />
              <Route path="finance" element={<ManageFinance />} />
              <Route path="donation" element={<ManageDonation />} />
              <Route path="contact" element={<EditContact />} />
              <Route path="content" element={<EditAbout />} />
            </Route>


            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;