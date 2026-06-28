/** Curated, editable content for the public site. Replace copy/images freely. */

export type Tone = "aegean" | "marble" | "olive" | "gold";

export const eventTypes = [
  {
    slug: "weddings",
    title: "Weddings",
    description:
      "Ceremonies and receptions held with quiet grandeur — from first vows to the last dance under the stars.",
    tone: "aegean" as Tone,
  },
  {
    slug: "private-dinners",
    title: "Private Dinners",
    description:
      "Intimate seatings for considered menus and close company, served at a single unhurried table.",
    tone: "olive" as Tone,
  },
  {
    slug: "celebrations",
    title: "Celebrations",
    description:
      "Anniversaries, milestones, and gatherings worth marking — arranged down to the smallest detail.",
    tone: "gold" as Tone,
  },
  {
    slug: "corporate",
    title: "Corporate & Cultural",
    description:
      "Refined settings for retreats, launches, and receptions, where work feels a little more like occasion.",
    tone: "marble" as Tone,
  },
];

export const venueFeatures = [
  {
    title: "Up to 120 guests",
    detail: "A hall and terrace that scale from intimate to grand.",
  },
  {
    title: "Indoor hall & olive terrace",
    detail: "Marble interiors opening onto a shaded outdoor seating.",
  },
  {
    title: "In-house kitchen",
    detail: "Seasonal menus and a considered cellar, prepared on site.",
  },
  {
    title: "A dedicated host",
    detail: "One point of contact, attending to every detail of the day.",
  },
];

export const galleryItems = [
  { caption: "The terrace at dusk", tone: "aegean" as Tone },
  { caption: "A single long table", tone: "marble" as Tone },
  { caption: "The olive courtyard", tone: "olive" as Tone },
  { caption: "Marble hall, set for dinner", tone: "marble" as Tone },
  { caption: "Golden-hour ceremony", tone: "gold" as Tone },
  { caption: "Evening reception", tone: "aegean" as Tone },
];
