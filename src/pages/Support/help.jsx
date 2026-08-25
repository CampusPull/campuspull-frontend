import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  BookOpen,
  ShieldCheck,
  HelpCircle,
  Users,
  Briefcase,
  Rocket,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Mail,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  ArrowRight,
  LifeBuoy,
  X,
  Send,
  Zap,
  GraduationCap,
  FileText,
  Lock,
  Globe,
  Clock,
  LayoutDashboard,
  ShieldAlert,
  UserCheck,
  Calendar,
  Layers,
  Sliders,
  CheckSquare,
  Bell,
  Code2,
  Compass
} from 'lucide-react';

// =========================================================================
// 1. AUTHENTIC DASHBOARDS & PLATFORM MODULES DATA
// =========================================================================
const DASHBOARD_MODULES = [
  {
    id: 'mentorship-hub',
    name: 'Mentorship Hub',
    path: '/mentorship/mentors',
    badge: 'Core Feature',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: Users,
    iconColor: 'bg-purple-500/10 text-purple-600',
    tagline: '1-on-1 Guidance from Verified Alumni & Industry Leaders',
    overview: 'The Mentorship Hub connects undergraduate students with experienced alumni and industry professionals for personalized career guidance, mock interviews, system design reviews, and resume optimization.',
    routes: [
      { name: 'Find a Mentor', path: '/mentorship/mentors', desc: 'Search & filter mentors by domain, company, and college' },
      { name: 'My Requests', path: '/mentorship/my-requests', desc: 'Track outgoing mentorship booking requests & status' },
      { name: 'Mentor Sessions', path: '/mentorship/sessions', desc: 'Manage confirmed video calls, schedules & reviews' },
      { name: 'Mentor Profile', path: '/mentorship/profile', desc: 'Alumni mentor availability, expertise & slots' }
    ],
    rolesAccess: ['Student (Mentee)', 'Alumni (Mentor)', 'Admin (Overseer)'],
    workflow: [
      { step: '1. Browse & Filter', detail: 'Go to /mentorship/mentors. Filter mentors by technical domain (e.g. SDE, AI/ML, Data Science, Product, UI/UX), company, or university.' },
      { step: '2. Submit Session Request', detail: 'Click "Request Mentorship", choose a topic (e.g., Resume Review, Mock Technical Interview), and specify your session agenda and preferred date.' },
      { step: '3. Status & Confirmation', detail: 'Track your request in /mentorship/my-requests (Pending ➔ Accepted / Declined). When accepted, access the call link in /mentorship/sessions.' },
      { step: '4. Attend & Review', detail: 'Join the video call at the scheduled time, complete the 1-on-1 session, and leave feedback and star ratings.' }
    ],
    faqs: [
      {
        q: 'How are mentors verified on CampusPull?',
        a: 'Every alumni mentor undergoes verification through their graduation credentials, college registration records, and professional LinkedIn verification to guarantee authentic industry guidance.'
      },
      {
        q: 'How can an Alumnus apply to become a Mentor?',
        a: 'Alumni accounts can go to /mentorship/profile to configure their mentoring bio, weekly slot availability (e.g. 2 hrs/week), session topics, and booking links. Once approved by the Admin team, the profile appears on the Mentor Discovery list.'
      },
      {
        q: 'What happens if a mentor does not respond to my request within 48 hours?',
        a: 'If a mentor does not accept or decline within 72 hours, the request automatically expires so you can book another mentor without locking your request quotas.'
      },
      {
        q: 'Can students book multiple mentors simultaneously?',
        a: 'Yes, verified students can have up to 3 active pending mentorship requests at any given time to avoid spamming and ensure high commitment rates.'
      }
    ]
  },
  {
    id: 'internships-portal',
    name: 'Internships & Hiring Portal',
    path: '/internships',
    badge: 'Careers & Jobs',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: Briefcase,
    iconColor: 'bg-emerald-500/10 text-emerald-600',
    tagline: 'Direct Campus & Startup Internship Discovery and 1-Click Apply',
    overview: 'The Internships Portal is the career launchpad on CampusPull. It aggregates verified campus hiring drives, startup internships, and open roles with direct recruiter tracking.',
    routes: [
      { name: 'Browse Internships', path: '/internships', desc: 'Filter openings by role, stipend, mode & location' },
      { name: 'Open Internships', path: '/internships/open', desc: 'Direct fast-track open roles from verified firms' },
      { name: 'Application Form', path: '/internships/:id/apply', desc: '1-Click application with profile sync & PDF resume' },
      { name: 'My Applications Tracker', path: '/applications', desc: 'Live candidate progress pipeline tracker' }
    ],
    rolesAccess: ['Student (Applicant)', 'Startup Founder (Poster)', 'Admin (Approver/Recruiter)'],
    workflow: [
      { step: '1. Discover Roles', detail: 'Filter listings by domain (Frontend, Backend, AI/ML, Marketing), location type (Remote, Hybrid, On-site), and minimum stipend.' },
      { step: '2. Review Requirements', detail: 'Check role requirements, required skill tags, duration, and deadline on /internships/:id.' },
      { step: '3. 1-Click Apply', detail: 'Submit your application on /internships/:id/apply. Your verified profile skills, GitHub, and ATS PDF resume (under 5MB) are packaged automatically.' },
      { step: '4. Pipeline Tracking', detail: 'Track progress live on /applications: Applied ➔ Under Review ➔ Shortlisted ➔ Interview ➔ Offer.' }
    ],
    faqs: [
      {
        q: 'How does the Application Tracking Pipeline work?',
        a: 'When you submit an application, its status is updated in real time on /applications. Recruiters can mark candidates as "Under Review", "Shortlisted", "Interview Scheduled", or "Selected". You will also receive in-app notifications on status changes.'
      },
      {
        q: 'Can I withdraw or update an already submitted application?',
        a: 'You can update your attached resume and contact information on your main profile at any time. To withdraw an active application, click "Withdraw" on the My Applications dashboard.'
      },
      {
        q: 'What is the difference between /internships and /internships/open?',
        a: 'The main /internships page features curated partner companies and structured hiring cycles, whereas /internships/open lists rapid, open-application startup roles with immediate onboarding.'
      },
      {
        q: 'Are unpaid internships allowed on CampusPull?',
        a: 'We strongly prioritize paid internships with clear learning outcomes and stipends. Unpaid roles must be purely educational and explicitly marked as volunteer or learning cohorts.'
      }
    ]
  },
  {
    id: 'startup-hub',
    name: 'Student Startups & Innovation Hub',
    path: '/startups',
    badge: 'Entrepreneurship',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Rocket,
    iconColor: 'bg-amber-500/10 text-amber-600',
    tagline: 'Showcase MVPs, Recruit Co-Founders, and Connect with Campus Angels',
    overview: 'The Startups Hub enables student entrepreneurs and campus innovators to register their ventures, recruit co-founders, post open team positions, and get discovered by alumni investors.',
    routes: [
      { name: 'Startups Directory', path: '/startups', desc: 'Explore student-led ventures and campus tech startups' },
      { name: 'Startup Profile & Pitch', path: '/startups/:id', desc: 'Venture details, elevator pitch, demo links & team' },
      { name: 'Register Startup', path: '/startups', desc: 'Admin & student founder registration modal' }
    ],
    rolesAccess: ['Student (Founder & Candidate)', 'Alumni (Advisor/Investor)', 'Admin (Verification)'],
    workflow: [
      { step: '1. Register Venture', detail: 'Submit startup name, sector (EdTech, FinTech, AI, SaaS, HealthTech), stage (Ideation, MVP, Early Traction), and demo video/URL.' },
      { step: '2. Post Open Team Roles', detail: 'Specify open roles such as Tech Co-founder, UI/UX Lead, or Growth Marketer to recruit peers.' },
      { step: '3. Engage Community', detail: 'Gain traction, receive community feedback, and showcase your launch milestones on the main Feed.' },
      { step: '4. Pitch & Mentorship', detail: 'Connect with alumni founders and angel mentors through the Mentorship directory for pitch deck reviews.' }
    ],
    faqs: [
      {
        q: 'Who can register a startup on CampusPull?',
        a: 'Any verified student or recent alumnus with an active project, MVP, or incorporated venture can submit their startup for listing on the platform.'
      },
      {
        q: 'How do students apply to join a listed startup?',
        a: 'Visit /startups/:id to inspect open positions. Click "Connect / Apply to Team" to send a direct message and portfolio to the founding team.'
      },
      {
        q: 'Is there any fee or equity commission taken by CampusPull?',
        a: 'No, CampusPull is 100% free for collegiate founders. We do not charge listing fees or take equity in student ventures.'
      }
    ]
  },
  {
    id: 'networking-chat',
    name: 'Explore, Network & Real-Time Chat',
    path: '/explore',
    badge: 'Social & Network',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Compass,
    iconColor: 'bg-blue-500/10 text-blue-600',
    tagline: 'Student & Alumni Discovery, Connections, and Instant WebSockets Chat',
    overview: 'A high-speed networking engine allowing students to discover peers by university, branch, skills, and batch year, send connection requests, and converse via real-time WebSockets chat.',
    routes: [
      { name: 'Explore Network', path: '/explore', desc: 'Search students & alumni with role filter tabs' },
      { name: 'My Connections', path: '/connections', desc: 'View all accepted connections and active network' },
      { name: 'Pending Requests', path: '/requests', desc: 'Accept or decline incoming connection requests' },
      { name: 'Real-Time Chat', path: '/chatPage', desc: 'Instant 1-on-1 socket messaging and conversations' }
    ],
    rolesAccess: ['Student', 'Alumni', 'Teacher', 'Admin'],
    workflow: [
      { step: '1. Discover Peers', detail: 'Use /explore with role filters (All, Student, Teacher, Alumni) and keyword search for colleges, skills, or batch years.' },
      { step: '2. Send Request', detail: 'Click "Connect". The recipient receives an instant in-app notification.' },
      { step: '3. Accept & Connect', detail: 'Manage incoming and outgoing requests under /requests.' },
      { step: '4. Real-Time Chat', detail: 'Once connected, start instant 1-on-1 messaging at /chatPage with online presence indicators.' }
    ],
    faqs: [
      {
        q: 'Why does the chat show "Connecting..." or fail to send messages?',
        a: 'Our chat operates over real-time WebSockets. If you see a connection error, ensure your network allows WebSocket traffic (some strict college hostel firewalls or VPNs block port 8080/WS). Refreshing the page re-establishes the socket handshake.'
      },
      {
        q: 'Is there a limit on how many connection requests I can send?',
        a: 'To prevent spam, unverified accounts have a daily limit of 10 requests. Once your student email or college ID is verified, your daily limit increases to 50.'
      },
      {
        q: 'How do I remove or block a connection?',
        a: 'Go to /connections, find the user card, click the options menu (...), and select "Remove Connection" or "Block User". Blocked users cannot message you or view your updates.'
      }
    ]
  },
  {
    id: 'feed-community-events',
    name: 'Feed, Community & Campus Events',
    path: '/feed',
    badge: 'Engage & Learn',
    badgeColor: 'bg-pink-100 text-pink-700 border-pink-200',
    icon: MessageSquare,
    iconColor: 'bg-pink-500/10 text-pink-600',
    tagline: 'Campus Discussions, Hackathon RSVPs, and Project Showcases',
    overview: 'The social hub of CampusPull where members share milestones, participate in tech discussion forums, and RSVP for hackathons, workshops, and webinars.',
    routes: [
      { name: 'Community Feed', path: '/feed', desc: 'Share updates, media, code snippets & celebrate wins' },
      { name: 'Community Channels', path: '/community', desc: 'Topic-based forum rooms for coding, tech & placements' },
      { name: 'Events & Hackathons', path: '/events', desc: 'Upcoming webinars, coding contests & RSVP management' },
      { name: 'Campus Announcements', path: '/announcements', desc: 'Official placement notices and administrative alerts' }
    ],
    rolesAccess: ['All Verified Users', 'Event Organizers (Alumni/Teachers/Admins)'],
    workflow: [
      { step: '1. Create a Post', detail: 'Post on /feed with rich media (Images, Videos, Code blocks) or share technical questions.' },
      { step: '2. Join Forum Discussions', detail: 'Participate in categorized threads under /community (DSA, Web Dev, Placements).' },
      { step: '3. Discover Events', detail: 'Browse hackathons, alumni guest talks, and campus workshops at /events.' },
      { step: '4. RSVP & Calendar Sync', detail: 'Click "RSVP" to secure your attendance, receive calendar invites, and get notification reminders.' }
    ],
    faqs: [
      {
        q: 'Who can host or create events on CampusPull?',
        a: 'Verified alumni, faculty/teachers, campus club leads, and administrators have permission to publish events and webinars on /events.'
      },
      {
        q: 'What media formats are supported in Feed posts?',
        a: 'The feed supports JPEG, PNG, WEBP images and MP4, WEBM video clips up to 25MB, alongside formatted text and hyperlinks.'
      },
      {
        q: 'How are announcements different from Feed posts?',
        a: 'Announcements (/announcements) are official university and platform bulletins pinned by authorized faculty and administrators, whereas Feed (/feed) is open community content.'
      }
    ]
  },
  {
    id: 'admin-hiring-dashboard',
    name: 'Admin & Global Hiring Dashboard',
    path: '/admin',
    badge: 'Admins & Recruiters',
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    icon: LayoutDashboard,
    iconColor: 'bg-indigo-500/10 text-indigo-600',
    tagline: 'Platform Analytics, User Management, and Candidate Hiring Pipeline',
    overview: 'The mission control for CampusPull administrators and hiring managers to manage platform statistics, verify users, oversee mentorship programs, and evaluate candidate applications.',
    routes: [
      { name: 'Admin Analytics', path: '/admin', desc: 'User growth charts, year-wise filters & platform metrics' },
      { name: 'Users Table', path: '/admin/users', desc: 'Search, filter, role-assign & verify user profiles' },
      { name: 'Admin Mentorship', path: '/admin/mentorship', desc: 'Review and approve alumni mentor applications' },
      { name: 'Global Hiring Dashboard', path: '/admin/hiring-dashboard', desc: 'Overview of all active internship openings & applicants' },
      { name: 'Candidate Dashboard', path: '/admin/applications', desc: 'Filter, review resumes & update candidate stages' },
      { name: 'Open Internships Admin', path: '/admin/open-internships', desc: 'Create, edit & toggle live internship listings' }
    ],
    rolesAccess: ['Admin Only (Strict Protected Route Role Guard)'],
    workflow: [
      { step: '1. User Moderation', detail: 'Inspect new registrations at /admin/users, approve student ID cards, and grant alumni/mentor badges.' },
      { step: '2. Review Mentor Applications', detail: 'Assess alumni mentor requests on /admin/mentorship to maintain high-quality guidance.' },
      { step: '3. Manage Job Openings', detail: 'Create and publish new opportunities on /admin/open-internships with specific qualification criteria.' },
      { step: '4. Candidate Review & Hiring', detail: 'Review applicant resumes on /admin/applications, transition stages, and schedule interviews.' }
    ],
    faqs: [
      {
        q: 'Who has access to the /admin routes?',
        a: 'Access to /admin is strictly protected by the ProtectedRoute role guard. Only accounts with role === "admin" can view analytics, user management, and global hiring consoles.'
      },
      {
        q: 'How do admins verify student ID cards?',
        a: 'In /admin/users, pending verification accounts display an ID preview badge. Admins check the student ID photo against the submitted university name and click "Approve Verification".'
      },
      {
        q: 'Can admins download candidate resumes in bulk?',
        a: 'Yes, on the Candidate Dashboard (/admin/applications), admins and hiring leads can view candidate PDF resumes directly in-browser or download them for offline evaluation.'
      }
    ]
  },
  {
    id: 'profile-verification',
    name: 'Profile & Account Verification',
    path: '/profile',
    badge: 'Account & Security',
    badgeColor: 'bg-teal-100 text-teal-700 border-teal-200',
    icon: GraduationCap,
    iconColor: 'bg-teal-500/10 text-teal-600',
    tagline: 'Student Badges, Public Portfolios, Resume Sync & Security Settings',
    overview: 'Your personal digital identity on CampusPull. Configure your professional headline, bio, university details, tech stack tags, GitHub/LinkedIn links, ATS resume, and account security.',
    routes: [
      { name: 'My Profile', path: '/profile', desc: 'Edit skills, bio, university, avatar & resume' },
      { name: 'Public Profile', path: '/profile/:userId', desc: 'Public portfolio view for recruiters & peers' },
      { name: 'Email Verification', path: '/verify-email/:token', desc: 'Institutional & campus email OTP confirmation' },
      { name: 'Password Reset', path: '/forgot-password', desc: 'Secure token-based password recovery' }
    ],
    rolesAccess: ['All Users'],
    workflow: [
      { step: '1. Complete Profile', detail: 'Fill out your university, branch, batch year, bio, and add your top 5-8 verified skills.' },
      { step: '2. Link Socials & Resume', detail: 'Attach GitHub, LinkedIn, portfolio link, and upload an ATS-friendly PDF resume.' },
      { step: '3. Verify Student Status', detail: 'Verify your .edu/college email or upload your student ID photo to receive the blue Verified Student badge.' },
      { step: '4. Share Public Profile', detail: 'Use /profile/:userId as your campus digital portfolio to share with mentors and recruiters.' }
    ],
    faqs: [
      {
        q: 'Why should I get verified on CampusPull?',
        a: 'Verified profiles receive higher visibility in the Mentor Discovery directory, increased daily connection limits, priority review on internship applications, and a blue trust badge on all posts and comments.'
      },
      {
        q: 'What if my college does not provide a student email address?',
        a: 'You can verify using manual ID verification by uploading a clear scan or photograph of your valid Student ID card on your Profile settings. Our team reviews ID submissions within 12–24 hours.'
      },
      {
        q: 'How do I change my registered email or password?',
        a: 'Go to Profile > Settings > Security. You can update your password or request an email change verification link.'
      }
    ]
  },
  {
    id: 'resources-hub',
    name: 'Resources Hub & Preparation',
    path: '/resources-hub',
    badge: 'Study & Prep',
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    icon: BookOpen,
    iconColor: 'bg-indigo-500/10 text-indigo-600',
    tagline: 'DSA Roadmaps, System Design Guides, and Core CS Notes',
    overview: 'A curated repository of open-source study notes, placement cheat sheets, coding roadmaps, and interview preparation materials shared by top alumni.',
    routes: [
      { name: 'Resources Hub', path: '/resources-hub', desc: 'Comprehensive library of roadmaps, notes & cheat sheets' }
    ],
    rolesAccess: ['All Users'],
    workflow: [
      { step: '1. Select Category', detail: 'Browse DSA, System Design, Frontend, Backend, AI/ML, OS, DBMS, or Computer Networks.' },
      { step: '2. Access Curated Roadmaps', detail: 'Follow structured week-by-week roadmaps created by placed alumni.' },
      { step: '3. Download Cheat Sheets', detail: 'Access quick revision sheets for technical interview preparation.' }
    ],
    faqs: [
      {
        q: 'Are the resources on the Resources Hub free?',
        a: 'Yes, all roadmaps, cheat sheets, and interview prep guides in /resources-hub are 100% free and open for all registered students.'
      },
      {
        q: 'Can students or alumni contribute new learning resources?',
        a: 'Yes! You can suggest notes and roadmaps by clicking "Suggest Resource" on the Resources Hub or by reaching out to support.'
      }
    ]
  }
];

// =========================================================================
// 2. QUICK TROUBLESHOOTING DATA
// =========================================================================
const TROUBLESHOOTING = [
  {
    issue: 'Real-Time Chat showing "Disconnected" or messages not arriving?',
    solution: 'Our chat runs over WebSockets. Ensure you are not behind a restrictive proxy or hostel firewall that blocks WebSocket handshakes. A quick hard-refresh (Ctrl+F5) will re-establish the socket connection.',
    category: 'Chat & WebSockets'
  },
  {
    issue: 'Did not receive student email verification token or OTP?',
    solution: 'Check your college email Spam/Junk folder. Institutional mail servers sometimes delay external automated emails. You can click "Resend OTP" after 60 seconds or switch to manual student ID photo verification in Profile Settings.',
    category: 'Authentication'
  },
  {
    issue: 'Resume upload fails or gives an error on application submit?',
    solution: 'Ensure your resume is a standard PDF document under 5MB in size without password encryption. Avoid DOCX or image formats as our recruiter parser specifically accepts PDF.',
    category: 'Internships'
  },
  {
    issue: 'Mentorship session booking request expired without response?',
    solution: 'Mentors have a 72-hour window to accept or reschedule requests. If expired, your booking slot quota is immediately released so you can book another verified mentor right away.',
    category: 'Mentorship'
  },
  {
    issue: 'Cannot access /admin or /admin/hiring-dashboard?',
    solution: 'Admin dashboards are strictly protected by role-based routing. Only accounts assigned the "admin" role in the database have access. Regular student and alumni accounts will be redirected.',
    category: 'Permissions'
  }
];

// =========================================================================
// 3. MAIN COMPONENT
// =========================================================================
const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState('mentorship-hub');
  const [openFaqId, setOpenFaqId] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [copiedText, setCopiedText] = useState(null);
  
  // Support ticket modal
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketModule, setTicketModule] = useState('mentorship-hub');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Active selected module object
  const activeModule = useMemo(() => {
    return DASHBOARD_MODULES.find(m => m.id === selectedModuleId) || DASHBOARD_MODULES[0];
  }, [selectedModuleId]);

  // Global search filtering across ALL modules, routes, workflows, and FAQs
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();

    const results = [];
    DASHBOARD_MODULES.forEach(mod => {
      // Check module info
      const modMatches = mod.name.toLowerCase().includes(q) || 
                         mod.tagline.toLowerCase().includes(q) || 
                         mod.overview.toLowerCase().includes(q);

      // Check module FAQs
      const matchingFaqs = mod.faqs.filter(f => 
        f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
      );

      // Check routes
      const matchingRoutes = mod.routes.filter(r => 
        r.name.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q)
      );

      if (modMatches || matchingFaqs.length > 0 || matchingRoutes.length > 0) {
        results.push({
          module: mod,
          faqs: matchingFaqs,
          routes: matchingRoutes
        });
      }
    });

    return results;
  }, [searchQuery]);

  const handleCopy = (key, text) => {
    navigator.clipboard?.writeText?.(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleFeedback = (faqKey, type) => {
    setFeedbackGiven(prev => ({ ...prev, [faqKey]: type }));
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setIsTicketModalOpen(false);
      setTicketSubject('');
      setTicketMessage('');
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* =========================================================================
          HERO BANNER
      ========================================================================= */}
      <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            CampusPull Comprehensive Knowledge Base & Dashboard FAQs
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Platform Help Center & Dashboard Guide
          </h1>
          <p className="text-base sm:text-lg text-indigo-100/80 max-w-3xl mx-auto mb-8">
            Complete authentic documentation for every feature on CampusPull: Mentorship booking, Internship pipelines, Startup showcase, Explore networking, Real-Time Chat, and Admin portals.
          </p>

          {/* Search Input */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any dashboard or feature (e.g. 'mentorship requests', 'resume upload', 'admin hiring', 'chat socket')..."
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-sm sm:text-base shadow-xl shadow-indigo-950/20 border-2 border-transparent focus:border-indigo-400 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
              <span className="text-indigo-200/70 font-medium">Quick Jump:</span>
              {[
                { label: 'Mentorship Hub', id: 'mentorship-hub' },
                { label: 'Internships & Careers', id: 'internships-portal' },
                { label: 'Startup Hub', id: 'startup-hub' },
                { label: 'Explore & Chat', id: 'networking-chat' },
                { label: 'Feed & Events', id: 'feed-community-events' },
                { label: 'Admin & Hiring', id: 'admin-hiring-dashboard' },
                { label: 'Profile & Verification', id: 'profile-verification' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedModuleId(item.id);
                    setSearchQuery('');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-indigo-100 border border-white/10 transition-all cursor-pointer backdrop-blur-sm"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN WRAPPER
      ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        
        {/* Platform Status & Quick Action Ribbon */}
        <div className="bg-white rounded-2xl p-4 shadow-lg shadow-slate-200/60 border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Platform Services</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-sm font-semibold text-slate-800">
                WebSockets (Port 8080) &bull; Auth &bull; Mentorship API &bull; Hiring Engine: <span className="text-emerald-600">Operational</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition shadow-sm hover:shadow"
            >
              <LifeBuoy className="w-4 h-4" />
              Raise Support Ticket
            </button>
            <Link
              to="/contact"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </Link>
          </div>
        </div>

        {/* =========================================================================
            SEARCH RESULTS VIEW (WHEN SEARCHING)
        ========================================================================= */}
        {searchResults !== null ? (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-sm text-slate-500">Found {searchResults.length} matching dashboard sections</p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
              >
                Clear Search
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">No matches found</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                  We couldn't find any questions or dashboard guides matching "{searchQuery}". Try browsing by dashboard category below or submit a support query.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  View All Dashboards
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {searchResults.map((res) => {
                  const ModIcon = res.module.icon;
                  return (
                    <div key={res.module.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
                      <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${res.module.iconColor}`}>
                            <ModIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">{res.module.name}</h3>
                            <p className="text-xs text-slate-500">{res.module.tagline}</p>
                          </div>
                        </div>
                        <Link
                          to={res.module.path}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-xs font-bold transition"
                        >
                          Open Dashboard <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* Matching FAQs */}
                      {res.faqs.length > 0 && (
                        <div className="space-y-3 mb-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Relevant FAQs</h4>
                          {res.faqs.map((faq, i) => (
                            <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              <p className="font-bold text-slate-900 text-sm mb-1.5">{faq.q}</p>
                              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Matching Routes */}
                      {res.routes.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Related Pages & Routes</h4>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {res.routes.map((r, i) => (
                              <Link
                                key={i}
                                to={r.path}
                                className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 text-xs flex items-center justify-between transition"
                              >
                                <div>
                                  <span className="font-bold text-slate-800 block">{r.name}</span>
                                  <span className="text-[11px] text-slate-500">{r.desc}</span>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* =========================================================================
              STRUCTURED DASHBOARD DEEP-DIVE (DEFAULT VIEW)
          ========================================================================= */
          <div>
            {/* Dashboard Selector Horizontal Scroll Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Platform Dashboards & Systems
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Select a dashboard below to inspect its real-time workflow, access permissions, and FAQs
                  </p>
                </div>
              </div>

              {/* Grid of Dashboard Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {DASHBOARD_MODULES.map((mod) => {
                  const IconComp = mod.icon;
                  const isSelected = selectedModuleId === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setSelectedModuleId(mod.id)}
                      className={`p-4 rounded-2xl text-left transition-all border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 scale-[1.02]'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-white/20 text-white' : mod.iconColor
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {mod.faqs.length} FAQs
                        </span>
                      </div>
                      <h3 className={`font-bold text-xs sm:text-sm leading-snug ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                        {mod.name}
                      </h3>
                      <p className={`text-[11px] mt-1 line-clamp-1 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                        {mod.tagline}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Dashboard Detailed Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 mb-14">
              {/* Header Info */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${activeModule.iconColor}`}>
                    {React.createElement(activeModule.icon, { className: 'w-7 h-7' })}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="text-2xl font-extrabold text-slate-900">{activeModule.name}</h3>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${activeModule.badgeColor}`}>
                        {activeModule.badge}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{activeModule.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={activeModule.path}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition shadow-sm"
                  >
                    Open Live Dashboard <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Overview & Permissions */}
              <div className="grid md:grid-cols-3 gap-6 py-6 border-b border-slate-100">
                <div className="md:col-span-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">How It Works & Purpose</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {activeModule.overview}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Roles with Access</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModule.rolesAccess.map((role, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                        <UserCheck className="w-3 h-3 text-indigo-600" /> {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sub-Routes Grid */}
              <div className="py-6 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Key Dashboard Routes & Views</h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {activeModule.routes.map((route, i) => (
                    <Link
                      key={i}
                      to={route.path}
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 transition flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition">
                            {route.name}
                          </span>
                          <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition" />
                        </div>
                        <span className="text-[11px] text-slate-500 leading-tight block">
                          {route.desc}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-500/80 mt-2 block">
                        {route.path}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Workflow */}
              <div className="py-6 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Step-by-Step Workflow</h4>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {activeModule.workflow.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-xs text-indigo-600 block mb-1.5">{item.step}</span>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module-Specific FAQs */}
              <div className="pt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  {activeModule.name} &bull; Frequently Asked Questions
                </h4>
                <div className="space-y-3">
                  {activeModule.faqs.map((faq, i) => {
                    const faqKey = `${activeModule.id}-${i}`;
                    const isOpen = openFaqId === faqKey;
                    const isCopied = copiedText === faqKey;
                    const userFeedback = feedbackGiven[faqKey];

                    return (
                      <div
                        key={i}
                        className={`bg-slate-50 rounded-2xl border transition-all ${
                          isOpen ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <button
                          onClick={() => setOpenFaqId(isOpen ? null : faqKey)}
                          className="w-full p-4 text-left flex items-start justify-between gap-4 select-none focus:outline-none"
                        >
                          <span className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                            {faq.q}
                          </span>
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform ${
                              isOpen ? 'bg-indigo-600 text-white rotate-180' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-4 border-t border-slate-100/80 pt-3">
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                              {faq.a}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                              <button
                                onClick={() => handleCopy(faqKey, `${faq.q}\n\n${faq.a}`)}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-700 bg-white px-2 py-1 rounded border border-slate-200"
                              >
                                {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                {isCopied ? 'Copied' : 'Copy'}
                              </button>

                              <div className="flex items-center gap-2">
                                <span className="text-[11px]">Helpful?</span>
                                {userFeedback ? (
                                  <span className="text-emerald-600 font-bold text-[10px]">Thanks!</span>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleFeedback(faqKey, 'yes')}
                                      className="p-1 hover:text-emerald-600"
                                      title="Yes"
                                    >
                                      <ThumbsUp className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleFeedback(faqKey, 'no')}
                                      className="p-1 hover:text-rose-600"
                                      title="No"
                                    >
                                      <ThumbsDown className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* =========================================================================
                QUICK TROUBLESHOOTING & ARCHITECTURE OVERVIEW
            ========================================================================= */}
            <div className="grid lg:grid-cols-3 gap-8 mb-14">
              {/* Troubleshooting Column */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-2.5 mb-2">
                  <Zap className="w-6 h-6 text-amber-500" />
                  <h3 className="text-xl font-extrabold text-slate-900">Platform Troubleshooting & Fixes</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">
                  Quick resolutions for common authentication, real-time socket, and file upload questions.
                </p>

                <div className="space-y-4">
                  {TROUBLESHOOTING.map((item, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">{item.issue}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roles & Permissions Summary */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
                  <h3 className="text-lg font-bold text-white mb-2">Role Permissions Guide</h3>
                  <p className="text-xs text-indigo-100/80 mb-4 leading-relaxed">
                    CampusPull grants role-based access based on verified status:
                  </p>

                  <div className="space-y-2.5 text-xs">
                    <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                      <span className="font-bold text-emerald-300 block mb-0.5">🎓 Student</span>
                      <span className="text-indigo-100/70 text-[11px]">Mentee sessions, Internship applications, Community feeds, Startups, Chat</span>
                    </div>
                    <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                      <span className="font-bold text-purple-300 block mb-0.5">🤝 Alumni / Mentor</span>
                      <span className="text-indigo-100/70 text-[11px]">Host 1-on-1 mentorship, post events, hire student interns, mentor directory listing</span>
                    </div>
                    <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                      <span className="font-bold text-amber-300 block mb-0.5">🛡️ Administrator</span>
                      <span className="text-indigo-100/70 text-[11px]">User verification, hiring consoles, analytics charts, content moderation</span>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100">
                  <h4 className="font-bold text-indigo-950 text-sm mb-1">Direct Helpdesk</h4>
                  <p className="text-xs text-indigo-900/70 mb-4">
                    Have an urgent bug or verification query?
                  </p>
                  <button
                    onClick={() => setIsTicketModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Query to Support Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        
        <div className="border-t border-slate-200 pt-10">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Still have questions?</h2>
            <p className="text-xs sm:text-sm text-slate-500">Reach out directly to our student and technical operations team</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Email Support</h3>
              <p className="text-xs text-slate-500 mb-4">Direct inbox support for student accounts & verification queries.</p>
              <a
                href="mailto:info@campuspull.in"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                info@campuspull.in &rarr;
              </a>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Community Channels</h3>
              <p className="text-xs text-slate-500 mb-4">Ask fellow student developers, campus leads, and alumni in the feed.</p>
              <Link
                to="/community"
                className="text-xs font-bold text-purple-600 hover:text-purple-800"
              >
                Go to Community &rarr;
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Suggest Features</h3>
              <p className="text-xs text-slate-500 mb-4">Share ideas, bug reports, and product feedback to improve CampusPull.</p>
              <Link
                to="/feedback"
                className="text-xs font-bold text-pink-600 hover:text-pink-800"
              >
                Share Feedback &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SUPPORT TICKET MODAL
      ========================================================================= */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setIsTicketModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {ticketSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Support Ticket Logged!</h3>
                <p className="text-sm text-slate-500">
                  Your query has been assigned ticket ID <span className="font-mono font-bold text-indigo-600">#CP-{Math.floor(1000 + Math.random() * 9000)}</span>. Our operations team will respond via your registered email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <LifeBuoy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">Raise Support Ticket</h3>
                    <p className="text-xs text-slate-500">Direct escalation to CampusPull technical operations</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Related Dashboard / Area
                    </label>
                    <select
                      value={ticketModule}
                      onChange={(e) => setTicketModule(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-medium focus:ring-2 focus:ring-indigo-400 outline-none"
                    >
                      {DASHBOARD_MODULES.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="e.g., Mentorship booking calendar sync issue"
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Detailed Description
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Please provide details, error messages, or affected profile/application IDs..."
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTicketModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Ticket
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Help;