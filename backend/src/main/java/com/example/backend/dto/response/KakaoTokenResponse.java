package com.example.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class KakaoTokenResponse {

    @JsonProperty("access_token")
    private String accessToken;
}
