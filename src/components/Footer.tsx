import { Monitor, MessageCircle, Mail, MapPin } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Monitor className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Learn1on1</span>
            </div>
            <p className="text-background/80 text-sm">
              Personalized computer lessons for all ages. 
              Building digital confidence one weekend at a time.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Modules</h3>
            <div className="space-y-2 text-sm text-background/80">
              <div>Computer Basics</div>
              <div>Microsoft Word</div>
              <div>Microsoft Excel</div>
              <div>PowerPoint</div>
              <div>Internet & Email</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <div className="space-y-2 text-sm text-background/80">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                WhatsApp Support
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                hello@learn1on1.com
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Nairobi, Kenya
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Schedule</h3>
            <div className="space-y-2 text-sm text-background/80">
              <div>Weekends Only</div>
              <div>Saturday: 9 AM - 6 PM</div>
              <div>Sunday: 10 AM - 5 PM</div>
              <div>Age-appropriate timings</div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 mt-12 pt-8 text-center text-sm text-background/60">
          <p>&copy; 2024 Learn1on1. All rights reserved. Building digital literacy for everyone.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer