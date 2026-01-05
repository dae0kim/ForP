package com.example.backend.controller;

import com.example.backend.dto.request.post.PostCreateRequest;
import com.example.backend.dto.request.post.PostUpdateRequest;
import com.example.backend.dto.response.common.PageResponse;
import com.example.backend.dto.response.post.PostDetailResponse;
import com.example.backend.dto.response.post.PostListResponse;
import com.example.backend.service.PostService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 게시글 등록 (회원만)
    @PostMapping
    public ResponseEntity<PostDetailResponse> create(
            @Valid @RequestBody PostCreateRequest request,
            @AuthenticationPrincipal Long memberId
    ) {
        return ResponseEntity.ok(postService.createPost(memberId, request));
    }

    // 게시글 목록 조회 + 페이징 + 검색
    // GET /api/posts?page=0&size=10&keyword=검색어
    @GetMapping
    public ResponseEntity<PageResponse<PostListResponse>> list(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(postService.getPostList(page, size, keyword));
    }

    // 게시글 상세 조회 + 조회수 증가
    @GetMapping("/{id}")
    public ResponseEntity<PostDetailResponse> detail(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostDetail(id));
    }

    // 게시글 수정 (회원만)
    @PutMapping("/{id}")
    public ResponseEntity<PostDetailResponse> update(
            @PathVariable Long id,
            @RequestBody PostUpdateRequest request,
            @AuthenticationPrincipal Long memberId
    ) {
        return ResponseEntity.ok(postService.updatePost(memberId, id, request));
    }

    // 게시글 삭제 (회원만)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal Long memberId
    ) {
        postService.deletePost(memberId, id);
        return ResponseEntity.noContent().build();
    }
}
