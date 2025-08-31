export const contactConfig = {
  badge: "Get In Touch",
  title: "Let's Work Together",
  subtitle: "Have a project in mind? Let's discuss how we can bring your ideas to life.",
  
  contactInfo: {
    email: "hello@meghrajgiri.dev",
    phone: "+977 9800000000",
    location: "Kathmandu, Nepal",
    timezone: "GMT+5:45"
  },
  
  socialLinks: [
    {
      name: "GitHub",
      icon: "🔗",
      url: "https://github.com/meghrajgiri",
      username: "@meghrajgiri"
    },
    {
      name: "LinkedIn", 
      icon: "💼",
      url: "https://linkedin.com/in/meghrajgiri",
      username: "in/meghrajgiri"
    },
    {
      name: "Twitter",
      icon: "🐦", 
      url: "https://twitter.com/meghrajgiri",
      username: "@meghrajgiri"
    },
    {
      name: "Instagram",
      icon: "📸",
      url: "https://instagram.com/meghrajgiri",
      username: "@meghrajgiri"
    }
  ],
  
  availability: {
    status: "Available for new projects",
    responseTime: "Usually responds within 24 hours",
    workingHours: "Mon-Fri, 9AM-6PM (GMT+5:45)"
  },
  
  services: [
    {
      title: "Web Development",
      description: "Full-stack web applications using modern technologies",
      icon: "🌐"
    },
    {
      title: "Mobile Development", 
      description: "Cross-platform mobile apps with React Native",
      icon: "📱"
    },
    {
      title: "UI/UX Design",
      description: "User-centered design and prototyping",
      icon: "🎨"
    },
    {
      title: "Consulting",
      description: "Technical consulting and code reviews", 
      icon: "💡"
    }
  ],
  
  form: {
    fields: {
      name: {
        label: "Full Name",
        placeholder: "Your full name",
        required: true
      },
      email: {
        label: "Email Address", 
        placeholder: "your.email@example.com",
        required: true
      },
      subject: {
        label: "Subject",
        placeholder: "What's this about?",
        required: true
      },
      message: {
        label: "Message",
        placeholder: "Tell me about your project...",
        required: true
      }
    },
    submitButton: "Send Message",
    successMessage: "Thanks for your message! I'll get back to you soon.",
    errorMessage: "Oops! Something went wrong. Please try again."
  }
};