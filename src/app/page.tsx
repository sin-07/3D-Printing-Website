import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import InteractiveStudio from '@/components/home/InteractiveStudio';
import CollectionGrid from '@/components/home/CollectionGrid';
import FeaturedMasterpieces from '@/components/home/FeaturedMasterpieces';
import LimitedDropVault from '@/components/home/LimitedDropVault';
import TechnologySection from '@/components/home/TechnologySection';
import CollectorTestimonials from '@/components/home/CollectorTestimonials';
import VipNewsletter from '@/components/home/VipNewsletter';

// AETHERIS 3D ATELIER Homepage
export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. Cinematic Hero Section */}
      <HeroSection />

      {/* 2. Curated Universes & Categories */}
      <CollectionGrid />

      {/* 3. Featured Masterpieces with 3D Preview */}
      <FeaturedMasterpieces />

      {/* 4. Real-time 3D Resin Material & Studio Lighting Lab */}
      <InteractiveStudio />

      {/* 5. Limited Drop Vault with Live Countdown */}
      <LimitedDropVault />

      {/* 6. 16K SLA Engineering & Print Simulator */}
      <TechnologySection />

      {/* 7. Collector Dispatches & Testimonials */}
      <CollectorTestimonials />

      {/* 8. VIP Registry Newsletter */}
      <VipNewsletter />
    </div>
  );
}
