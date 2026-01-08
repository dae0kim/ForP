package com.example.backend.dto.request.MyPage;

import com.example.backend.domain.Pet;
import com.example.backend.domain.User;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetCreateRequest {

    @NotBlank(message = "반려동물 이름은 필수입니다.")
    @Size(max = 10, message = "이름은 10자 이하로 입력해주세요.")
    private String name;

    @NotBlank(message = "반려동물 종 입력은 필수입니다.")
    @Size(max = 10, message = "종은 10자 이하로 입력해주세요.")
    private String species;

    @Size(max = 20, message = "품종은 20자 이하로 입력해주세요.")
    private String breed;

    @NotBlank(message = "성별을 선택해주세요.")
    @Pattern(regexp = "^(남|여|중성|없음)$", message = "성별은 남/여/중성/없음 중 하나여야 합니다.")
    private String gender;

    @NotNull(message = "몸무게는 필수입니다.")
    @DecimalMin(value = "0.1", message = "몸무게는 0.1kg 이상이어야 합니다.")
    @DecimalMax(value = "99.99", message = "몸무게는 100kg 미만이어야 합니다.")
    private BigDecimal weight;

    @NotBlank(message = "사진은 필수입니다.")
    private String imageUrl;

    public Pet toEntity(User user) {
        return Pet.builder()
                .user(user)
                .name(name)
                .species(species)
                .breed(breed)
                .gender(gender)
                .weight(weight)
                .imageUrl(imageUrl)
                .build();
    }
}