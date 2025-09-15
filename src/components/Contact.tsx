import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeroButton } from "@/components/ui/hero-button"
import { MessageCircle, CreditCard, Clock, MapPin } from "lucide-react"

const Contact = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get in touch today and begin your journey to digital confidence
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <Card className="border-0 bg-card-gradient shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6 text-primary" />
                  Contact Us on WhatsApp
                </CardTitle>
                <CardDescription className="text-base">
                  Send us a message to schedule your first lesson or ask any questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HeroButton 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  onClick={() => window.open('https://wa.me/254700000000', '_blank')}
                >
                  <MessageCircle />
                  Start WhatsApp Chat
                </HeroButton>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card-gradient shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-accent" />
                  Simple Payment Options
                </CardTitle>
                <CardDescription className="text-base">
                  Easy Paybill payments with clear pricing for all modules
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold text-primary">
                  Starting at KSH 2,500 per module
                </div>
                <p className="text-sm text-muted-foreground">
                  Paybill: 123456 | Account: Your Phone Number
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">What to Expect:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Weekend Sessions</h4>
                    <p className="text-muted-foreground">Saturdays and Sundays, 2-3 hours per session</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Online & In-Person</h4>
                    <p className="text-muted-foreground">Choose the learning format that works best for you</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">Age Requirements:</h4>
              <p className="text-sm text-muted-foreground">
                All ages welcome! Parental consent required for learners under 18. 
                Our content automatically adapts to each age group for the best learning experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact