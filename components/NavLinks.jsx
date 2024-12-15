import Link from "next/link";

const links = [
  { href: "/chat", label: "CHAT" },
  { href: "/dialogs", label: "STORIES" },

  { href: "/profile", label: "PROFILE" },
];

const NavLinks = () => {
  return (
    <ul className="menu text-base-content">
      {links.map((link) => {
        const specialClass = link.label === "GET TOKENS" ? "getTokensLink" : "";
        return (
          <li key={link.href} className="navlinks">
            <Link
              href={link.href}
              className={`capitalize transition duration-300 p-4 ease-in-out hover:text-white ${specialClass}`}
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
