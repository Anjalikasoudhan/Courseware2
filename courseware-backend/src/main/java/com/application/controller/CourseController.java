package com.application.controller;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.application.model.Course;
import com.application.services.CourseService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class CourseController 
{
    @Autowired
    private CourseService courseService;

    // Add new course
    @PostMapping("/addcourse")
    public ResponseEntity<?> addCourse(@RequestBody Course course) 
    {
        try {
            System.out.println("=== ADD COURSE REQUEST ===");
            System.out.println("Course Name: " + course.getCoursename());
            System.out.println("Course ID: " + course.getCourseid());
            System.out.println("Instructor: " + course.getInstructorname());
            
            // Set current date as enrolled date
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");  
            Date date = new Date();  
            String todayDate = formatter.format(date);
            course.setEnrolleddate(todayDate);
            
            // Set default enrolled count if not provided
            if (course.getEnrolledcount() == null || course.getEnrolledcount().isEmpty()) {
                course.setEnrolledcount("0");
            }
            
            Course savedCourse = courseService.addNewCourse(course);
            System.out.println("=== COURSE SAVED SUCCESSFULLY ===");
            System.out.println("Saved Course ID: " + savedCourse.getId());
            
            return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
        } catch (Exception e) {
            System.out.println("=== ERROR SAVING COURSE ===");
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Error adding course: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all courses
    @GetMapping("/courseList")
    public ResponseEntity<List<Course>> getAllCourses() 
    {
        try {
            List<Course> courses = courseService.getAllCourses();
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get course by course name
    @GetMapping("/courseByName/{coursename}")
    public ResponseEntity<Course> getCourseByCoursename(@PathVariable String coursename) 
    {
        try {
            Course course = courseService.fetchCourseByCoursename(coursename);
            if (course != null) {
                return new ResponseEntity<>(course, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get course by course ID
    @GetMapping("/courseById/{courseid}")
    public ResponseEntity<Course> getCourseByCourseid(@PathVariable String courseid) 
    {
        try {
            Course course = courseService.fetchCourseByCourseid(courseid);
            if (course != null) {
                return new ResponseEntity<>(course, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get courses by instructor name
    @GetMapping("/coursesByInstructor/{instructorname}")
    public ResponseEntity<List<Course>> getCoursesByInstructorname(@PathVariable String instructorname) 
    {
        try {
            List<Course> courses = courseService.fetchByInstructorname(instructorname);
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get courses by institution
    @GetMapping("/coursesByInstitution/{institution}")
    public ResponseEntity<List<Course>> getCoursesByInstitution(@PathVariable String institution) 
    {
        try {
            List<Course> courses = courseService.fetchByInstructorinstitution(institution);
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get courses by course type
    @GetMapping("/coursesByType/{coursetype}")
    public ResponseEntity<List<Course>> getCoursesByType(@PathVariable String coursetype) 
    {
        try {
            List<Course> courses = courseService.fetchByCoursetype(coursetype);
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get courses by skill level
    @GetMapping("/coursesBySkillLevel/{skilllevel}")
    public ResponseEntity<List<Course>> getCoursesBySkillLevel(@PathVariable String skilllevel) 
    {
        try {
            List<Course> courses = courseService.fetchBySkilllevel(skilllevel);
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get courses by language
    @GetMapping("/coursesByLanguage/{language}")
    public ResponseEntity<List<Course>> getCoursesByLanguage(@PathVariable String language) 
    {
        try {
            List<Course> courses = courseService.fetchByLanguage(language);
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update enrolled count
    @PutMapping("/updateEnrolledCount")
    public ResponseEntity<String> updateEnrolledCount(@RequestParam String coursename, @RequestParam int enrolledcount) 
    {
        try {
            courseService.updateEnrolledcount(coursename, enrolledcount);
            return new ResponseEntity<>("Enrolled count updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating enrolled count: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Search courses by multiple criteria
    @GetMapping("/searchCourses")
    public ResponseEntity<List<Course>> searchCourses(
            @RequestParam(required = false) String coursename,
            @RequestParam(required = false) String instructorname,
            @RequestParam(required = false) String coursetype,
            @RequestParam(required = false) String skilllevel) 
    {
        try {
            List<Course> courses = courseService.getAllCourses();
            
            // Filter based on provided criteria
            if (coursename != null) {
                courses = courses.stream()
                    .filter(course -> course.getCoursename().toLowerCase().contains(coursename.toLowerCase()))
                    .toList();
            }
            if (instructorname != null) {
                courses = courses.stream()
                    .filter(course -> course.getInstructorname().toLowerCase().contains(instructorname.toLowerCase()))
                    .toList();
            }
            if (coursetype != null) {
                courses = courses.stream()
                    .filter(course -> course.getCoursetype().equalsIgnoreCase(coursetype))
                    .toList();
            }
            if (skilllevel != null) {
                courses = courses.stream()
                    .filter(course -> course.getSkilllevel().equalsIgnoreCase(skilllevel))
                    .toList();
            }
            
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get total courses count
    @GetMapping("/totalCourses")
    public ResponseEntity<Integer> getTotalCourses() 
    {
        try {
            List<Course> courses = courseService.getAllCourses();
            return new ResponseEntity<>(courses.size(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(0, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
