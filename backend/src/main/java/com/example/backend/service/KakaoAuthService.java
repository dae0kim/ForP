package com.example.backend.service;

import com.example.backend.config.JwtProvider;
import com.example.backend.config.KakaoAuthConfig;
import com.example.backend.domain.User;
import com.example.backend.dto.response.KakaoTokenResponse;
import com.example.backend.dto.response.KakaoUserResponse;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class KakaoAuthService {
    private final KakaoAuthConfig kakaoConfig;
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    @Transactional
    public String kakaoLogin(String code) {

        // Access Token 요청
        String accessToken = getAccessToken(code);

        // 사용자 정보 요청
        KakaoUserResponse kakaoUser = getKakaoUser(accessToken);

        // 회원 조회 or 가입
        User user = userRepository
                .findByProviderAndProviderId("KAKAO", kakaoUser.getId().toString())
                .orElseGet(() ->
                        userRepository.save(
                                User.builder()
                                        .provider("KAKAO")
                                        .providerId(kakaoUser.getId().toString())
                                        .nickname(
                                                kakaoUser.getKakao_account()
                                                        .getProfile()
                                                        .getNickname()
                                        )
                                        .profileImage(
                                                kakaoUser.getKakao_account()
                                                        .getProfile()
                                                        .getProfile_image_url()
                                        )
                                        .build()
                        )
                );

        // JWT 발급
        return jwtProvider.createToken(user.getId());
    }

    private String getAccessToken(String code) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", kakaoConfig.getClientId());
        params.add("client_secret", kakaoConfig.getClientSecret());
        params.add("redirect_uri", kakaoConfig.getRedirectUri());
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request =
                new HttpEntity<>(params, headers);

        ResponseEntity<KakaoTokenResponse> response =
                restTemplate.postForEntity(
                        "https://kauth.kakao.com/oauth/token",  // 카카오 로그인 api 기본 설정
                        request,
                        KakaoTokenResponse.class
                );

        return response.getBody().getAccessToken();
    }

    private KakaoUserResponse getKakaoUser(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<KakaoUserResponse> response =
                restTemplate.exchange(
                        "https://kapi.kakao.com/v2/user/me",
                        HttpMethod.GET,
                        request,
                        KakaoUserResponse.class
                );

        return response.getBody();
    }
}
