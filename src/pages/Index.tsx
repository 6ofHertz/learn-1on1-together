import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Modules from "@/components/Modules"
import Features from "@/components/Features"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"
import WeekendScheduleBanner from "@/components/WeekendScheduleBanner"
import UserProgress from "@/components/UserProgress"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  // Check parental consent for minors
  useEffect(() => {
    if (user && profile && profile.age && profile.age < 18 && !profile.parental_consent) {
      // Redirect to complete parental consent if needed
      // For MVP, we'll just show a warning
    }
  }, [user, profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading TechWise Learning...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Header />
      <main>
        {user ? (
          <motion.div 
            className="container mx-auto px-4 py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <WeekendScheduleBanner />
            <UserProgress />
            <section id="modules" className="mt-8">
              <Modules />
            </section>
          </motion.div>
        ) : (
          <>
            <Hero />
            <section id="modules">
              <Modules />
            </section>
            <section id="features">
              <Features />
            </section>
            <section id="contact">
              <Contact />
            </section>
          </>
        )}
      </main>
      <Footer />
    </motion.div>
  );
};

export default Index;
