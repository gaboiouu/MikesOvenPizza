package com.example.mikespizza;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MikespizzaApplication {

	public static void main(String[] args) {
		SpringApplication.run(MikespizzaApplication.class, args);
	}

}
