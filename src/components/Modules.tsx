import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroButton } from "@/components/ui/hero-button"
import { Monitor, FileText, BarChart3, Presentation, Globe, Mail } from "lucide-react"

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
                  <HeroButton 
                    variant="primary" 
                    size="sm" 
                    className="w-full"
                  >
                    Start Module
                  </HeroButton>
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