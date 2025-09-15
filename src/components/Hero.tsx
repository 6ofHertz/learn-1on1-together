import { HeroButton } from "@/components/ui/hero-button"
import { MessageCircle, Calendar, Users, Award } from "lucide-react"
import heroImage from "@/assets/hero-learning.jpg"

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Calendar className="mr-2 h-4 w-4" />
                Weekend Lessons Only
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-6xl">
                Learn Computers{" "}
                <span className="bg-hero-gradient bg-clip-text text-transparent">
                  1-on-1
                </span>
              </h1>
              <p className="text-xl text-muted-foreground lg:text-2xl">
                From Beginner to Confident in Weeks
              </p>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Personalized computer lessons for all ages. Learn at your own pace with 
              dedicated weekend sessions designed just for you.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <HeroButton 
                variant="hero" 
                size="xl"
                className="group"
              >
                <MessageCircle className="group-hover:rotate-12 transition-transform" />
                Start Learning Today
              </HeroButton>
              <HeroButton 
                variant="heroOutline" 
                size="xl"
              >
                View Courses
              </HeroButton>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">All Ages Welcome</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">Certificates Included</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-hover">
              <img 
                src={heroImage} 
                alt="People of all ages learning computers together"
                className="h-[500px] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero