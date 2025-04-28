# Learn Spring Boot

## 🚀 Getting Started

### Hello World
```java
@SpringBootApplication
public class DemoApplication {
  public static void main(String[] args) {
    SpringApplication.run(DemoApplication.class, args);
  }
}
```

## 🧱 Basic REST Controller
```java
@RestController
public class HelloController {
  @GetMapping("/hello")
  public String sayHello() {
    return "Hello, Spring Boot!";
  }
}
```

## 🔧 Intermediate

### Dependency Injection
```java
@Service
public class GreetingService {
  public String greet() {
    return "Hello from Service!";
  }
}

@RestController
public class GreetController {
  @Autowired
  private GreetingService service;

  @GetMapping("/greet")
  public String greet() {
    return service.greet();
  }
}
```

### JPA Integration
```java
@Entity
public class User {
  @Id
  @GeneratedValue
  private Long id;
  private String name;
}

@Repository
public interface UserRepository extends JpaRepository<User, Long> {}
```

## 🌐 Advanced

### Security with Spring Security
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests().anyRequest().authenticated().and().httpBasic();
  }
}
```

### Custom Exception Handling
```java
@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(Exception.class)
  public ResponseEntity<String> handleAllExceptions(Exception ex) {
    return new ResponseEntity<>("Error: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
```

