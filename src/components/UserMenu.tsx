import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User, Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const UserMenu = () => {
  const { user:data, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isAuthenticated || !data) {
    return (
      <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <User size={20} className="text-gray-500" />
        </div>
        <span>تسجيل الدخول</span>
      </Link>
    );
  }
  const { user } = data || {};
  // Format the last login date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        {user.avatar ? (
          <img src={user.avatar} alt={user.fullname} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
            {user.fullname[0]?.toUpperCase() || <User size={20} />}
          </div>
        )}
        <span>{user.fullname}</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-72 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
            {user.avatar && (
              <img src={user.avatar} alt={user.fullname} className="w-16 h-16 rounded-full object-cover mx-auto mb-3" />
            )}
            <div className="font-medium text-lg mb-1">{user.fullname}</div>
            <div className="text-gray-500 mb-1">{user.email}</div>
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Phone size={14} />
              <span dir="ltr">{user.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                {user.gender === "female" ? "أنثى" : "ذكر"}
              </span>
            </div>
            {user.last_login_at && (
              <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
                <Calendar size={14} />
                <span>آخر تسجيل دخول: {formatDate(user.last_login_at)}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
          >
            <LogOut size={16} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
