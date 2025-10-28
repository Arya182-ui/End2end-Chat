import { ReactNode } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { BackToTop } from './BackToTop';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export const Layout = ({ children, showFooter = true }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
      <BackToTop />
    </div>
  );
};
