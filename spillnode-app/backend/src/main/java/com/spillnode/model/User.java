package com.spillnode.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.USER;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Many-to-Many with Post.
     * @JsonIgnore — prevents Jackson infinite-recursion when serializing
     * Post.author (which would try to serialize User.likedPosts → Post → author → ...)
     * and avoids returning a giant nested payload on every post response.
     */
    @JsonIgnore
    /**
     * Many-to-Many with Post.
     * @JsonIgnore — prevents Jackson infinite-recursion when serializing
     * Post.author (which would try to serialize User.likedPosts → Post → author → ...)
     * and avoids returning a giant nested payload on every post response.
     */
    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "user_liked_posts",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "post_id")
    )
    @Builder.Default
    private Set<Post> likedPosts = new HashSet<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
