package com.spillnode.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank
    private String name;

    private String description;
    private String iconName;
    private String colorHex;
}
