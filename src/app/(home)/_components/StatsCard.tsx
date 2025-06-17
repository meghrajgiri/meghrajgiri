import React from "react";

type StatsCardProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
};

export default function StatsCard({ icon, value, label }: StatsCardProps) {
  return (
    <div className="flex min-w-[300px] items-center justify-between rounded-2xl bg-white-100 p-6 shadow sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-auto">
      <div className="flex">
        <div>{icon}</div>
        <div className="ml-2">
          <div className="text-2xl font-semibold text-[#223344]">{value}</div>
        </div>
      </div>
      <div>{label && <div className="text-gray-500">{label}</div>}</div>
    </div>
  );
}
