package com.codingcruiser.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "newsletter_subscribers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NewsletterSubscriber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, updatable = false)
    private LocalDateTime subscribedAt;

    @PrePersist
    public void prePersist() {
        this.subscribedAt = LocalDateTime.now();
    }
}
