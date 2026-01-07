package com.example.backend.service.impl;

import com.example.backend.domain.User;
import com.example.backend.dto.response.UserMyPageResponse;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.FileService;
import com.example.backend.service.UserMyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class UserMyPageServiceImpl implements UserMyPageService {

    private final UserRepository userRepository;
    private final FileService fileService;

    // 회원 정보 조회
    @Override
    @Transactional(readOnly = true)
    public UserMyPageResponse getMyInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        return UserMyPageResponse.from(user);
    }

    // 닉네임 수정
    @Override
    public UserMyPageResponse updateNickname(Long userId, String nickname) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        user.updateNickname(nickname);

        // dirty checking으로 DB 반영
        return UserMyPageResponse.from(user);
    }

    // 프로필 사진 변경
    @Override
    public UserMyPageResponse updateProfileImage(Long userId, MultipartFile image) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        // 1. 기존 이미지 삭제 (외부 URL인 경우 제외)
        String oldImageUrl = user.getProfileImage();
        if (oldImageUrl != null && !oldImageUrl.startsWith("http")) { // http로 시작하지 않을 때만 삭제 실행
            fileService.deleteImage(oldImageUrl);
        }

        // 2. 새 이미지 저장 로직...
        String newImageUrl = fileService.saveImage(image);
        user.updateProfileImage(newImageUrl);

        return UserMyPageResponse.from(user);
    }

}
