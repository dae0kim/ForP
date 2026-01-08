package com.example.backend.dto.response;

import com.example.backend.domain.Pet;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPetResponse {

    private Long petId;
    private String name;
    private String species;
    private String breed;
    private String gender;
    private BigDecimal weight;
    private String imageUrl;

    public static UserPetResponse from(Pet pet) {
        return new UserPetResponse(
                pet.getPetId(),
                pet.getName(),
                pet.getSpecies(),
                pet.getBreed(),
                pet.getGender(),
                pet.getWeight(),
                pet.getImageUrl()
        );
    }
}
