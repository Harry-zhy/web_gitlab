package team.bham.web.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class component {

    @GetMapping("/")
    public String index() {
        return "index";
    }
}
