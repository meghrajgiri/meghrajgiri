export const projectsConfig = {
  badge: "My Work",
  title: "Featured Projects",
  subtitle: "Some of the projects I've worked on recently",
  
  projects: [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce solution with modern design and seamless user experience.",
      longDescription: "Built a comprehensive e-commerce platform using Next.js, TypeScript, and Stripe integration. Features include user authentication, product catalog, shopping cart, and admin dashboard.",
      image: "/projects/ecommerce.jpg",
      technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Tailwind CSS"],
      category: "Full Stack",
      status: "Completed",
      year: "2024",
      links: {
        demo: "https://demo.example.com",
        github: "https://github.com/username/project",
        case_study: "/case-studies/ecommerce"
      },
      highlights: [
        "Secure payment processing with Stripe",
        "Real-time inventory management", 
        "Responsive design across all devices",
        "Admin dashboard with analytics"
      ]
    },
    {
      id: 2,
      title: "Task Management App",
      description: "A collaborative project management tool with real-time updates and team features.",
      longDescription: "Developed a task management application with real-time collaboration features using React, Node.js, and Socket.io.",
      image: "/projects/taskapp.jpg", 
      technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Material-UI"],
      category: "Web Application",
      status: "Completed",
      year: "2023",
      links: {
        demo: "https://taskapp.example.com",
        github: "https://github.com/username/taskapp"
      },
      highlights: [
        "Real-time collaboration with Socket.io",
        "Drag & drop task management",
        "Team member invitations",
        "Progress tracking and reporting"
      ]
    },
    {
      id: 3,
      title: "Portfolio Website",
      description: "A modern, responsive portfolio website showcasing creative design and smooth animations.",
      longDescription: "Created a personal portfolio website with modern design principles, smooth animations, and optimal performance.",
      image: "/projects/portfolio.jpg",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      category: "Frontend",
      status: "Ongoing", 
      year: "2024",
      links: {
        demo: "https://portfolio.example.com",
        github: "https://github.com/username/portfolio"
      },
      highlights: [
        "Modern design with smooth animations",
        "Optimized performance and SEO",
        "Dark/Light mode toggle",
        "Fully responsive design"
      ]
    }
  ],
  
  callToAction: {
    title: "Interested in working together?",
    description: "I'm always open to discussing new opportunities and interesting projects.",
    buttonText: "Get In Touch"
  }
};