CREATE DATABASE IF NOT EXISTS defaultdb;
USE `defaultdb`;

CREATE TABLE `Address` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `street_address` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `province` varchar(100) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`address_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Address` VALUES 
(1,'123 Elm Street','Colombo','Western Province','10100','Sri Lanka','2024-12-26 18:31:16','2024-12-26 18:31:16'),
(2,'456 Maple Avenue','Kandy','Central Province','20000','Sri Lanka','2024-12-26 18:31:16','2024-12-26 18:31:16'),
(17,'Kalugalla','kegalle',' sabara','1000','sl','2024-12-27 07:19:27','2024-12-27 07:19:27'),
(20,'Adurapotha','kegalle','sabara','1016','','2024-12-27 07:30:33','2024-12-27 07:30:33'),
(25,'wert','rtyu','rtyu','1234','','2024-12-27 07:43:40','2024-12-27 07:43:40'),
(29,'sdfg','erty','ffgh','1016','','2024-12-27 07:52:07','2024-12-27 07:52:07'),
(31,'jddkd','jddkdkd','kfmfmfm','1098','','2024-12-27 07:54:20','2024-12-27 07:54:20'),
(39,'Sisila,Kalugalla','Kegalle','Sabaragamuwa','1016','','2024-12-27 08:09:25','2024-12-27 08:09:25'),
(40,'wasanthapura','kegalle','uva','2000','','2024-12-27 08:33:30','2024-12-27 08:33:30'),
(42,'No 26 A','Eppawala','NC','50260','Sri Lanka','2024-12-27 19:00:46','2024-12-27 19:00:46');

CREATE TABLE `Admin` (
  `nic` char(12) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telephone` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`nic`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Admin` VALUES 
('199012345678','John','Doe','admin.john@example.com','0712345678','$2a$10$Orin9iiSdz/p8E.s02kKY.bvCd7G5QDuDRRJe.l4LxIXXMHYfeleK'),
('200220202397','dasun2','pramodya2','das2@gmail.com','0252249543','$2a$10$hbCpeqvezxEZS.0ImGsNIOlciwlBYh1gWIVeYriGPmcEV3c4Pfo.O'),
('200220202398','dasun1','pramodya1','das1@gmail.com','0252249543','$2a$10$7n5fhgwuoWgdymYzS/Jh.u/7k0ildwJoKyMDiqA7Q8iwFhD25sTya');

CREATE TABLE `Answer` (
  `answer_id` int NOT NULL AUTO_INCREMENT,
  `enrollment_id` int NOT NULL,
  `question_id` int NOT NULL,
  `option_id` int DEFAULT NULL,
  `text_answer` text,
  PRIMARY KEY (`answer_id`),
  KEY `enrollment_id` (`enrollment_id`),
  KEY `question_id` (`question_id`),
  KEY `option_id` (`option_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Answer` VALUES 
(1,1,1,1,NULL),
(2,2,2,NULL,'2');

CREATE TABLE `Course` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `course_type` enum('online','offline') NOT NULL,
  `batch` varchar(50) NOT NULL,
  `month` varchar(50) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `duration` int NOT NULL,
  `progress` decimal(5,2) DEFAULT '0.00',
  `started_at` date NOT NULL,
  `ended_at` date DEFAULT NULL,
  PRIMARY KEY (`course_id`),
  KEY `image_url_index` (`image_url`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Course` VALUES 
(1,'online','Batch A','January',NULL,'Introduction to Programming',5000.00,3,0.00,'2024-01-01','2024-03-31'),
(2,'offline','Batch B','February',NULL,'Advanced Mathematics',7500.00,6,0.00,'2024-02-01','2024-07-31');

CREATE TABLE `Enrollment` (
  `enrollment_id` int NOT NULL AUTO_INCREMENT,
  `nic` char(12) NOT NULL,
  `course_id` int NOT NULL,
  PRIMARY KEY (`enrollment_id`),
  KEY `course_id` (`course_id`),
  KEY `nic` (`nic`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Enrollment` VALUES 
(1,'199012345678',1),
(2,'199112345679',2);

CREATE TABLE `Option` (
  `option_id` int NOT NULL AUTO_INCREMENT,
  `question_id` int NOT NULL,
  `option_text` varchar(255) NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  PRIMARY KEY (`option_id`),
  KEY `question_id` (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Option` VALUES 
(1,1,'A storage location in memory.',1),
(2,1,'A type of loop.',0);

CREATE TABLE `Payment` (
  `enrollment_id` int NOT NULL,
  `payment_status` enum('pending','completed','failed') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`enrollment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Payment` VALUES 
(1,'completed',5000.00),
(2,'pending',7500.00);

CREATE TABLE `Question` (
  `question_id` int NOT NULL AUTO_INCREMENT,
  `quiz_id` int NOT NULL,
  `question_text` text NOT NULL,
  `question_type` varchar(50) NOT NULL,
  PRIMARY KEY (`question_id`),
  KEY `question_type_index` (`question_type`),
  KEY `quiz_id` (`quiz_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Question` VALUES 
(1,1,'What is a variable?','multiple-choice'),
(2,2,'Solve for x: 2x + 3 = 7.','short-answer');

CREATE TABLE `Quiz` (
  `quiz_id` int NOT NULL AUTO_INCREMENT,
  `section_id` int NOT NULL,
  PRIMARY KEY (`quiz_id`),
  KEY `section_id` (`section_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Quiz` VALUES 
(1,1),
(2,2);

CREATE TABLE `Section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `course_id` int NOT NULL,
  `week_id` int NOT NULL,
  `order_id` int NOT NULL,
  `type_id` int NOT NULL,
  `content_url` varchar(255) DEFAULT NULL,
  `mark_as_done` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `type_id` (`type_id`),
  KEY `course_id` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Section` VALUES 
(1,'Introduction','Getting started with programming basics.',1,1,1,1,'intro.mp4',0),
(2,'Algebra Basics','Introduction to algebra.',2,1,1,2,'algebra.pdf',0);

CREATE TABLE `Type` (
  `type_id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(100) NOT NULL,
  `type_icon` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Type` VALUES 
(1,'Video','video_icon.png'),
(2,'Document','document_icon.png');

CREATE TABLE `User` (
  `nic` char(12) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `address_id` int DEFAULT NULL,
  `telephone` varchar(15) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `batch` varchar(50) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`nic`),
  UNIQUE KEY `email` (`email`),
  KEY `address_id` (`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `User` VALUES 
('1234','asdf','wer',25,'1234','dilhara@gmail.com','$2a$10$0d99rPYjobzaqXzBAsM/Mei4fZgLRLPf5n0oi8.5A7jKSbArN.WBG','2024-12-03','23','https://res.cloudinary.com/dxxa198zw/image/upload/v1735285419/user_images/nzbioxj2l5jdy3fyuain.jpg',''),
('123456789','Lishani','Sulakshika',20,'0712345612','kasun@gmail.com','$2a$10$/QWbkC7m.d6znL2jxDZ0B.umdjB.Z7ED87B/nM4NiOrQ7ZhA0GkbC','2024-12-26','21','https://res.cloudinary.com/dxxa198zw/image/upload/v1735284632/user_images/gwzxikxt0uaspfjijypp.jpg',''),
('12894','jdjddk','jfkfkfk',31,'182822929','jdjdjdj@gmail.com','$2a$10$Wuwm/5x5isXzmVoE7A1MfuPv.NMPul8Cd7YN7Zpr9bO2dqmQJaCnm','2024-11-25','22','https://res.cloudinary.com/dxxa198zw/image/upload/v1735286059/user_images/wa6hnsnkwoqg1zf3gcga.png',''),
('1969200015','Wasantha','Kumara',40,'0718247980','wasantha@gmail.com','$2a$10$va2GldtKWIaBksxCH3q.7OQegVH4L7zr1.91VX6BIV9asMVAeX60y','2024-12-17','21','https://res.cloudinary.com/dxxa198zw/image/upload/v1735288409/user_images/fiphgicjm35okuczz0nd.png',''),
('199012345678','John','Doe',1,'0712345678','john.doe@example.com','$2b$10$examplehashedpassword','1990-01-15','Batch A',NULL,'active'),
('199112345679','Jane','Smith',2,'0776543210','jane.smith@example.com','$2b$10$examplehashedpassword2','1991-03-22','Batch B',NULL,'active'),
('200218402732','Kasun','Dilhara',39,'0704085377','kasunkumara200272@gmail.com','$2a$10$68QBuIT8is0Ha5eIu1aWKuaSCy0EOy.uKtIJZN2vn4CECVCAjCaU6','2002-07-02','22','https://res.cloudinary.com/dxxa198zw/image/upload/v1735286965/user_images/mpsb1muhlmdjgxw2ffsr.png',''),
('200220202399','Dasun','Pramodya',42,'0711940579','dasun@gmail.com','$2a$10$Orin9iiSdz/p8E.s02kKY.bvCd7G5QDuDRRJe.l4LxIXXMHYfeleK','2002-07-20','21','https://res.cloudinary.com/dxxa198zw/image/upload/v1735326045/user_images/c5gbnf2iht4frdjfsnum.jpg','Active'),
('567','supun','kumara',29,'1234','asun@gmail.com','$2a$10$B3zCBh2tqyQY6NLbEMcHNO6jLAn12Lp97XQpRUuXMLdDOFJd3RpZC','2025-01-07','22','https://res.cloudinary.com/dxxa198zw/image/upload/v1735285926/user_images/kpslc9bamptlnwop6emg.jpg','');
