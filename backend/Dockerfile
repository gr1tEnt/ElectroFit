# ElectroFit backend — multi-stage build (Spring Boot at repository root)
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/electrical-accessories-store-0.0.1-SNAPSHOT.jar app.jar

RUN mkdir -p /app/uploads/products

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
