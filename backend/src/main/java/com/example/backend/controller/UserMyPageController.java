package com.example.backend.controller;

import com.example.backend.domain.User;
import com.example.backend.dto.request.MyPage.NicknameUpdateRequest;
import com.example.backend.dto.response.UserMyPageResponse;
import com.example.backend.service.UserMyPageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
public class UserMyPageController {

    private final UserMyPageService userMyPageService;

    private Long currentUserId() {
        return (Long) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
    }

    // 회원 정보 조회
    @GetMapping("/me")
    public UserMyPageResponse me() {
        return userMyPageService.getMyInfo(currentUserId());
    }

    // 닉네임 수정
    @PatchMapping("/nickname")
    public UserMyPageResponse updateNickname(@Valid @RequestBody NicknameUpdateRequest request) {
        return userMyPageService.updateNickname(currentUserId(), request.getNickname());
    }

    // 프로필 사진 수정
    @PutMapping(value = "/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserMyPageResponse> updateProfileImage(
            @RequestPart("image") MultipartFile image
    ) {
        UserMyPageResponse updated = userMyPageService.updateProfileImage(currentUserId(), image);
        return ResponseEntity.ok(updated);
    }
}
