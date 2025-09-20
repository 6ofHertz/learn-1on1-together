import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroButton } from "@/components/ui/hero-button"
import { Button } from "@/components/ui/button"
import { Play, Lock, CheckCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useAgeAdaptiveStyles } from "@/hooks/useAgeAdaptiveStyles"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

interface ModuleCardProps {
  module: {
    icon: React.ComponentType<{ className?: string }>
    title: string
    description: string
    lessons: string
    duration: string
  }
  index: number
  progress: number
  canAccess: boolean
  onStart: () => void
}

export const ModuleCard = ({ module, index, progress, canAccess, onStart }: ModuleCardProps) => {
  const { user } = useAuth()
  const styles = useAgeAdaptiveStyles()
  const Icon = module.icon
  
  const isCompleted = progress === 100
  const hasStarted = progress > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Card className="h-full hover:shadow-hover transition-all duration-300 bg-card-gradient border-0 overflow-hidden">
        <CardHeader className="text-center pb-4 relative">
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4"
            >
              <CheckCircle className="h-6 w-6 text-green-500" />
            </motion.div>
          )}
          
          <motion.div 
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="h-8 w-8 text-primary" />
          </motion.div>
          
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

          {user && hasStarted && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {user ? (
            <Button
              variant={canAccess ? "default" : "secondary"}
              size={styles.buttonSize as any}
              className="w-full flex items-center gap-2"
              disabled={!canAccess}
              onClick={onStart}
            >
              {canAccess ? (
                <>
                  <Play className="w-4 h-4" />
                  {isCompleted ? 'Review' : hasStarted ? 'Continue' : 'Start Module'}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Weekend Only
                </>
              )}
            </Button>
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
    </motion.div>
  )
}