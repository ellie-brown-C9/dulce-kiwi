import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PromiseStrip from "@/components/PromiseStrip";
import Bakes from "@/components/Bakes";
import Story from "@/components/Story";
import HowToOrder from "@/components/HowToOrder";
import Contact from "@/components/Contact";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PromiseStrip />
        <Bakes />
        <Story />
        <HowToOrder />
        <Contact />
      </main>
      <FloatingWhatsApp />
    </>
  );
}
