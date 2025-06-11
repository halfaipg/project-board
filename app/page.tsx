'use client';

import { useState, useEffect } from 'react';
import ProjectTableView from './components/ProjectTableView';
import LoginForm from './components/LoginForm';
import { getProjectConfig } from './config/env';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [viewerName, setViewerName] = useState('');
  const [isSharedView, setIsSharedView] = useState(false);
  const [config, setConfig] = useState(getProjectConfig());
  
  // Update config when component mounts on client
  useEffect(() => {
    setConfig(getProjectConfig());
  }, []);
  
  // Parse URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      
      // Check for viewer parameter
      const encodedViewer = params.get('v');
      if (encodedViewer) {
        try {
          // Decode the Base64 encoded viewer name
          const decodedViewer = atob(encodedViewer);
          setViewerName(decodedViewer);
          setIsLoggedIn(true);
          setIsReadOnly(true); // Always read-only for shared views
          setIsSharedView(true);
        } catch (error) {
          console.error('Error decoding viewer name:', error);
        }
      } else {
        // Check for stored login
        const storedUser = localStorage.getItem('board_user');
        if (storedUser) {
          setUsername(storedUser);
          setIsLoggedIn(true);
        }
      }
    }
  }, []);
  
  const handleLogin = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
    localStorage.setItem('board_user', user);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('board_user');
  };
  
  const createShareableLink = () => {
    const viewerName = prompt('Enter name for the viewer:');
    if (!viewerName) return;
    
    // Encode the viewer name with Base64
    const encodedViewer = btoa(viewerName);
    
    // Create read-only links for sharing (mode parameter removed)
    const url = `${window.location.origin}${window.location.pathname}?v=${encodedViewer}`;
    
    // Use a try-catch block for clipboard operations
    try {
      navigator.clipboard.writeText(url)
        .then(() => alert('Shareable link copied to clipboard! The viewer will be able to view the board and add comments.'))
        .catch(() => {
          alert(`Shareable link: ${url}\n\nPlease copy this link manually.`);
        });
    } catch (err) {
      alert(`Shareable link: ${url}\n\nPlease copy this link manually.`);
    }
  };
  
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between w-full px-1 sm:px-4 lg:px-6 py-2 sm:py-3">
          <div className="flex items-center">
            {config.logo && (
              <img 
                src={config.logo} 
                alt="Logo"
                className="h-6 w-6 sm:h-8 sm:w-8 mr-1 md:mr-4"
                onError={(e) => {
                  // Hide logo if it fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <h1 className="text-base md:text-xl font-semibold text-gray-900">Project Board</h1>
            <span className="ml-1 md:ml-4 text-xs text-gray-500 px-1 sm:px-2 py-0.5 sm:py-1 bg-gray-100 rounded-full">Main</span>
          </div>
          <div className="flex items-center space-x-1 md:space-x-3">
            <div className="flex items-center">
              <div className="flex items-center">
                <span className="text-xs md:text-sm text-gray-700 mr-1 md:mr-3 hidden sm:inline">
                  {viewerName || username}
                </span>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              </div>
              {!isSharedView && (
                <>
                  <button 
                    onClick={createShareableLink}
                    className="text-xs md:text-sm text-blue-600 hover:text-blue-800 ml-1 md:ml-4 mr-1 md:mr-3"
                  >
                    Share
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="text-xs md:text-sm text-gray-500 hover:text-gray-700"
                  >
                    Exit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <div className="w-full px-0">
        <ProjectTableView 
          isReadOnly={isReadOnly} 
          currentUser={viewerName || username} 
        />
      </div>
    </main>
  );
}
