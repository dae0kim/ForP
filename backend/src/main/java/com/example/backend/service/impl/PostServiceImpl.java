package com.example.backend.service.impl;

import com.example.backend.domain.Post;
import com.example.backend.domain.User;
import com.example.backend.dto.request.post.PostCreateRequest;
import com.example.backend.dto.request.post.PostUpdateRequest;
import com.example.backend.dto.response.common.PageResponse;
import com.example.backend.dto.response.post.PostDetailResponse;
import com.example.backend.dto.response.post.PostListResponse;
import com.example.backend.repository.PostCommentRepository;
import com.example.backend.repository.PostRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.FileService;
import com.example.backend.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final FileService fileService;
    private final UserRepository userRepository;
    private final PostCommentRepository postCommentRepository;

    // 로그인 여부 체크
    private void loginCheck(Long memberId) {
        if (memberId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다");
        }
    }

    // 게시글 작성
    @Override
    public PostDetailResponse createPost(Long memberId, PostCreateRequest request) {
        loginCheck(memberId);

        User user = userRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다"));

        Post post = request.toEntity(user);

        Post saved = postRepository.save(post);

        return PostDetailResponse.from(saved);
    }

    // 게시글 목록 조회 + 검색 + 페이징
    @Transactional(readOnly = true)
    @Override
    public PageResponse<PostListResponse> getPostList(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Post> postPage = findPostPage(keyword, pageable);
        return PageResponse.from(postPage, PostListResponse::from);
    }

    private Page<Post> findPostPage(String keyword, Pageable pageable) {
        if (keyword == null || keyword.isBlank()) {
            return postRepository.findAll(pageable);
        }
        return postRepository.findByTitleContainingIgnoreCaseOrContentContaining(keyword, keyword, pageable);
    }

    // 게시글 상세 조회 + 조회수 증가
    @Override
    public PostDetailResponse getPostDetail(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 글이 없습니다"));

        post.increaseReadCount(); // @Transactional이라 dirty checking으로 반영됨

        return PostDetailResponse.from(post);
    }

    // 게시글 수정 (회원만)
    @Override
    public PostDetailResponse updatePost(Long memberId, Long id, @Valid PostUpdateRequest request) {
        loginCheck(memberId);

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 글이 없습니다"));

        // 작성자 검증
        if (!post.getUser().getId().equals(memberId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "게시글 수정 권한이 없습니다");
        }

        post.update(request.getTitle(), request.getContent(), request.getImageUrl());

        // post는 영속 상태라 save() 없이도 반영되지만, 명확히 하려면 save 유지해도 OK
        return PostDetailResponse.from(postRepository.save(post));
    }

    // 게시글 삭제
    @Override
    public void deletePost(Long memberId, Long id) {
        loginCheck(memberId);

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "게시글 찾을 수 없음"));

        // 작성자 검증
        if (!post.getUser().getId().equals(memberId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "게시글 삭제 권한이 없습니다");
        }

        // 댓글 먼저 삭제
        postCommentRepository.deleteByPostId(id);

        // 이미지 URL이 없으면 삭제 호출하지 않도록 방어
        if (post.getImageUrl() != null && !post.getImageUrl().isBlank()) {
            fileService.deleteImage(post.getImageUrl());
        }

        postRepository.delete(post);
    }
}
