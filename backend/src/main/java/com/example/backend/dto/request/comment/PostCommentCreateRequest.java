package com.example.backend.dto.request.comment;

import com.example.backend.domain.User;
import com.example.backend.domain.Post;
import com.example.backend.domain.PostComment;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

// 댓글 작성 요청 DTO
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostCommentCreateRequest {

    @NotBlank(message = "댓글 내용을 입력하세요")
    private String content;

    // DTO -> Entity
    public PostComment toEntity(Post post, User user) {
        return PostComment.builder()
                .post(post)
                .user(user)
                .content(content)
                .build();
    }
}