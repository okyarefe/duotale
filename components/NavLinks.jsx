import Link from "next/link";

const links = [
  { href: "/chat", label: "CHAT" },
  { href: "/dialogs", label: "STORIES" },

  { href: "/profile", label: "PROFILE" },
  { href: "/gettokens", label: "GET TOKENS" },
];

const NavLinks = () => {
  return (
    <ul className="menu text-base-content">
      {links.map((link) => {
        const specialClass = link.label === "GET TOKENS" ? "getTokensLink" : "";
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`capitalize transition duration-300 ease-in-out hover:bg-gray-200 hover:text-black ${specialClass}`}
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
