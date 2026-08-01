/** Curated, editable Albanian content for the public site. */

export type Tone = "aegean" | "marble" | "olive" | "gold";

export const brandName = "Apollonia Events";

export const publicMetadata = {
  root: {
    title: "Evente private — Apollonia Events",
    description:
      "Një vend i qetë për dasma, darka private dhe festime në Gjilan. Rezervoni datën tuaj te Apollonia Events.",
  },
} as const;

export type UpcomingFreeDate = {
  iso: string;
  label: string;
};

export const WHATSAPP_PHONE_NUMBER = "38344376237";

const whatsappGreeting =
  "Përshëndetje Apollonia, dëshiroj të pyes për një datë eventi.";

export const contactCopy = {
  whatsappLabel: "Shkruani në WhatsApp",
  whatsappHref: `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
    whatsappGreeting,
  )}`,
} as const;

export const availabilityCopy = {
  overline: "Disponueshmëria",
  homePrefix: "Të shtunat më të afërta të lira",
  reservePrompt: "Zgjidhni një të shtunë të lirë",
  unavailable: "Datat më të afërta do t'i konfirmojmë personalisht me ju.",
} as const;

export const navLinks = [
  { href: "/venue", label: "Vendi" },
  { href: "/events", label: "Eventet" },
  { href: "/gallery", label: "Galeria" },
] as const;

export type NavLink = (typeof navLinks)[number];

export const navCopy = {
  homeAriaLabel: "Apollonia Events — faqja kryesore",
  desktopNavigationLabel: "Navigimi kryesor",
  mobileNavigationLabel: "Navigimi në telefon",
  openMenu: "Hap menunë",
  closeMenu: "Mbyll menunë",
  reserve: "Rezervo",
  reserveDate: "Rezervoni një datë",
} as const;

export const eventTypes = [
  {
    slug: "weddings",
    title: "Dasma",
    description:
      "Ceremoni dhe pritje me madhështi të qetë, nga fjala e parë deri te vallëzimi i fundit.",
    tone: "aegean" as Tone,
  },
  {
    slug: "private-dinners",
    title: "Darka private",
    description:
      "Tryeza të afërta, menu të menduara dhe shoqëri e zgjedhur, pa nxitim.",
    tone: "olive" as Tone,
  },
  {
    slug: "celebrations",
    title: "Festime",
    description:
      "Përvjetorë, ditë të shënuara dhe mbledhje që meritojnë kujdes në çdo hollësi.",
    tone: "gold" as Tone,
  },
  {
    slug: "corporate",
    title: "Evente korporative & kulturore",
    description:
      "Mjedis i përmbajtur për takime, prezantime dhe pritje ku puna merr ritëm ngjarjeje.",
    tone: "marble" as Tone,
  },
];

export const eventCardCopy = {
  cta: "Rezervoni këtë rast",
} as const;

export const venueFeatures = [
  {
    title: "Deri në 60 të ftuar",
    detail:
      "Rreth 30–35 të ulur në tryeza; deri në 60 në pritje në këmbë.",
  },
  {
    title: "Një sallë e vetme, e gjerë",
    detail: "Rreth 60 m² që rikompozohen nga ceremonia te darka dhe vallëzimi.",
  },
  {
    title: "Kateringu, zgjedhja juaj",
    detail:
      "Ju sillni kateringun dhe pijet që doni — salla dhe ekipi përshtaten.",
  },
  {
    title: "Zërim & përkujdesje",
    detail:
      "Sistem zërimi për DJ dhe muzikën tuaj; një person përgjegjës ndjek orarin dhe rezervimin tuaj.",
  },
];

export const galleryItems = [
  { caption: "Salla në muzg", tone: "aegean" as Tone },
  { caption: "Banaku i mermertë, bardh e zi", tone: "marble" as Tone },
  { caption: "Drita pranë dritareve", tone: "olive" as Tone },
  { caption: "Një tryezë e gjatë, gati për darkë", tone: "marble" as Tone },
  { caption: "Tavani — vepër arti", tone: "gold" as Tone },
  { caption: "Pritje në mbrëmje", tone: "aegean" as Tone },
];

export const homeCopy = {
  metadata: {
    title: "Evente private — Apollonia Events",
    description:
      "Një vend i qetë, i punuar me kujdes, për dasma, darka private dhe festime në Gjilan.",
  },
  hero: {
    overline: "Evente private · Gjilan",
    titleLead: "Ku çdo mbledhje bëhet",
    titleAccent: "ngjarje",
    description:
      "Një vend i qetë, i punuar me kujdes, për dasma, darka private dhe festime. Çdo hollësi pritet me dorë.",
    primaryCta: "Rezervoni një datë",
    secondaryCta: "Zbuloni vendin",
    venueAriaLabel: "Vendi i Apollonia Events",
  },
  venueIntro: {
    overline: "Vendi",
    title: "Një shtëpi e ngritur për mbledhje",
    description:
      "Një sallë e vetme që merr formë me orët — drita lëviz nga dritaret te muzgu i artë, nën një tavan të punuar si vepër arti. Asgjë nuk nxitohet; çdo orë e ditës gjen formën e vet.",
  },
  day: {
    overline: "Dita",
    title: "Dita në Apollonia",
    description:
      "Një kalendar privat e lejon vendin të ndjekë ngjarjen nga përgatitja e qetë deri te kënga e fundit.",
    timeline: [
      {
        time: "10:00",
        title: "Përgatitjet",
        detail: "Salla pastrohet e rregullohet: tryezat, banaku dhe dekori që sillni ju.",
        tone: "text-ink",
        muted: "text-timeline-muted",
      },
      {
        time: "17:00",
        title: "Ardhja e mysafirëve",
        detail: "Salla i mbledh të ftuarit ndërsa drita zbutet nga dritaret.",
        tone: "text-ink",
        muted: "text-timeline-muted",
      },
      {
        time: "20:00",
        title: "Darka & muzika",
        detail: "Zërimi ynë dhe kateringu juaj; pjatat dhe bisedat ecin ngadalë.",
        tone: "text-ink lg:text-ivory",
        muted: "text-timeline-muted lg:text-ivory/90",
      },
      {
        time: "23:00",
        title: "Toni zbutet",
        detail: "Muzika ulet me respekt për fqinjët; nata mbyllet ngadalë deri pas mesnate.",
        tone: "text-ink lg:text-ivory",
        muted: "text-timeline-muted lg:text-ivory/90",
      },
    ],
  },
  occasions: {
    overline: "Rastet",
    title: "Çdo lloj mbledhjeje",
    description:
      "Nga betimet te ditët e shënuara dhe darkat e qeta, çdo rast përgatitet me të njëjtën dorë të kujdesshme.",
  },
  galleryPreview: {
    overline: "Galeria",
    title: "Një vështrim i vendit",
    link: "Shihni gjithë galerinë",
  },
  cta: {
    title: "Rezervoni datën tuaj në Apollonia",
    description:
      "Na tregoni pak për rastin tuaj dhe ne do ta mbajmë ditën ndërsa e planifikojmë bashkë.",
    link: "Nisni rezervimin",
  },
} as const;

export const venueCopy = {
  metadata: {
    title: "Vendi — Apollonia Events",
    description:
      "Një sallë e vetme e gjerë në Gjilan, që merr tri forma gjatë ditës — ceremonia, darka, vallëzimi.",
  },
  header: {
    overline: "Vendi",
    title: "Një shtëpi për ngjarjen tuaj",
    description:
      "Për orët e eventit tuaj, salla përgatitet plotësisht dhe ekipi i kushtohet vetëm juve — nga rregullimi i parë te ora e fundit.",
  },
  heritage: {
    title: "Nga Apolonia e lashtë",
    beats: [
      {
        overline: "Emri",
        text: "Apolonia, qyteti antik pranë Fierit, ruajti dije dhe mikpritje.",
      },
      {
        overline: "Trashëgimia",
        text: "Mikpritja si nder i lashtë — φιλοξενία — kalon brez pas brezi.",
      },
      {
        overline: "Sot",
        text: "Një shtëpi, një ngjarje, kujdesi i dikurshëm në çdo hollësi.",
      },
    ],
  },
  spacesHeading: {
    overline: "Salla",
    title: "Një sallë, tri kohë",
    description:
      "E njëjta sallë merr tri forma gjatë ditës — ceremonia, darka, vallëzimi — ndërsa ngjarja shpaloset me qetësi.",
  },
  spaces: [
    {
      name: "Ceremonia",
      description:
        "Salla renditet për fjalën e parë pranë dritareve — ulëse në rresht, dritë e butë e ditës dhe çdo sy nga çifti.",
      tone: "marble" as Tone,
    },
    {
      name: "Darka",
      description:
        "Tryeza të gjata e të rrumbullakëta zënë vendin rreth banakut të mermertë bardh e zi, ndërsa pjatat dhe bisedat ecin ngadalë.",
      tone: "olive" as Tone,
    },
    {
      name: "Vallëzimi",
      description:
        "Tryezat tërhiqen anash dhe salla hapet nën tavanin e punuar si vepër arti — muzikë, dritë e ulët dhe një orë të fundit që s'duam ta mbyllim.",
      tone: "aegean" as Tone,
    },
  ],
  detailsHeading: {
    overline: "Hollësitë",
    title: "Çdo gjë me kujdes",
  },
  cta: "Kontrolloni një datë",
} as const;

export const eventsCopy = {
  metadata: {
    title: "Eventet — Apollonia Events",
    description:
      "Dasma, darka private, festime dhe evente korporative, secila e përgatitur me kujdes.",
  },
  header: {
    overline: "Eventet",
    title: "Raste që e meritojnë vendin",
    description:
      "Cilado qoftë mbledhja, secila pritet me të njëjtën dorë të kujdesshme dhe me vëmendjen e plotë të ekipit për orët e saj.",
  },
  processHeading: {
    overline: "Procesi",
    title: "Nga kërkesa te ngjarja",
  },
  process: [
    {
      step: "01",
      title: "Dërgoni kërkesën",
      detail:
        "Ndani datën, rastin dhe numrin e të ftuarve në një kërkesë të shkurtër.",
    },
    {
      step: "02",
      title: "Mbajmë ditën",
      detail:
        "Konfirmojmë disponueshmërinë dhe e rezervojmë përkohësisht datën tuaj.",
    },
    {
      step: "03",
      title: "Planifikojmë bashkë",
      detail:
        "Një person përgjegjës ndjek orarin dhe rezervimin; ju zgjidhni kateringun, pijet dhe dekorin, ne përshtatim sallën dhe zërimin.",
    },
    {
      step: "04",
      title: "Dita e ngjarjes",
      detail: "Mbërrini në një vend që është tërësisht dhe qetësisht i juaji.",
    },
  ],
  cta: "Nisni rezervimin",
} as const;

export const galleryCopy = {
  metadata: {
    title: "Galeria — Apollonia Events",
    description:
      "Një vështrim i Apollonia Events: një sallë e vetme që merr formë nga ceremonia te darka, në dritën e artë.",
  },
  header: {
    overline: "Galeria",
    title: "Një vështrim i vendit",
    description:
      "Disa çaste nga vendi dhe ngjarjet që ka mbajtur. Historia e plotë shihet më mirë nga afër.",
  },
  wall: {
    description:
      "Një mur i mbledhur me sallën, tryezat dhe mbërritjet, në ritmin e pabarabartë të një vendi të parë me kohë.",
    countLabel: "pamje",
    withImages:
      "Një vështrim i përditësuar i sallës dhe mbledhjeve në Apollonia.",
    withoutImages:
      "Fotografitë janë përkohësisht mbajtëse vendi; pamjet reale do të vendosen këtu.",
    cta: "Organizoni një vizitë",
  },
  lightbox: {
    close: "Mbyll imazhin",
    previous: "Imazhi i mëparshëm",
    next: "Imazhi tjetër",
    fallbackTitle: (index: number) => `Pamje galerie ${index + 1}`,
    openLabel: (title: string) => `Hapni ${title}`,
    count: (index: number, total: number) => `Galeria ${index} nga ${total}`,
  },
} as const;

export const testimonialsCopy = [
  {
    quote:
      "Kapitulli i parë i sallës: ekspozita kolektive «Kujtesë e Vlerave artistike» nga artistë vendorë.",
    attribution: "Eventi i parë në Apollonia",
  },
] as const;

/**
 * Half-hour start times the visitor may pick freely, 10:00–22:00 inclusive
 * (25 options). Labels are the plain "HH:MM" value. Generated rather than
 * hand-written so the range stays a single source of truth.
 */
function buildTimeSlots(): { value: string; label: string }[] {
  const slots: { value: string; label: string }[] = [];
  for (let minutes = 10 * 60; minutes <= 22 * 60; minutes += 30) {
    const value = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
      minutes % 60,
    ).padStart(2, "0")}`;
    slots.push({ value, label: value });
  }
  return slots;
}

export const reserveCopy = {
  metadata: {
    title: "Rezervoni një datë — Apollonia Events",
    description:
      "Kërkoni një datë në Apollonia Events. Na tregoni për rastin tuaj dhe ne do ta mbajmë ditën ndërsa e planifikojmë bashkë.",
  },
  header: {
    overline: "Rezervo",
    title: "Nisni ftesën",
    description:
      "Na tregoni formën e parë të ditës: kur duhet të ndodhë, për kë është dhe si mund t'ju kontaktojmë. Do t'ju përgjigjemi personalisht përpara se çdo datë të quhet e konfirmuar.",
  },
  faq: {
    title: "Pyetje të shpeshta",
    items: [
      {
        question: "Sa të ftuar mund të presë Apollonia?",
        answer:
          "Apollonia pret deri në 60 të ftuar. Rreth 30–35 të ulur në tryeza të gjata drejtkëndëshe e të rrumbullakëta, ose deri në 60 në pritje në këmbë.",
      },
      {
        question: "A mbahet më shumë se një ngjarje në ditë?",
        answer:
          "Sipas llojit dhe orarit, dita mund të presë deri në dy evente, të ndara me kujdes që të mos përplasen. Salla rifreskohet plotësisht mes tyre.",
      },
      {
        question: "Si funksionon kuzhina?",
        answer:
          "S'ka kuzhinë në vend. Ju zgjidhni kateringun dhe pijet tuaja të preferuara, ndërsa ne ofrojmë hapësirën dhe zërimin.",
      },
      {
        question: "Çfarë ndodh nëse moti ndryshon?",
        answer:
          "Festimi zhvillohet brenda në sallë, prandaj moti nuk e prek rrjedhën e ditës. E planifikojmë çdo hollësi pa e lënë rastësisë.",
      },
      {
        question: "Si konfirmohet rezervimi?",
        answer:
          "Fillon me një kërkesë dhe vijon me konfirmim personal nga Apollonia. Data quhet e mbyllur vetëm pasi ta konfirmojmë bashkë.",
      },
      {
        question: "Si funksionon pagesa dhe anulimi?",
        answer:
          "Data mbyllet me një paradhënie prej 50%. Anulimi njoftohet të paktën 48–72 orë përpara; në raste të veçanta, edhe brenda 24 orëve, e kuptojmë.",
      },
      {
        question: "Deri në çfarë ore mund të zgjasë festa?",
        answer:
          "Muzika me volum të plotë deri në orën 23:00 — jemi në zonë të banuar dhe respektojmë fqinjët — pastaj vazhdon me ton të lehtë; qëndrimi deri rreth 00:00–01:00.",
      },
    ],
  },
  form: {
    progressLabel: "Ecuria e rezervimit",
    steps: {
      day: "Hollësitë e ditës",
      contact: "Të dhënat e kontaktit",
    },
    dateFallback: "Zgjidhni një datë",
    timeFallback: "Zgjidhni një orë",
    eventFallback: "Zgjidhni një rast",
    guestFallback: "1–60 të ftuar",
    reservedDates: "Datat e shënuara janë të rezervuara",
    dayLegend: "Hollësitë e ditës",
    dayTitle: "Dita që keni në mendje",
    dayDescription: "Nisni me datën, orën, rastin dhe numrin e të ftuarve.",
    contactLegend: "Të dhënat e kontaktit",
    contactTitle: "Ku duhet t'ju shkruajmë",
    contactDescription: "Shtoni të dhënat e personit që porosit ditën.",
    labels: {
      date: "Data",
      time: "Ora",
      occasion: "Rasti",
      guests: "Të ftuar",
      name: "Emri i plotë",
      phone: "Telefoni",
      email: "Email",
      notes: "Shënime",
    },
    placeholders: {
      name: "Emri juaj",
      phone: "Numri i kontaktit",
      email: "ju@email.com",
      notes: "Çdo gjë që dëshironi të dimë për rastin tuaj.",
    },
    requestNotice:
      "Një kërkesë, jo një rezervim i mbyllur. Datën do ta konfirmojmë personalisht. Përgjigjemi brenda 24 orëve.",
    back: "Kthehu",
    continue: "Vazhdo",
    edit: "Ndrysho",
    summaryLabel: "Dita e zgjedhur",
    submit: "Dërgo kërkesën",
    sending: "Duke dërguar…",
    print: "Printo ftesën",
    successOverline: "Faleminderit",
    successTitle: "Do t'ju përgjigjemi me kujdes",
    successDescription:
      "Faleminderit. Kërkesa juaj u shënua dhe do t'ju kontaktojmë së shpejti për të konfirmuar disponueshmërinë.",
    successNotice:
      "Kjo mbetet kërkesë derisa Apollonia ta konfirmojë datën personalisht.",
    suggestedDates: "Zgjidhni një të shtunë të lirë",
  },
  invitation: {
    receivedAriaLabel: "Ftesa e kërkesës së marrë",
    draftAriaLabel: "Parapamja e ftesës së rezervimit",
    draftOverline: "Apollonia Events",
    receivedOverline: "Kërkesa u mor",
    draftTitle: "Një rast në Apollonia",
    receivedTitle: "Kërkesa juaj u mor",
    draftDescription: "Një përshtypje e parë e ditës që dëshironi të mbajmë.",
    receivedDescription:
      "Kemi shënimin tuaj dhe do t'ju përgjigjemi personalisht.",
    requestedFor: "Kërkuar për",
    dateFallback: "një datë të zgjedhur me kujdes",
    occasion: "Rasti",
    occasionFallback: "Rasti do të emërtohet",
    hour: "Ora",
    hourFallback: "Ora do të zgjidhet",
    guests: "Të ftuar",
    guestsFallback: "Numri i të ftuarve do të vijë më pas",
    requestedBy: "Kërkuar nga",
    nameFallback: "Emri juaj",
    contactFallback: "Telefoni dhe email-i juaj do të shfaqen këtu.",
    hostNote: "Shënim për mikpritësin",
    bookingNotice:
      "Kjo kërkesë nuk është rezervim derisa Apollonia ta konfirmojë datën.",
    singleGuest: (count: string) => `${count} i ftuar`,
    manyInvitees: (count: string) => `${count} të ftuar`,
  },
  validation: {
    dateRequired: "Ju lutemi zgjidhni një datë.",
    dateInvalid: "Ju lutemi zgjidhni një datë të vlefshme.",
    dateFuture: "Ju lutemi zgjidhni një datë nga sot e tutje.",
    timeRequired: "Ju lutemi zgjidhni një orë.",
    eventRequired: "Ju lutemi zgjidhni një rast.",
    guestRequired: "Ju lutemi shkruani numrin e të ftuarve.",
    guestWhole: "Përdorni një numër të plotë.",
    guestRange: "Nga 1 deri në 60 të ftuar.",
    nameRequired: "Ju lutemi shkruani emrin tuaj.",
    phoneRequired: "Ju lutemi shkruani një numër kontakti.",
    emailInvalid: "Ju lutemi shkruani një email të vlefshëm.",
    notesMax: "Ju lutemi mbajini shënimet nën 2000 karaktere.",
  },
  serverErrors: {
    invalid:
      "Disa hollësi kërkojnë edhe një vështrim. Ju lutemi kontrolloni formularin.",
    unavailable:
      "Kjo datë është tashmë e rezervuar. Ju lutemi zgjidhni një datë tjetër.",
    submit: "Nuk mundëm ta dërgonim kërkesën tani. Ju lutemi provoni përsëri.",
  },
  timeSlots: buildTimeSlots(),
} as const;

export const footerCopy = {
  description:
    "Një vend i qetë, i punuar me kujdes, për rastet më të çmuara të jetës.",
  philoxenia:
    "mikpritje: nderi i lashtë ndaj mikut, nga Apolonia e dikurshme deri në ditën tuaj.",
  explore: "Zbuloni",
  visit: "Vizitoni",
  byAppointment: "Me takim",
  coast: "Gjilan, Kosovë",
  street: "Rr. Demush Shabani",
  cityLine: "60000 Gjilan, Kosovë",
  phones: [
    { label: "+383 44 376 237", href: "tel:+38344376237" },
    { label: "+383 48 190 599", href: "tel:+38348190599" },
  ],
  instagramLabel: "Instagram",
  instagramHref: "https://www.instagram.com/apollonia.events",
  rights: "Të gjitha të drejtat e rezervuara.",
  reservationOnly:
    "Vetëm me rezervim · Një kalendar i kuruar i eventeve private",
  duskLine: "Apollonia nën yje — deri në orën e fundit.",
} as const;

export const notFoundCopy = {
  title: "Kjo faqe është rrënojë.",
  description: "Ajo që kërkoni nuk gjendet më këtu.",
  home: "Kthehu në fillim",
} as const;

export const emailCopy = {
  guestDetails: {
    date: "Data",
    time: "Ora",
    occasion: "Rasti",
    guests: "Të ftuar",
  },
  footer: "Apollonia Events &middot; Vetëm me rezervim",
  requestReceived: {
    subject: "Kemi marrë kërkesën tuaj për Apollonia",
    heading: "Kemi marrë kërkesën tuaj",
    paragraph:
      "Faleminderit që na shkruat. Ekipi ynë do të shqyrtojë hollësitë dhe do të konfirmojë disponueshmërinë së shpejti.",
    preheader: "Kemi marrë kërkesën tuaj të rezervimit te Apollonia Events.",
  },
  confirmed: {
    subject: "Rezervimi juaj në Apollonia është konfirmuar",
    heading: "Rezervimi juaj është konfirmuar",
    paragraph:
      "Me kënaqësi konfirmojmë rezervimin tuaj. Presim t'ju mirëpresim.",
    preheader: "Rezervimi juaj te Apollonia Events është konfirmuar.",
  },
  reminder: {
    subject: "Kujtesë: rezervimi juaj në Apollonia është nesër",
    heading: "Rezervimi juaj është nesër",
    paragraph:
      "Kjo është një kujtesë e shkurtër për rezervimin tuaj të konfirmuar.",
    preheader:
      "Një kujtesë për rezervimin tuaj të ardhshëm te Apollonia Events.",
  },
  declined: {
    subject: "Rreth kërkesës suaj për rezervim në Apollonia",
    heading: "Rreth kërkesës suaj për rezervim",
    paragraph:
      "Faleminderit që menduat për Apollonia Events. Na vjen keq që nuk mund ta mbajmë këtë datë dhe do të ishim të lumtur të gjejmë një mundësi tjetër.",
    preheader: "Nuk mund ta mbajmë këtë datë rezervimi te Apollonia Events.",
  },
} as const;
