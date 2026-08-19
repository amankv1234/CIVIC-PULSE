FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Cache dependencies layer
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw && ./mvnw dependency:go-offline -q

# Build application
COPY src ./src
RUN ./mvnw package -DskipTests -q

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine AS runtime

# Security: non-root user
RUN addgroup -S spring && adduser -S spring -G spring

WORKDIR /app

# Upload directory
RUN mkdir -p /app/uploads && chown spring:spring /app/uploads

COPY --from=build --chown=spring:spring /app/target/*.jar app.jar

USER spring

EXPOSE 8080

# Java 21 Virtual Threads + container-aware memory
ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-XX:+UseVirtualThreads", \
  "-jar", "app.jar"]
