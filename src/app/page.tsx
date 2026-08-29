import { HeroSection } from "@/components/home/hero-section";
import { BestSellers } from "@/components/home/best-sellers";
import { ValueProps } from "@/components/home/value-props";
import { Testimonials } from "@/components/home/testimonials";
import { PromoBanner } from "@/components/home/promo-banner";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full">
      <HeroSection />
      <BestSellers />
      <ValueProps />
      <Testimonials />
      <PromoBanner />
    </main>
  );
}
