package com.application.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.application.services.UserService;
import com.application.services.ProfessorService;
import com.application.services.CourseService;
import com.application.services.WishlistService;
import com.application.services.EnrollmentService;
import com.application.services.ChapterService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private ProfessorService professorService;
    
    @Autowired
    private CourseService courseService;
    
    @Autowired
    private WishlistService wishlistService;
    
    @Autowired
    private EnrollmentService enrollmentService;
    
    @Autowired
    private ChapterService chapterService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> stats = new HashMap<>();
            
            stats.put("totalUsers", userService.getTotalUsersCount());
            stats.put("totalProfessors", professorService.getTotalProfessorsCount());
            stats.put("totalCourses", courseService.getTotalCoursesCount());
            stats.put("totalWishlist", wishlistService.getTotalWishlistCount());
            stats.put("totalEnrollments", enrollmentService.getTotalEnrollmentsCount());
            stats.put("totalEnrollmentCount", enrollmentService.getTotalEnrollmentCount());
            stats.put("totalChapters", chapterService.getTotalChaptersCount());
            
            response.put("success", true);
            response.put("data", stats);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching dashboard statistics: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Individual endpoints (if you need them separately)
    @GetMapping("/totalusers")
    public ResponseEntity<Map<String, Object>> getTotalUsers() {
        return createResponse(userService.getTotalUsersCount(), "users");
    }

    @GetMapping("/totalprofessors")
    public ResponseEntity<Map<String, Object>> getTotalProfessors() {
        return createResponse(professorService.getTotalProfessorsCount(), "professors");
    }

    @GetMapping("/totalcourses")
    public ResponseEntity<Map<String, Object>> getTotalCourses() {
        return createResponse(courseService.getTotalCoursesCount(), "courses");
    }

    @GetMapping("/totalwishlist")
    public ResponseEntity<Map<String, Object>> getTotalWishlist() {
        return createResponse(wishlistService.getTotalWishlistCount(), "wishlist");
    }

    @GetMapping("/totalenrollments")
    public ResponseEntity<Map<String, Object>> getTotalEnrollments() {
        return createResponse(enrollmentService.getTotalEnrollmentsCount(), "enrollments");
    }

    @GetMapping("/totalenrollmentcount")
    public ResponseEntity<Map<String, Object>> getTotalEnrollmentCount() {
        return createResponse(enrollmentService.getTotalEnrollmentCount(), "enrollment count");
    }

    @GetMapping("/totalchapters")
    public ResponseEntity<Map<String, Object>> getTotalChapters() {
        return createResponse(chapterService.getTotalChaptersCount(), "chapters");
    }

    // Helper method for individual responses
    private ResponseEntity<Map<String, Object>> createResponse(long count, String type) {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("count", count);
            response.put("success", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("count", 0);
            response.put("success", false);
            response.put("message", "Error fetching " + type + " count: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testEndpoint() {
        System.out.println("=== /api/dashboard/test endpoint called ===");
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Dashboard controller is working!");
        response.put("success", true);
        return ResponseEntity.ok(response);
    }
}
