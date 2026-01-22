# JDK 21 버전의 가벼운 이미지 사용
FROM eclipse-temurin:21-jdk-slim
# Maven의 경우 빌드 결과물이 target 폴더에 생성됨
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]