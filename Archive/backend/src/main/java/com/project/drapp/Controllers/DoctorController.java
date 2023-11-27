package com.project.drapp.Controllers;

import com.project.drapp.Daos.DoctorDao;
import com.project.drapp.Models.Doctor;
import org.springframework.beans.factory.annotation.Autowired;
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



}
