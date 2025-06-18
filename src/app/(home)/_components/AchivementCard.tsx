import StatsCard from "./StatsCard";

const statsData = [
  {
    icon: (
      // Trophy icon
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <path
          d="M8 21h8M12 17v4M17 5V3H7v2H3v2a5 5 0 0 0 5 5c.5 0 1-.07 1.47-.2A5 5 0 0 0 15 12a5 5 0 0 0 5-5V5h-3z"
          stroke="#223344"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    value: "500k+",
    label: "Trust Client",
  },

  {
    icon: (
      // Trophy icon
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <path
          d="M8 21h8M12 17v4M17 5V3H7v2H3v2a5 5 0 0 0 5 5c.5 0 1-.07 1.47-.2A5 5 0 0 0 15 12a5 5 0 0 0 5-5V5h-3z"
          stroke="#223344"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    value: "500k+",
    label: "Trust Client",
  },
  {
    icon: (
      // Crown icon
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <path
          d="M3 7l5 7 4-5 4 5 5-7"
          stroke="#223344"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 17h20v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2z"
          stroke="#223344"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    value: "800k+",
    label: "Top Buyers",
  },
  {
    icon: (
      // Trophy icon
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <path
          d="M8 21h8M12 17v4M17 5V3H7v2H3v2a5 5 0 0 0 5 5c.5 0 1-.07 1.47-.2A5 5 0 0 0 15 12a5 5 0 0 0 5-5V5h-3z"
          stroke="#223344"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    value: "500k+",
    label: "Trust Client",
  },
];

export default function AchivementCard() {
  return (
    <div className="mt-6 w-full max-w-[1200px]">
      <div className="grid grid-cols-3 gap-6 rounded-xl border-2 border-white-100 p-4">
        {statsData.map((stat, idx) => (
          <StatsCard
            key={idx}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
          />
        ))}
      </div>
    </div>
  );
}
