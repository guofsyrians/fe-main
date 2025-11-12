import React from 'react';
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import SubUnions from './pages/SubUnions';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Offices from './pages/Offices';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyInfo from './pages/MyInfo';
import Graduates from './pages/Graduates';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="App flex flex-col min-h-screen">
          <BrowserRouter>
            <ScrollToTop />
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sub-unions" element={<SubUnions />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/articles/:id" element={<ArticleDetail />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/offices" element={<Offices />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/my-info" element={<MyInfo />} />
                <Route 
                  path="/graduates" 
                  element={
                    <ProtectedRoute>
                      <Graduates />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </BrowserRouter>
          <Toaster position="top-center" richColors />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
