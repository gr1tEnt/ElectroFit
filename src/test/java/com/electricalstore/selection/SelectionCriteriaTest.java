package com.electricalstore.selection;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

class SelectionCriteriaTest {

    @Test
    void bedroom_requiresIp20() {
        SelectionCriteria criteria = SelectionCriteria.from("BEDROOM", false, false);
        assertThat(criteria.minIpRating()).isEqualTo(20);
        assertThat(criteria.requireChildProtection()).isFalse();
        assertThat(criteria.lowVoltageOnly()).isFalse();
    }

    @Test
    void kidsRoom_requiresChildProtection() {
        SelectionCriteria criteria = SelectionCriteria.from("KIDS_ROOM", false, false);
        assertThat(criteria.minIpRating()).isEqualTo(20);
        assertThat(criteria.requireChildProtection()).isTrue();
    }

    @Test
    void hasChildren_addsChildProtection() {
        SelectionCriteria criteria = SelectionCriteria.from("LIVING_ROOM", false, true);
        assertThat(criteria.minIpRating()).isEqualTo(20);
        assertThat(criteria.requireChildProtection()).isTrue();
    }

    @Test
    void bathroomZone3_requiresIp44() {
        SelectionCriteria criteria = SelectionCriteria.from("BATHROOM", false, false);
        assertThat(criteria.minIpRating()).isEqualTo(44);
        assertThat(criteria.lowVoltageOnly()).isFalse();
    }

    @Test
    void bathroomNearWater_requiresLowVoltageOnly() {
        SelectionCriteria criteria = SelectionCriteria.from("BATHROOM", true, false);
        assertThat(criteria.lowVoltageOnly()).isTrue();
        assertThat(criteria.minIpRating()).isZero();
    }

    @Test
    void outdoor_requiresIp54() {
        SelectionCriteria criteria = SelectionCriteria.from("OUTDOOR", false, false);
        assertThat(criteria.minIpRating()).isEqualTo(54);
    }

    @Test
    void unknownRoomType_throws() {
        assertThatThrownBy(() -> SelectionCriteria.from("ATTIC", false, false))
                .isInstanceOf(IllegalArgumentException.class);
    }
}
