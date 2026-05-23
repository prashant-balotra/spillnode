package com.codingcruiser.service;

import com.codingcruiser.model.NewsletterSubscriber;
import com.codingcruiser.repository.NewsletterRepository;
import org.springframework.stereotype.Service;

@Service
public class NewsletterService {

    private final NewsletterRepository repository;

    public NewsletterService(NewsletterRepository repository) {
        this.repository = repository;
    }

    public NewsletterSubscriber subscribe(String email) {
        if (repository.existsByEmail(email)) {
            throw new IllegalStateException("Already subscribed");
        }
        return repository.save(NewsletterSubscriber.builder().email(email).build());
    }

    public long count() {
        return repository.count();
    }
}
