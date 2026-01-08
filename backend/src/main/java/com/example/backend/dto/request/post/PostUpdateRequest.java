package com.example.backend.dto.request.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

// 게시글 수정 요청 DTO
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostUpdateRequest {

    @NotBlank(message = "제목 필수")
    @Size(max = 200, message = "제목은 200자 이내로 작성하세요")
    private String title;

    @NotBlank(message = "내용 필수")
    private String content;

    // 수정 시에도 현재 본문에 남아있는 이미지 URL 리스트를 받음
    private List<String> imageUrls;

}
