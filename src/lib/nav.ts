/** Primary navigation for the public site. */
export const navLinks = [
  { href: "/venue", label: "The Venue" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
] as const;

export type NavLink = (typeof navLinks)[number];
