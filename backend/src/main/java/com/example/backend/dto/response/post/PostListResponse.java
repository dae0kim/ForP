package com.example.backend.dto.response.post;

import com.example.backend.domain.Post;
import com.example.backend.dto.response.common.MemberResponse;
import lombok.*;

import java.time.LocalDateTime;

// 게시글 리스트 응답 DTO
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostListResponse {

    private Long id;
    private String title; // 제목
    private MemberResponse author; // 작성자(id, nickname)
    private Integer readCount; // 조회 수
    private LocalDateTime rgstDate; // 작성일
    private String content; // 메인화면 미리보기 출력용
    private String imageUrl; // 메인화면 미리보기 이미지용
    private Integer commentCount; // 메인화면 미리보기 댓글수

    // Post entity -> 리스트 DTO
    public static PostListResponse from(Post post) {
        return PostListResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .author(MemberResponse.from(post.getUser())) // 작성자 매핑
                .readCount(post.getReadCount())
                .rgstDate(post.getRgstDate())
                .content(post.getContent())
                .imageUrl(post.getImages().isEmpty() ? null : post.getImages().get(0).getImageUrl())
                .commentCount(post.getComments() != null ? post.getComments().size() : 0)
                .build();
    }
}
