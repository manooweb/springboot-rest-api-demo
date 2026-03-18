package fr.manooweb.backend.web;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("appName", "Spring Boot REST API Demo");
        model.addAttribute("swaggerUrl", "/swagger-ui/index.html");
        model.addAttribute("frontendUrl", "https://projects.manooweb.fr");
        model.addAttribute("legalNoticeUrl", "https://projects.manooweb.fr/legal-notice");
        model.addAttribute("privacyPolicyUrl", "https://projects.manooweb.fr/privacy-policy");
        model.addAttribute("healthStatus", "Healthy");
        return "home";
    }
}
