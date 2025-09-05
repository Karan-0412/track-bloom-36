import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { 
  Award, 
  Activity, 
  Calendar, 
  MapPin, 
  Building,
  Target,
  TrendingUp,
  Users,
  Trophy
} from 'lucide-react';
import { format } from 'date-fns';

interface CoCurricularActivity {
  id: string;
  title: string;
  description: string | null;
  activity_type: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  start_date: string | null;
  end_date: string | null;
  organization: string | null;
  location: string | null;
  credits_earned: number;
  created_at: string;
}

const CoCurricularRecords = () => {
  const { profile } = useProfile();
  const [activities, setActivities] = useState<CoCurricularActivity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchCoCurricularRecords();
    }
  }, [profile]);

  const fetchCoCurricularRecords = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('student_id', profile.id)
        .eq('category', 'co_curricular')
        .eq('status', 'approved')
        .order('start_date', { ascending: false });

      if (error) {
        console.error('Error fetching co-curricular records:', error);
        // Use mock data for demonstration
        setActivities([
          {
            id: '1',
            title: 'Student Council President',
            description: 'Led student council initiatives and represented student body',
            activity_type: 'leadership',
            status: 'approved',
            start_date: '2023-09-01',
            end_date: '2024-05-31',
            organization: 'University Student Council',
            location: 'Campus',
            credits_earned: 3,
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Annual Tech Fest Volunteer',
            description: 'Organized and managed technical events during the annual fest',
            activity_type: 'volunteering',
            status: 'approved',
            start_date: '2024-03-15',
            end_date: '2024-03-17',
            organization: 'Tech Fest Committee',
            location: 'Main Auditorium',
            credits_earned: 2,
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            title: 'Inter-University Basketball Championship',
            description: 'Represented university in basketball tournament',
            activity_type: 'sports',
            status: 'approved',
            start_date: '2024-02-10',
            end_date: '2024-02-12',
            organization: 'University Sports Committee',
            location: 'Sports Complex',
            credits_earned: 2,
            created_at: new Date().toISOString(),
          },
          {
            id: '4',
            title: 'Cultural Dance Performance',
            description: 'Performed traditional dance at cultural evening',
            activity_type: 'cultural',
            status: 'approved',
            start_date: '2024-01-20',
            end_date: '2024-01-20',
            organization: 'Cultural Committee',
            location: 'Main Hall',
            credits_earned: 1,
            created_at: new Date().toISOString(),
          }
        ]);
      } else {
        setActivities(data || []);
      }
    } catch (error) {
      console.error('Error fetching co-curricular records:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'leadership':
        return <Users className="h-4 w-4" />;
      case 'sports':
        return <Trophy className="h-4 w-4" />;
      case 'cultural':
        return <Award className="h-4 w-4" />;
      case 'volunteering':
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'leadership':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'sports':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cultural':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'volunteering':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'competition':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const calculateStats = () => {
    const totalActivities = activities.length;
    const totalCredits = activities.reduce((sum, activity) => sum + activity.credits_earned, 0);
    const activityTypes = [...new Set(activities.map(a => a.activity_type))].length;
    const averageCredits = totalActivities > 0 ? totalCredits / totalActivities : 0;

    return {
      totalActivities,
      totalCredits,
      activityTypes,
      averageCredits
    };
  };

  const groupByActivityType = () => {
    const grouped = activities.reduce((acc, activity) => {
      if (!acc[activity.activity_type]) {
        acc[activity.activity_type] = [];
      }
      acc[activity.activity_type].push(activity);
      return acc;
    }, {} as Record<string, CoCurricularActivity[]>);

    return Object.entries(grouped).sort(([, a], [, b]) => b.length - a.length);
  };

  const groupByYear = () => {
    const grouped = activities.reduce((acc, activity) => {
      const year = activity.start_date ? new Date(activity.start_date).getFullYear().toString() : 'Unknown';
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(activity);
      return acc;
    }, {} as Record<string, CoCurricularActivity[]>);

    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  };

  const stats = calculateStats();
  const typeGroups = groupByActivityType();
  const yearGroups = groupByYear();

  if (loading) {
    return <div className="text-center py-4">Loading co-curricular records...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Co-Curricular Records</h2>
        <p className="text-muted-foreground">Your approved co-curricular activities and achievements</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActivities}</div>
            <p className="text-xs text-muted-foreground">Approved activities</p>
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
            <CardTitle className="text-sm font-medium">Activity Types</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activityTypes}</div>
            <p className="text-xs text-muted-foreground">Different categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Credits</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageCredits.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Per activity</p>
          </CardContent>
        </Card>
      </div>

      {activities.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Co-Curricular Records</h3>
            <p className="text-muted-foreground">
              Your approved co-curricular activities will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="by-type" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="by-type">By Activity Type</TabsTrigger>
            <TabsTrigger value="by-year">By Year</TabsTrigger>
            <TabsTrigger value="all">All Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="by-type" className="space-y-4">
            {typeGroups.map(([type, typeActivities]) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getActivityTypeIcon(type)}
                    <span>{type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}</span>
                  </CardTitle>
                  <CardDescription>
                    {typeActivities.length} activities • {typeActivities.reduce((sum, a) => sum + a.credits_earned, 0)} credits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {typeActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{activity.title}</h4>
                            <Badge className={getActivityTypeColor(activity.activity_type)}>
                              {activity.activity_type.replace('_', ' ')}
                            </Badge>
                          </div>
                          {activity.description && (
                            <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            {activity.organization && (
                              <div className="flex items-center space-x-1">
                                <Building className="h-3 w-3" />
                                <span>{activity.organization}</span>
                              </div>
                            )}
                            {activity.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{activity.location}</span>
                              </div>
                            )}
                            {activity.start_date && (
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {format(new Date(activity.start_date), 'MMM dd, yyyy')}
                                  {activity.end_date && activity.end_date !== activity.start_date && 
                                    ` - ${format(new Date(activity.end_date), 'MMM dd, yyyy')}`
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <Badge variant="outline">
                            {activity.credits_earned} credits
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="by-year" className="space-y-4">
            {yearGroups.map(([year, yearActivities]) => (
              <Card key={year}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>{year}</span>
                  </CardTitle>
                  <CardDescription>
                    {yearActivities.length} activities • {yearActivities.reduce((sum, a) => sum + a.credits_earned, 0)} credits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {yearActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">{activity.title}</h4>
                            <Badge className={getActivityTypeColor(activity.activity_type)}>
                              {activity.activity_type.replace('_', ' ')}
                            </Badge>
                          </div>
                          {activity.description && (
                            <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            {activity.organization && (
                              <div className="flex items-center space-x-1">
                                <Building className="h-3 w-3" />
                                <span>{activity.organization}</span>
                              </div>
                            )}
                            {activity.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{activity.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <Badge variant="outline">
                            {activity.credits_earned} credits
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-4">
              {activities.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getActivityTypeIcon(activity.activity_type)}
                          <h3 className="font-semibold">{activity.title}</h3>
                          <Badge className={getActivityTypeColor(activity.activity_type)}>
                            {activity.activity_type.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          {activity.organization && (
                            <div className="flex items-center space-x-2">
                              <Building className="h-4 w-4" />
                              <span>{activity.organization}</span>
                            </div>
                          )}
                          
                          {activity.location && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{activity.location}</span>
                            </div>
                          )}
                          
                          {activity.start_date && (
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {format(new Date(activity.start_date), 'MMM dd, yyyy')}
                                {activity.end_date && activity.end_date !== activity.start_date && 
                                  ` - ${format(new Date(activity.end_date), 'MMM dd, yyyy')}`
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <Badge variant="outline">
                          {activity.credits_earned} credits
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CoCurricularRecords;