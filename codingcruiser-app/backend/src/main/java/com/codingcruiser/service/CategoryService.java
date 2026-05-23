package com.codingcruiser.service;

import com.codingcruiser.dto.CategoryRequest;
import com.codingcruiser.model.Category;
import com.codingcruiser.repository.CategoryRepository;
import com.codingcruiser.service.PostService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> list() {
        return categoryRepository.findAll();
    }

    public Category getBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }

    public Category create(CategoryRequest req) {
        if (categoryRepository.existsByName(req.getName())) {
            throw new IllegalStateException("Category already exists");
        }
        Category c = Category.builder()
                .name(req.getName())
                .slug(PostService.slugify(req.getName()))
                .description(req.getDescription())
                .iconName(req.getIconName())
                .colorHex(req.getColorHex())
                .build();
        return categoryRepository.save(c);
    }

    public Category update(Long id, CategoryRequest req) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        c.setName(req.getName());
        c.setSlug(PostService.slugify(req.getName()));
        c.setDescription(req.getDescription());
        c.setIconName(req.getIconName());
        c.setColorHex(req.getColorHex());
        return categoryRepository.save(c);
    }

    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }
}
