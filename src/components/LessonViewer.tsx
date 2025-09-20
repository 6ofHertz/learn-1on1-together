import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAgeAdaptiveStyles } from '@/hooks/useAgeAdaptiveStyles';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, PlayCircle, Clock, Award, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Lesson {
  id: string;
  title: string;
  module_name: string;
  description: string;
  content: any;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_duration: number;
  order_in_module: number;
  weekend_only: boolean;
}

interface LessonProgress {
  id?: string;
  lesson_id: string;
  user_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  time_spent: number;
  quiz_score?: number;
  started_at?: string;
  completed_at?: string;
}

interface LessonViewerProps {
  lessonId: string;
  onClose: () => void;
}

const LessonViewer: React.FC<LessonViewerProps> = ({ lessonId, onClose }) => {
  const { user } = useAuth();
  const styles = useAgeAdaptiveStyles();
  const { toast } = useToast();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !lessonId) return;

    const fetchLessonData = async () => {
      try {
        // Fetch lesson details
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lessonId)
          .single();

        if (lessonError) throw lessonError;

        // Fetch user progress
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .maybeSingle();

        setLesson(lessonData);
        setProgress(progressData ? {
          ...progressData,
          status: progressData.status as 'not_started' | 'in_progress' | 'completed'
        } : {
          lesson_id: lessonId,
          user_id: user.id,
          status: 'not_started' as const,
          progress_percentage: 0,
          time_spent: 0
        });

        if (progressData?.time_spent) {
          setTimeSpent(progressData.time_spent);
        }

      } catch (error) {
        console.error('Error fetching lesson:', error);
        toast({
          title: "Error",
          description: "Failed to load lesson content",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLessonData();
  }, [user, lessonId, toast]);

  useEffect(() => {
    // Start lesson if not already started
    if (lesson && progress && progress.status === 'not_started') {
      startLesson();
    }
  }, [lesson, progress]);

  useEffect(() => {
    // Track time spent
    const interval = setInterval(() => {
      if (progress?.status === 'in_progress') {
        setTimeSpent(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [progress?.status]);

  const startLesson = async () => {
    if (!user || !lesson) return;

    try {
      const updatedProgress: Partial<LessonProgress> = {
        status: 'in_progress',
        started_at: new Date().toISOString(),
        progress_percentage: 0
      };

      if (progress?.id) {
        await supabase
          .from('user_progress')
          .update(updatedProgress)
          .eq('id', progress.id);
      } else {
        const { data } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            lesson_id: lesson.id,
            ...updatedProgress
          })
          .select()
          .single();
        
        if (data) {
          setProgress(prev => ({ ...prev!, ...updatedProgress, id: data.id }));
        }
      }

      setProgress(prev => prev ? { ...prev, ...updatedProgress } : null);
    } catch (error) {
      console.error('Error starting lesson:', error);
    }
  };

  const completeLesson = async () => {
    if (!user || !lesson || !progress?.id) return;

    try {
      const updatedProgress = {
        status: 'completed' as const,
        completed_at: new Date().toISOString(),
        progress_percentage: 100,
        time_spent: timeSpent
      };

      await supabase
        .from('user_progress')
        .update(updatedProgress)
        .eq('id', progress.id);

      setProgress(prev => prev ? { ...prev, ...updatedProgress } : null);

      toast({
        title: "Lesson Completed! 🎉",
        description: `Great job completing "${lesson.title}"!`,
      });

      // Track analytics
      await supabase
        .from('analytics')
        .insert({
          user_id: user.id,
          lesson_id: lesson.id,
          event_type: 'lesson_completed',
          metadata: {
            time_spent: timeSpent,
            difficulty: lesson.difficulty,
            module: lesson.module_name
          }
        });

    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  const updateProgress = async (percentage: number) => {
    if (!progress?.id) return;

    try {
      await supabase
        .from('user_progress')
        .update({ 
          progress_percentage: percentage,
          time_spent: timeSpent 
        })
        .eq('id', progress.id);

      setProgress(prev => prev ? { ...prev, progress_percentage: percentage } : null);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
            <Button onClick={onClose}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sections = lesson.content?.sections || [];
  const totalSections = sections.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className={`${styles.fontSize} font-bold`}>{lesson.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">{lesson.module_name}</Badge>
                  <Badge variant="outline">{lesson.difficulty}</Badge>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {lesson.estimated_duration} min
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
              </div>
              <div className="w-32">
                <Progress value={progress?.progress_percentage || 0} />
              </div>
              <span className="text-sm font-medium">
                {progress?.progress_percentage || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {totalSections > 0 ? (
            <Card className={styles.spacing}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    Section {currentSection + 1} of {totalSections}
                  </span>
                  {progress?.status === 'completed' && (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Completed
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div 
                  className={`${styles.fontSize} prose prose-slate max-w-none`}
                  dangerouslySetInnerHTML={{ 
                    __html: sections[currentSection]?.content || sections[currentSection]?.text 
                  }}
                />

                {/* Navigation */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newSection = Math.max(0, currentSection - 1);
                      setCurrentSection(newSection);
                      updateProgress(Math.round(((newSection + 1) / totalSections) * 100));
                    }}
                    disabled={currentSection === 0}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {currentSection === totalSections - 1 ? (
                    <Button
                      onClick={completeLesson}
                      disabled={progress?.status === 'completed'}
                      className="flex items-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      Complete Lesson
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        const newSection = Math.min(totalSections - 1, currentSection + 1);
                        setCurrentSection(newSection);
                        updateProgress(Math.round(((newSection + 1) / totalSections) * 100));
                      }}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className={styles.spacing}>
              <CardContent className="text-center py-12">
                <PlayCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Lesson Content Coming Soon</h3>
                <p className="text-muted-foreground mb-6">
                  This lesson is being prepared and will be available soon.
                </p>
                <Button onClick={onClose}>Go Back</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;