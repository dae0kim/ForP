package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "post")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {
    
    @Id // 기본키
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long id;

    // 회원 1 : 게시글 N
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false) // 외래키로 멤버 아이디를 설정
    private User user;

    // 제목, 필수값
    @Column(name="title", nullable = false, length = 200)
    private String title;

    // 내용, 필수값
    @Lob
    @Column(name="content", nullable = false)
    private String content;

    // 이미지, DB에 경로만 저장
    @Column(name="image_url", length = 500)
    private String imageUrl;

    // 조회수
    @Column(name="read_count", nullable = false)
    private Integer readCount;

    // 작성일
    @CreationTimestamp
    @Column(name="created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 수정일
    @UpdateTimestamp
    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void preCount() {
        if(readCount == null) readCount = 0;
    }

    // 조회수 증가 메서드
    public void increaseReadCount() {
        this.readCount++;
    }

    // 업데이트 메서드
    public void update(String title, String content, String imageUrl) {
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
    }

}
