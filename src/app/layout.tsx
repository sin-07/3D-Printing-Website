import type { Metadata } from 'next';
import './globals.css';
import ProvidersShell from '@/components/ui/ProvidersShell';

export const metadata: Metadata = {
  title: 'AETHERIS ATELIER | Luxury 3D-Printed Collectibles & Statues',
  description: 'Masterwork 3D printed resin statues and collectibles. 16K SLA photopolymer precision, 0.015mm layer slicing, cold-cast bronze, and 24K Florentine gold leaf finishes.',
  keywords: '3D printed statues, 16K resin collectibles, luxury sculptures, cyberpunk statues, mythic collectibles, bespoke 3D print atelier',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-obsidian-950 text-foreground min-h-screen antialiased selection:bg-gold-500 selection:text-obsidian-950">
        <ProvidersShell>{children}</ProvidersShell>
      </body>
    </html>
  );
}
