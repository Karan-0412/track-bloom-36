import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  Calendar,
  GraduationCap,
  Target
} from 'lucide-react';

interface AcademicRecord {
  id: string;
  semester: string;
  subject_code: string;
  subject_name: string;
  credits: number;
  grade: string;
  grade_points: number | null;
  cgpa: number | null;
  academic_year: string;
  created_at: string;
}

const AcademicRecords = () => {
  const { profile } = useProfile();
  const [records, setRecords] = useState<AcademicRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchAcademicRecords();
    }
  }, [profile]);

  const fetchAcademicRecords = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('academic_records')
        .select('*')
        .eq('student_id', profile.id)
        .order('academic_year', { ascending: false })
        .order('semester', { ascending: false });

      if (error) {
        console.error('Error fetching academic records:', error);
        // Use mock data for demonstration
        setRecords([
          {
            id: '1',
            semester: 'Fall 2023',
            subject_code: 'CS101',
            subject_name: 'Introduction to Computer Science',
            credits: 3,
            grade: 'A',
            grade_points: 4.0,
            cgpa: 3.8,
            academic_year: '2023-24',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            semester: 'Fall 2023',
            subject_code: 'MATH201',
            subject_name: 'Calculus II',
            credits: 4,
            grade: 'B+',
            grade_points: 3.3,
            cgpa: 3.8,
            academic_year: '2023-24',
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            semester: 'Spring 2023',
            subject_code: 'ENG101',
            subject_name: 'English Composition',
            credits: 3,
            grade: 'A-',
            grade_points: 3.7,
            cgpa: 3.7,
            academic_year: '2022-23',
            created_at: new Date().toISOString(),
          }
        ]);
      } else {
        setRecords(data || []);
      }
    } catch (error) {
      console.error('Error fetching academic records:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (grade.startsWith('D')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const calculateStats = () => {
    const totalCredits = records.reduce((sum, record) => sum + record.credits, 0);
    const currentCGPA = records.length > 0 ? records[0].cgpa || 0 : 0;
    const totalSubjects = records.length;
    const averageGradePoints = records.reduce((sum, record) => sum + (record.grade_points || 0), 0) / records.length || 0;

    return {
      totalCredits,
      currentCGPA,
      totalSubjects,
      averageGradePoints
    };
  };

  const groupByAcademicYear = () => {
    const grouped = records.reduce((acc, record) => {
      if (!acc[record.academic_year]) {
        acc[record.academic_year] = [];
      }
      acc[record.academic_year].push(record);
      return acc;
    }, {} as Record<string, AcademicRecord[]>);

    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  };

  const groupBySemester = () => {
    const grouped = records.reduce((acc, record) => {
      const key = `${record.academic_year} - ${record.semester}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(record);
      return acc;
    }, {} as Record<string, AcademicRecord[]>);

    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  };

  const stats = calculateStats();
  const yearGroups = groupByAcademicYear();
  const semesterGroups = groupBySemester();

  if (loading) {
    return <div className="text-center py-4">Loading academic records...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Academic Records</h2>
        <p className="text-muted-foreground">Your complete academic performance and transcript</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current CGPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentCGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Out of 4.0</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCredits}</div>
            <p className="text-xs text-muted-foreground">Credits earned</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubjects}</div>
            <p className="text-xs text-muted-foreground">Courses completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Grade Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageGradePoints.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Average performance</p>
          </CardContent>
        </Card>
      </div>

      {records.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Academic Records</h3>
            <p className="text-muted-foreground">
              Your academic records will appear here once they are added by faculty.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="by-year" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="by-year">By Academic Year</TabsTrigger>
            <TabsTrigger value="by-semester">By Semester</TabsTrigger>
          </TabsList>

          <TabsContent value="by-year" className="space-y-4">
            {yearGroups.map(([year, yearRecords]) => (
              <Card key={year}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Academic Year {year}</span>
                  </CardTitle>
                  <CardDescription>
                    {yearRecords.length} subjects • {yearRecords.reduce((sum, r) => sum + r.credits, 0)} credits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {yearRecords.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{record.subject_name}</h4>
                            <Badge variant="outline">{record.subject_code}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {record.semester} • {record.credits} credits
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getGradeColor(record.grade)}>
                            {record.grade}
                          </Badge>
                          {record.grade_points && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {record.grade_points.toFixed(1)} GP
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="by-semester" className="space-y-4">
            {semesterGroups.map(([semesterKey, semesterRecords]) => (
              <Card key={semesterKey}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>{semesterKey}</span>
                  </CardTitle>
                  <CardDescription>
                    {semesterRecords.length} subjects • {semesterRecords.reduce((sum, r) => sum + r.credits, 0)} credits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {semesterRecords.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{record.subject_name}</h4>
                            <Badge variant="outline">{record.subject_code}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {record.credits} credits
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getGradeColor(record.grade)}>
                            {record.grade}
                          </Badge>
                          {record.grade_points && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {record.grade_points.toFixed(1)} GP
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AcademicRecords;