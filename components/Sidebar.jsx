import NavLinks from "../components/NavLinks";
import SidebarHeader from "../components/SidebarHeader";
import SignOutButton from "../components/SignOutButton";
import {
  Book,
  Flame,
  Home,
  Settings,
  Trophy,
  Gem,
  GraduationCap,
  BookOpen,
} from "lucide-react";

const Sidebar = () => {
  return (
    <div className="h-screen w-32 bg-gradient-to-b from-indigo-600 to-indigo-800 fixed flex flex-col items-center py-8 text-white">
      <div className="mb-12 bg-white p-3 rounded-2xl shadow-lg">
        <BookOpen size={32} className="text-indigo-600" />
      </div>
      <SidebarHeader></SidebarHeader>
      <NavLinks></NavLinks>
      <SignOutButton></SignOutButton>
    </div>
  );
};

export default Sidebar;
