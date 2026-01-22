# Build는 GitHub Actions에서 진행하므로 실행 환경만 설정
FROM openjdk:17-jdk-slim
# 빌드된 jar 파일의 이름을 app.jar로 복사
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar
# 8080포트 개방
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]