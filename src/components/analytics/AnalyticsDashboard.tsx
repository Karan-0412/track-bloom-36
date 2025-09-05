import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  FileText, 
  Download, 
  Calendar,
  Building,
  Target,
  Activity,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
  Eye,
  Trash2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface AnalyticsData {
  totalStudents: number;
  totalFaculty: number;
  totalCertificates: number;
  totalActivities: number;
  approvedCertificates: number;
  approvedActivities: number;
  pendingCertificates: number;
  pendingActivities: number;
  rejectedCertificates: number;
  rejectedActivities: number;
  totalCredits: number;
  averageCreditsPerStudent: number;
}

interface Report {
  id: string;
  title: string;
  description: string | null;
  report_type: 'naac' | 'aicte' | 'nirf' | 'internal' | 'custom';
  generated_by: string | null;
  parameters: any;
  file_url: string | null;
  status: string;
  created_at: string;
  completed_at: string | null;
}

interface StudentAchievement {
  student_id: string;
  full_name: string;
  student_id_number: string | null;
  total_certificates: number;
  approved_certificates: number;
  total_activities: number;
  approved_activities: number;
  total_credits: number;
  current_cgpa: number | null;
}

const AnalyticsDashboard = () => {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalStudents: 0,
    totalFaculty: 0,
    totalCertificates: 0,
    totalActivities: 0,
    approvedCertificates: 0,
    approvedActivities: 0,
    pendingCertificates: 0,
    pendingActivities: 0,
    rejectedCertificates: 0,
    rejectedActivities: 0,
    totalCredits: 0,
    averageCreditsPerStudent: 0,
  });
  const [reports, setReports] = useState<Report[]>([]);
  const [studentAchievements, setStudentAchievements] = useState<StudentAchievement[]>([]);
  const [loading, setLoading] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  
  // Report form state
  const [reportForm, setReportForm] = useState({
    title: '',
    description: '',
    report_type: 'internal' as 'naac' | 'aicte' | 'nirf' | 'internal' | 'custom',
    parameters: {} as any,
  });

  useEffect(() => {
    if (profile && (profile.faculty_level === 'senior' || profile.faculty_level === 'admin')) {
      fetchAnalyticsData();
      fetchReports();
      fetchStudentAchievements();
    }
  }, [profile]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch students count
      const { count: studentsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student');

      // Fetch faculty count
      const { count: facultyCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'faculty');

      // Fetch certificates data
      const { data: certificates } = await supabase
        .from('certificates')
        .select('status');

      // Fetch activities data
      const { data: activities } = await supabase
        .from('activities')
        .select('status, credits_earned');

      // Fetch student achievements summary
      const { data: achievements } = await supabase
        .from('student_achievements_summary')
        .select('*');

      const totalCertificates = certificates?.length || 0;
      const approvedCertificates = certificates?.filter(c => c.status === 'approved').length || 0;
      const pendingCertificates = certificates?.filter(c => c.status === 'pending').length || 0;
      const rejectedCertificates = certificates?.filter(c => c.status === 'rejected').length || 0;

      const totalActivities = activities?.length || 0;
      const approvedActivities = activities?.filter(a => a.status === 'approved').length || 0;
      const pendingActivities = activities?.filter(a => a.status === 'submitted').length || 0;
      const rejectedActivities = activities?.filter(a => a.status === 'rejected').length || 0;

      const totalCredits = activities?.reduce((sum, a) => sum + (a.credits_earned || 0), 0) || 0;
      const averageCreditsPerStudent = achievements && achievements.length > 0 
        ? achievements.reduce((sum, a) => sum + a.total_credits, 0) / achievements.length 
        : 0;

      setAnalyticsData({
        totalStudents: studentsCount || 0,
        totalFaculty: facultyCount || 0,
        totalCertificates,
        totalActivities,
        approvedCertificates,
        approvedActivities,
        pendingCertificates,
        pendingActivities,
        rejectedCertificates,
        rejectedActivities,
        totalCredits,
        averageCreditsPerStudent,
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('institutional_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
      } else {
        setReports(data || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchStudentAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('student_achievements_summary')
        .select('*')
        .order('total_credits', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching student achievements:', error);
      } else {
        setStudentAchievements(data || []);
      }
    } catch (error) {
      console.error('Error fetching student achievements:', error);
    }
  };

  const generateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setGeneratingReport(reportForm.report_type);
    try {
      const { error } = await supabase
        .from('institutional_reports')
        .insert({
          title: reportForm.title,
          description: reportForm.description,
          report_type: reportForm.report_type,
          generated_by: profile.id,
          parameters: reportForm.parameters,
          status: 'generating',
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Report generation started! You will be notified when it\'s ready.',
      });

      // Reset form
      setReportForm({
        title: '',
        description: '',
        report_type: 'internal',
        parameters: {},
      });
      setIsReportDialogOpen(false);
      
      // Refresh reports
      fetchReports();
    } catch (error: any) {
      console.error('Error generating report:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate report',
        variant: 'destructive',
      });
    } finally {
      setGeneratingReport(null);
    }
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const { error } = await supabase
        .from('institutional_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Report deleted successfully!',
      });

      fetchReports();
    } catch (error: any) {
      console.error('Error deleting report:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete report',
        variant: 'destructive',
      });
    }
  };

  // Chart data
  const certificateStatusData = [
    { name: 'Approved', value: analyticsData.approvedCertificates, color: '#10b981' },
    { name: 'Pending', value: analyticsData.pendingCertificates, color: '#f59e0b' },
    { name: 'Rejected', value: analyticsData.rejectedCertificates, color: '#ef4444' },
  ];

  const activityStatusData = [
    { name: 'Approved', value: analyticsData.approvedActivities, color: '#10b981' },
    { name: 'Pending', value: analyticsData.pendingActivities, color: '#f59e0b' },
    { name: 'Rejected', value: analyticsData.rejectedActivities, color: '#ef4444' },
  ];

  const monthlyData = [
    { month: 'Jan', certificates: 12, activities: 8 },
    { month: 'Feb', certificates: 19, activities: 15 },
    { month: 'Mar', certificates: 15, activities: 12 },
    { month: 'Apr', certificates: 22, activities: 18 },
    { month: 'May', certificates: 18, activities: 14 },
    { month: 'Jun', certificates: 25, activities: 20 },
  ];

  if (!profile || (profile.faculty_level !== 'senior' && profile.faculty_level !== 'admin')) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              You need senior faculty or admin privileges to access analytics and reporting.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground">Institutional analytics and reporting dashboard</p>
        </div>
        <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Generate New Report</DialogTitle>
              <DialogDescription>
                Create a new institutional report for analysis and compliance.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={generateReport} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Report Title *</Label>
                <Input
                  id="title"
                  value={reportForm.title}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  placeholder="e.g., Q1 2024 Student Achievements"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  placeholder="Brief description of the report..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report_type">Report Type *</Label>
                <Select 
                  value={reportForm.report_type} 
                  onValueChange={(value: 'naac' | 'aicte' | 'nirf' | 'internal' | 'custom') => 
                    setReportForm({ ...reportForm, report_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal Report</SelectItem>
                    <SelectItem value="naac">NAAC Report</SelectItem>
                    <SelectItem value="aicte">AICTE Report</SelectItem>
                    <SelectItem value="nirf">NIRF Report</SelectItem>
                    <SelectItem value="custom">Custom Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsReportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={generatingReport !== null || !reportForm.title}>
                  {generatingReport ? 'Generating...' : 'Generate Report'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Active students
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalFaculty}</div>
            <p className="text-xs text-muted-foreground">
              Teaching staff
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.totalCertificates + analyticsData.totalActivities}
            </div>
            <p className="text-xs text-muted-foreground">
              Certificates & Activities
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalCredits}</div>
            <p className="text-xs text-muted-foreground">
              Earned by students
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Certificates and activities over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="certificates" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="activities" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Students */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Students</CardTitle>
                <CardDescription>Students with highest achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentAchievements.slice(0, 5).map((student, index) => (
                    <div key={student.student_id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{student.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {student.student_id_number || 'No ID'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{student.total_credits} credits</p>
                        <p className="text-sm text-muted-foreground">
                          {student.approved_certificates + student.approved_activities} achievements
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Certificate Status Distribution</CardTitle>
                <CardDescription>Breakdown of certificate approval status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={certificateStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {certificateStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificate Statistics</CardTitle>
                <CardDescription>Detailed certificate metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Certificates</span>
                    <span className="text-2xl font-bold">{analyticsData.totalCertificates}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-600">Approved</span>
                    <span className="text-xl font-semibold text-green-600">{analyticsData.approvedCertificates}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-yellow-600">Pending</span>
                    <span className="text-xl font-semibold text-yellow-600">{analyticsData.pendingCertificates}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-red-600">Rejected</span>
                    <span className="text-xl font-semibold text-red-600">{analyticsData.rejectedCertificates}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Approval Rate</span>
                    <span className="text-xl font-bold">
                      {analyticsData.totalCertificates > 0 
                        ? Math.round((analyticsData.approvedCertificates / analyticsData.totalCertificates) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Status Distribution</CardTitle>
                <CardDescription>Breakdown of activity approval status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={activityStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {activityStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Statistics</CardTitle>
                <CardDescription>Detailed activity metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Activities</span>
                    <span className="text-2xl font-bold">{analyticsData.totalActivities}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-600">Approved</span>
                    <span className="text-xl font-semibold text-green-600">{analyticsData.approvedActivities}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-yellow-600">Pending</span>
                    <span className="text-xl font-semibold text-yellow-600">{analyticsData.pendingActivities}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-red-600">Rejected</span>
                    <span className="text-xl font-semibold text-red-600">{analyticsData.rejectedActivities}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Average Credits per Student</span>
                    <span className="text-xl font-bold">
                      {Math.round(analyticsData.averageCreditsPerStudent * 10) / 10}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Institutional reports for compliance and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No reports generated yet</p>
                  <p className="text-sm">Generate your first report to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{report.title}</h3>
                            <Badge variant="outline">{report.report_type.toUpperCase()}</Badge>
                            <Badge 
                              variant={report.status === 'completed' ? 'default' : 'secondary'}
                            >
                              {report.status}
                            </Badge>
                          </div>
                          {report.description && (
                            <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                          )}
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Created: {new Date(report.created_at).toLocaleDateString()}</span>
                            {report.completed_at && (
                              <span>Completed: {new Date(report.completed_at).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {report.file_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(report.file_url, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteReport(report.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;

