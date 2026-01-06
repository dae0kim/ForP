package com.example.backend.dto.request.MyPage;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NicknameUpdateRequest {

    // 닉네임 수정
    @NotBlank(message = "닉네임은 필수 입니다.")
    @Size(min = 2, max = 20, message = "닉네임은 2~20자여야 합니다.")
    @Pattern(regexp = "^[A-Za-z0-9가-힣]{2,20}$", message = "닉네임은 한글/영문/숫자만 가능합니다.")
    private String nickname;
}
