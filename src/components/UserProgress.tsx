import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Book, Clock } from 'lucide-react';

interface UserBadge {
  id: string;
  badge_id: string;
  earned_at: string;
  badges: {
    name: string;
    description: string;
    icon: string;
  };
}

interface ProgressStats {
  totalLessons: number;
  completedLessons: number;
  totalTimeSpent: number;
  averageScore: number;
}

const UserProgress = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    totalLessons: 0,
    completedLessons: 0,
    totalTimeSpent: 0,
    averageScore: 0
  });

  useEffect(() => {
    if (!user) return;

    const fetchProgress = async () => {
      // Fetch user badges
      const { data: badgesData } = await supabase
        .from('user_badges')
        .select(`
          id,
          badge_id,
          earned_at,
          badges:badge_id (
            name,
            description,
            icon
          )
        `)
        .eq('user_id', user.id);

      if (badgesData) {
        setBadges(badgesData);
      }

      // Fetch progress statistics
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('id');

      if (progressData && lessonsData) {
        const completedLessons = progressData.filter(p => p.status === 'completed').length;
        const totalTimeSpent = progressData.reduce((sum, p) => sum + (p.time_spent || 0), 0);
        const scoresWithValues = progressData.filter(p => p.quiz_score !== null);
        const averageScore = scoresWithValues.length > 0 
          ? scoresWithValues.reduce((sum, p) => sum + (p.quiz_score || 0), 0) / scoresWithValues.length 
          : 0;

        setStats({
          totalLessons: lessonsData.length,
          completedLessons,
          totalTimeSpent: Math.floor(totalTimeSpent / 60), // Convert to minutes
          averageScore: Math.round(averageScore)
        });
      }
    };

    fetchProgress();
  }, [user]);

  const progressPercentage = stats.totalLessons > 0 
    ? Math.round((stats.completedLessons / stats.totalLessons) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            Your Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{stats.completedLessons}</div>
              <div className="text-sm text-muted-foreground">Lessons Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{stats.totalTimeSpent}</div>
              <div className="text-sm text-muted-foreground">Minutes Learned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{stats.averageScore}%</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{badges.length}</div>
              <div className="text-sm text-muted-foreground">Badges Earned</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      {badges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Your Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {badges.map((userBadge) => (
                <Badge
                  key={userBadge.id}
                  variant="secondary"
                  className="text-sm py-2 px-3 flex items-center gap-2"
                >
                  <span className="text-lg">{userBadge.badges.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold">{userBadge.badges.name}</div>
                    <div className="text-xs opacity-80">{userBadge.badges.description}</div>
                  </div>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserProgress;