FROM docker pull maven:3.9.6-eclipse-temurin-21

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn -B package -DskipTests

FROM eclipse-temurin:21.0.1_12-jre
WORKDIR /app
COPY --from=build /app/target/app /app/app.jar

EXPOSE 8080
CMD["java", "-jar", "app.jar"]
