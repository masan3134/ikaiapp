import type { Metadata } from 'next';
import PublicNavbar from '@/components/landing/PublicNavbar';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'İKAI - AI-Powered HR Platform',
  description: 'İşe alım süreçlerinizi yapay zeka ile dönüştürün. CV analizi, mülakat yönetimi ve teklif süreçlerini tek platformda yönetin.',
  keywords: ['HR', 'İnsan Kaynakları', 'CV Analizi', 'İşe Alım', 'AI', 'Yapay Zeka', 'SaaS'],
  authors: [{ name: 'İKAI Team' }],
  openGraph: {
    title: 'İKAI - AI-Powered HR Platform',
    description: 'İşe alım süreçlerinizi yapay zeka ile dönüştürün',
    type: 'website',
    locale: 'tr_TR',
    url: 'https://gaiai.ai/ik',
    siteName: 'İKAI HR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'İKAI - AI-Powered HR Platform',
    description: 'İşe alım süreçlerinizi yapay zeka ile dönüştürün',
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
