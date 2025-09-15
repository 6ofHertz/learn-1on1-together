import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Modules from "@/components/Modules"
import Features from "@/components/Features"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
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
      </main>
      <Footer />
    </div>
  );
};

export default Index;
