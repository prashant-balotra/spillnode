package com.codingcruiser.service;

import com.codingcruiser.dto.PostRequest;
import com.codingcruiser.model.Category;
import com.codingcruiser.model.Post;
import com.codingcruiser.model.User;
import com.codingcruiser.repository.CategoryRepository;
import com.codingcruiser.repository.PostRepository;
import com.codingcruiser.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository,
                       CategoryRepository categoryRepository,
                       UserRepository userRepository) {
        this.postRepository = postRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public Page<Post> list(String q, String categorySlug, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        String query = (q == null || q.isBlank()) ? null : q;
        String slug = (categorySlug == null || categorySlug.isBlank()) ? null : categorySlug;
        return postRepository.search(query, slug, pageable);
    }

    public Page<Post> featured(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return postRepository.findByFeaturedTrue(pageable);
    }

    public List<Post> trending() {
        return postRepository.findTop5ByOrderByViewCountDesc();
    }

    @Transactional
    public Post getBySlugAndIncrementViews(String slug) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        post.setViewCount(post.getViewCount() + 1);
        return postRepository.save(post);
    }

    public Post create(PostRequest req, String authorEmail) {
        Category cat = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new IllegalArgumentException("Author not found"));

        String baseSlug = slugify(req.getTitle());
        String slug = baseSlug;
        if (postRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + UUID.randomUUID().toString().substring(0, 6);
        }

        Post post = Post.builder()
                .title(req.getTitle())
                .slug(slug)
                .excerpt(req.getExcerpt())
                .content(req.getContent())
                .thumbnailUrl(req.getThumbnailUrl())
                .youtubeVideoId(req.getYoutubeVideoId())
                .category(cat)
                .author(author)
                .tags(req.getTags() == null ? new HashSet<>() : req.getTags())
                .featured(req.isFeatured())
                .build();
        return postRepository.save(post);
    }

    public Post update(Long id, PostRequest req) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        Category cat = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        post.setTitle(req.getTitle());
        post.setExcerpt(req.getExcerpt());
        post.setContent(req.getContent());
        post.setThumbnailUrl(req.getThumbnailUrl());
        post.setYoutubeVideoId(req.getYoutubeVideoId());
        post.setCategory(cat);
        post.setTags(req.getTags() == null ? new HashSet<>() : req.getTags());
        post.setFeatured(req.isFeatured());
        return postRepository.save(post);
    }

    public void delete(Long id) {
        postRepository.deleteById(id);
    }

    @Transactional
    public Post toggleLike(Long postId, String userEmail) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Set<Post> liked = user.getLikedPosts();
        if (liked.contains(post)) {
            liked.remove(post);
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
        } else {
            liked.add(post);
            post.setLikeCount(post.getLikeCount() + 1);
        }
        userRepository.save(user);
        return postRepository.save(post);
    }

    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public static String slugify(String input) {
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NON_LATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH).replaceAll("-+", "-").replaceAll("^-|-$", "");
    }
}
