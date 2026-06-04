package com.electricalstore.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "technical_specs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TechnicalSpec {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(name = "ip_rating", nullable = false)
    private IpRating ipRating;

    @Column(name = "max_amps", nullable = false)
    private Integer maxAmps;

    @Column(name = "has_child_protection", nullable = false)
    private boolean hasChildProtection;

    @Column(name = "has_grounding", nullable = false)
    private boolean hasGrounding;

    @Column(name = "frame_posts_count")
    private Integer framePostsCount;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "technical_spec_room_compatibility",
            joinColumns = @JoinColumn(name = "technical_spec_id"))
    @Column(name = "room_type")
    @Builder.Default
    private List<String> compatibleRoomTypes = new ArrayList<>();
}
