package com.example.educhain;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class EduChainApplication {

  public static void main(String[] args) {
    SpringApplication.run(EduChainApplication.class, args);
  }
}
