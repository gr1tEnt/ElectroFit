import type { RoomId } from "@/types/smartSelect";

interface RoomIconProps {
  room: RoomId;
  className?: string;
}

export function RoomIcon({ room, className = "h-8 w-8" }: RoomIconProps) {
  const props = {
    className: `${className} shrink-0 stroke-current`,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (room) {
    case "BATHROOM":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 14h16M6 14V8a2 2 0 012-2h2v8M14 6h2a2 2 0 012 2v6" />
          <path strokeLinecap="round" d="M8 18v2M16 18v2" />
        </svg>
      );
    case "KITCHEN":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 4v4M10 4v2M14 4v4M18 4v2" />
          <rect x="4" y="8" width="16" height="10" rx="2" strokeLinecap="round" />
          <path strokeLinecap="round" d="M8 14h8" />
        </svg>
      );
    case "BEDROOM":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M6 12V9a3 3 0 016 0v3M14 9a3 3 0 016 0v3" />
          <path strokeLinecap="round" d="M4 18h16" />
        </svg>
      );
    case "KIDS_ROOM":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 20v-1a6 6 0 0112 0v1" />
          <path strokeLinecap="round" d="M9 14h6" />
        </svg>
      );
    case "OUTDOOR":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2M5 12h2M17 12h2M7.8 7.8l1.4 1.4M14.8 14.8l1.4 1.4M7.8 16.2l1.4-1.4M14.8 9.2l1.4-1.4" />
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" d="M4 20h16" />
        </svg>
      );
  }
}
