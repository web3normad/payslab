import Hero from "../components/ui/sections/Hero";
import CTA from "../components/ui/sections/CTA";
import HowItWorks from "../components/ui/sections/HowItWorks";
import Testimonials from "../components/ui/sections/Testimonials";
import Solution from "../components/ui/sections/Solution";
import Features from "../components/ui/sections/Features";
export default function Home() {
  return (
   <>
      <Hero />
      <HowItWorks />
      <Solution/>
      <Features/>
      <Testimonials />
      <CTA />
   </>
  );
}
