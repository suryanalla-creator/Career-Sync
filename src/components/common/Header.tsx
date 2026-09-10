import React, { useState } from 'react';
import {
  Search,
  Bell,
  MessageSquare,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  GraduationCap,
  Briefcase,
  Building2,
  Compass,
  LogOut,
  UserPlus,
  LogIn,
  Phone,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, AuthRole } from '../../types';

export const Header: React.FC = () => {
  const {
    role,
    pageView,
    setPageView,
    setSelectedAuthRole,
    setIsGetStartedModalOpen,
    navigateToRole,
    logoutUser,
    studentProfile,
    notifications,
    conversations,
    setIsSearchOpen,
    setIsNotificationsOpen,
    setIsMessagesOpen,
    startPhoneCall,
    setIsOnboardingGuideOpen,
    setIsAuthModalOpen,
    setAuthMode
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSwitchRole = (targetRole: AuthRole) => {
    setIsRoleDropdownOpen(false);
    setIsMobileMenuOpen(false);
    if (role === targetRole) return;
    setSelectedAuthRole(targetRole);
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const unreadNotifsCount = Array.isArray(notifications) ? notifications.filter(n => !n?.isRead).length : 0;
  const unreadMsgsCount = Array.isArray(conversations) ? conversations.reduce((acc, c) => acc + (c?.unreadCount || 0), 0) : 0;

  const getRoleDetails = (r: UserRole) => {
    switch (r) {
      case 'student':
        return {
          title: 'Student Portal',
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          name: studentProfile?.name || 'Student Portal',
          sub: studentProfile?.college || 'Computer Science & Engineering',
          avatar: studentProfile?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
        };
      case 'industry':
        return {
          title: 'Industry Portal',
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
          name: 'TechNova Solutions',
          sub: 'Corporate Recruiter',
          avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&auto=format&fit=crop&q=80'
        };
      case 'institution':
        return {
          title: 'Institution Admin',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          name: 'Apex Institute of Tech',
          sub: 'Dean of Placements',
          avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80'
        };
      default:
        return {
          title: 'Public Portal',
          badge: 'bg-slate-100 text-slate-800 border-slate-200',
          name: 'Guest Explorer',
          sub: 'CAREER SYNC',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
        };
    }
  };

  const currentRoleInfo = getRoleDetails(role);
  const isPublicView = role === 'landing' || pageView !== 'portal';

  const handleNavClick = (target: string) => {
    switch (target) {
      case 'home':
        setPageView('landing');
        break;
      case 'about':
        setPageView('landing');
        setTimeout(() => {
          const el = document.getElementById('about-section') || document.getElementById('roles-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        break;
      case 'students':
        setPageView('students');
        break;
      case 'industries':
        setPageView('industries');
        break;
      case 'institutions':
        setPageView('institutions');
        break;
      default:
        setPageView('landing');
    }
    setIsMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    setSelectedAuthRole('student');
    setPageView('login');
    setIsMobileMenuOpen(false);
  };

  const handleRegisterClick = () => {
    setSelectedAuthRole('student');
    setPageView('register');
    setIsMobileMenuOpen(false);
  };

  const handleGetStartedClick = () => {
    setIsGetStartedModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Logo & Platform Tag */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPageView('landing')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                  CAREER <span className="text-blue-600">SYNC</span>
                </span>
                <p className="text-[10px] font-medium text-slate-500 tracking-wider uppercase hidden sm:block">
                  Academia–Industry Collaboration
                </p>
              </div>
            </button>

            {/* Current Active Role Badge when in a dashboard */}
            {!isPublicView && (
              <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentRoleInfo.badge}`}>
                  {currentRoleInfo.title}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation for Public / Landing Modes: Home, About, Students, Industries, Institutions */}
          {isPublicView ? (
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
              <button onClick={() => handleNavClick('home')} className={`hover:text-blue-600 transition-colors ${pageView === 'landing' ? 'text-blue-600 font-bold' : ''}`}>Home</button>
              <button onClick={() => handleNavClick('about')} className="hover:text-blue-600 transition-colors">About</button>
              <button onClick={() => handleNavClick('students')} className={`hover:text-blue-600 transition-colors ${pageView === 'students' ? 'text-blue-600 font-bold' : ''}`}>Students</button>
              <button onClick={() => handleNavClick('industries')} className={`hover:text-blue-600 transition-colors ${pageView === 'industries' ? 'text-purple-600 font-bold' : ''}`}>Industries</button>
              <button onClick={() => handleNavClick('institutions')} className={`hover:text-blue-600 transition-colors ${pageView === 'institutions' ? 'text-amber-600 font-bold' : ''}`}>Institutions</button>
            </nav>
          ) : (
            /* Search Trigger Bar in App Portals */
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-lg text-xs text-slate-500 transition-colors shadow-inner"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  Search jobs, internships, courses, projects, skills...
                </span>
                <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-sm">
                  Ctrl K
                </kbd>
              </button>
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isPublicView ? (
              /* Landing & Public Page CTAs: Login | Register | Get Started */
              <div className="flex items-center gap-2 sm:gap-2.5">
                <button
                  onClick={() => setIsOnboardingGuideOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-all hidden md:flex items-center gap-1.5 cursor-pointer"
                  title="How to Use Career Sync"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>How to Use</span>
                </button>

                <button
                  onClick={handleLoginClick}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 border border-slate-200 rounded-lg hover:border-slate-300 transition-all hidden sm:block"
                >
                  Login
                </button>

                <button
                  onClick={handleRegisterClick}
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 border border-slate-200 rounded-lg hover:border-slate-300 transition-all hidden sm:block"
                >
                  Register
                </button>

                <button
                  onClick={handleGetStartedClick}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-105"
                >
                  Get Started
                </button>
              </div>
            ) : (
              /* Logged In Portal Controls */
              <>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Notifications Button */}
                <button
                  onClick={() => setIsNotificationsOpen(true)}
                  className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {/* Messages Button (Chat Box) */}
                <button
                  onClick={() => setIsMessagesOpen(true)}
                  className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Direct Messages & Chat"
                  title="Direct Messages & Chat Box"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadMsgsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 px-1 min-w-[16px] h-4 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                      {unreadMsgsCount}
                    </span>
                  )}
                </button>

                {/* Direct Phone Call Button */}
                <button
                  onClick={() => startPhoneCall()}
                  className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors group"
                  aria-label="Direct Phone Call & Voice Consultation"
                  title="Direct Phone Call & Voice Consultation"
                >
                  <Phone className="w-5 h-5 text-slate-600 group-hover:text-emerald-600 transition-colors" />
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
                </button>

                {/* How to Use Quick Guide Button */}
                <button
                  onClick={() => setIsOnboardingGuideOpen(true)}
                  className="p-1.5 sm:px-2.5 sm:py-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  title="How to Use Career Sync Guide"
                  aria-label="How to Use Career Sync Guide"
                >
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span className="hidden sm:inline">How to Use</span>
                </button>

                {/* Role Switcher & User Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full transition-colors"
                  >
                    <img
                      src={currentRoleInfo.avatar}
                      alt={currentRoleInfo.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-300"
                    />
                    <span className="text-xs font-semibold text-slate-800 hidden lg:inline max-w-[120px] truncate">
                      {currentRoleInfo.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 mr-1" />
                  </button>

                  {/* Dropdown Menu */}
                  {isRoleDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-500 font-medium">Switch Active Portal:</p>
                      </div>

                      <div className="p-1 space-y-0.5">
                        <button
                          onClick={() => handleSwitchRole('student')}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${role === 'student' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <GraduationCap className="w-4 h-4 text-blue-600" />
                          <div>
                            <p>Student Portal</p>
                            <span className="text-[10px] text-slate-400">{studentProfile?.name || 'Student'} • {studentProfile?.department?.split(' ')[0] || 'CSE'}</span>
                          </div>
                        </button>

                        <button
                          onClick={() => handleSwitchRole('industry')}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${role === 'industry' ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <Briefcase className="w-4 h-4 text-purple-600" />
                          <div>
                            <p>Industry & Recruiter</p>
                            <span className="text-[10px] text-slate-400">TechNova Solutions</span>
                          </div>
                        </button>

                        <button
                          onClick={() => handleSwitchRole('institution')}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${role === 'institution' ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                          <Building2 className="w-4 h-4 text-amber-600" />
                          <div>
                            <p>Institution Administrator</p>
                            <span className="text-[10px] text-slate-400">Apex Institute of Tech</span>
                          </div>
                        </button>
                      </div>

                      <div className="pt-2 mt-1 border-t border-slate-100 px-1 space-y-0.5">
                        <button
                          onClick={() => { setPageView('landing'); setIsRoleDropdownOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 text-left transition-colors"
                        >
                          <Compass className="w-4 h-4 text-slate-400" />
                          Return to Public Home
                        </button>
                        <button
                          onClick={() => { logoutUser(); setIsRoleDropdownOpen(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 text-left transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile Navigation Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {isPublicView ? (
            <>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Navigation
              </div>

              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => handleNavClick('home')}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold transition-colors ${pageView === 'landing' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavClick('about')}
                  className="p-2.5 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => handleNavClick('students')}
                  className={`p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-colors ${pageView === 'students' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-blue-50'}`}
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" /> Students
                </button>
                <button
                  onClick={() => handleNavClick('industries')}
                  className={`p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-colors ${pageView === 'industries' ? 'bg-purple-50 text-purple-600 font-bold' : 'text-slate-700 hover:bg-purple-50'}`}
                >
                  <Briefcase className="w-4 h-4 text-purple-600" /> Industries
                </button>
                <button
                  onClick={() => handleNavClick('institutions')}
                  className={`p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-colors ${pageView === 'institutions' ? 'bg-amber-50 text-amber-600 font-bold' : 'text-slate-700 hover:bg-amber-50'}`}
                >
                  <Building2 className="w-4 h-4 text-amber-600" /> Institutions
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleLoginClick}
                    className="py-2 px-3 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 hover:bg-slate-50"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-500" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    className="py-2 px-3 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 hover:bg-slate-200"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-slate-500" />
                    <span>Register</span>
                  </button>
                </div>
                <button
                  onClick={handleGetStartedClick}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold text-center shadow-sm transition-colors"
                >
                  Get Started
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Logged in mobile menu */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <img
                  src={currentRoleInfo.avatar}
                  alt={currentRoleInfo.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-300"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">{currentRoleInfo.name}</p>
                  <p className="text-[11px] text-slate-500">{currentRoleInfo.title} • {currentRoleInfo.sub}</p>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-1">
                Switch Portal
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => handleSwitchRole('student')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${role === 'student' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Student Portal</span>
                </button>
                <button
                  onClick={() => handleSwitchRole('industry')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${role === 'industry' ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <span>Industry Portal</span>
                </button>
                <button
                  onClick={() => handleSwitchRole('institution')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-colors ${role === 'institution' ? 'bg-amber-50 text-amber-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Institution Portal</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <button
                  onClick={() => { setPageView('landing'); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 text-left transition-colors"
                >
                  <Compass className="w-4 h-4 text-slate-400" />
                  <span>Return to Public Home</span>
                </button>
                <button
                  onClick={() => { logoutUser(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 text-left transition-colors"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};

