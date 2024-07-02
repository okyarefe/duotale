import Link from "next/link";

const links = [
  { href: "/chat", label: "CHAT" },
  { href: "/dialogs", label: "DIALOGS" },

  { href: "/profile", label: "PROFILE" },
];

const NavLinks = () => {
  return (
    <ul className="menu text-base-content">
      {links.map((link) => {
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className="capitalize story transition duration-300 ease-in-out hover:bg-gray-200 hover:text-black"
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
export default NavLinks;
