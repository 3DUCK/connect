import { LucideIcon } from "lucide-react";

interface AppCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
}

export function AppCard({ name, description, icon: Icon, badge }: AppCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-ink/5 hover:shadow-md transition-shadow flex items-start gap-4">
      <div className="bg-mint/30 p-3 rounded-xl text-ink">
        <Icon size={24} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-lg">{name}</h3>
          {badge && (
            <span className="text-[10px] font-bold uppercase tracking-wider bg-signal text-white px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className="text-ink/70 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
