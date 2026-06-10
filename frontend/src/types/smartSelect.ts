export type RoomId = "BATHROOM" | "KITCHEN" | "BEDROOM" | "KIDS_ROOM" | "OUTDOOR";

export interface RoomOption {
  id: RoomId;
  label: string;
  description: string;
}

export const ROOM_OPTIONS: RoomOption[] = [
  {
    id: "BATHROOM",
    label: "Ванна кімната",
    description: "Вологі зони з правилами для окремих ділянок",
  },
  {
    id: "KITCHEN",
    label: "Кухня",
    description: "Робочі поверхні, схильні до бризок",
  },
  {
    id: "BEDROOM",
    label: "Спальня",
    description: "Стандартні сухі житлові приміщення",
  },
  {
    id: "KIDS_ROOM",
    label: "Дитяча кімната",
    description: "Потрібен захист від дітей",
  },
  {
    id: "OUTDOOR",
    label: "На відкритому повітрі",
    description: "Монтаж у відкритих умовах",
  },
];

export const ROOM_LABELS: Record<RoomId, string> = {
  BATHROOM: "Ванна кімната",
  KITCHEN: "Кухня",
  BEDROOM: "Спальня",
  KIDS_ROOM: "Дитяча кімната",
  OUTDOOR: "На відкритому повітрі",
};
