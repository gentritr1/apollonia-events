/** Curated, editable Albanian content for the public site. */

export type Tone = "aegean" | "marble" | "olive" | "gold";

export const brandName = "Apollonia Events";

export const publicMetadata = {
  root: {
    title: "Evente private — Apollonia Events",
    description:
      "Një vend i qetë për dasma, darka private dhe festime. Rezervoni datën tuaj te Apollonia Events.",
  },
} as const;

export type UpcomingFreeDate = {
  iso: string;
  label: string;
};

export const WHATSAPP_PHONE_NUMBER = "355000000000";

const whatsappGreeting =
  "Përshëndetje Apollonia, dëshiroj të pyes për një datë eventi.";

export const contactCopy = {
  whatsappLabel: "Shkruani në WhatsApp",
  whatsappHref: `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(
    whatsappGreeting
  )}`,
} as const;

export const availabilityCopy = {
  overline: "Disponueshmëria",
  homePrefix: "Të shtunat më të afërta të lira",
  reservePrompt: "Zgjidhni një të shtunë të lirë",
  unavailable:
    "Datat më të afërta do t'i konfirmojmë personalisht me ju.",
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

export const venueFeatures = [
  {
    title: "Deri në 120 të ftuar",
    detail: "Salla dhe tarraca përshtaten nga tryeza intime te pritja e plotë.",
  },
  {
    title: "Sallë e brendshme & tarracë ullinjsh",
    detail: "Interierë mermeri që hapen drejt ulëseve të hijëzuara jashtë.",
  },
  {
    title: "Kuzhinë në vend",
    detail: "Menu sezonale dhe përzgjedhje pijesh, të përgatitura në shtëpi.",
  },
  {
    title: "Mikpritës i përkushtuar",
    detail: "Një person kontakti, i vëmendshëm ndaj çdo hollësie të ditës.",
  },
];

export const galleryItems = [
  { caption: "Tarraca në muzg", tone: "aegean" as Tone },
  { caption: "Një tryezë e gjatë", tone: "marble" as Tone },
  { caption: "Oborri i ullinjve", tone: "olive" as Tone },
  { caption: "Salla e mermerit, gati për darkë", tone: "marble" as Tone },
  { caption: "Ceremoni në orën e artë", tone: "gold" as Tone },
  { caption: "Pritje në mbrëmje", tone: "aegean" as Tone },
];

export const homeCopy = {
  metadata: {
    title: "Evente private — Apollonia Events",
    description:
      "Një vend i qetë, i punuar me kujdes, për dasma, darka private dhe festime pranë Adriatikut.",
  },
  hero: {
    overline: "Evente private · Buzë Adriatikut",
    titleLead: "Ku çdo mbledhje bëhet",
    titleAccent: "ngjarje",
    description:
      "Një vend i qetë, i punuar me kujdes, për dasma, darka private dhe festime. Rezervohet për një ditë të vetme; çdo hollësi pritet me dorë.",
    primaryCta: "Rezervoni një datë",
    secondaryCta: "Zbuloni vendin",
    venueAriaLabel: "Vendi i Apollonia Events",
  },
  venueIntro: {
    overline: "Vendi",
    title: "Një shtëpi e ngritur për mbledhje",
    description:
      "Apollonia i jepet një ngjarjeje të vetme në ditë. Interierët e mermerit hapen drejt tarracës me ullinj; drita lëviz nga qetësia e mëngjesit te muzgu i artë. Asgjë nuk nxitohet dhe asgjë nuk ndahet me të tjerë.",
  },
  day: {
    overline: "Dita",
    title: "Dita në Apollonia",
    description:
      "Një kalendar privat e lejon vendin të ndjekë ngjarjen nga përgatitja e qetë deri te kënga e fundit.",
    timeline: [
      {
        time: "11:00",
        title: "Përgatitjet",
        detail: "Dhomat mbushen me lule, pëlhura dhe ritmin e ardhjes.",
        tone: "text-ink",
        muted: "text-ink-soft",
      },
      {
        time: "17:00",
        title: "Ceremonia",
        detail: "Oborri i mbledh të gjithë në një dritë të vonë.",
        tone: "text-ink",
        muted: "text-ink-soft",
      },
      {
        time: "20:00",
        title: "Darka nën ullinj",
        detail: "Tarraca ngrohet ndërsa pjatat dhe bisedat ecin ngadalë.",
        tone: "text-ink lg:text-ivory",
        muted: "text-ink-soft lg:text-ivory/72",
      },
      {
        time: "00:00",
        title: "Vallëzimi i fundit",
        detail: "Nata ngushtohet në qirinj, gur dhe njerëzit që ende rrinë.",
        tone: "text-ink lg:text-ivory",
        muted: "text-ink-soft lg:text-ivory/72",
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
      "Interierë mermeri dhe tarracë me ullinj pranë Adriatikut. Një vend, një ngjarje në ditë.",
  },
  header: {
    overline: "Vendi",
    title: "Një shtëpi, vetëm për një ngjarje",
    description:
      "Apollonia nuk rezervohet kurrë dy herë në të njëjtën ditë. Nga përgatitjet e mëngjesit te ora e fundit, vendi i përket vetëm ditës suaj.",
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
    overline: "Hapësirat",
    title: "Tre mjedise, një ditë e pandërprerë",
    description:
      "Lëvizni nga oborri në sallë e pastaj në tarracë ndërsa ngjarja shpaloset me qetësi.",
  },
  spaces: [
    {
      name: "Salla e mermerit",
      description:
        "Një interier i qetë me gur dhe dritë të butë, për ceremoni dhe darka të ulura.",
      tone: "marble" as Tone,
    },
    {
      name: "Tarraca e ullinjve",
      description:
        "Një tarracë e hapur, e hijëzuar nga ullinjtë, për pritje, dolli dhe mbrëmje të gjata.",
      tone: "olive" as Tone,
    },
    {
      name: "Oborri",
      description:
        "Një prag i qetë me ujë dhe gur, ku të ftuarit mbërrijnë dhe dita nis.",
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
      "Cilado qoftë mbledhja, Apollonia pret vetëm një në ditë, me vëmendjen që lejon një kalendar i pandarë.",
  },
  processHeading: {
    overline: "Procesi",
    title: "Nga kërkesa te ngjarja",
  },
  process: [
    {
      step: "01",
      title: "Dërgoni kërkesën",
      detail: "Ndani datën, rastin dhe numrin e të ftuarve në një kërkesë të shkurtër.",
    },
    {
      step: "02",
      title: "Mbajmë ditën",
      detail: "Konfirmojmë disponueshmërinë dhe e rezervojmë përkohësisht datën tuaj.",
    },
    {
      step: "03",
      title: "Planifikojmë bashkë",
      detail: "Një mikpritës i përkushtuar formëson menunë, ritmin dhe hollësitë me ju.",
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
      "Një vështrim i Apollonia Events: salla mermeri, tarraca e ullinjve dhe mbledhje në dritën e artë.",
  },
  header: {
    overline: "Galeria",
    title: "Një vështrim i vendit",
    description:
      "Disa çaste nga vendi dhe ngjarjet që ka mbajtur. Historia e plotë shihet më mirë nga afër.",
  },
  wall: {
    description:
      "Një mur i mbledhur me dhoma, tarraca, tryeza dhe mbërritje, në ritmin e pabarabartë të një vendi të parë me kohë.",
    countLabel: "pamje",
    withImages:
      "Një vështrim i përditësuar i dhomave, tarracës dhe mbledhjeve në Apollonia.",
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
      "Dita lëvizi me aq kujdes të qetë sa çdo i ftuar u ndie i pritur, i njohur dhe i mbajtur bukur.",
    attribution: "Mira & Elian, dasmë në shtator",
  },
  {
    quote:
      "Darka nën ullinj u ndie më pak e organizuar dhe më shumë e kompozuar. Asgjë nuk garoi me shoqërinë.",
    attribution: "Darkë private familjare",
  },
  {
    quote:
      "Apollonia i dha festimit ritëm: mbërritje, dritë, tryezë, muzikë dhe një orë të fundit që nuk donim ta mbyllnim.",
    attribution: "Festim përvjetori",
  },
] as const;

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
          "Apollonia pret deri në 120 të ftuar. Hapësirat përshtaten për tryeza intime, ceremoni dhe pritje më të plota.",
      },
      {
        question: "A mbahet më shumë se një ngjarje në ditë?",
        answer:
          "Jo. Vendi i jepet vetëm një ngjarjeje në ditë, që ekipi dhe hapësirat të jenë tërësisht tuajat.",
      },
      {
        question: "Si funksionon kuzhina?",
        answer:
          "Kuzhina jonë përgatit menu sezonale në vend. Menuja përfundimtare ndërtohet me ju pas kërkesës së parë.",
      },
      {
        question: "Çfarë ndodh nëse moti ndryshon?",
        answer:
          "Salla e brendshme mban një plan të qetë për mot të paqëndrueshëm. E planifikojmë rrjedhën e ditës pa e lënë rastësisë.",
      },
      {
        question: "Si konfirmohet rezervimi?",
        answer:
          "Fillon me një kërkesë dhe vijon me konfirmim personal nga Apollonia. Data quhet e mbyllur vetëm pasi ta konfirmojmë bashkë.",
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
    guestFallback: "Numri i të ftuarve",
    reservedDates: "Datat e shënuara janë të rezervuara",
    dayLegend: "Hollësitë e ditës",
    dayTitle: "Dita që keni në mendje",
    dayDescription: "Nisni me datën, orën, rastin dhe numrin e të ftuarve.",
    contactLegend: "Të dhënat e kontaktit",
    contactTitle: "Ku duhet t'ju shkruajmë",
    contactDescription:
      "Shtoni të dhënat e personit që porosit ditën.",
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
      "Një kërkesë, jo një rezervim i mbyllur. Datën do ta konfirmojmë personalisht.",
    back: "Kthehu",
    continue: "Vazhdo",
    submit: "Dërgo kërkesën e rezervimit",
    sending: "Duke dërguar…",
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
    draftDescription:
      "Një përshtypje e parë e ditës që dëshironi të mbajmë.",
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
    guestRange: "Nga 1 deri në 120 të ftuar.",
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
    submit:
      "Nuk mundëm ta dërgonim kërkesën tani. Ju lutemi provoni përsëri.",
  },
  timeSlots: [
    { value: "11:00", label: "Paradite vonë · 11:00" },
    { value: "13:00", label: "Drekë · 13:00" },
    { value: "16:00", label: "Pasdite · 16:00" },
    { value: "18:30", label: "Mbrëmje · 18:30" },
    { value: "20:00", label: "Darkë · 20:00" },
  ],
} as const;

export const footerCopy = {
  description:
    "Një vend i qetë, i punuar me kujdes, për rastet më të çmuara të jetës.",
  philoxenia:
    "mikpritje: nderi i lashtë ndaj mikut, nga Apolonia e dikurshme deri në ditën tuaj.",
  explore: "Zbuloni",
  visit: "Vizitoni",
  byAppointment: "Me takim",
  coast: "Bregu i Adriatikut",
  rights: "Të gjitha të drejtat e rezervuara.",
  reservationOnly: "Vetëm me rezervim · Një kalendar i kuruar i eventeve private",
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
    paragraph: "Kjo është një kujtesë e shkurtër për rezervimin tuaj të konfirmuar.",
    preheader: "Një kujtesë për rezervimin tuaj të ardhshëm te Apollonia Events.",
  },
  declined: {
    subject: "Rreth kërkesës suaj për rezervim në Apollonia",
    heading: "Rreth kërkesës suaj për rezervim",
    paragraph:
      "Faleminderit që menduat për Apollonia Events. Na vjen keq që nuk mund ta mbajmë këtë datë dhe do të ishim të lumtur të gjejmë një mundësi tjetër.",
    preheader: "Nuk mund ta mbajmë këtë datë rezervimi te Apollonia Events.",
  },
} as const;
