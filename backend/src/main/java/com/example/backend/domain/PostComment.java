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
@Table(name = "post_comment")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostComment {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "post_comment_seq_gen")
    @SequenceGenerator(
            name = "post_comment_seq_gen",
            sequenceName = "POST_COMMENT_SEQ",
            allocationSize = 1
    )
    @Column(name = "comment_id")
    private Long id;

    // 회원 1 : 댓글 N
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 댓글 N개 : 1개 게시글
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(name = "content", nullable = false, length = 1000)
    private String content;

    @CreationTimestamp
    @Column(name = "rgst_date", nullable = false, updatable = false)
    private LocalDateTime rgstDate;

    @UpdateTimestamp
    @Column(name = "updt_date")
    private LocalDateTime updtDate;

    // 댓글 수정 메서드
    public void updateContent(String content) {
        this.content = content;
    }

}

