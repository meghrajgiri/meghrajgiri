export const projectsConfig = {
  badge: "My Work", 
  title: "Featured Projects",
  subtitle: "Innovative solutions across Fin-Tech, Ed-Tech, E-Commerce, and Web3 industries",
  
  projects: [
    {
      id: 1,
      title: "Lyve (Alight)",
      description: "A comprehensive fintech platform designed to streamline financial services and enhance user experience.",
      longDescription: "Developed a sophisticated financial technology platform for Alight, focusing on employee benefits and financial wellness. The platform integrates modern UI/UX principles with robust backend systems to deliver seamless financial services.",
      image: "/projects/lyve.webp",
      technologies: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Stripe API"],
      category: "Fin-Tech",
      status: "Completed",
      year: "2024",
      links: {
        demo: "https://lyve.alight.com",
        case_study: "/case-studies/lyve"
      },
      highlights: [
        "Secure financial data processing",
        "Real-time transaction monitoring",
        "Employee benefits management",
        "Responsive design across all devices",
        "GDPR and SOX compliance"
      ]
    },
    {
      id: 2,
      title: "LaunchX",
      description: "An educational technology platform empowering entrepreneurs and startups with comprehensive learning resources.",
      longDescription: "Built an innovative ed-tech platform that provides entrepreneurship education and startup incubation tools. Features include interactive courses, mentorship matching, and project collaboration spaces.",
      image: "/projects/launchx.webp",
      technologies: ["Next.js", "TypeScript", "MongoDB", "Socket.io", "Tailwind CSS", "Vercel"],
      category: "Ed-Tech",
      status: "Completed", 
      year: "2023",
      links: {
        demo: "https://launchx.edu",
        case_study: "/case-studies/launchx"
      },
      highlights: [
        "Interactive learning modules",
        "Real-time mentorship matching",
        "Collaborative project workspace",
        "Progress tracking and analytics",
        "Mobile-first responsive design"
      ]
    },
    {
      id: 3,
      title: "BookVid",
      description: "A modern e-commerce platform for digital content, focusing on books and video educational materials.",
      longDescription: "Created a comprehensive e-commerce solution specializing in digital educational content. The platform features advanced search, recommendation systems, and seamless digital content delivery.",
      image: "/projects/bookvid.webp",
      technologies: ["Vue.js", "Express.js", "MySQL", "Redis", "Elasticsearch", "AWS S3"],
      category: "E-Commerce",
      status: "Completed",
      year: "2023", 
      links: {
        demo: "https://bookvid.com",
        case_study: "/case-studies/bookvid"
      },
      highlights: [
        "Advanced search and filtering",
        "AI-powered recommendations",
        "Secure digital content delivery",
        "Multi-payment gateway integration",
        "Admin dashboard with analytics"
      ]
    },
    {
      id: 4,
      title: "CCS (Crypto Commerce System)",
      description: "A cutting-edge Web3 e-commerce platform enabling cryptocurrency payments and NFT marketplace functionality.",
      longDescription: "Developed a revolutionary Web3 commerce platform that bridges traditional e-commerce with blockchain technology. Features include crypto payments, NFT marketplace, and decentralized identity management.",
      image: "/projects/ccs.webp",
      technologies: ["React", "Solidity", "Ethereum", "IPFS", "Web3.js", "MetaMask"],
      category: "Web3",
      status: "Completed",
      year: "2024",
      links: {
        demo: "https://ccs-web3.com",
        case_study: "/case-studies/ccs"
      },
      highlights: [
        "Multi-cryptocurrency payment support",
        "NFT minting and marketplace",
        "Smart contract integration", 
        "Decentralized storage with IPFS",
        "MetaMask wallet integration"
      ]
    }
  ],
  
  callToAction: {
    title: "Interested in working together?",
    description: "I'm always open to discussing new opportunities and interesting projects.",
    buttonText: "Get In Touch"
  }
};