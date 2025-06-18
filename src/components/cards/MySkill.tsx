type SkillCard = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function MySkill({ icon, title, description }: SkillCard) {
  return (
    <div className="bg-white flex min-h-[220px] flex-col rounded-2xl p-3 text-left shadow transition hover:shadow-lg">
      <div className="mb-4 flex items-start justify-start">
        <span className="inline-flex items-center justify-center rounded-full bg-gray-100">
          {icon}
        </span>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-[#223344]">{title}</h3>
      <p className="text-base text-gray-500">{description}</p>
    </div>
  );
}
