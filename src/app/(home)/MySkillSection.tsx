import MySkill from "@/components/cards/MySkill";

export default function MySkillSection() {
  const attributes = [
    {
      icon: (
        // Figma icon
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="7" r="3" fill="#223344" />
          <circle cx="12" cy="14" r="3" fill="#223344" opacity="0.7" />
          <circle cx="12" cy="21" r="3" fill="#223344" opacity="0.4" />
          <circle cx="7" cy="10.5" r="3" fill="#223344" opacity="0.5" />
          <circle cx="17" cy="10.5" r="3" fill="#223344" opacity="0.5" />
        </svg>
      ),
      title: "Figma",
      description: "Cloud-based design tool for collaborative prototyping",
    },
    {
      icon: (
        // Invision icon (simple "in" in a rounded square)
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            stroke="#223344"
            strokeWidth="2"
          />
          <text
            x="7"
            y="17"
            fontSize="10"
            fill="#223344"
            fontFamily="Arial"
            fontWeight="bold"
          >
            in
          </text>
        </svg>
      ),
      title: "Invision",
      description:
        "Prototyping tool for transforming designs into interactive experiences.",
    },
    {
      icon: (
        // Adobe Photoshop icon (stylized "A" in a rounded triangle)
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5L20 19H4L12 5Z"
            stroke="#223344"
            strokeWidth="2"
            fill="none"
          />
          <text
            x="8"
            y="17"
            fontSize="10"
            fill="#223344"
            fontFamily="Arial"
            fontWeight="bold"
          >
            A
          </text>
        </svg>
      ),
      title: "Adobe Photoshop",
      description:
        "Industry-standard software for image editing, manipulation, and creation.",
    },
    {
      icon: (
        // Adobe Illustrator icon (stylized "Ai" in a rounded square)
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            stroke="#223344"
            strokeWidth="2"
          />
          <text
            x="7"
            y="17"
            fontSize="10"
            fill="#223344"
            fontFamily="Arial"
            fontWeight="bold"
          >
            Ai
          </text>
        </svg>
      ),
      title: "Adobe Illustrator",
      description:
        "Vector graphics software for creating scalable logos, icons, and illustrations.",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 py-8 sm:grid-cols-2 md:grid-cols-2">
      {attributes.map((attr, idx) => (
        <MySkill
          key={idx}
          icon={attr.icon}
          title={attr.title}
          description={attr.description}
        />
      ))}
    </div>
  );
}
