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

        // 2. Categories
        List<Category> defaults = List.of(
                Category.builder().name("Java").slug("java")
                        .description("Core Java, JVM, concurrency, design patterns")
                        .iconName("coffee").colorHex("#f89820").build(),
                Category.builder().name("Spring Boot").slug("spring-boot")
                        .description("REST APIs, Spring Security, microservices")
                        .iconName("leaf").colorHex("#6db33f").build(),
                Category.builder().name("Angular").slug("angular")
                        .description("Components, RxJS, routing, state")
                        .iconName("triangle").colorHex("#dd0031").build(),
                Category.builder().name("Next.js").slug("nextjs")
                        .description("App router, SSR, server components")
                        .iconName("zap").colorHex("#0ea5e9").build(),
                Category.builder().name("Full Stack").slug("full-stack")
                        .description("End-to-end project tutorials")
                        .iconName("layers").colorHex("#8b5cf6").build(),
                Category.builder().name("Cloud").slug("cloud")
                        .description("AWS, GCP, deployment, devops")
                        .iconName("cloud").colorHex("#0284c7").build()
        );
        for (Category c : defaults) {
            if (!categoryRepository.existsBySlug(c.getSlug())) {
                categoryRepository.save(c);
            }
        }
        System.out.println(">>> Seeded default categories");

        // 3. Sample posts
        if (seedSamplePosts && postRepository.count() == 0) {
            seedSamplePosts(admin);
            System.out.println(">>> Seeded sample posts");
        }
    }

    private void seedSamplePosts(User admin) {
        Map<String, Category> bySlug = new java.util.HashMap<>();
        categoryRepository.findAll().forEach(c -> bySlug.put(c.getSlug(), c));

        savePost(admin, bySlug.get("java"),
                "Java Streams: from zero to fluent in 15 minutes",
                "A pragmatic tour of Java Streams — map, filter, reduce, collectors, and the gotchas that trip up beginners.",
                "<h2>Why streams?</h2><p>Java Streams let you express data transformations declaratively. Instead of writing loops, you describe <em>what</em> you want.</p>" +
                "<pre><code>List&lt;String&gt; upper = names.stream()\n  .filter(n -&gt; n.length() &gt; 3)\n  .map(String::toUpperCase)\n  .toList();</code></pre>" +
                "<h2>The 3 operations you'll use 90% of the time</h2><ul><li><code>filter</code> — keep elements matching a predicate</li><li><code>map</code> — transform each element</li><li><code>collect</code> / <code>toList()</code> — materialize the result</li></ul>" +
                "<blockquote>Streams are lazy — nothing runs until a terminal operation kicks in.</blockquote>" +
                "<h2>Common pitfalls</h2><p>Don't reuse a stream. Don't mutate the source. And remember: parallel isn't always faster.</p>",
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=70",
                "grCTXGW3exQ",
                Set.of("streams", "functional", "java-8"),
                true);

        savePost(admin, bySlug.get("spring-boot"),
                "Spring Boot 3 + JWT Auth: the complete walkthrough",
                "Wire up stateless JWT authentication in Spring Boot 3 the right way — security filter chain, password encoding, role-based access.",
                "<h2>The architecture</h2><p>JWT auth = <strong>stateless</strong>. The server doesn't keep sessions; the token <em>is</em> the session.</p>" +
                "<h2>Pieces you need</h2><ul><li><code>JwtService</code> — sign &amp; verify tokens</li><li><code>JwtAuthFilter</code> — extract token from header, populate <code>SecurityContext</code></li><li><code>SecurityConfig</code> — wire the filter into the chain, define rules</li></ul>" +
                "<pre><code>http\n  .authorizeHttpRequests(a -&gt; a\n    .requestMatchers(\"/api/auth/**\").permitAll()\n    .anyRequest().authenticated())\n  .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);</code></pre>" +
                "<h2>Watch out for</h2><p>Token expiration handling on the client, CORS preflight (<code>OPTIONS</code>) requests, and don't ever store tokens in <code>localStorage</code> for high-security apps — use httpOnly cookies.</p>",
                "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=1200&q=70",
                "KYNR5js2cXE",
                Set.of("jwt", "security", "rest-api"),
                true);

        savePost(admin, bySlug.get("angular"),
                "Angular 17 standalone components: the new mental model",
                "Goodbye NgModules, hello standalone. Here's how routing, lazy loading and DI changed in Angular 17.",
                "<h2>What changed?</h2><p>Every component, directive and pipe can now declare its own imports. No more <code>NgModule</code> ceremony.</p>" +
                "<pre><code>&#64;Component({\n  selector: 'app-home',\n  standalone: true,\n  imports: [CommonModule, RouterLink]\n})\nexport class HomeComponent {}</code></pre>" +
                "<h2>Lazy loading made simple</h2><p>Lazy-load routes by pointing at the component directly:</p>" +
                "<pre><code>{ path: 'about', loadComponent: () =&gt; import('./about.component').then(m =&gt; m.AboutComponent) }</code></pre>" +
                "<h2>Signals on the horizon</h2><p>Combine standalone components with signals and you get a reactivity model that's far simpler than RxJS for most UI state.</p>",
                "https://images.unsplash.com/photo-1599507593362-3acb13f4a99e?w=1200&q=70",
                "qg2J2MZHk4U",
                Set.of("standalone", "signals", "lazy-loading"),
                false);

        savePost(admin, bySlug.get("full-stack"),
                "Build a blog from scratch: Spring Boot + Angular",
                "Step-by-step build of a JWT-secured blog with categories, comments, likes and an admin dashboard.",
                "<h2>What we'll build</h2><p>By the end of this tutorial you'll have a deployable blog with:</p>" +
                "<ul><li>JWT authentication</li><li>Role-based admin dashboard</li><li>Categories, tags, comments, likes</li><li>Newsletter signup</li><li>YouTube channel integration</li></ul>" +
                "<h2>Backend skeleton</h2><p>We'll use Spring Boot 3 with Spring Data JPA. MySQL for persistence in prod, H2 for local dev.</p>" +
                "<h2>Frontend skeleton</h2><p>Angular 17 with standalone components and Tailwind CSS. Lazy-loaded routes, route guards, and an HTTP interceptor for the JWT token.</p>" +
                "<blockquote>By building end-to-end you'll <strong>actually</strong> understand how the pieces talk to each other.</blockquote>",
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=70",
                null,
                Set.of("project", "tutorial", "end-to-end"),
                true);

        savePost(admin, bySlug.get("cloud"),
                "Dockerize your Spring Boot + Angular app",
                "A single docker-compose.yml that runs MySQL, Spring Boot and Angular for local development.",
                "<h2>Why Docker?</h2><p>One command to spin up the whole stack — no \"works on my machine\".</p>" +
                "<h2>Multi-stage Dockerfile</h2><p>Build the JAR in a Maven container, then copy it into a slim JRE image for runtime.</p>" +
                "<pre><code>FROM maven:3.9-eclipse-temurin-17 AS build\nWORKDIR /app\nCOPY pom.xml .\nRUN mvn dependency:go-offline\nCOPY src ./src\nRUN mvn -B clean package -DskipTests\n\nFROM eclipse-temurin:17-jre\nCOPY --from=build /app/target/*.jar app.jar\nENTRYPOINT [\"java\",\"-jar\",\"/app.jar\"]</code></pre>" +
                "<h2>Compose everything</h2><p>One file describes MySQL + backend + frontend networking. <code>docker compose up</code> and you're done.</p>",
                "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=1200&q=70",
                null,
                Set.of("docker", "devops", "compose"),
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
