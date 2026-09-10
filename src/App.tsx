import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { OpportunityDetailModal } from './components/common/OpportunityDetailModal';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { MessagesDrawer } from './components/common/MessagesDrawer';
import { PhoneCallModal } from './components/common/PhoneCallModal';
import { AuthModal } from './components/common/AuthModal';
import { SettingsView } from './components/common/SettingsView';
import { LandingPage } from './components/landing/LandingPage';
import { RoleLandingPage } from './components/landing/RoleLandingPage';
import { GlobalOpportunitiesView } from './components/common/GlobalOpportunitiesView';
import { HowToUseGuideModal } from './components/student/HowToUseGuideModal';

// Auth Pages & Modals
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { GetStartedModal } from './components/auth/GetStartedModal';

// Student Portal Views
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentProfileView } from './components/student/StudentProfileView';
import { SkillAssessmentView } from './components/student/SkillAssessmentView';
import { SkillProfileView } from './components/student/SkillProfileView';
import { CareerPathView } from './components/student/CareerPathView';
import { JobOpportunitiesView } from './components/student/JobOpportunitiesView';
import { InternshipsView } from './components/student/InternshipsView';
import { JobsAndInternshipsView } from './components/student/JobsAndInternshipsView';
import { OnlineCoursesView } from './components/student/OnlineCoursesView';
import { RecommendedForYouView } from './components/student/RecommendedForYouView';
import { ApplicationsTrackerView } from './components/student/ApplicationsTrackerView';
import { MyInternshipsView } from './components/student/MyInternshipsView';
import { DigitalPortfolioView } from './components/student/DigitalPortfolioView';
import { MyProjectsView } from './components/student/MyProjectsView';
import { MentorshipView } from './components/student/MentorshipView';
import { EventsView } from './components/student/EventsView';
import { ResumeBuilderView } from './components/student/ResumeBuilderView';

// Industry Portal Views
import { IndustryDashboard } from './components/industry/IndustryDashboard';
import { PostJobView } from './components/industry/PostJobView';
import { PostInternshipView } from './components/industry/PostInternshipView';
import { CandidateSearchView } from './components/industry/CandidateSearchView';
import { IndustryProgramsView } from './components/industry/IndustryProgramsView';

// Institution Admin Views
import { InstitutionDashboard } from './components/institution/InstitutionDashboard';
import { StudentManagementView } from './components/institution/StudentManagementView';
import { MyStudentsProgressView } from './components/institution/MyStudentsProgressView';
import { SkillGapAnalyticsView } from './components/institution/SkillGapAnalyticsView';
import { PlacementManagementView } from './components/institution/PlacementManagementView';
import { IndustryCollaborationHubView } from './components/institution/IndustryCollaborationHubView';

const MainContent: React.FC = () => {
  const { role, pageView, activeTab, selectedOpportunity, setSelectedOpportunity } = useApp();

  const isPortalMode = role !== 'landing' && pageView === 'portal';

  const renderContent = () => {
    // Dedicated Auth & Landing Routes
    if (pageView === 'login') {
      return <LoginPage />;
    }
    if (pageView === 'register') {
      return <RegisterPage />;
    }
    if (pageView === 'forgot-password') {
      return <ForgotPasswordPage />;
    }
    if (pageView === 'students') {
      return <RoleLandingPage roleType="student" />;
    }
    if (pageView === 'industries') {
      return <RoleLandingPage roleType="industry" />;
    }
    if (pageView === 'institutions') {
      return <RoleLandingPage roleType="institution" />;
    }
    if (pageView === 'opportunities') {
      return (
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <GlobalOpportunitiesView />
        </div>
      );
    }
    if (pageView === 'assessment') {
      return (
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <SkillAssessmentView />
        </div>
      );
    }
    if (pageView === 'landing' || role === 'landing') {
      return <LandingPage />;
    }

    if (activeTab === 'settings') {
      return <SettingsView initialSubTab="account" />;
    }

    // Role-based portal routing
    switch (role) {
      case 'student':
        switch (activeTab) {
          case 'dashboard': return <StudentDashboard />;
          case 'profile': return <StudentProfileView />;
          case 'skill-assessment': return <SkillProfileView initialMode="assessment" />;
          case 'skill-profile': return <SkillProfileView initialMode="overview" />;
          case 'career-path': return <CareerPathView />;
          case 'jobs-internships': return <JobsAndInternshipsView initialSubBlock="all" />;
          case 'jobs': return <JobsAndInternshipsView initialSubBlock="jobs" />;
          case 'internships': return <JobsAndInternshipsView initialSubBlock="internships" />;
          case 'opportunities': return <JobsAndInternshipsView initialSubBlock="all" />;
          case 'online-courses': return <OnlineCoursesView initialSubBlock="all" />;
          case 'learning': return <OnlineCoursesView initialSubBlock="all" />;
          case 'recommended': return <RecommendedForYouView />;
          case 'applications': return <ApplicationsTrackerView />;
          case 'my-internships': return <JobsAndInternshipsView initialSubBlock="certificates" />;
          case 'portfolio': 
          case 'projects': return <DigitalPortfolioView />;
          case 'certifications': return <OnlineCoursesView initialSubBlock="certifications" />;
          case 'mentorship': return <MentorshipView />;
          case 'events': return <EventsView />;
          case 'resume-builder': return <ResumeBuilderView />;
          default: return <StudentDashboard />;
        }

      case 'industry':
        switch (activeTab) {
          case 'dashboard': return <IndustryDashboard />;
          case 'post-job': return <PostJobView />;
          case 'post-internship': return <PostInternshipView />;
          case 'candidate-search': return <CandidateSearchView />;
          case 'industry-programs': return <IndustryProgramsView />;
          case 'collaborations': return <IndustryCollaborationHubView />;
          default: return <IndustryDashboard />;
        }

      case 'institution':
        switch (activeTab) {
          case 'dashboard': return <InstitutionDashboard />;
          case 'my-students': return <MyStudentsProgressView />;
          case 'students-mgmt': return <StudentManagementView />;
          case 'skill-gaps': return <SkillGapAnalyticsView />;
          case 'placements': return <PlacementManagementView />;
          case 'collab-hub': return <IndustryCollaborationHubView />;
          default: return <InstitutionDashboard />;
        }

      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      {isPortalMode ? (
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
            {renderContent()}
          </main>
        </div>
      ) : (
        <main className="flex-1 overflow-y-auto max-w-full">
          {renderContent()}
        </main>
      )}

      {/* Global Modals */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />
      <GlobalSearchModal />
      <NotificationDrawer />
      <MessagesDrawer />
      <PhoneCallModal />
      <AuthModal />
      <GetStartedModal />
      <HowToUseGuideModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
