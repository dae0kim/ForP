package com.example.backend.dto.response.post;

// 페이지 클릭하고 들어갔을 때 모든 정보들이 담긴 DTO , 여기에는 필요한 필드값 다 작성해야함

import com.example.backend.domain.Post;
import com.example.backend.dto.response.common.MemberResponse;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

// 게시글 상세 응답 DTO
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostDetailResponse {

    private Long id;
    private String title;
    private String content;
    private String imageUrl;
    private MemberResponse author; // 작성자(id, nickname)
    private Integer readCount;
    private LocalDateTime rgstDate;
    private LocalDateTime updtDate;

    // Post entity -> 상세 응답 DTO
    public static PostDetailResponse from(Post post) {
        return PostDetailResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .author(MemberResponse.from(post.getUser()))
                .imageUrl(post.getImageUrl())
                .readCount(post.getReadCount())
                .rgstDate(post.getRgstDate())
                .updtDate(post.getUpdtDate())
                .build();
    }
}



