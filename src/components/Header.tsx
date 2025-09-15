import { HeroButton } from "@/components/ui/hero-button"
import { Monitor, Menu } from "lucide-react"
import { useState } from "react"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-hero-gradient">
              <Monitor className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Learn1on1</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#modules" className="text-sm font-medium hover:text-primary transition-colors">
              Modules
            </a>
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </a>
            <HeroButton variant="primary" size="sm">
              Get Started
            </HeroButton>
          </nav>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <a href="#modules" className="block text-sm font-medium hover:text-primary transition-colors">
              Modules
            </a>
            <a href="#features" className="block text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            <a href="#contact" className="block text-sm font-medium hover:text-primary transition-colors">
              Contact
            </a>
            <HeroButton variant="primary" size="sm" className="w-full">
              Get Started
            </HeroButton>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header