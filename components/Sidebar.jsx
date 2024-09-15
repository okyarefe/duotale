import { Sign } from "crypto";
import NavLinks from "../components/NavLinks";
import SidebarHeader from "../components/SidebarHeader";
import SignOutButton from "../components/SignOutButton";

const Sidebar = () => {
  return (
    <div className="px-4 w-80 min-h-full py-12 grid grid-rows-[auto-1fr-1auto] bg-slate-800 ">
      <SidebarHeader></SidebarHeader>
      <NavLinks></NavLinks>
      <SignOutButton></SignOutButton>
    </div>
  );
};

export default Sidebar;
