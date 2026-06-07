import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Login",
  description: "Sign in to manage your Blinko link-in-bio page.",
};

export default function LoginLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background grain">
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
