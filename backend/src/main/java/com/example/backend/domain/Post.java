package com.example.backend.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "post")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {
    
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "post_seq_gen")
    @SequenceGenerator(
            name = "post_seq_gen",
            sequenceName = "POST_SEQ",
            allocationSize = 1
    )
    @Column(name = "post_id")
    private Long id;

    // 회원 1 : 게시글 N
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 제목, 필수값
    @Column(name="title", nullable = false, length = 200)
    private String title;

    // 내용, 필수값
    @Lob
    @Column(name="content", nullable = false)
    private String content;

    // 이미지, DB에 경로만 저장
    @Column(name="image_url", length = 1000)
    private String imageUrl;

    // 조회수
    @Column(name="read_count", nullable = false)
    private Integer readCount;

    // 작성일
    @CreationTimestamp
    @Column(name="rgst_date", nullable = false, updatable = false)
    private LocalDateTime rgstDate;

    // 수정일
    @UpdateTimestamp
    @Column(name="updt_date")
    private LocalDateTime updtDate;

    // 게시글 1 : 이미지 N
    @Builder.Default
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostImage> images = new ArrayList<>();

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

    // 이미지 추가 메서드
    public void addImage(PostImage image) {
        this.images.add(image);
        image.setPost(this);
    }

}
