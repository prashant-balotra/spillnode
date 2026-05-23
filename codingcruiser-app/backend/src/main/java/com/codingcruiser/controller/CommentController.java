package com.codingcruiser.controller;

import com.codingcruiser.dto.CommentRequest;
import com.codingcruiser.model.Comment;
import com.codingcruiser.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> listByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.listByPost(postId));
    }

    @PostMapping("/post/{postId}")
    public ResponseEntity<Comment> add(@PathVariable Long postId,
                                       @Valid @RequestBody CommentRequest req,
                                       @AuthenticationPrincipal UserDetails user) {
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(commentService.add(postId, user.getUsername(), req));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(@PathVariable Long commentId,
                                       @AuthenticationPrincipal UserDetails user) {
        if (user == null) return ResponseEntity.status(401).build();
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        commentService.delete(commentId, user.getUsername(), isAdmin);
        return ResponseEntity.noContent().build();
    }
}
