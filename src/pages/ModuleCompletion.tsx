import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import CertificateGenerator from '@/components/CertificateGenerator';
import { Award, ArrowLeft, Star } from 'lucide-react';

const ModuleCompletion = () => {
  const { moduleName } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [moduleData, setModuleData] = useState<{
    lessons: any[];
    completedLessons: number;
    totalTimeSpent: number;
    completionDate: string;
    averageScore: number;
  } | null>(null);
  const [certificateEarned, setCertificateEarned] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !moduleName) return;
    
    fetchModuleCompletion();
  }, [user, moduleName]);

  const fetchModuleCompletion = async () => {
    try {
      // Fetch all lessons for this module
      const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_name', moduleName);

      if (!lessons || lessons.length === 0) {
        toast({
          title: "Module Not Found",
          description: "The requested module could not be found.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      // Fetch user progress for all lessons in this module
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user!.id)
        .in('lesson_id', lessons.map(l => l.id))
        .eq('status', 'completed');

      const completedLessons = progress?.length || 0;
      const totalTimeSpent = progress?.reduce((sum, p) => sum + (p.time_spent || 0), 0) || 0;
      const scoresWithValues = progress?.filter(p => p.quiz_score !== null) || [];
      const averageScore = scoresWithValues.length > 0 
        ? scoresWithValues.reduce((sum, p) => sum + (p.quiz_score || 0), 0) / scoresWithValues.length 
        : 0;

      // Check if module is fully completed
      const isModuleComplete = completedLessons === lessons.length;
      
      if (!isModuleComplete) {
        toast({
          title: "Module Not Complete",
          description: "Complete all lessons in this module to earn your certificate.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      // Get the most recent completion date
      const completionDate = progress
        ?.filter(p => p.completed_at)
        ?.sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
        ?.[0]?.completed_at || new Date().toISOString();

      setModuleData({
        lessons,
        completedLessons,
        totalTimeSpent: Math.floor(totalTimeSpent / 60), // Convert to minutes
        completionDate,
        averageScore: Math.round(averageScore)
      });

      // Award completion badge
      await awardCompletionBadge();
      setCertificateEarned(true);

    } catch (error) {
      console.error('Error fetching module completion:', error);
      toast({
        title: "Error",
        description: "Failed to load module completion data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const awardCompletionBadge = async () => {
    try {
      // Check if user already has this badge
      const { data: existingBadge } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', user!.id)
        .eq('badge_id', (await getBadgeId(`${moduleName} Master`)))
        .maybeSingle();

      if (!existingBadge) {
        // Award the badge
        const badgeId = await getBadgeId(`${moduleName} Master`);
        if (badgeId) {
          await supabase
            .from('user_badges')
            .insert({
              user_id: user!.id,
              badge_id: badgeId
            });

          toast({
            title: "Badge Earned! 🏆",
            description: `You've earned the "${moduleName} Master" badge!`,
          });
        }
      }
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  };

  const getBadgeId = async (badgeName: string): Promise<string | null> => {
    try {
      const { data: badge } = await supabase
        .from('badges')
        .select('id')
        .eq('name', badgeName)
        .maybeSingle();

      if (!badge) {
        // Create the badge if it doesn't exist
        const { data: newBadge } = await supabase
          .from('badges')
          .insert({
            name: badgeName,
            description: `Completed all lessons in ${moduleName}`,
            icon: '🏆',
            badge_type: 'module_completed',
            requirements: { module: moduleName }
          })
          .select('id')
          .single();

        return newBadge?.id || null;
      }

      return badge.id;
    } catch (error) {
      console.error('Error getting/creating badge:', error);
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Module Not Found</h2>
            <Button onClick={() => navigate('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Award className="w-16 h-16 text-yellow-500" />
            </div>
            <h1 className="text-4xl font-bold">Congratulations! 🎉</h1>
            <p className="text-xl text-muted-foreground">
              You've successfully completed the <strong>{moduleName}</strong> module!
            </p>
          </div>

          {/* Achievement Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Your Achievement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary">{moduleData.completedLessons}</div>
                  <div className="text-sm text-muted-foreground">Lessons Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">{moduleData.totalTimeSpent}m</div>
                  <div className="text-sm text-muted-foreground">Time Invested</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">{moduleData.averageScore}%</div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {new Date(moduleData.completionDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Completion Date</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificate */}
          {certificateEarned && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Your Certificate</h2>
                <p className="text-muted-foreground">
                  Download and share your achievement with others!
                </p>
              </div>
              
              <CertificateGenerator
                moduleName={moduleName!}
                completionDate={moduleData.completionDate}
                totalLessons={moduleData.completedLessons}
                totalTimeSpent={moduleData.totalTimeSpent}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Modules
            </Button>
            <Button onClick={() => navigate('/')}>
              Continue Learning
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleCompletion;