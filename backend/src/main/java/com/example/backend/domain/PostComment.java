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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long id;

    // 회원 1 : 댓글 N
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false) // 외래키로 멤버 아이디를 설정
    private User user;

    // 댓글 N개 : 1개 게시글
    @ManyToOne(fetch = FetchType.LAZY) //이걸 쓰는 이유가 무엇일까??
    @JoinColumn(name = "post_id", nullable = false) // 1개 게시글 안에 여러개의 댓글이 달려야하는 상황
    private Post post;

    @Column(name = "content", nullable = false, length = 1000)
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "update_at")
    private LocalDateTime updatedAt;

    // 댓글 수정 메서드
    public void updateContent(String content) {
        this.content = content;
    }

}

