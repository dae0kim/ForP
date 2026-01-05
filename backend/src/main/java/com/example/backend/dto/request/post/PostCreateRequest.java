package com.example.backend.dto.request.post;

import com.example.backend.domain.User;
import com.example.backend.domain.Post;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

// 게시글 작성 요청 DTO
@Getter
@Setter // DTO 만들고 있으면 Setter도 들어가야함
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostCreateRequest {

    @NotBlank(message = "제목 필수")
    @Size(max = 200, message = "제목은 200자 이내로 작성하세요")
    private String title; // 이건 id로

    @NotBlank(message = "내용 필수")
    private String content;
    private String imageUrl; // 이것도 시험에서는 필요없음

    // 요청 DTO -> Post entity로 변환
    public Post toEntity(User user) {
        return Post.builder()
                .user(user) // 작성자
                .title(title)
                .content(content)
                .imageUrl(imageUrl)
                .build();
        // 회원 수정이 들어가게 되면 이 안의 내용들도 수정 들어감
    }
}

