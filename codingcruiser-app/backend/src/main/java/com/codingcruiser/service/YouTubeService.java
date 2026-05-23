package com.codingcruiser.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Fetches latest videos from a YouTube channel.
 * Requires app.youtube.channel-id and app.youtube.api-key set in application.properties.
 * If keys not provided, returns an empty list (graceful fallback).
 */
@Service
public class YouTubeService {

    @Value("${app.youtube.channel-id:}")
    private String channelId;

    @Value("${app.youtube.api-key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> fetchLatestVideos(int maxResults) {
        if (channelId == null || channelId.isBlank() || apiKey == null || apiKey.isBlank()) {
            return Collections.emptyList();
        }
        String url = "https://www.googleapis.com/youtube/v3/search"
                + "?key=" + apiKey
                + "&channelId=" + channelId
                + "&part=snippet,id&order=date&maxResults=" + maxResults;

        try {
            ResponseEntity<Map> resp = restTemplate.getForEntity(url, Map.class);
            Map<String, Object> body = resp.getBody();
            if (body == null) return Collections.emptyList();
            List<Map<String, Object>> items = (List<Map<String, Object>>) body.get("items");
            if (items == null) return Collections.emptyList();

            List<Map<String, Object>> result = new ArrayList<>();
            for (Map<String, Object> item : items) {
                Map<String, Object> idMap = (Map<String, Object>) item.get("id");
                if (idMap == null) continue;
                Object videoId = idMap.get("videoId");
                if (videoId == null) continue;
                Map<String, Object> snippet = (Map<String, Object>) item.get("snippet");

                Map<String, Object> out = new LinkedHashMap<>();
                out.put("videoId", videoId);
                out.put("title", snippet != null ? snippet.get("title") : null);
                out.put("description", snippet != null ? snippet.get("description") : null);
                out.put("publishedAt", snippet != null ? snippet.get("publishedAt") : null);
                Map<String, Object> thumbs = snippet == null ? null : (Map<String, Object>) snippet.get("thumbnails");
                if (thumbs != null) {
                    Map<String, Object> high = (Map<String, Object>) thumbs.get("high");
                    out.put("thumbnail", high != null ? high.get("url") : null);
                }
                out.put("watchUrl", "https://www.youtube.com/watch?v=" + videoId);
                result.add(out);
            }
            return result;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
