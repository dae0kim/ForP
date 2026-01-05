package com.example.backend.dto.response;

import lombok.Builder;
import lombok.Getter;

// 카카오 로그인 연동 결과 확인용, 추후 삭제 또는 병합 예정
@Getter
@Builder
public class UserResponse {
    private Long id;
    private String nickname;
    private String profileImage;
    private String provider;
}