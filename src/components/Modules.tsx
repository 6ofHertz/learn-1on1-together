import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroButton } from "@/components/ui/hero-button"
import { Button } from "@/components/ui/button"
import { Monitor, FileText, BarChart3, Presentation, Globe, Mail, Play, Lock } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useAgeAdaptiveStyles } from "@/hooks/useAgeAdaptiveStyles"
import { useWeekendScheduling } from "@/hooks/useWeekendScheduling"
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import LessonViewer from "./LessonViewer"

const modules = [
  {
    icon: Monitor,
    title: "Computer Basics",
    description: "Start from the very beginning - mouse, keyboard, files, and folders",
    lessons: "8 lessons",
    duration: "2 weekends"
  },
  {
    icon: FileText,
    title: "Microsoft Word",
    description: "Create documents, format text, and master essential writing tools",
    lessons: "10 lessons", 
    duration: "3 weekends"
  },
  {
    icon: BarChart3,
    title: "Microsoft Excel",
    description: "Spreadsheets, formulas, charts, and data organization made simple",
    lessons: "12 lessons",
    duration: "4 weekends"
  },
  {
    icon: Presentation,
    title: "Microsoft PowerPoint",
    description: "Create stunning presentations that captivate your audience",
    lessons: "8 lessons",
    duration: "2 weekends"
  },
  {
    icon: Globe,
    title: "Internet & Browsing",
    description: "Navigate the web safely, search effectively, and stay secure online",
    lessons: "6 lessons",
    duration: "2 weekends"
  },
  {
    icon: Mail,
    title: "Email Mastery",
    description: "Send, receive, organize emails and manage your digital communication",
    lessons: "6 lessons",
    duration: "2 weekends"
  }
]

const Modules = () => {
  const { user } = useAuth();
  const styles = useAgeAdaptiveStyles();
  const { isWeekend } = useWeekendScheduling();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [moduleLessons, setModuleLessons] = useState<Record<string, any[]>>({});
  const [userProgress, setUserProgress] = useState<Record<string, any>>({});

  useEffect(() => {
    if (user) {
      fetchLessonsAndProgress();
    }
  }, [user]);

  const fetchLessonsAndProgress = async () => {
    try {
      // Fetch all lessons grouped by module
      const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .order('order_in_module');

      if (lessons) {
        const grouped = lessons.reduce((acc, lesson) => {
          if (!acc[lesson.module_name]) {
            acc[lesson.module_name] = [];
          }
          acc[lesson.module_name].push(lesson);
          return acc;
        }, {} as Record<string, any[]>);
        setModuleLessons(grouped);
      }

      // Fetch user progress
      if (user) {
        const { data: progress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);

        if (progress) {
          const progressMap = progress.reduce((acc, p) => {
            acc[p.lesson_id] = p;
            return acc;
          }, {} as Record<string, any>);
          setUserProgress(progressMap);
        }
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const getModuleProgress = (moduleName: string) => {
    const lessons = moduleLessons[moduleName] || [];
    if (lessons.length === 0) return 0;
    
    const completed = lessons.filter(lesson => 
      userProgress[lesson.id]?.status === 'completed'
    ).length;
    
    return Math.round((completed / lessons.length) * 100);
  };

  const getFirstAvailableLesson = (moduleName: string) => {
    const lessons = moduleLessons[moduleName] || [];
    return lessons.find(lesson => {
      const progress = userProgress[lesson.id];
      return !progress || progress.status !== 'completed';
    });
  };

  const canAccessModule = (moduleName: string) => {
    if (!user) return false;
    const lessons = moduleLessons[moduleName] || [];
    const hasWeekendOnlyLessons = lessons.some(lesson => lesson.weekend_only);
    return !hasWeekendOnlyLessons || isWeekend;
  };

  if (selectedLesson) {
    return (
      <LessonViewer
        lessonId={selectedLesson}
        onClose={() => setSelectedLesson(null)}
      />
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Complete Learning Modules
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Structured lessons designed to take you from complete beginner to confident computer user
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => {
            const Icon = module.icon
            return (
              <Card 
                key={index} 
                className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-2 bg-card-gradient border-0"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{module.lessons}</span>
                    <span>{module.duration}</span>
                  </div>
                  {user ? (
                    <div className="space-y-2">
                      {userProgress && getModuleProgress(module.title) > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Progress: {getModuleProgress(module.title)}%
                        </div>
                      )}
                      <Button
                        variant={canAccessModule(module.title) ? "default" : "secondary"}
                        size={styles.buttonSize as any}
                        className="w-full flex items-center gap-2"
                        disabled={!canAccessModule(module.title)}
                        onClick={() => {
                          if (canAccessModule(module.title)) {
                            const firstLesson = getFirstAvailableLesson(module.title);
                            if (firstLesson) {
                              setSelectedLesson(firstLesson.id);
                            }
                          }
                        }}
                      >
                        {canAccessModule(module.title) ? (
                          <>
                            <Play className="w-4 h-4" />
                            {getModuleProgress(module.title) > 0 ? 'Continue' : 'Start Module'}
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Weekend Only
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <HeroButton 
                      variant="primary" 
                      size="sm" 
                      className="w-full"
                    >
                      Sign Up to Start
                    </HeroButton>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-16">
          <HeroButton variant="hero" size="lg">
            View All Courses
          </HeroButton>
        </div>
      </div>
    </section>
  )
}

export default Modules