package com.example.backend.dto.response.comment;

import com.example.backend.domain.PostComment;
import com.example.backend.dto.response.common.MemberResponse;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class PostCommentResponse {
    private Long id; // 아이디
    private String content; // 내용
    private LocalDateTime createdAt; // 작성일
    private LocalDateTime updateAt; // 수정일
    private MemberResponse author;

    // Entity -> DTO
    public static PostCommentResponse from(PostComment comment) {
        return PostCommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(MemberResponse.from(comment.getUser())) // 작성자 매핑
                .createdAt(comment.getCreatedAt())
                .updateAt(comment.getUpdatedAt())
                .build();
    }

}