package com.codingcruiser.controller;

import com.codingcruiser.service.YouTubeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/youtube")
public class YouTubeController {

    private final YouTubeService youTubeService;

    public YouTubeController(YouTubeService youTubeService) {
        this.youTubeService = youTubeService;
    }

    @GetMapping("/latest")
    public ResponseEntity<List<Map<String, Object>>> latest(
            @RequestParam(defaultValue = "6") int max) {
        return ResponseEntity.ok(youTubeService.fetchLatestVideos(max));
    }
}
