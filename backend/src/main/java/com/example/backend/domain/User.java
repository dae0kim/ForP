package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_seq_gen")
    @SequenceGenerator(
            name = "users_seq_gen",
            sequenceName = "USERS_SEQ",
            allocationSize = 1
    )
    private Long id;

    // 소셜 로그인 제공자 식별값
    @Column(nullable = false)
    private String provider;

    // 소셜 로그인 사용자 식별값
    @Column(nullable = false)
    private String providerId;

    // 사용자 닉네임
    private String nickname;

    // 가입일
    @CreationTimestamp
    @Column(name = "rgst_date", nullable = false, updatable = false)
    private LocalDateTime rgstDate;

    // 수정일
    // update 실행시 자동으로 현재 시간으로 갱신
    @UpdateTimestamp
    @Column(name = "updt_date")
    private LocalDateTime updtDate;

}
