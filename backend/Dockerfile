FROM maven:3.9.9-eclipse-temurin-21 AS build

WORKDIR /build

COPY backend/.mvn/ backend/.mvn/
COPY backend/mvnw backend/pom.xml backend/
COPY backend/src/ backend/src/

RUN chmod +x backend/mvnw
RUN ./backend/mvnw -f backend/pom.xml clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /build/backend/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
