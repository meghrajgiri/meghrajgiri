import { SITE_DATA } from "@/config";
import { ExperienceIcon } from "@/components/icons";
import SectionHeading from "./SectionHeading";

const SkillsSection = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 sm:p-12 lg:p-24">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-purple-500/20 blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 h-48 w-48 rounded-full bg-blue-500/20 blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 h-24 w-24 rounded-full bg-pink-500/20 blur-xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 h-4 w-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-32 h-3 w-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-1/3 h-5 w-5 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-bounce delay-700"></div>
      </div>
      
      <div className="relative z-10">
        <SectionHeading
          title={SITE_DATA.skills.title}
          subTitle={SITE_DATA.skills.subtitle}
          badgeText={SITE_DATA.skills.badge}
          badgeIcon={<ExperienceIcon />}
        />
        <div className="grid grid-cols-1 gap-8 p-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {SITE_DATA.skills.categories.map((category, categoryIdx) => (
            <div
              key={categoryIdx}
              className="space-y-6 transform-gpu transition-all duration-700 hover:scale-105 animate-float"
              style={{
                animationDelay: `${categoryIdx * 200}ms`
              }}
            >
              {/* Category Header */}
              <div className="text-center space-y-3">
                <div className="text-4xl mb-2">{category.icon}</div>
                <h3 className="text-xl font-bold text-white">{category.title}</h3>
              </div>
              
              {/* Skills in Category */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIdx) => (
                  <div
                    key={skillIdx}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-purple-400/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{skill.name}</span>
                      <span className="text-purple-300 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out`}
                        style={{ 
                          width: `${skill.level}%`,
                          animationDelay: `${(categoryIdx * 4 + skillIdx) * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default SkillsSection;
