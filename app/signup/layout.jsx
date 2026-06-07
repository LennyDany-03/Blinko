import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Create Account",
  description: "Create your Blinko account and launch a smarter link-in-bio page.",
};

export default function SignupLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background grain">
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
