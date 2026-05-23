package com.codingcruiser.repository;

import com.codingcruiser.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findBySlug(String slug);
    boolean existsBySlug(String slug);

    Page<Post> findByCategorySlug(String slug, Pageable pageable);

    Page<Post> findByFeaturedTrue(Pageable pageable);

    @Query("SELECT p FROM Post p WHERE " +
           "(:q IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(p.excerpt) LIKE LOWER(CONCAT('%', :q, '%'))) " +
           "AND (:categorySlug IS NULL OR p.category.slug = :categorySlug)")
    Page<Post> search(@Param("q") String q,
                      @Param("categorySlug") String categorySlug,
                      Pageable pageable);

    List<Post> findTop5ByOrderByViewCountDesc();
}
