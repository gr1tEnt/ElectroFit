export type RoomId = "BATHROOM" | "KITCHEN" | "BEDROOM" | "KIDS_ROOM" | "OUTDOOR";

export interface RoomOption {
  id: RoomId;
  label: string;
  description: string;
}

export const ROOM_OPTIONS: RoomOption[] = [
  {
    id: "BATHROOM",
    label: "Bathroom",
    description: "Wet areas with zone-specific rules",
  },
  {
    id: "KITCHEN",
    label: "Kitchen",
    description: "Splash-prone work surfaces",
  },
  {
    id: "BEDROOM",
    label: "Bedroom",
    description: "Standard dry living spaces",
  },
  {
    id: "KIDS_ROOM",
    label: "Kids room",
    description: "Child-safe protection required",
  },
  {
    id: "OUTDOOR",
    label: "Outdoor",
    description: "Weather-exposed installations",
  },
];

export const ROOM_LABELS: Record<RoomId, string> = {
  BATHROOM: "Bathroom",
  KITCHEN: "Kitchen",
  BEDROOM: "Bedroom",
  KIDS_ROOM: "Kids room",
  OUTDOOR: "Outdoor",
};
