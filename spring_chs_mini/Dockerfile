# 가장 확실하게 존재하는 이미지 태그로 변경
FROM openjdk:21-jdk-slim
# Maven의 경우 빌드 결과물이 target 폴더에 생성됨
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]