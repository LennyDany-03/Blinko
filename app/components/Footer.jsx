const footerLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Security", href: "#" },
  { label: "Status", href: "#" },
  { label: "Contact", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-transparent w-full py-8 text-secondary dark:text-secondary-fixed-dim font-body-md text-body-md relative z-20 mt-12 border-t border-black/5">
      <div className="max-w-[1515px] mx-auto px-container-padding flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="font-display-xl text-headline-md hover:opacity-100 transition-opacity flex items-center gap-2 text-on-surface">
          <svg className="h-6 w-6 text-on-surface animate-pulse" fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2"></circle>
            <path
              d="M11 9h5.5a3.5 3.5 0 0 1 0 7h-5.5h5.5a3.5 3.5 0 0 1 0 7h-5.5V9z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            ></path>
          </svg>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              className="hover:text-primary transition-colors text-on-surface-variant font-medium font-body-md"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
        
        <div className="text-sm text-on-surface-variant font-medium">
          © {new Date().getFullYear()} Blinko Systems. Built for the future of digital presence.
        </div>
      </div>
    </footer>
  );
}
