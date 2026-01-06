package com.example.backend.service;

import com.example.backend.dto.response.UserMyPageResponse;

public interface  UserMyPageService {
    // 회원 정보 조회
    UserMyPageResponse getMyInfo(Long userId);

    // 닉네임 수정
    UserMyPageResponse updateNickname(Long userId, String nickname);

}
