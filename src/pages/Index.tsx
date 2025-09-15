import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Modules from "@/components/Modules"
import Features from "@/components/Features"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"
import WeekendScheduleBanner from "@/components/WeekendScheduleBanner"
import UserProgress from "@/components/UserProgress"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {user ? (
          <div className="container mx-auto px-4 py-8">
            <WeekendScheduleBanner />
            <UserProgress />
            <section id="modules" className="mt-8">
              <Modules />
            </section>
          </div>
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
    </div>
  );
};

export default Index;
