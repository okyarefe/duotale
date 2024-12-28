"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Coins,
  Home,
  Settings,
  Trophy,
  Brain,
  History,
  Heart,
} from "lucide-react";

const links = [
  { href: "/chat", label: "Chat", icon: Brain },
  { href: "/dialogs", label: "Stories", icon: Trophy },

  { href: "/profile", label: "Profile", icon: Home },
];

const NavLinks = () => {
  const pathname = usePathname();

  return (
    <ul className="flex-1 flex flex-col gap-8">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const specialClass = link.label === "GET TOKENS" ? "getTokensLink" : "";

        return (
          <li
            key={link.href}
            className={`group flex flex-col items-center gap-2 transition-all hover:scale-110 ${
              isActive ? "active-link-class" : ""
            }`}
          >
            <Link
              href={link.href}
              className={`capitalize transition duration-300 p-4 ease-in-out hover:text-white text-center ${specialClass} ${
                isActive ? "text-white font-bold" : ""
              }`}
            >
              <div
                className={`p-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-white text-indigo-600"
                    : "bg-indigo-500/30 group-hover:bg-white group-hover:text-indigo-600"
                }`}
              >
                <link.icon size={24} />
              </div>
              <span
                className={`text-xs opacity-80 group-hover:opacity-100 ${
                  isActive ? "opacity-100" : ""
                }`}
              >
                {link.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavLinks;
