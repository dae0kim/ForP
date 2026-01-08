package com.example.backend.controller;

import com.example.backend.dto.request.MyPage.PetCreateRequest;
import com.example.backend.dto.request.MyPage.PetUpdateRequest;
import com.example.backend.dto.response.UserPetResponse;
import com.example.backend.service.UserPetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pets")
public class UserPetController {

    private final UserPetService petService;

    private Long userId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new RuntimeException("Unauthorized");
        }
        return (Long) auth.getPrincipal();
    }

    // 생성
    @PostMapping
    public UserPetResponse create(@Valid @RequestBody PetCreateRequest request) {
        return petService.create(userId(), request);
    }

    // 조회
    @GetMapping
    public List<UserPetResponse> myPets() {
        return petService.findMyPets(userId());
    }

    // 단건 조회 (수정 페이지에서 사용)
    @GetMapping("/{petId}")
    public UserPetResponse getOne(@PathVariable Long petId) {
        return petService.findMyPet(userId(), petId);
    }

    // 수정
    @PutMapping("/{petId}")
    public UserPetResponse update(
            @PathVariable Long petId,
            @Valid @RequestBody PetUpdateRequest request
            ){
        return petService.update(userId(), petId, request);
    }

    // 삭제
    @DeleteMapping("/{petId}")
    public void delete(@PathVariable Long petId) {
        petService.delete(userId(), petId);
    }
}
