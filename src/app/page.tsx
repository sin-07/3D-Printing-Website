import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ProcessStepsSection from '@/components/home/ProcessStepsSection';
import HardwareChamberSection from '@/components/home/HardwareChamberSection';
import PrecisionMetrologySection from '@/components/home/PrecisionMetrologySection';
import PrinterVideoSection from '@/components/home/PrinterVideoSection';
import LiveSlicerSection from '@/components/home/LiveSlicerSection';
import InteractiveStudio from '@/components/home/InteractiveStudio';
import FeaturedMasterpieces from '@/components/home/FeaturedMasterpieces';
import InsideTheBoxSection from '@/components/home/InsideTheBoxSection';
import CollectionGrid from '@/components/home/CollectionGrid';
import LaunchReservationPill from '@/components/home/LaunchReservationPill';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-hidden bg-black text-white">
      {/* 1. ⬛ DARK: Industrial 3D Printing Hero & Workshop */}
      <HeroSection />

      {/* 2. ⬜ WHITE: Additive Workflow (Slices, Prints, Verifies) */}
      <ProcessStepsSection />

      {/* 3. ⬛ DARK: Hardware Architecture (300°C Hotend, PEI Bed, Filtration) */}
      <HardwareChamberSection />

      {/* 4. ⬜ WHITE: 0.01mm Precision Metrology & Caliper Tolerances */}
      <PrecisionMetrologySection />

      {/* 5. ⬛ DARK: 3D Printer in Action Cinematic Video with Live Telemetry HUD */}
      <PrinterVideoSection />

      {/* 6. ⬜ WHITE: Interactive Live Slicer & Print Quoting Engine */}
      <LiveSlicerSection />

      {/* 7. ⬛ DARK: Real-Time 3D Mechanical Assembly & G-Code Toolpath Turntable */}
      <InteractiveStudio />

      {/* 8. ⬜ WHITE: Precision 3D Printed Engineering Components Catalog */}
      <FeaturedMasterpieces />

      {/* 9. ⬛ DARK: Package Contents & Hardware Ecosystem (Inside the Box) */}
      <InsideTheBoxSection />

      {/* 10. ⬜ WHITE: Engineering Domains & Applications Grid */}
      <CollectionGrid />

      {/* 11. ⬛ DARK: Production Batch Capacity Reservation Pill Card */}
      <LaunchReservationPill />

      {/* 12. ⬛ DARK: Minimalist Engineering Footer (Rendered in Layout) */}
    </div>
  );
}
