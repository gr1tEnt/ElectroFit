import { RoomIcon } from "@/components/smart-select/RoomIcon";
import type { RoomId } from "@/types/smartSelect";
import Link from "next/link";

const environments: {
  room: RoomId;
  title: string;
  badge: string;
  description: string;
  tint: string;
  iconBg: string;
  href: string;
}[] = [
  {
    room: "BATHROOM",
    title: "Bathroom",
    badge: "IP44+",
    description: "Wet rooms, protection against water splashes.",
    tint: "hover:border-sky-200 hover:bg-sky-50/80",
    iconBg: "bg-sky-100 text-sky-700 group-hover:bg-sky-600 group-hover:text-white",
    href: "/smart-select?room=BATHROOM",
  },
  {
    room: "BEDROOM",
    title: "Living Room",
    badge: "IP20",
    description: "Standard dry rooms, focus on design and child-safety.",
    tint: "hover:border-violet-200 hover:bg-violet-50/80",
    iconBg: "bg-violet-100 text-violet-700 group-hover:bg-violet-600 group-hover:text-white",
    href: "/smart-select?room=BEDROOM",
  },
  {
    room: "KITCHEN",
    title: "Kitchen",
    badge: "IP44",
    description: "Protection against oil, grease, and water splashes.",
    tint: "hover:border-amber-200 hover:bg-amber-50/80",
    iconBg: "bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white",
    href: "/smart-select?room=KITCHEN",
  },
  {
    room: "OUTDOOR",
    title: "Outdoor",
    badge: "IP54+",
    description: "Heavy-duty protection against dust, rain, and extreme temperatures.",
    tint: "hover:border-emerald-200 hover:bg-emerald-50/80",
    iconBg: "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white",
    href: "/smart-select?room=OUTDOOR",
  },
];

export function HomeEnvironmentsSection() {
  return (
    <section className="border-t border-border bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-ink">Choose by Operating Conditions</h2>
          <p className="mt-3 text-muted">Select your room type to see safe options</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {environments.map((env) => (
            <Link
              key={env.room}
              href={env.href}
              className={`group flex flex-col rounded-2xl border border-border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${env.tint}`}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${env.iconBg}`}
                >
                  <RoomIcon room={env.room} className="h-7 w-7" />
                </span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 transition-colors group-hover:bg-white">
                  {env.badge}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">{env.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{env.description}</p>
              <span className="mt-4 text-sm font-medium text-brand-600 transition-colors group-hover:text-brand-700">
                View safe options →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
