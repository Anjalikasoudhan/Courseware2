package com.application.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.application.model.Wishlist;
import com.application.services.WishlistService;

@Controller
@RequestMapping("/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // Add course to wishlist
    @PostMapping("/addcourse")
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public Wishlist addCourseToWishlist(@RequestBody Wishlist course) {
        return wishlistService.addToWishlist(course);
    }

    // Save course to wishlist (alternative endpoint)
    @PostMapping("/savecourse")
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public Wishlist saveCourseToWishlist(@RequestBody Wishlist course) {
        return wishlistService.saveToWishlist(course);
    }

    // Get all liked courses
    @GetMapping("/getallcourses")
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public List<Wishlist> getAllLikedCourses() {
        return wishlistService.getAllLikedCourses();
    }

    // Get course by course name
    @GetMapping("/getcoursebycoursename")
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public Wishlist getCourseByCoursename(@RequestParam String coursename) {
        return wishlistService.fetchCourseByCoursename(coursename);
    }

    // Get course by course ID
    @GetMapping("/getcoursebycourseid")
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public Wishlist getCourseByCourseid(@RequestParam String courseid) {
        return wishlistService.fetchCourseByCourseid(courseid);
    }

    // Get courses by instructor name
    @GetMapping("/getcoursesbyinstructorname")
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public List<Wishlist> getCoursesByInstructorname(@RequestParam String instructorname) {
        return wishlistService.fetchByInstructorname(instructorname);
    }

    // Get courses by instructor institution
    @GetMapping("/getcoursesbyinstitution")
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public List<Wishlist> getCoursesByInstitution(@RequestParam String instructorinstitution) {
        return wishlistService.fetchByInstructorinstitution(instructorinstitution);
    }

    // Get courses by liked user
    @GetMapping("/getcoursesbyuser")
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public List<Wishlist> getCoursesByLikeduser(@RequestParam String likeduser) {
        return wishlistService.fetchByLikeduser(likeduser);
    }

    // Get courses by liked user type
    @GetMapping("/getcoursesbyusertype")
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public List<Wishlist> getCoursesByLikedusertype(@RequestParam String likedusertype) {
        return wishlistService.fetchByLikedusertype(likedusertype);
    }

    // Get courses by course type
    @GetMapping("/getcoursesbycoursetype")
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public List<Wishlist> getCoursesByCoursetype(@RequestParam String coursetype) {
        return wishlistService.fetchByCoursetype(coursetype);
    }

    // Get courses by skill level
    @GetMapping("/getcoursesbyskilllevel")
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public List<Wishlist> getCoursesBySkilllevel(@RequestParam String skilllevel) {
        return wishlistService.fetchBySkilllevel(skilllevel);
    }

    // Get courses by language
    @GetMapping("/getcoursesbylanguage")
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public List<Wishlist> getCoursesByLanguage(@RequestParam String language) {
        return wishlistService.fetchByLanguage(language);
    }

    // PathVariable versions (alternative to RequestParam)

    @GetMapping("/user/{likeduser}")
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public List<Wishlist> getWishlistByUser(@PathVariable String likeduser) {
        return wishlistService.fetchByLikeduser(likeduser);
    }

    @GetMapping("/usertype/{likedusertype}")
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public List<Wishlist> getWishlistByUserType(@PathVariable String likedusertype) {
        return wishlistService.fetchByLikedusertype(likedusertype);
    }

    @GetMapping("/instructor/{instructorname}")
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public List<Wishlist> getWishlistByInstructor(@PathVariable String instructorname) {
        return wishlistService.fetchByInstructorname(instructorname);
    }

    @GetMapping("/coursename/{coursename}")
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public Wishlist getWishlistByCourseName(@PathVariable String coursename) {
        return wishlistService.fetchCourseByCoursename(coursename);
    }

    @GetMapping("/courseid/{courseid}")
    @CrossOrigin(origins = "http://localhost:4200")
    @ResponseBody
    public Wishlist getWishlistByCourseId(@PathVariable String courseid) {
        return wishlistService.fetchCourseByCourseid(courseid);
    }
}