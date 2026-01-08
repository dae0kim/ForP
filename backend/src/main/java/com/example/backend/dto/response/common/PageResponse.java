package com.example.backend.dto.response.common;

import lombok.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageResponse<T> {

    private List<T> content;
    private int page;
    private int size;
    private long totalElement;
    private int totalPages;

    public static <E,D> PageResponse<D> from(Page<E> page, Function<E,D> mapper) {
        List<D> content = page.getContent().stream()
                .map(mapper)
                .toList();

        return PageResponse.<D>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElement(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }


}



