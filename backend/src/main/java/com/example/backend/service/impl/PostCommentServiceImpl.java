package com.example.backend.service.impl;

import com.example.backend.domain.User;
import com.example.backend.domain.Post;
import com.example.backend.domain.PostComment;
import com.example.backend.dto.request.comment.PostCommentCreateRequest;
import com.example.backend.dto.request.comment.PostCommentUpdateRequest;
import com.example.backend.dto.response.comment.PostCommentResponse;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.PostCommentRepository;
import com.example.backend.repository.PostRepository;
import com.example.backend.service.PostCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PostCommentServiceImpl implements PostCommentService {

    private final PostCommentRepository postCommentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // 로그인 여부
    private void loginCheck(Long memberId) {
        if(memberId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다");
        }
    }

    // 댓글 조회
    @Override
    @Transactional
    public List<PostCommentResponse> getComments(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));

        List<PostComment> comments = postCommentRepository.findByPostOrderByRgstDateAsc(post);

        // DTO 리스트로 변환
        return comments.stream().map(PostCommentResponse::from).toList();
    }

    // 댓글 작성
    @Override
    public PostCommentResponse create(Long memberId, Long postId, PostCommentCreateRequest request) {

        loginCheck(memberId);

        User user = userRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."));

        // DTO -> Entity
        PostComment comment = request.toEntity(post, user);
        PostComment saved = postCommentRepository.save(comment);
        return PostCommentResponse.from(saved);


    }

    // 댓글 수정
    @Override
    public PostCommentResponse update(Long memberId, Long commentId, PostCommentUpdateRequest request) {

        loginCheck(memberId);

        // 댓글 아이디 탐색
        PostComment comment = postCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다"));

        // 작성자 체크
        if(!comment.getUser().getId().equals(memberId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "댓글 수정 권한이 없습니다");

        }

        // 댓글 수정(엔티티가 담당하는)
        comment.updateContent(request.getContent());

        // 수정된 내용으로 반환
        return PostCommentResponse.from(comment);
    }

    // 댓글 삭제
    @Override
    public void delete(Long memberId, Long commentId) {

        loginCheck(memberId);

        // 댓글 아이디 탐색
        PostComment comment = postCommentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다"));

        // 작성자 체크
        if(!comment.getUser().getId().equals(memberId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "댓글 삭제 권한이 없습니다");
        }

        // 삭제
        postCommentRepository.delete(comment);
    }
}