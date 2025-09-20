import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useWeekendScheduling } from "@/hooks/useWeekendScheduling"
import { supabase } from "@/integrations/supabase/client"
import { ModuleCard } from "./ModuleCard"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Skeleton } from "@/components/ui/loading-skeleton"
import { useToast } from "@/hooks/use-toast"
import { Monitor, FileText, BarChart3, Presentation, Globe, Mail } from "lucide-react"
import { motion } from "framer-motion"

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

interface ModulesGridProps {
  onLessonSelect: (lessonId: string) => void
}

export const ModulesGrid = ({ onLessonSelect }: ModulesGridProps) => {
  const { user } = useAuth()
  const { isWeekend } = useWeekendScheduling()
  const { toast } = useToast()
  const [moduleLessons, setModuleLessons] = useState<Record<string, any[]>>({})
  const [userProgress, setUserProgress] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchLessonsAndProgress()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchLessonsAndProgress = async () => {
    try {
      setLoading(true)
      
      // Fetch all lessons grouped by module
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .order('order_in_module')

      if (lessonsError) throw lessonsError

      if (lessons) {
        const grouped = lessons.reduce((acc, lesson) => {
          if (!acc[lesson.module_name]) {
            acc[lesson.module_name] = []
          }
          acc[lesson.module_name].push(lesson)
          return acc
        }, {} as Record<string, any[]>)
        setModuleLessons(grouped)
      }

      // Fetch user progress
      if (user) {
        const { data: progress, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)

        if (progressError) throw progressError

        if (progress) {
          const progressMap = progress.reduce((acc, p) => {
            acc[p.lesson_id] = p
            return acc
          }, {} as Record<string, any>)
          setUserProgress(progressMap)
        }
      }
    } catch (error) {
      console.error('Error fetching lessons:', error)
      toast({
        title: "Error",
        description: "Failed to load modules. Please refresh the page.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getModuleProgress = (moduleName: string) => {
    const lessons = moduleLessons[moduleName] || []
    if (lessons.length === 0) return 0
    
    const completed = lessons.filter(lesson => 
      userProgress[lesson.id]?.status === 'completed'
    ).length
    
    return Math.round((completed / lessons.length) * 100)
  }

  const getFirstAvailableLesson = (moduleName: string) => {
    const lessons = moduleLessons[moduleName] || []
    return lessons.find(lesson => {
      const progress = userProgress[lesson.id]
      return !progress || progress.status !== 'completed'
    })
  }

  const canAccessModule = (moduleName: string) => {
    if (!user) return false
    const lessons = moduleLessons[moduleName] || []
    const hasWeekendOnlyLessons = lessons.some(lesson => lesson.weekend_only)
    return !hasWeekendOnlyLessons || isWeekend
  }

  const handleModuleStart = (moduleName: string) => {
    if (canAccessModule(moduleName)) {
      const firstLesson = getFirstAvailableLesson(moduleName)
      if (firstLesson) {
        onLessonSelect(firstLesson.id)
      }
    }
  }

  if (loading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div 
      className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {modules.map((module, index) => (
        <ModuleCard
          key={module.title}
          module={module}
          index={index}
          progress={getModuleProgress(module.title)}
          canAccess={canAccessModule(module.title)}
          onStart={() => handleModuleStart(module.title)}
        />
      ))}
    </motion.div>
  )
}