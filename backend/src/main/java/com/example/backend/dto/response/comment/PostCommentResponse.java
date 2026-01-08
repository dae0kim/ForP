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
    private Long id;
    private String content;
    private LocalDateTime rgstDate;
    private LocalDateTime updtDate;
    private MemberResponse author;

    // Entity -> DTO
    public static PostCommentResponse from(PostComment comment) {
        return PostCommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .author(MemberResponse.from(comment.getUser()))
                .rgstDate(comment.getRgstDate())
                .updtDate(comment.getUpdtDate())
                .build();
    }

}