import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Statement } from "@/components/Statement";
import { Projects } from "@/components/Projects";
import { Feature } from "@/components/Feature";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { StyleQuiz } from "@/components/StyleQuiz";
import { Founder } from "@/components/Founder";
import { Instagram } from "@/components/Instagram";
import { Portfolio } from "@/components/Portfolio";
import { Faq } from "@/components/Faq";
import { Testimonials } from "@/components/Testimonials";
import { BookConsultation } from "@/components/BookConsultation";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { testimonials } from "@/lib/site";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Transformations } from "@/components/Transformations";
import { CostEstimator } from "@/components/CostEstimator";
import { JournalTeaser } from "@/components/JournalTeaser";
import { VideoIntro, introScript } from "@/components/VideoIntro";

export default function Home() {
  return (
    <>
      {/* Runs before first paint so the intro never flashes for returning visitors. */}
      <script dangerouslySetInnerHTML={{ __html: introScript }} />
      <VideoIntro />
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <Statement />
        <Projects />
        <Transformations />
        <Portfolio />
        <Feature />
        <Services />
        <StyleQuiz />
        <Process />
        <CostEstimator />
        <Founder />
        <Instagram />
        <JournalTeaser />
        <Testimonials items={testimonials} />
        <Faq />
        <BookConsultation />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
