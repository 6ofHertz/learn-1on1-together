import { HeroButton } from "@/components/ui/hero-button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Monitor, Menu, User, LogOut } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAgeAdaptiveStyles } from "@/hooks/useAgeAdaptiveStyles"
import { motion } from "framer-motion"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const styles = useAgeAdaptiveStyles()

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-hero-gradient">
              <Monitor className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TechWise Learning
            </span>
          </motion.div>

          <nav className="hidden md:flex items-center gap-8">
            <motion.a 
              href="#modules" 
              className="text-sm font-medium hover:text-primary transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Modules
            </motion.a>
            <motion.a 
              href="#features" 
              className="text-sm font-medium hover:text-primary transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Features
            </motion.a>
            <motion.a 
              href="#contact" 
              className="text-sm font-medium hover:text-primary transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Contact
            </motion.a>
            
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center gap-2">
                <span className={`${styles.fontSize} font-medium`}>
                  Hi, {profile?.first_name || 'Student'}!
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <HeroButton 
                variant="primary" 
                size={styles.buttonSize as any}
                onClick={() => navigate('/auth')}
              >
                Get Started
              </HeroButton>
            )}
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
            {user ? (
              <div className="space-y-2">
                <div className={`${styles.fontSize} font-medium text-center`}>
                  Hi, {profile?.first_name || 'Student'}!
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-1 justify-center"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <HeroButton 
                variant="primary" 
                size={styles.buttonSize as any} 
                className="w-full"
                onClick={() => navigate('/auth')}
              >
                Get Started
              </HeroButton>
            )}
          </div>
        )}
      </div>
    </motion.header>
  )
}

export default Header