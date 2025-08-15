import React from "react";
import { Link } from "react-router-dom";

// You can use any icon library like lucide-react, or use these SVG components.
const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const HelpIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

interface HeaderProps {
  navLinks: NavLink[];
  addButton: {
    label: string;
    href: string;
  };
  helpButton: {
    label: string;
    href: string;
  };
  customAdd?: React.ReactNode;
}

export const PageHeader = ({ navLinks, addButton, helpButton, customAdd }: HeaderProps) => {
  return (
    <header className="w-full bg-white" dir="rtl">
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        {/* Right side: Navigation Links */}
        <nav className="flex items-center h-full">
          <ul className="flex items-center gap-x-8 h-full">
            {navLinks.map((link) => (
              <li key={link.label} className="h-full flex items-center">
                <Link
                  to={link.href}
                  className={`text-sm font-semibold transition-colors h-full flex items-center
                    ${
                      link.isActive
                        ? "text-[#3A5779] border-b-2 border-[#3A5779]"
                        : "text-gray-500 hover:text-[#3A5779]"
                    }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Left side: Action Buttons */}
        <div className="flex items-center gap-x-3">
          {customAdd
            ? customAdd
            : addButton && (
                <a
                  href={addButton.href}
                  className="flex items-center justify-center gap-x-2 px-4 py-2 bg-[#3A5779] text-white rounded-md text-sm font-semibold hover:bg-opacity-90 transition-opacity"
                >
                  <PlusIcon />
                  {addButton.label}
                </a>
              )}
          {helpButton && (
            <a
              href={helpButton.href}
              className="flex items-center justify-center gap-x-2 px-4 py-2 bg-[#5b87b925] text-[#3A5779] border border-[#E9EAEC] rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              <HelpIcon />
              {helpButton.label}
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
