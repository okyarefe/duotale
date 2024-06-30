import MemberProfile from "../components/MemberProfile";
import NavLinks from "../components/NavLinks";
import SidebarHeader from "../components/SidebarHeader";

const Sidebar = () => {
  return (
    <div className="px-4 w-80 min-h-full bg-blue-100 py-12 grid grid-rows-[auto-1fr-1auto]">
      <SidebarHeader></SidebarHeader>
      <NavLinks></NavLinks>
      <MemberProfile></MemberProfile>
    </div>
  );
};

export default Sidebar;
