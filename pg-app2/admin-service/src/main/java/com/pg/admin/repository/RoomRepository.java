//package com.pg.admin.repository;
//
//import java.util.List;
//import java.util.Optional;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import com.pg.admin.entity.Room;
//
//public interface RoomRepository extends JpaRepository<Room, Long> {
//    Optional<Room> findByRoomName(String roomName);
//    List<Room> findByAllocatedFalse(); // get only available rooms
//}
