package com.codingcruiser.service;

import com.codingcruiser.dto.CommentRequest;
import com.codingcruiser.model.Comment;
import com.codingcruiser.model.Post;
import com.codingcruiser.model.User;
import com.codingcruiser.repository.CommentRepository;
import com.codingcruiser.repository.PostRepository;
import com.codingcruiser.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository,
                          PostRepository postRepository,
                          UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public List<Comment> listByPost(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
    }

    public Comment add(Long postId, String email, CommentRequest req) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Comment comment = Comment.builder()
                .content(req.getContent())
                .post(post)
                .user(user)
                .build();
        return commentRepository.save(comment);
    }

    public void delete(Long commentId, String email, boolean isAdmin) {
        Comment c = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        if (!isAdmin && !c.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("Not allowed to delete this comment");
        }
        commentRepository.delete(c);
    }
}
