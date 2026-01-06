package com.example.backend.dto.response.common;

// 1페이지, 2페이지, 3페이지 페이지네이션 / 페이지마다 게시글 몇 개씩 보이도록 할건지
// 페이징을 위한 공통 DTO
// 게시글, 회원 목록, 댓글 목록...

import com.example.backend.domain.Post;
import com.example.backend.dto.response.post.PostListResponse;
import lombok.*;
import org.springframework.data.domain.Page;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageResponse<T> {
    // pageResponse<PostListResponse>, PageResponse<MemberResponse>, PageReponse<CommentResponse>

    private List<T> content; // 리스트 데이터
    private int page;
    private int size;
    private long totalElement;
    private int totalPages;

    // 필드 선언
    // Page<Entity> -> PageResponse<DTO> 변환
    //from(Page<Entity 타입> page, Function<E,DTO 타입> mapper
    public static <E,D> PageResponse<D> from(Page<E> page, Function<E,D> mapper) {
        // .map(mapper) -> Entity -> DTO 변환
        // PostListReponse :: from 변환 함수
        List<D> content = page.getContent().stream()
                .map(mapper)
                .toList();

        return PageResponse.<D>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElement(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }


}



