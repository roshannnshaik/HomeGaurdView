import { Home, History, Settings, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: History, label: "History", path: "/history" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-30">
      <div className="grid grid-cols-4 py-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <button className={`flex flex-col items-center py-2 px-4 ${
                isActive ? "text-nav-teal" : "text-gray-400"
              }`}>
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
