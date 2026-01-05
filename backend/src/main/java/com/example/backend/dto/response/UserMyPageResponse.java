package com.example.backend.dto.response;

import com.example.backend.domain.Pet;
import com.example.backend.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMyPageResponse {

    private String nickname;
    private LocalDateTime rgstDate;

    public static UserMyPageResponse from(User user) {
        return UserMyPageResponse.builder()
                .nickname(user.getNickname())
                .rgstDate(user.getRgstDate())
                .build();
    }
}
