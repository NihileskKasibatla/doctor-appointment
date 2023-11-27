package com.project.drapp.Controllers;

import com.project.drapp.Daos.DoctorDao;
import com.project.drapp.Daos.UserDao;
import com.project.drapp.Models.Doctor;
import com.project.drapp.Models.MessageResponse;
import com.project.drapp.Models.User;
import com.project.drapp.Models.UserLoginDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.util.Optional;

@RestController
public class UserController {

    @Autowired
    private UserDao dao;
    @Autowired
    private DoctorDao DDao;

    @RequestMapping(path="/api/v1/login",method = RequestMethod.POST,headers="Accept=*/*",produces = MediaType.APPLICATION_PROBLEM_JSON_VALUE)
    public ResponseEntity<User> loginUser (@RequestBody UserLoginDetails userDetailGiven) throws UnsupportedEncodingException, NoSuchAlgorithmException {
        System.out.println(userDetailGiven.userEmail);
        Optional<User> userFound = dao.findById(userDetailGiven.userEmail);
        if(userFound.isPresent() && userFound.get().userPassword.equals(userDetailGiven.userPass)){
            return ResponseEntity.ok(userFound.get());
        }
        return ResponseEntity.ok(new User());
    }

    @RequestMapping(path="/api/v1/logindoctor",method = RequestMethod.POST,headers="Accept=*/*",produces = MediaType.APPLICATION_PROBLEM_JSON_VALUE)
    public ResponseEntity<Doctor> loginDoctor (@RequestBody UserLoginDetails userDetailGiven) throws UnsupportedEncodingException, NoSuchAlgorithmException {
        System.out.println(userDetailGiven.userEmail);
        Optional<Doctor> userFound = DDao.findById(userDetailGiven.userEmail);
        System.out.println(userFound);
        if(!userFound.isPresent()){
            return ResponseEntity.ok(new Doctor());
        }
        if(userFound.get().password.equals(userDetailGiven.userPass)){
            return ResponseEntity.ok(userFound.get());
        }
        return ResponseEntity.ok(new Doctor());
    }

    @RequestMapping(path = "/api/v1/adduser",consumes = "*/*", produces = MediaType.APPLICATION_PROBLEM_JSON_VALUE)
    public ResponseEntity<MessageResponse> createUser (@RequestBody User newUser) {
        dao.save(newUser);
        return ResponseEntity.ok(new MessageResponse("UserAdded"));
    }

    @RequestMapping(path = "/api/v1/createdoctor",consumes = "*/*", produces = MediaType.APPLICATION_PROBLEM_JSON_VALUE)
    public ResponseEntity<MessageResponse> createDoctor (@RequestBody Doctor newSeller) {
        DDao.save(newSeller);
        return ResponseEntity.ok(new MessageResponse("UserAdded"));
    }
}
