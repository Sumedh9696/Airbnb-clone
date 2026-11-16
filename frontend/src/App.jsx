import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import SearchModal from './components/SearchModal';
import HomePage from './pages/HomePage';
import ListingDetailPage from './pages/ListingDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBookingsPage from './pages/MyBookingsPage';
import HostDashboardPage from './pages/HostDashboardPage';

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar onOpenSearch={() => setIsSearchOpen(true)} />

          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSearch={(newFilters) => setSearchFilters(newFilters)}
            currentFilters={searchFilters}
          />

          <main className="main-content">
            <Routes>
              <Route
                path="/"
                element={
                  <HomePage
                    filters={searchFilters}
                    onResetFilters={() => setSearchFilters({})}
                  />
                }
              />
              <Route path="/listings/:id" element={<ListingDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/trips" element={<MyBookingsPage />} />
              <Route path="/host/dashboard" element={<HostDashboardPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
