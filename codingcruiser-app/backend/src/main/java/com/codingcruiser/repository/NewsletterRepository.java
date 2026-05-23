package com.codingcruiser.repository;

import com.codingcruiser.model.NewsletterSubscriber;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsletterRepository extends JpaRepository<NewsletterSubscriber, Long> {
    boolean existsByEmail(String email);
}
