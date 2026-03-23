# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build the application
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copy the built jar from the build stage
COPY --from=build /app/target/assignment-system-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your app runs on (Render uses PORT env variable, defaulting to 8080)
EXPOSE 8080

# Command to run the application with memory constraints for free tier (512MB RAM)
ENTRYPOINT ["sh", "-c", "java -Xmx300M -Xss512K -XX:MaxMetaspaceSize=128M -Dserver.port=${PORT:-8080} -jar app.jar"]
