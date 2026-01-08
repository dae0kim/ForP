package com.example.backend.controller;

import com.example.backend.dto.request.comment.PostCommentCreateRequest;
import com.example.backend.dto.request.comment.PostCommentUpdateRequest;
import com.example.backend.dto.response.comment.PostCommentResponse;
import com.example.backend.service.PostCommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts/{postId}/comments")
public class PostCommentController {

    private final PostCommentService postCommentService;

    // 댓글 조회
    @GetMapping
    public ResponseEntity<List<PostCommentResponse>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(postCommentService.getComments(postId));
    }

    // 댓글 작성
    @PostMapping
    public ResponseEntity<PostCommentResponse> create(
            @PathVariable Long postId,
            @Valid @RequestBody PostCommentCreateRequest request,
            @AuthenticationPrincipal Long memberId
    ) {
        return ResponseEntity.ok(postCommentService.create(memberId, postId, request));
    }

    // 댓글 수정
    @PutMapping("/{commentId}")
    public ResponseEntity<PostCommentResponse> update(
            @PathVariable Long commentId,
            @Valid @RequestBody PostCommentUpdateRequest request,
            @AuthenticationPrincipal Long memberId
    ) {
        PostCommentResponse response = postCommentService.update(memberId, commentId, request);
        return ResponseEntity.ok(response);
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long commentId,
            @AuthenticationPrincipal Long memberId) {
        postCommentService.delete(memberId, commentId);
        return ResponseEntity.noContent().build();
    }
}
