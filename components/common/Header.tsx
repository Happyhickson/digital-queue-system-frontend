import React from 'react';
import Button from './Button';
import { View } from '../../types';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  onHomeClick: () => void;
  onLoginClick: () => void;
  currentView: View;
  onDashboardClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogout, onHomeClick, onLoginClick, currentView, onDashboardClick }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onHomeClick}>
          <svg className="w-8 h-8 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Digital Queue System</h1>
        </div>
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              {currentView === View.Landing && (
                <Button onClick={onDashboardClick} variant="secondary">
                  Dashboard
                </Button>
              )}
              <Button onClick={onLogout} variant="secondary">
                Logout
              </Button>
            </>
          ) : (
             <Button onClick={onLoginClick} variant="secondary">
              Staff Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;