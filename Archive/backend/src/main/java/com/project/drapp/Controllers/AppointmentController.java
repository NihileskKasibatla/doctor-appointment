package com.project.drapp.Controllers;

import com.project.drapp.Daos.AppointmentDao;
import com.project.drapp.Models.Appointment;
import com.project.drapp.Models.AppointmentFeedback;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class AppointmentController {

    @Autowired
    private AppointmentDao dao;

    @GetMapping(path = "/api/v1/appointment/{id}")
    public ResponseEntity<Iterable<Appointment>> listAppointments (@PathVariable(name = "id") String emailId) {
        return ResponseEntity.ok(dao.findAppointmentByEmail(emailId));
    }

    @RequestMapping(path = "/api/v1/addAppointment",consumes = "*/*", produces = MediaType.APPLICATION_PROBLEM_JSON_VALUE)
    public ResponseEntity<String> addAppointment (@RequestBody Appointment newCartItem) {
        dao.save(newCartItem);
        return ResponseEntity.ok("added");
    }

    @RequestMapping(path = "/api/v1/updateFeedback",consumes = "*/*", produces = MediaType.APPLICATION_PROBLEM_JSON_VALUE)
    public ResponseEntity<String> updateFeedback (@RequestBody AppointmentFeedback appointmentFeedback) {
        dao.updateAppointmentFeedback(appointmentFeedback.feedback,appointmentFeedback.id);
        return ResponseEntity.ok("added feedback");
    }


}
