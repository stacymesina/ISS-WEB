 /** Built-in defaults — used when site-config.json cannot be loaded (e.g. opening files locally). */
const SITE_DEFAULTS = {
  membershipR101Open: false,
  membershipPeriodLabel: "R101",
  upcomingEventsOpen: true,
  adminPassword: "iss-nexus-admin",
  contact: {
    email: "iss.cics@ust.edu.ph",
    facebook: "UST - Information Systems Society",
    instagram: "@ustiss",
  },
  hero: {
    title: "IS Nexus",
    subtitle: "Official Platform of UST Information Systems Society",
    tagline:
      "Your central hub for IS students—events, opportunities, and involvement.",
  },
  eventsArchive: [],
  announcements: [
    {
      title: "The Hufflepuff Summit: A Project Management Seminar",
      date: "May 19, 2026",
      desc: "A seminar designed to introduce IS students to the fundamentals of project management, bridging theory and real-world application through practical tools and industry insights.",
      image: "img2.jpg",
    },
    {
      title: "The Broken Spell: Escape from Azka-bug",
      date: "May 19, 2026",
      desc: "An interactive, code-themed escape room where participants solve programming and logic challenges to fix a corrupted system within a limited time.",
      image: "img3.jpg",
    },
    {
      title:
        "The Sorcerer's Network: Illuminating the Future of Information Systems Colloquium 2026",
      date: "May 20, 2026",
      desc: "A culminating event where fourth-year IS students present and defend their capstone projects, showcasing their research, technical skills, and readiness for the professional world.",
      image: "img4.jpg",
    },
  ],
  executiveBoard: [
    { role: "President", name: "Stacy Vhonzel U. Mesina" },
    { role: "Internal Vice President", name: "John Marco P. Parman" },
    { role: "External Vice President", name: "Precious Gelin P. Apelo" },
    { role: "Secretary", name: "Shekaina Rose Janelle D. Uy" },
    { role: "Assistant Secretary", name: "Alyza Denyz O. Besavilla" },
    { role: "Treasurer", name: "Jared Aimery T. Ty" },
    { role: "Auditor", name: "Leann C. Wingco" },
    { role: "Public Relations Officer", name: "Charlene May F. Cagayat" },
    { role: "Chief Of Staff", name: "Ahneesha Mhae F. Wee-ebol" },
  ],
  about: {
    paragraphs: [
      "The Information Systems Society (ISS) is the mother organization of the Information Systems Department. It strives to strengthen the IS community and serves as the grievance body for IS students.",
      "Beyond this, ISS is committed to fostering academic excellence, leadership development, and holistic growth by organizing activities that enhance technical skills, encourage collaboration, and cultivate a strong sense of identity within the department.",
      "The organization also serves as a bridge between students and the administration, ensuring a supportive and empowering environment for all IS students.",
    ],
    vision:
      "Guided by the core values of the Church, the University and the Information Systems Department, the organization provides opportunities for growth and social responsiveness. It aims to develop each member's abilities, promote camaraderie, and build proactive individuals ready to surpass challenges while contributing meaningfully to society.",
    mission:
      "The organization aims to be a leading student body in information systems by promoting academic excellence, fostering professional and moral development, and utilizing technology to serve society. It empowers members to become competent, compassionate, and committed professionals.",
  },
  membershipFeeNotice:
    "Membership fee is ₱250. This applies once your application is approved and you are confirmed as an ISS member. Applicants for Staff and Executive Assistant roles may need to complete an interview first—payment details will be shared after you pass screening, not at the time you submit this form.",
  siteTerms: {
    enabled: true,
    title: "Terms and Conditions — IS Nexus",
    content:
      "Welcome to IS Nexus, the official platform of the UST Information Systems Society (ISS).\n\nBy using this website, you agree to use it only for lawful purposes related to ISS membership, events, and announcements. Information you provide must be accurate and truthful.\n\nISS may update announcements, events, and membership policies at any time. Continued use of this site after updates constitutes acceptance of those changes.\n\nFor questions about these terms, contact iss.cics@ust.edu.ph.",
  },
  eventRegistration: {
    termsTitle: "Event Registration — Terms and Conditions",
    termsContent:
      "By registering for an ISS event through this platform, you confirm that you are a current ISS member (unless the event is open to non-members as stated in the announcement).\n\nYou agree to follow university and ISS guidelines during the event, including attendance rules, dress code (if applicable), and conduct expectations.\n\nRegistration does not guarantee a slot until confirmed by ISS. The organization may cancel or reschedule events; registered participants will be notified through official channels.\n\nPersonal data collected via the registration form will be used only for event administration and may be shared with authorized ISS officers.",
    googleFormUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLScK9wfLRSszKE-cZY4dyTtt-NWS6xrPA3JUBNDklkFLzqnz_g/viewform",
  },
};
