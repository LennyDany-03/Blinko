import DashboardSidebar from "../components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-on-background relative grain flex flex-col md:flex-row">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 md:pl-20 pt-20 md:pt-8 transition-all duration-300">
        <main className="flex-1 px-4 pb-12 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
