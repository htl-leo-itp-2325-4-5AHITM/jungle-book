FROM eclipse-temurin:17-jre

RUN mkdir -p /opt/application
RUN mkdir -p /media/jungle-book
COPY *-runner.jar /opt/application/backend.jar
CMD [ "java", "-jar", "backend.jar" ]
WORKDIR /opt/application
