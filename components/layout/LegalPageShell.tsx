import type { ReactNode } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/components/layout/Footer";

type LegalPageShellProps = {
  children: ReactNode;
  contentClassName?: string;
};

export default function LegalPageShell({
  children,
  contentClassName = "max-w-3xl",
}: LegalPageShellProps) {
  return (
    <div className="relative min-h-screen bg-background text-on-background font-body-md antialiased grain selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />
      <main
        className={`mx-auto w-full px-container-padding py-16 md:py-24 ${contentClassName}`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
