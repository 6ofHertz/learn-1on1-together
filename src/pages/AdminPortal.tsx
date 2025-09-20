import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Clock, 
  Target,
  Download,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudentStats {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  age_group: string;
  total_progress: number;
  completed_lessons: number;
  total_time: number;
  badges_earned: number;
  average_score: number;
  last_activity: string;
}

interface ModuleStats {
  module_name: string;
  total_lessons: number;
  avg_completion_rate: number;
  avg_time_spent: number;
  avg_score: number;
  drop_off_rate: number;
}

const AdminPortal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [students, setStudents] = useState<StudentStats[]>([]);
  const [moduleStats, setModuleStats] = useState<ModuleStats[]>([]);
  const [overallStats, setOverallStats] = useState({
    totalStudents: 0,
    totalLessons: 0,
    avgCompletionRate: 0,
    totalBadgesEarned: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch student statistics
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*');

      if (profiles) {
        const studentStats = await Promise.all(
          profiles.map(async (profile) => {
            // Get progress data
            const { data: progressData } = await supabase
              .from('user_progress')
              .select('*')
              .eq('user_id', profile.user_id);

            // Get badges
            const { data: badgesData } = await supabase
              .from('user_badges')
              .select('*')
              .eq('user_id', profile.user_id);

            const completedLessons = progressData?.filter(p => p.status === 'completed').length || 0;
            const totalTime = progressData?.reduce((sum, p) => sum + (p.time_spent || 0), 0) || 0;
            const scoresWithValues = progressData?.filter(p => p.quiz_score !== null) || [];
            const averageScore = scoresWithValues.length > 0 
              ? scoresWithValues.reduce((sum, p) => sum + (p.quiz_score || 0), 0) / scoresWithValues.length 
              : 0;

            return {
              id: profile.id,
              first_name: profile.first_name || 'Unknown',
              last_name: profile.last_name || '',
              age: profile.age || 0,
              age_group: profile.age_group || 'adult',
              total_progress: progressData?.length || 0,
              completed_lessons: completedLessons,
              total_time: Math.floor(totalTime / 60), // Convert to minutes
              badges_earned: badgesData?.length || 0,
              average_score: Math.round(averageScore),
              last_activity: progressData?.[0]?.updated_at || profile.updated_at
            };
          })
        );

        setStudents(studentStats);
      }

      // Fetch module statistics
      const { data: lessons } = await supabase
        .from('lessons')
        .select('*');

      if (lessons) {
        const moduleGroups = lessons.reduce((acc, lesson) => {
          if (!acc[lesson.module_name]) {
            acc[lesson.module_name] = [];
          }
          acc[lesson.module_name].push(lesson);
          return acc;
        }, {} as Record<string, any[]>);

        const moduleStatsData = await Promise.all(
          Object.entries(moduleGroups).map(async ([moduleName, moduleLessons]) => {
            const lessonIds = moduleLessons.map(l => l.id);
            
            const { data: progressData } = await supabase
              .from('user_progress')
              .select('*')
              .in('lesson_id', lessonIds);

            const totalProgress = progressData?.length || 0;
            const completedProgress = progressData?.filter(p => p.status === 'completed').length || 0;
            const avgTime = progressData?.reduce((sum, p) => sum + (p.time_spent || 0), 0) || 0;
            const scoresWithValues = progressData?.filter(p => p.quiz_score !== null) || [];
            const avgScore = scoresWithValues.length > 0 
              ? scoresWithValues.reduce((sum, p) => sum + (p.quiz_score || 0), 0) / scoresWithValues.length 
              : 0;

            return {
              module_name: moduleName,
              total_lessons: moduleLessons.length,
              avg_completion_rate: totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0,
              avg_time_spent: totalProgress > 0 ? Math.floor(avgTime / totalProgress / 60) : 0,
              avg_score: Math.round(avgScore),
              drop_off_rate: totalProgress > 0 ? ((totalProgress - completedProgress) / totalProgress) * 100 : 0
            };
          })
        );

        setModuleStats(moduleStatsData);
      }

      // Calculate overall stats
      const { data: allBadges } = await supabase
        .from('user_badges')
        .select('id');

      setOverallStats({
        totalStudents: profiles?.length || 0,
        totalLessons: lessons?.length || 0,
        avgCompletionRate: moduleStats.length > 0 
          ? moduleStats.reduce((sum, m) => sum + m.avg_completion_rate, 0) / moduleStats.length 
          : 0,
        totalBadgesEarned: allBadges?.length || 0
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportStudentData = () => {
    const csvContent = [
      ['Name', 'Age', 'Age Group', 'Completed Lessons', 'Time Spent (min)', 'Badges', 'Avg Score', 'Last Activity'],
      ...students.map(student => [
        `${student.first_name} ${student.last_name}`,
        student.age,
        student.age_group,
        student.completed_lessons,
        student.total_time,
        student.badges_earned,
        `${student.average_score}%`,
        new Date(student.last_activity).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'students_report.csv';
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Student data exported successfully",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Portal</h1>
              <p className="text-muted-foreground">Manage students and track learning progress</p>
            </div>
            <Button onClick={exportStudentData} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.totalStudents}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.totalLessons}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(overallStats.avgCompletionRate)}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.totalBadgesEarned}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="students" className="space-y-6">
            <TabsList>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="modules">Module Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="students">
              <Card>
                <CardHeader>
                  <CardTitle>Student Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div>
                            <h3 className="font-semibold">
                              {student.first_name} {student.last_name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Age: {student.age}</span>
                              <Badge variant="outline">{student.age_group}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="text-center">
                            <div className="font-semibold">{student.completed_lessons}</div>
                            <div className="text-muted-foreground">Lessons</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{student.total_time}m</div>
                            <div className="text-muted-foreground">Time</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{student.badges_earned}</div>
                            <div className="text-muted-foreground">Badges</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{student.average_score}%</div>
                            <div className="text-muted-foreground">Avg Score</div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="modules">
              <Card>
                <CardHeader>
                  <CardTitle>Module Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {moduleStats.map((module) => (
                      <div
                        key={module.module_name}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold">{module.module_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {module.total_lessons} lessons
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-green-600">
                              {Math.round(module.avg_completion_rate)}%
                            </div>
                            <div className="text-muted-foreground">Completion</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{module.avg_time_spent}m</div>
                            <div className="text-muted-foreground">Avg Time</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold">{module.avg_score}%</div>
                            <div className="text-muted-foreground">Avg Score</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-red-500">
                              {Math.round(module.drop_off_rate)}%
                            </div>
                            <div className="text-muted-foreground">Drop-off</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;