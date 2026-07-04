import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Fragrances - ScentMatch',
  description: 'Explore the ScentMatch fragrance catalog with filters for scent family, occasion, weather, price, projection, and notes to avoid.',
};

export default function FragrancesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
