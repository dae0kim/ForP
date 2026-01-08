package com.example.backend.service;

import com.example.backend.dto.response.UserMyPageResponse;
import org.springframework.web.multipart.MultipartFile;

public interface  UserMyPageService {
    // 회원 정보 조회
    UserMyPageResponse getMyInfo(Long userId);

    // 닉네임 수정
    UserMyPageResponse updateNickname(Long userId, String nickname);

    // 프로필 사진 수정
    UserMyPageResponse updateProfileImage(Long id, MultipartFile image);
}
