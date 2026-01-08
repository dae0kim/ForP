package com.example.backend.dto.request.post;

import com.example.backend.domain.User;
import com.example.backend.domain.Post;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

// 게시글 작성 요청 DTO
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostCreateRequest {

    @NotBlank(message = "제목 필수")
    @Size(max = 200, message = "제목은 200자 이내로 작성하세요")
    private String title;

    @NotBlank(message = "내용 필수")
    private String content;

    // 본문의 모든 이미지 URL 받도록
    private List<String> imageUrls;

    public Post toEntity(User user) {
        // 리스트 중 첫 번째 이미지를 대표 이미지(목록용)로 설정
        String firstImageUrl = (imageUrls != null && !imageUrls.isEmpty()) ? imageUrls.get(0) : null;

        return Post.builder()
                .user(user)
                .title(title)
                .content(content)
                .imageUrl(firstImageUrl) // 대표 이미지 저장
                .build();
    }
}

