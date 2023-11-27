package com.project.drapp.Controllers;

import com.project.drapp.Daos.OrderDao;
import com.project.drapp.Daos.ReturnDao;
import com.project.drapp.Models.MessageResponse;
import com.project.drapp.Models.OrderReturnRequest;
import com.project.drapp.Models.Orders;
import com.project.drapp.Models.UpdateTrackingDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class OrderController {

    @Autowired
    private OrderDao dao;

    @Autowired
    private ReturnDao orderReturnDao;

    @GetMapping(path = "/api/v1/allOrders")
    public ResponseEntity<Iterable<Orders>> listOrders () {
        return ResponseEntity.ok(dao.findAll());
    }

    @RequestMapping(path = "/api/v1/addOrder",consumes = "*/*", produces = MediaType.APPLICATION_PROBLEM_JSON_VALUE)
    public ResponseEntity<MessageResponse> addOrder (@RequestBody Orders newOrder) {
        dao.save(newOrder);
        return ResponseEntity.ok(new MessageResponse("added"));
    }

    @GetMapping(path = "/api/v1/orders/{id}")
    public ResponseEntity<Iterable<Orders>> listUserOrders (@PathVariable(name = "id") String id) {
        return ResponseEntity.ok(dao.findUserOrders(id));
    }

    @GetMapping(path = "/api/v1/orders/seller/{id}")
    public ResponseEntity<Iterable<Orders>> listOrdersOfSeller (@PathVariable(name = "id") String id) {
        return ResponseEntity.ok(dao.findHotelOrders(id));
    }

    @RequestMapping(path = "/api/v1/updateStatus",consumes = "*/*", produces = MediaType.APPLICATION_PROBLEM_JSON_VALUE)
    public ResponseEntity<MessageResponse> updateOrderStatus (@RequestBody UpdateTrackingDetails updateTrackingDetails) {
        dao.updateOrderStatus(updateTrackingDetails.status, updateTrackingDetails.orderId);
        return ResponseEntity.ok(new MessageResponse("item-updated"));
    }

    @RequestMapping(path = "/api/v1/addReturn",consumes = "*/*", produces = MediaType.APPLICATION_PROBLEM_JSON_VALUE)
    public ResponseEntity<MessageResponse> addOrderReturn (@RequestBody OrderReturnRequest orderReturnRequest) {
        dao.cancelOrder(orderReturnRequest.orderId);
        orderReturnDao.save(orderReturnRequest);
        return ResponseEntity.ok(new MessageResponse("added"));
    }

    @GetMapping(path = "/api/v1/cancelOrder/{id}",consumes = "*/*", produces = MediaType.APPLICATION_PROBLEM_JSON_VALUE)
    public ResponseEntity<MessageResponse> cancelOrder (@PathVariable(name = "id") String orderId) {
        dao.cancelOrder(orderId);
        return ResponseEntity.ok(new MessageResponse("canceled"));
    }

    @GetMapping(path = "/api/v1/canceledOrders/{id}",consumes = "*/*", produces = MediaType.APPLICATION_PROBLEM_JSON_VALUE)
    public ResponseEntity<Iterable<Orders>> getCanceledOrders (@PathVariable(name = "id") String hotelId) {
        return ResponseEntity.ok(dao.findCanceledOrders(hotelId));
    }

    @GetMapping(path = "/api/v1/returnedOrders/{id}",consumes = "*/*", produces = MediaType.APPLICATION_PROBLEM_JSON_VALUE)
    public ResponseEntity<Iterable<OrderReturnRequest>> getReturnedOrdersForHotel (@PathVariable(name = "id") String hotelId) {
        return ResponseEntity.ok(orderReturnDao.findReturnedOrders(hotelId));
    }

}
