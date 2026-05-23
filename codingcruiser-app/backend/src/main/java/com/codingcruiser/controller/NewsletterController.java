package com.codingcruiser.controller;

import com.codingcruiser.dto.NewsletterRequest;
import com.codingcruiser.service.NewsletterService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {

    private final NewsletterService newsletterService;

    public NewsletterController(NewsletterService newsletterService) {
        this.newsletterService = newsletterService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, Object>> subscribe(@Valid @RequestBody NewsletterRequest req) {
        newsletterService.subscribe(req.getEmail());
        return ResponseEntity.ok(Map.of("message", "Subscribed successfully", "email", req.getEmail()));
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> count() {
        return ResponseEntity.ok(Map.of("count", newsletterService.count()));
    }
}
