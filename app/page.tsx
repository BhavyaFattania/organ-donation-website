import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import LearningPathway from "@/components/learning-pathway";
import DashboardSection from "@/components/dashboard-section";
import ExpertInsights from "@/components/expert-insights";
import FaqSection from "@/components/faq-section";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <LearningPathway />
        <DashboardSection />
        <ExpertInsights />
        <FaqSection />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}