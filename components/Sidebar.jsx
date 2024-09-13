import NavLinks from "../components/NavLinks";
import SidebarHeader from "../components/SidebarHeader";
import { Merienda } from "next/font/google";

const Sidebar = () => {
  return (
    <div className="px-4 w-80 min-h-full py-12 grid grid-rows-[auto-1fr-1auto] ">
      <SidebarHeader></SidebarHeader>
      <NavLinks></NavLinks>
    </div>
  );
};

export default Sidebar;
