// src/Routes.jsx
import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import NotFound from "./pages/NotFound.jsx";
import AboutLinkMate from "./pages/about-link-mate";
import ResourcesHub from "./pages/resources-hub";
import Homepage from "./pages/homepage";
import Profile from "./pages/profile/Profile.jsx"; 
import PublicProfile from "./pages/profile/publicProfile.jsx";
import Community from "./pages/community/community.jsx"; 
import Events from "./pages/events/events.jsx";   
import Explore from "./pages/explore/Explore.jsx";
import ConnectionsPage from "./pages/explore/connectionsPage.jsx";
import RequestsPage from "./pages/explore/RequestsPage.jsx";
import Feed from "./pages/feed/Feed.jsx";  
import Auth from "./pages/Auth/AuthPage.jsx";
import CheckEmail from './pages/Auth/checkEmail.jsx';
import NotificationPage from "pages/notifiaction/notifiactionPage.jsx";
import VerifyEmail from './pages/Auth/VerifyEmail.jsx';
import ForgotPassword from './pages/Auth/forgotPassword.jsx';
import ResetPassword from './pages/Auth/resetPassword.jsx';
import Announcement from "./pages/Announcement/announcement.jsx";
import Help from "./pages/Support/help.jsx";
import Contact from "./pages/Support/contact.jsx";
import Feedback from "./pages/Support/feedback.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CommunityProvider } from "./context/communityContext.jsx";
import { EventProvider } from "./context/eventContext.jsx"; 
import ProtectedRoute from "./components/ProtectedRoute.jsx";   
import { ExploreProvider } from "./context/exploreContext.jsx";
import { ProfileProvider } from "./context/profileContext.jsx";
import { ChatProvider } from "./context/chatContext.jsx";
import { SocketProvider } from "context/socketContext.jsx";
import { NotificationProvider } from "./context/notificationContext.jsx";
import { ToastContainer } from "react-toastify";
import ChatPage from "./pages/chat/chatPage.jsx";  
import Header from "./components/ui/Header.jsx";  
import { FeedProvider } from "./context/feedContext.jsx";
import { FeedbackProvider } from "./context/feedbackContext.jsx";
import FeedbackPage from "pages/feedback/feedbackPage.jsx";
import { ResourceProvider } from "./context/resourceContext.jsx"; 
import { AnnouncementProvider } from "./context/announcementContext.jsx"; 
import AdminDashboard from './pages/Admin/adminDashboard';
import UsersTable from './pages/Admin/usersTable';
import MentorDiscoveryPage from "pages/Mentorship/UI/menteePage.jsx";
import MentorProfilePage from "pages/Mentorship/UI/mentorPage.jsx";
import MyRequests from "pages/Mentorship/components/myRequest.jsx";
import MentorSessions from "pages/Mentorship/components/mentorSessions.jsx";
import { StartupProvider } from "./context/startupContext.jsx";
import StartupPage from "pages/startup/startupPage.jsx";

import Internships from "./pages/interships/Internships.jsx";
import InternshipDetails from "./pages/interships/InternshipDetails.jsx";



const ProtectedLayout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="pt-16">{children}</div>
    </>
  );
};



const Routes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>  
        <NotificationProvider>
        <EventProvider> 
        <CommunityProvider>
        <ExploreProvider>
        <ProfileProvider>
        <FeedProvider>
        <ResourceProvider>
        <AnnouncementProvider>
        <ChatProvider>
        <FeedbackProvider>
          <ErrorBoundary>
            <ScrollToTop />

            <RouterRoutes>
              {/* Protected Routes - All nested providers removed from here */}
              <Route
  path="/internships"
  element={
    <ProtectedRoute>
      <ProtectedLayout>
        <Internships />
      </ProtectedLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/internships/:id"
  element={
    <ProtectedRoute>
      <ProtectedLayout>
        <InternshipDetails />
      </ProtectedLayout>
    </ProtectedRoute>
  }
/>



              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Homepage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/notifications" 
                element={
                <ProtectedRoute>
                  <ProtectedLayout>
                    <NotificationPage />
                  </ProtectedLayout>
                </ProtectedRoute>
                 } 
              />
              <Route
                path="/feedback"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <FeedbackPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/homepage"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Homepage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chatPage"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ChatPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about-link-mate"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <AboutLinkMate />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/help"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Help />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Contact />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feedback"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Feedback />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/resources-hub"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ResourcesHub />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Profile />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
                <Route
                path="/profile/:userId"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <PublicProfile />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Community />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
            path="/announcements"
            element={
              <ProtectedRoute>
                <ProtectedLayout>
                  <Announcement />
                </ProtectedLayout>
              </ProtectedRoute>
            }
          />
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Events />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explore"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Explore />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/connections"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ConnectionsPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requests"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <RequestsPage />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feed"
                element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Feed />
                    </ProtectedLayout>
                  </ProtectedRoute>
                }
              />
<Route
  path="/startups"
  element={
    <ProtectedRoute>
      <StartupProvider>
        <ProtectedLayout>
          <StartupPage />
        </ProtectedLayout>
      </StartupProvider>
    </ProtectedRoute>
  }
/>


              <Route path="/mentorship">
  <Route
    path="mentors"
    element={
      <ProtectedRoute>
        <ProtectedLayout>
          <MentorDiscoveryPage />
        </ProtectedLayout>
      </ProtectedRoute>
    }
  />
  <Route
    path="my-requests"
    element={
      <ProtectedRoute>
        <ProtectedLayout>
          <MyRequests />
        </ProtectedLayout>
      </ProtectedRoute>
    }
  />
  <Route
    path="sessions"
    element={
      <ProtectedRoute>
        <ProtectedLayout>
          <MentorSessions />
        </ProtectedLayout>
      </ProtectedRoute>
    }
  />

  <Route
    path="profile"
    element={
      <ProtectedRoute requiredRole="alumni">
        <ProtectedLayout>
          <MentorProfilePage />
        </ProtectedLayout>
      </ProtectedRoute>
    }
  />
</Route>





              
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UsersTable />} />

              {/* Public Auth Page (no header) */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/check-email" element={<CheckEmail />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </RouterRoutes>
            <ToastContainer />
          </ErrorBoundary>
        </FeedbackProvider>
        </ChatProvider>
        </AnnouncementProvider>
        </ResourceProvider>
        </FeedProvider>
        </ProfileProvider>
        </ExploreProvider>
        </CommunityProvider>
        </EventProvider>
        </NotificationProvider>
      </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Routes;