package com.project.drapp.Controllers;

import com.project.drapp.Daos.DoctorDao;
import com.project.drapp.Models.Doctor;
import com.project.drapp.Models.DoctorRating;
import com.project.drapp.Models.MessageResponse;
import com.project.drapp.Models.UpdateTrackingDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DoctorController {

    @Autowired
    private DoctorDao dao;

    @GetMapping(path = "/api/v1/getDoctor/{id}")
    public ResponseEntity<List<Doctor>> getAllSoldBySeller (@PathVariable(name = "id") String sellerId) {
        return ResponseEntity.ok(dao.findDoctorFromEmail(sellerId));
    }

    @GetMapping(path = "/api/v1/doctors")
    public ResponseEntity<Iterable<Doctor>> getAllItems () {
        return ResponseEntity.ok(dao.findAll());
    }

    @RequestMapping(path = "/api/v1/updateRating",consumes = "*/*", produces = MediaType.APPLICATION_PROBLEM_JSON_VALUE)
    public ResponseEntity<MessageResponse> updateDoctorRating (@RequestBody DoctorRating doctorRatingDetails) {
        List<Doctor> doctorDetails = dao.findDoctorFromEmail(doctorRatingDetails.email);
        int rating;
        if(doctorDetails.get(0).rating == 0){
            rating = doctorRatingDetails.rating;
        }
        else {
            rating = (doctorDetails.get(0).rating + doctorRatingDetails.rating) / 2 ;
        }
        dao.updateDoctorRating(rating, doctorRatingDetails.email);
        return ResponseEntity.ok(new MessageResponse("item-updated"));
    }

}
