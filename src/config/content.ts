export const siteConfig = {
  // Personal Information
  personal: {
    name: "Meghraj Giri",
    role: "Full Stack Developer",
    initials: "MG",
  },

  // Hero Section
  hero: {
    mainTitle: {
      line1: "Building Digital",
      line2: "Experiences"
    },
    description: "Crafting digital experiences that blend innovative design with clean code",
    highlightedTerms: {
      term1: "innovative design",
      term2: "clean code"
    },
    buttons: {
      primary: "View My Work",
      secondary: "Let's Connect"
    },
    stats: [
      { number: "4+", label: "Years Experience" },
      { number: "50+", label: "Projects Completed" },
      { number: "100%", label: "Client Satisfaction" }
    ]
  },

  // Navigation
  navigation: {
    items: [
      { href: "#about", label: "About" },
      { href: "#skills", label: "Skills" },
      { href: "#projects", label: "Projects" },
      { href: "#contact", label: "Contact" }
    ]
  },

  // About Section
  about: {
    badge: "About Me",
    title: "Passionate Developer",
    subtitle: "Building the future of web with cutting-edge technologies and innovative solutions",
    description: [
      "With over 4 years of experience in web development, I specialize in building modern, scalable applications using cutting-edge technologies. My passion lies in creating seamless user experiences backed by robust, maintainable code.",
      "I believe in the power of clean, efficient code and collaborative development. Whether working on a startup MVP or an enterprise application, I bring the same level of attention to detail and commitment to excellence."
    ],
    highlights: [
      {
        title: "Frontend Excellence",
        description: "React, Next.js, TypeScript, Tailwind CSS",
        icon: "🎨"
      },
      {
        title: "Backend Mastery", 
        description: "Node.js, Python, PostgreSQL, MongoDB",
        icon: "⚡"
      },
      {
        title: "Cloud & DevOps",
        description: "AWS, Docker, CI/CD, Serverless",
        icon: "☁️"
      },
      {
        title: "Design & UX",
        description: "Figma, User Research, Prototyping",
        icon: "✨"
      }
    ],
    callToAction: {
      title: "Ready to bring your vision to life?",
      description: "Let's collaborate to create something extraordinary that makes a real impact",
      buttonText: "Start a Project"
    }
  },

  // Meta Information
  meta: {
    title: "Meghraj Giri - Full Stack Developer",
    description: "Full Stack Developer specializing in modern web technologies. Building exceptional digital experiences with clean code and innovative solutions.",
    url: "https://meghrajgiri.dev",
    twitter: "@meghrajgiri"
  }
};

export type SiteConfig = typeof siteConfig;