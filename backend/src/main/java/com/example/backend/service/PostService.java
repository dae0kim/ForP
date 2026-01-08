package com.example.backend.service;

import com.example.backend.dto.request.post.PostCreateRequest;
import com.example.backend.dto.request.post.PostUpdateRequest;
import com.example.backend.dto.response.common.PageResponse;
import com.example.backend.dto.response.post.PostDetailResponse;
import com.example.backend.dto.response.post.PostListResponse;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.jspecify.annotations.Nullable;


// 설계(규칙)
public interface PostService {

    // 게시글 작성
    PostDetailResponse createPost(Long memberId, PostCreateRequest request);

    // 게시글 목록 조회 + 검색 + 페이징
    PageResponse<PostListResponse> getPostList(int page, int size, String keyword, Boolean mine, Long memberId);

    // 게시글 상세 조회 + 조회수 증가
    PostDetailResponse getPostDetail(Long id);

    // 게시글 수정
    PostDetailResponse updatePost(Long memberId, Long id, PostUpdateRequest request);

    // 게시글 삭제
    void deletePost(Long memberId, Long id);
}

