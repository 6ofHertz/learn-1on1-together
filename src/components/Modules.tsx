import { useState } from "react"
import { HeroButton } from "@/components/ui/hero-button"
import LessonViewer from "./LessonViewer"
import { ModulesGrid } from "./modules/ModulesGrid"
import { LessonSearch } from "./search/LessonSearch"
import { ErrorBoundary } from "./ui/error-boundary"
import { motion } from "framer-motion"

const Modules = () => {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  if (selectedLesson) {
    return (
      <ErrorBoundary>
        <LessonViewer
          lessonId={selectedLesson}
          onClose={() => setSelectedLesson(null)}
        />
      </ErrorBoundary>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Complete Learning Modules
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Structured lessons designed to take you from complete beginner to confident computer user
          </p>
        </motion.div>

        <div className="mb-12">
          <LessonSearch 
            onSearch={setSearchQuery}
            placeholder="Search modules and lessons..."
          />
        </div>

        <ErrorBoundary>
          <ModulesGrid onLessonSelect={setSelectedLesson} />
        </ErrorBoundary>

        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <HeroButton variant="hero" size="lg">
            View All Courses
          </HeroButton>
        </motion.div>
      </div>
    </section>
  )
}

export default Modules