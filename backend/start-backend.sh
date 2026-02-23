#!/bin/bash
export JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home"
echo "Using JAVA_HOME: $JAVA_HOME"
mvn spring-boot:run
