package com.example.backend.service.impl;

import com.example.backend.domain.Post;
import com.example.backend.domain.PostImage;
import com.example.backend.domain.User;
import com.example.backend.dto.request.post.PostCreateRequest;
import com.example.backend.dto.request.post.PostUpdateRequest;
import com.example.backend.dto.response.common.PageResponse;
import com.example.backend.dto.response.post.PostDetailResponse;
import com.example.backend.dto.response.post.PostListResponse;
import com.example.backend.repository.PostCommentRepository;
import com.example.backend.repository.PostImageRepository;
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

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final FileService fileService;
    private final UserRepository userRepository;
    private final PostCommentRepository postCommentRepository;
    private final PostImageRepository postImageRepository;

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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "사용자 정보를 찾을 수 없습니다"));

        Post post = request.toEntity(user);
        Post savedPost = postRepository.save(post);

        // 이미지 매핑 (Quill에서 선업로드된 PostImage들을 찾아 Post와 연결)
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<PostImage> postImages = postImageRepository.findByImageUrlIn(request.getImageUrls());
            for (PostImage image : postImages) {
                savedPost.addImage(image);
            }
        }

        return PostDetailResponse.from(savedPost);
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

        if (!post.getUser().getId().equals(memberId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "수정 권한이 없습니다");
        }

        // 대표 이미지 (리스트의 첫 번째)
        String firstImageUrl = (request.getImageUrls() != null && !request.getImageUrls().isEmpty())
                ? request.getImageUrls().get(0) : null;

        // 기본 정보 업데이트
        post.update(request.getTitle(), request.getContent(), firstImageUrl);

        // 이미지 연관관계 갱신
        if (request.getImageUrls() != null) {
            // 기존 연결을 끊고 새로 들어온 URL들로 재매핑
            List<PostImage> postImages = postImageRepository.findByImageUrlIn(request.getImageUrls());
            post.getImages().clear();
            postImages.forEach(post::addImage);
        }

        return PostDetailResponse.from(post);
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

        // 해당 게시글에 연결된 모든 이미지 파일을 서버에서 삭제
        if (post.getImages() != null) {
            for (PostImage img : post.getImages()) {
                fileService.deleteImage(img.getImageUrl());
            }
        }

        postRepository.delete(post);
    }
}
