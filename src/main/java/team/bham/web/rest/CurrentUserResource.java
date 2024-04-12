package team.bham.web.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import team.bham.service.UserService;

@RestController
@RequestMapping("/api")
public class CurrentUserResource {

    private final UserService userService;

    public CurrentUserResource(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/current-user-email")
    public String getCurrentUserEmail() {
        String userEmail = userService.getCurrentUserEmail();
        return userEmail;
    }

    @GetMapping("/current-username")
    public String getCurrentUserName() {
        String username = userService.getCurrentUserName();
        return username;
    }
}
