# ===== Build stage =====
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace

# Cache deps first
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Build
COPY src ./src
RUN mvn -B clean package -DskipTests

# ===== Runtime stage =====
FROM eclipse-temurin:17-jre
WORKDIR /app

# Non-root user
RUN groupadd --system spring && useradd --system --gid spring spring
USER spring:spring

COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
