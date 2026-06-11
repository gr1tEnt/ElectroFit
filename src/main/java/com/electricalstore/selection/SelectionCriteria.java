package com.electricalstore.selection;

public record SelectionCriteria(
        int minIpRating,
        boolean requireChildProtection,
        boolean lowVoltageOnly
) {

    public static SelectionCriteria from(String roomType, boolean nearWater, boolean hasChildren) {
        String room = roomType == null ? "" : roomType.trim().toUpperCase();

        int minIp = 0;
        boolean requireChildProtection = false;
        boolean lowVoltageOnly = false;

        switch (room) {
            case "BEDROOM", "LIVING_ROOM" -> minIp = 20;
            case "KIDS_ROOM" -> {
                minIp = 20;
                requireChildProtection = true;
            }
            case "BATHROOM" -> {
                if (nearWater) {
                    lowVoltageOnly = true;
                } else {
                    minIp = 44;
                }
            }
            case "KITCHEN" -> minIp = 44;
            case "OUTDOOR", "GARAGE" -> minIp = 54;
            default -> throw new IllegalArgumentException("Unknown room type: " + roomType);
        }

        if (hasChildren) {
            requireChildProtection = true;
            minIp = Math.max(minIp, 20);
        }

        return new SelectionCriteria(minIp, requireChildProtection, lowVoltageOnly);
    }
}
