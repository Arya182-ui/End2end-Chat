import { ReactNode, isValidElement } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { BackToTop } from './BackToTop';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export const Layout = ({ children, showFooter = true }: LayoutProps) => {
  // Only show <Header /> if children does NOT include ChatInterface (i.e., in setup mode)
  // We check for a prop on children to determine if it's ChatInterface
  const isChatInterface = Array.isArray(children)
    ? children.some(
        (child) =>
          isValidElement(child) && child.type && (child.type as any).name === 'ChatInterface'
      )
    : isValidElement(children) && children.type && (children.type as any).name === 'ChatInterface';

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#0f1021] to-black text-gray-100">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        {!isChatInterface && <Header />}
        <main className={!isChatInterface ? 'flex-1 pt-20' : 'flex-1'}>
          {children}
        </main>
        {showFooter && <Footer />}
        <BackToTop />
      </div>
    </div>
  );
};
