import DashboardNavbar from "../components/dashboard/DashboardNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-on-background relative grain flex flex-col">
      <DashboardNavbar />
      <main className="flex-1 px-4 pt-28 pb-12 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
