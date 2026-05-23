package com.codingcruiser.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Set;

@Data
public class PostRequest {
    @NotBlank
    private String title;

    private String excerpt;

    @NotBlank
    private String content;

    private String thumbnailUrl;

    private String youtubeVideoId;

    @NotNull
    private Long categoryId;

    private Set<String> tags;

    private boolean featured;
}
