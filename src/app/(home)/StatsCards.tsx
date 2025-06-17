import React from "react";

type Stat = {
  icon: React.ReactNode;
  value: React.ReactNode;
  label?: string;
};

type StatsCardsProps = {
  stats: Stat[];
};

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-6 rounded-xl border-2 border-white-100 p-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="flex min-w-[300px] items-center justify-between rounded-2xl bg-white-100 p-6 shadow sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-auto"
        >
          <div className="flex">
            <div>{stat.icon}</div>
            <div className="ml-2">
              <div className="text-2xl font-semibold text-[#223344]">
                {stat.value}
              </div>
            </div>
          </div>
          <div>
            {stat.label && <div className="text-gray-500">{stat.label}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
