import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  FileText, 
  Activity, 
  BookOpen, 
  Bell, 
  User,
  TrendingUp,
  CheckCircle,
  Star,
  Calendar,
  Building
} from 'lucide-react';

const HomePage = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  // Navigation handlers
  const handleNavigation = (section: string) => {
    setActiveSection(section);
    console.log(`Navigating to: ${section}`);
    
    // For now, we'll show alerts. Later we'll implement proper routing
    switch(section) {
      case 'certificates':
        alert('Certificate Management - Coming Soon!');
        break;
      case 'projects':
        alert('Project Portfolio - Coming Soon!');
        break;
      case 'activities':
        alert('Co-Curricular Records - Coming Soon!');
        break;
      case 'academic':
        alert('Academic Achievements - Coming Soon!');
        break;
      case 'portfolio':
        alert('Portfolio Generator - Coming Soon!');
        break;
      case 'notifications':
        alert('Notifications - Coming Soon!');
        break;
      default:
        break;
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 snap-y snap-mandatory overflow-y-scroll scroll-smooth">
        {/* Hero Section - Full Page */}
        <div className="h-screen flex items-center justify-center snap-start">
          <div className="text-center space-y-8 max-w-4xl mx-auto px-6">
            <div className="space-y-6">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Student Management System
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Streamline academic and co-curricular record management with our comprehensive platform designed for educational excellence.
              </p>
            </div>
            <div className="space-y-6">
              <Link to="/auth">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Get Started
                </Button>
              </Link>
              <p className="text-sm text-slate-500">
                Sign in to access your personalized dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student Dashboard Section
  if (profile?.role === 'student') {
    return (
      <div 
        className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-y-scroll scroll-smooth"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {/* Hero Section - Full Page */}
        <div 
          className="h-screen flex items-center justify-center"
          style={{ scrollSnapAlign: 'start' }}
        >
          <div className="text-center space-y-8 max-w-4xl mx-auto px-6">
            <div className="space-y-6">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome Back, {profile?.full_name}!
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Manage your academic journey and showcase your achievements with our comprehensive student platform.
              </p>
            </div>
            <div className="pt-8">
              <Button 
                onClick={() => {
                  const element = document.getElementById('dashboard-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Section */}
        <div 
          id="dashboard-section" 
          className="h-screen pt-4 pb-8 px-6 overflow-y-auto"
          style={{ scrollSnapAlign: 'start' }}
        >
          <div className="max-w-7xl mx-auto">
            {/* Top Navigation Bar */}
            <div className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-slate-800">Your Academic Hub</h2>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Dark Mode Toggle */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full"
                  onClick={() => {
                    setIsDarkMode(!isDarkMode);
                    alert(`Dark mode ${!isDarkMode ? 'enabled' : 'disabled'} - Coming Soon!`);
                  }}
                >
                  {isDarkMode ? (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </Button>
                
                {/* Notifications */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full relative"
                  onClick={() => handleNavigation('notifications')}
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
                </Button>
                
                {/* Profile Dropdown */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-slate-700">{profile?.full_name}</p>
                    <p className="text-xs text-slate-500">Student</p>
                  </div>
                </div>
                
                {/* Sign Out */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={signOut}
                >
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Navigation Cards */}
            <div className="mb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card 
                  className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                    activeSection === 'certificates' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => handleNavigation('certificates')}
                >
                  <CardContent className="p-6 text-center">
                    <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-slate-700">Certificate Management</h3>
                    <p className="text-sm text-slate-500 mt-1">Manage your certificates</p>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                    activeSection === 'projects' ? 'ring-2 ring-green-500 bg-green-50' : ''
                  }`}
                  onClick={() => handleNavigation('projects')}
                >
                  <CardContent className="p-6 text-center">
                    <Activity className="h-8 w-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-slate-700">Project Portfolio</h3>
                    <p className="text-sm text-slate-500 mt-1">Showcase your projects</p>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                    activeSection === 'activities' ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                  }`}
                  onClick={() => handleNavigation('activities')}
                >
                  <CardContent className="p-6 text-center">
                    <Award className="h-8 w-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-slate-700">Co-Curricular Records</h3>
                    <p className="text-sm text-slate-500 mt-1">Track activities</p>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                    activeSection === 'academic' ? 'ring-2 ring-orange-500 bg-orange-50' : ''
                  }`}
                  onClick={() => handleNavigation('academic')}
                >
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-8 w-8 text-orange-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-slate-700">Academic Achievements</h3>
                    <p className="text-sm text-slate-500 mt-1">Academic records</p>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                    activeSection === 'portfolio' ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                  }`}
                  onClick={() => handleNavigation('portfolio')}
                >
                  <CardContent className="p-6 text-center">
                    <User className="h-8 w-8 text-indigo-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-slate-700">Portfolio</h3>
                    <p className="text-sm text-slate-500 mt-1">Create your portfolio</p>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                    activeSection === 'notifications' ? 'ring-2 ring-red-500 bg-red-50' : ''
                  }`}
                  onClick={() => handleNavigation('notifications')}
                >
                  <CardContent className="p-6 text-center">
                    <Bell className="h-8 w-8 text-red-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-slate-700">Notifications</h3>
                    <p className="text-sm text-slate-500 mt-1">Stay updated</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Student Overview */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Your Achievements Overview</h3>
              
              {/* Major Achievements */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-slate-800">
                      <Star className="h-6 w-6 text-yellow-500" />
                      <span>Recent Certificates</span>
                    </CardTitle>
                    <CardDescription>Your latest academic and professional achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Mock Certificate Display */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                          <div className="aspect-[4/3] bg-white rounded-lg shadow-sm flex items-center justify-center mb-3">
                            <FileText className="h-12 w-12 text-blue-600" />
                          </div>
                          <h4 className="font-semibold text-slate-700 text-sm">Python Programming</h4>
                          <p className="text-xs text-slate-500">Certified Developer</p>
                          <Badge className="mt-2 bg-green-100 text-green-700">Verified</Badge>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                          <div className="aspect-[4/3] bg-white rounded-lg shadow-sm flex items-center justify-center mb-3">
                            <Award className="h-12 w-12 text-green-600" />
                          </div>
                          <h4 className="font-semibold text-slate-700 text-sm">Data Science</h4>
                          <p className="text-xs text-slate-500">Advanced Course</p>
                          <Badge className="mt-2 bg-green-100 text-green-700">Verified</Badge>
                        </div>
                      </div>
                      
                      <div className="text-center pt-4">
                        <Button 
                          variant="outline" 
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => handleNavigation('certificates')}
                        >
                          View All Certificates
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-slate-800">
                      <TrendingUp className="h-6 w-6 text-green-500" />
                      <span>Academic Progress</span>
                    </CardTitle>
                    <CardDescription>Your current academic standing and achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">12</div>
                          <div className="text-sm text-slate-600">Certificates</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">8</div>
                          <div className="text-sm text-slate-600">Projects</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">15</div>
                          <div className="text-sm text-slate-600">Activities</div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">4.2</div>
                          <div className="text-sm text-slate-600">GPA</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                          <span className="text-sm text-slate-500">85%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Student Info Summary */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-slate-800">
                    <User className="h-6 w-6 text-indigo-500" />
                    <span>Student Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">Institution</span>
                      </div>
                      <p className="text-slate-600">University of Technology</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">Enrollment Date</span>
                      </div>
                      <p className="text-slate-600">September 2023</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">Status</span>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Faculty Dashboard Section (simplified for now)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Faculty Navigation Bar - Fixed at top */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-slate-800">Faculty Dashboard</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Profile Section */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {profile?.full_name?.charAt(0) || 'F'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-700">{profile?.full_name}</p>
                <p className="text-xs text-slate-500">Faculty</p>
              </div>
            </div>
            
            {/* Sign Out */}
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={signOut}
            >
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Faculty Content */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8 max-w-4xl mx-auto px-6">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Faculty Dashboard
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Manage student records and academic processes efficiently.
            </p>
            <div className="pt-8">
              <Button 
                onClick={() => {
                  const element = document.getElementById('dashboard-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View Full Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
