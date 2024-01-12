package com.project.drapp.Daos;

import com.project.drapp.Models.Appointment;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;
import java.util.List;

public interface AppointmentDao extends CrudRepository<Appointment,String> {

    @Query(value = "SELECT * from appointments WHERE user_email = ?1 OR doctor_email = ?1",nativeQuery = true)
    List<Appointment> findAppointmentByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "UPDATE appointments SET feedback = ?1 WHERE id = ?2",nativeQuery = true)
    void updateAppointmentFeedback(String feedback,String id);

    @Modifying
    @Transactional
    @Query(value = "DELETE from appointments WHERE id = ?1",nativeQuery = true)
    void deleteAppointment(String id);

    @Modifying
    @Transactional
    @Query(value = "UPDATE appointments SET message = ?1 WHERE id = ?2",nativeQuery = true)
    void updateMessageToPatient(String message, String id);
}