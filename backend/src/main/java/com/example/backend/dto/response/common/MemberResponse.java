package com.example.backend.dto.response.common;

import com.example.backend.domain.User;
import lombok.*;

/*
게시글, 댓글 작성자 공통 정보 dto
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberResponse {
    private Long id;
    private String nickname;

    // entity -> 작성자 dto
    public static MemberResponse from(User user) {
        if(user == null) return null; // 탈퇴 멤버 확인

        return MemberResponse.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .build();
    }
}
