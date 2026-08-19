package com.civicpulse.model.entity;

import com.civicpulse.model.enums.PriorityLevel;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "complaint_categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_name")
    private String iconName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "default_dept_id")
    private Department defaultDepartment;

    @Enumerated(EnumType.STRING)
    @Column(name = "default_priority")
    @Builder.Default
    private PriorityLevel defaultPriority = PriorityLevel.MEDIUM;

    @Column(name = "sla_hours")
    @Builder.Default
    private Integer slaHours = 48;

    @Column(name = "category_weight")
    @Builder.Default
    private BigDecimal categoryWeight = BigDecimal.valueOf(1.0);

    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;

    @Builder.Default
    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
