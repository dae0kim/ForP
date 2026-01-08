package com.example.backend.dto.response;

import lombok.Getter;

@Getter
public class KakaoUserResponse {

    private Long id;
    private KakaoAccount kakao_account;

    @Getter
    public static class KakaoAccount {
        private Profile profile;
    }

    @Getter
    public static class Profile {
        private String nickname;
        private String profile_image_url;   // 카카오 JSON 키값과 일치하도록
    }

}
