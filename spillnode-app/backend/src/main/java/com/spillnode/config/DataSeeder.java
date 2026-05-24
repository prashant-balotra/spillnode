package com.spillnode.config;

import com.spillnode.model.Category;
import com.spillnode.model.Post;
import com.spillnode.model.Role;
import com.spillnode.model.User;
import com.spillnode.repository.CategoryRepository;
import com.spillnode.repository.PostRepository;
import com.spillnode.repository.UserRepository;
import com.spillnode.service.PostService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Configuration
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PostRepository postRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")    private String adminEmail;
    @Value("${app.admin.password}") private String adminPassword;
    @Value("${app.admin.name}")     private String adminName;
    @Value("${app.seed.sample-posts:true}") private boolean seedSamplePosts;

    public DataSeeder(UserRepository userRepository,
                      CategoryRepository categoryRepository,
                      PostRepository postRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.postRepository = postRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Admin
        User admin = userRepository.findByEmail(adminEmail).orElseGet(() -> {
            User u = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .name(adminName)
                    .role(Role.ADMIN)
                    .build();
            User saved = userRepository.save(u);
            System.out.println(">>> Seeded admin user: " + adminEmail);
            return saved;
        });

        // 2. Categories — 8 tracks matching the SpillNode taxonomy
        List<Category> defaults = List.of(
                Category.builder().name("Java").slug("java")
                        .description("Core Java, OOP, JVM, Collections, Concurrency")
                        .iconName("coffee").colorHex("#f59e0b").build(),
                Category.builder().name("Spring Boot").slug("spring-boot")
                        .description("REST APIs, JPA, Security, Microservices")
                        .iconName("leaf").colorHex("#10b981").build(),
                Category.builder().name("Angular").slug("angular")
                        .description("Components, Services, RxJS, NgRx")
                        .iconName("triangle").colorHex("#ef4444").build(),
                Category.builder().name("Next.js").slug("nextjs")
                        .description("App Router, SSR, ISR, Server Actions")
                        .iconName("arrow-right").colorHex("#a1a1aa").build(),
                Category.builder().name("Full Stack").slug("full-stack")
                        .description("End-to-end app development")
                        .iconName("layers").colorHex("#f59e0b").build(),
                Category.builder().name("Cloud").slug("cloud")
                        .description("AWS, Azure, GCP, Docker, Kubernetes")
                        .iconName("cloud").colorHex("#10b981").build(),
                Category.builder().name("DSA").slug("dsa")
                        .description("Data Structures & Algorithms")
                        .iconName("binary").colorHex("#ef4444").build(),
                Category.builder().name("System Design").slug("system-design")
                        .description("Scalable architecture patterns")
                        .iconName("network").colorHex("#f59e0b").build()
        );
        for (Category c : defaults) {
            if (!categoryRepository.existsBySlug(c.getSlug())) {
                categoryRepository.save(c);
            }
        }
        System.out.println(">>> Seeded default categories");

        // 3. Sample posts — seed only if NO posts exist yet
        if (seedSamplePosts && postRepository.count() == 0) {
            seedSamplePosts(admin);
            System.out.println(">>> Seeded sample posts");
        }
    }

    private void seedSamplePosts(User admin) {
        Map<String, Category> bySlug = new java.util.HashMap<>();
        categoryRepository.findAll().forEach(c -> bySlug.put(c.getSlug(), c));

        savePost(admin, bySlug.get("angular"),
                "Angular Signals: A Practical Guide",
                "Replace BehaviorSubject and OnPush ceremony with the new Signals API.",
                "<h2>What changed?</h2><p>Angular Signals offer a simpler, more declarative way to handle reactivity. No more zone.js gymnastics.</p>" +
                "<pre><code>const count = signal(0);\nconst doubled = computed(() =&gt; count() * 2);\n\ncount.set(5);\nconsole.log(doubled()); // 10</code></pre>" +
                "<h2>Why this matters</h2><p>Fine-grained reactivity means fewer re-renders, simpler code, and better performance — especially in component-heavy apps.</p>" +
                "<blockquote>Signals are not a replacement for RxJS. They are a complement for UI state.</blockquote>",
                "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg",
                "qg2J2MZHk4U",
                Set.of("signals", "reactivity", "angular-17"),
                true);

        savePost(admin, bySlug.get("cloud"),
                "Deploying Microservices on Kubernetes",
                "From Docker image to a multi-node K8s cluster — the full production pipeline.",
                "<h2>The journey</h2><p>This guide walks you from a single Spring Boot Dockerfile to a horizontally-scalable Kubernetes deployment.</p>" +
                "<h2>Key concepts</h2><ul><li>Deployments &amp; ReplicaSets</li><li>Services &amp; Ingress</li><li>ConfigMaps &amp; Secrets</li><li>Liveness &amp; readiness probes</li></ul>" +
                "<pre><code>apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api\nspec:\n  replicas: 3\n  template:\n    spec:\n      containers:\n      - name: api\n        image: spillnode/api:1.0.0</code></pre>",
                "https://images.pexels.com/photos/17489150/pexels-photo-17489150.jpeg",
                null,
                Set.of("kubernetes", "docker", "devops"),
                true);

        savePost(admin, bySlug.get("spring-boot"),
                "Building Production REST APIs with Spring Boot 3",
                "Set up a secure, observable REST API with validation, exception handling, and OpenAPI docs.",
                "<h2>The skeleton</h2><p>A production REST API is more than @RestController. You need validation, consistent errors, observability, and security baked in.</p>" +
                "<h2>The stack we'll wire</h2><ul><li>Spring Web + Validation</li><li>Spring Security (JWT)</li><li>Spring Data JPA</li><li>SpringDoc OpenAPI 3</li><li>Micrometer + Actuator</li></ul>" +
                "<pre><code>&#64;RestController\n&#64;RequestMapping(\"/api/posts\")\n&#64;Validated\npublic class PostController {\n  &#64;PostMapping\n  public ResponseEntity&lt;Post&gt; create(&#64;Valid &#64;RequestBody PostRequest req) {\n    return ResponseEntity.ok(service.create(req));\n  }\n}</code></pre>" +
                "<blockquote>Boilerplate today saves 3am debugging tomorrow.</blockquote>",
                "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg",
                "KYNR5js2cXE",
                Set.of("spring-boot", "rest-api", "production"),
                true);

        savePost(admin, bySlug.get("java"),
                "Mastering Java Collections Framework",
                "A deep dive into ArrayList, HashMap, ConcurrentHashMap and when to use each.",
                "<h2>Why collections matter</h2><p>The right collection turns an O(n) hot path into O(1). Pick wrong and you'll burn CPU.</p>" +
                "<h2>The cheat sheet</h2><ul><li><code>ArrayList</code> — fast random access, slow inserts in the middle</li><li><code>LinkedList</code> — fast inserts, slow random access</li><li><code>HashMap</code> — O(1) lookups, no order guarantee</li><li><code>LinkedHashMap</code> — O(1) lookups, insertion order preserved</li><li><code>TreeMap</code> — sorted, O(log n) ops</li><li><code>ConcurrentHashMap</code> — thread-safe, lock-striped</li></ul>" +
                "<pre><code>Map&lt;String, Integer&gt; counts = new ConcurrentHashMap&lt;&gt;();\ncounts.merge(\"hits\", 1, Integer::sum);</code></pre>",
                "https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg",
                "grCTXGW3exQ",
                Set.of("collections", "java-core", "performance"),
                false);

        savePost(admin, bySlug.get("nextjs"),
                "Next.js App Router: Server Components Done Right",
                "Understand the server/client boundary and build fast, SEO-friendly apps with the App Router.",
                "<h2>Server vs client</h2><p>By default in the App Router, components run on the server. They have zero JS shipped to the client. You only opt-in to client interactivity when needed.</p>" +
                "<pre><code>// app/posts/page.tsx — server component\nexport default async function Posts() {\n  const posts = await db.posts.findMany();\n  return &lt;ul&gt;{posts.map(p =&gt; &lt;li&gt;{p.title}&lt;/li&gt;)}&lt;/ul&gt;;\n}</code></pre>" +
                "<h2>When to bail to client</h2><p>Use 'use client' only when you need state, effects, or browser APIs. Push it as deep into the tree as possible.</p>",
                "https://images.pexels.com/photos/30820142/pexels-photo-30820142.jpeg",
                null,
                Set.of("nextjs", "rsc", "app-router"),
                false);

        savePost(admin, bySlug.get("system-design"),
                "System Design: Designing a URL Shortener",
                "Tackle the classic interview question — from napkin sketch to a scalable, production-ready design.",
                "<h2>The brief</h2><p>Take a long URL, return a short one. Sounds easy. Scale to 1B URLs and 100k QPS — suddenly it isn't.</p>" +
                "<h2>The pieces</h2><ul><li><strong>ID generation</strong> — base62, snowflake, or counter shards</li><li><strong>Storage</strong> — KV store (Redis) for hot reads, RDBMS for source-of-truth</li><li><strong>Cache</strong> — CDN + Redis hot layer</li><li><strong>Analytics</strong> — async event stream</li></ul>" +
                "<blockquote>Every system design interview is really an exercise in saying \"it depends\" — with substance.</blockquote>",
                "https://images.pexels.com/photos/30820142/pexels-photo-30820142.jpeg",
                null,
                Set.of("system-design", "interview", "scalability"),
                false);
    }

    private void savePost(User author, Category category, String title, String excerpt,
                          String content, String thumb, String videoId,
                          Set<String> tags, boolean featured) {
        if (category == null) return;
        String slug = PostService.slugify(title);
        if (postRepository.existsBySlug(slug)) return;

        Post post = Post.builder()
                .title(title).slug(slug).excerpt(excerpt).content(content)
                .thumbnailUrl(thumb).youtubeVideoId(videoId)
                .category(category).author(author)
                .tags(new HashSet<>(tags))
                .featured(featured)
                .build();
        postRepository.save(post);
    }
}
