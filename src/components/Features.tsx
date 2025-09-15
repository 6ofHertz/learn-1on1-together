import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Clock, Award, BarChart, Heart, Shield } from "lucide-react"

const features = [
  {
    icon: User,
    title: "1-on-1 Personalized Learning",
    description: "Every lesson is tailored to your age, skill level, and learning pace for maximum effectiveness."
  },
  {
    icon: Clock,
    title: "Weekend-Only Schedule",
    description: "Learn at your convenience with flexible weekend sessions that fit your busy lifestyle."
  },
  {
    icon: Award,
    title: "Completion Certificates",
    description: "Earn recognized certificates for each module to showcase your new digital skills."
  },
  {
    icon: BarChart,
    title: "Progress Tracking",
    description: "Watch your skills grow with detailed progress reports and achievement milestones."
  },
  {
    icon: Heart,
    title: "Age-Appropriate Content",
    description: "Content automatically adapts for children, teens, adults, and seniors for optimal learning."
  },
  {
    icon: Shield,
    title: "Safe Learning Environment",
    description: "Secure platform with parental controls and data protection for learners of all ages."
  }
]

const Features = () => {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We make learning computers simple, personal, and effective for everyone
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card 
                key={index} 
                className="group hover:shadow-soft transition-all duration-300 border-0 bg-background/60 backdrop-blur-sm"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <Icon className="h-7 w-7 text-accent" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features