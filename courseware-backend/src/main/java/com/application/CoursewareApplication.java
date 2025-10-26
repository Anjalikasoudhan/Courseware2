package com.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.application")
public class CoursewareApplication {

	public static void main(String[] args) {
		SpringApplication.run(CoursewareApplication.class, args);
	}

}
