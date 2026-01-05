package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "pet")
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "pet_seq_gen")
    @SequenceGenerator(
            name = "pet_seq_gen",
            sequenceName = "PET_SEQ",
            allocationSize = 1
    )
    private Long petId;

    // 반려동물 주인
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 반려동물 이름
    @Column(nullable = false, length = 100)
    private String name;

    // 반려동물 종 (강아지, 고양이 등)
    @Column(nullable = false, length = 100)
    private String species;

    // 반려동물 품종
    @Column(length = 100)
    private String breed;

    // 성별 (남, 여, 중성)
    @Column(nullable = false, length = 20)
    private String gender;

    // 체중
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal weight;

    // 이미지
    @Column(name = "image_url", length = 500, nullable = false)
    private String imageUrl;

    // 등록일
    @CreationTimestamp
    @Column(name = "rgst_date", nullable = false, updatable = false)
    private LocalDateTime rgstDate;

    // 수정일
    @UpdateTimestamp
    @Column(name = "updt_date")
    private LocalDateTime updtDate;

    // 도메인 메서드 ============

    // 생성
    public static Pet create(
            User user,
            String name,
            String species,
            String breed,
            String gender,
            BigDecimal weight,
            String imageUrl
    ) {
        return Pet.builder()
                .user(user)
                .name(name)
                .species(species)
                .breed(breed)
                .gender(gender)
                .weight(weight)
                .imageUrl(imageUrl)
                .build();
    }

    // 수정
    public void update(
            String name,
            String species,
            String breed,
            String gender,
            BigDecimal weight,
            String imageUrl
    ) {
        this.name = name;
        this.species = species;
        this.breed = breed;
        this.gender = gender;
        this.weight = weight;
        this.imageUrl = imageUrl;
    }
}

