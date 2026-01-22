# Amazon Corretto 21 이미지는 ARM64와 x86_64 모두를 안정적으로 지원합니다.
FROM amazoncorretto:21-al2023-jdk

# Maven의 경우 빌드 결과물이 target 폴더에 생성됨
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app.jar"]