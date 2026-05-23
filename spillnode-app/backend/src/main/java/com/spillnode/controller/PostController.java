package com.spillnode.controller;

import com.spillnode.dto.PostRequest;
import com.spillnode.model.Post;
import com.spillnode.service.PostService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<Page<Post>> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(postService.list(q, category, page, size));
    }

    @GetMapping("/featured")
    public ResponseEntity<Page<Post>> featured(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(postService.featured(page, size));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<Post>> trending() {
        return ResponseEntity.ok(postService.trending());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Post> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(postService.getBySlugAndIncrementViews(slug));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Post> create(@Valid @RequestBody PostRequest req,
                                       @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(postService.create(req, user.getUsername()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Post> update(@PathVariable Long id,
                                       @Valid @RequestBody PostRequest req) {
        return ResponseEntity.ok(postService.update(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Post> toggleLike(@PathVariable Long id,
                                           @AuthenticationPrincipal UserDetails user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(postService.toggleLike(id, user.getUsername()));
    }
}
