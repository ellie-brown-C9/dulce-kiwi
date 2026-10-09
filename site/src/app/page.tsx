import Header from "@/components/Header";
import PromoStrip from "@/components/PromoStrip";
import Hero from "@/components/Hero";
import Special from "@/components/Special";
import Ticker from "@/components/Ticker";
import Bakes from "@/components/Bakes";
import Story from "@/components/Story";
import HowToOrder from "@/components/HowToOrder";
import Contact from "@/components/Contact";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getActivePromo } from "@/components/data";

// Re-check promo dates hourly so specials appear and end without a redeploy
export const revalidate = 3600;

export default function Home() {
  const promo = getActivePromo();

  return (
    <>
      {promo && <PromoStrip promo={promo} />}
      <Header />
      <main>
        <Hero />
        {promo && <Special promo={promo} />}
        <Ticker />
        <Bakes />
        <Story />
        <HowToOrder />
        <Contact />
      </main>
      <FloatingWhatsApp />
    </>
  );
}
