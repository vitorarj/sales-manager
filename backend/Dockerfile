# Multi-stage build para otimização
FROM gradle:8.5-jdk17 AS build

WORKDIR /app
COPY build.gradle settings.gradle ./
COPY src ./src

# Build da aplicação
RUN gradle clean build -x test

# Imagem final otimizada
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copiar apenas o JAR necessário
COPY --from=build /app/build/libs/*.jar app.jar

# Criar usuário não-root
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

# Configurações JVM otimizadas
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseG1GC"

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

CMD ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]