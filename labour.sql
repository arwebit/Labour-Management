-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 22, 2025 at 01:10 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `labour`
--

-- --------------------------------------------------------

--
-- Table structure for table `group_access`
--

CREATE TABLE `group_access` (
  `role_id` int(11) NOT NULL,
  `module_access_id` int(11) NOT NULL,
  `updated_by` int(11) NOT NULL,
  `updated_datetime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `group_access`
--

INSERT INTO `group_access` (`role_id`, `module_access_id`, `updated_by`, `updated_datetime`) VALUES
(1, 2, 3, '2025-07-15 10:25:40'),
(1, 1, 3, '2025-07-15 10:25:40'),
(1, 5, 3, '2025-07-15 10:25:40'),
(1, 7, 3, '2025-07-15 10:25:40'),
(1, 8, 3, '2025-07-15 10:25:40'),
(1, 11, 3, '2025-07-15 10:25:40'),
(1, 12, 3, '2025-07-15 10:25:40'),
(1, 14, 3, '2025-07-15 10:25:40'),
(1, 16, 3, '2025-07-15 10:25:40'),
(1, 17, 3, '2025-07-15 10:25:40'),
(1, 18, 3, '2025-07-15 10:25:40'),
(1, 20, 3, '2025-07-15 10:25:40'),
(1, 21, 3, '2025-07-15 10:25:40'),
(1, 24, 3, '2025-07-15 10:25:40'),
(1, 25, 3, '2025-07-15 10:25:40'),
(1, 26, 3, '2025-07-15 10:25:40'),
(1, 33, 3, '2025-07-15 10:25:40'),
(1, 34, 3, '2025-07-15 10:25:40'),
(1, 35, 3, '2025-07-15 10:25:40'),
(1, 37, 3, '2025-07-15 10:25:40'),
(1, 38, 3, '2025-07-15 10:25:40'),
(1, 39, 3, '2025-07-15 10:25:40'),
(1, 40, 3, '2025-07-15 10:25:40'),
(1, 41, 3, '2025-07-15 10:25:40'),
(1, 42, 3, '2025-07-15 10:25:40'),
(1, 43, 3, '2025-07-15 10:25:40'),
(1, 44, 3, '2025-07-15 10:25:40'),
(1, 27, 3, '2025-07-15 10:25:40'),
(1, 9, 3, '2025-07-15 10:25:40'),
(1, 13, 3, '2025-07-15 10:25:40'),
(1, 10, 3, '2025-07-15 10:25:40'),
(1, 6, 3, '2025-07-15 10:25:40'),
(1, 3, 3, '2025-07-15 10:25:40'),
(1, 22, 3, '2025-07-15 10:25:40'),
(1, 36, 3, '2025-07-15 10:25:40'),
(4, 29, 2, '2025-06-02 14:10:31'),
(4, 30, 2, '2025-06-02 14:10:31'),
(4, 31, 2, '2025-06-02 14:10:31'),
(1, 46, 3, '2025-07-15 10:25:40'),
(1, 45, 3, '2025-07-15 10:25:40'),
(1, 29, 3, '2025-07-15 10:25:40'),
(1, 30, 3, '2025-07-15 10:25:40'),
(1, 31, 3, '2025-07-15 10:25:40');

-- --------------------------------------------------------

--
-- Table structure for table `labour_attendance`
--

CREATE TABLE `labour_attendance` (
  `attendance_id` bigint(20) NOT NULL,
  `labour` int(11) NOT NULL,
  `check_in` datetime NOT NULL,
  `check_out` datetime DEFAULT NULL,
  `work_time_in_minutes` int(11) DEFAULT NULL,
  `wage_type_desc` varchar(255) DEFAULT NULL,
  `wage_type_value` float DEFAULT NULL,
  `labour_rate` double(15,2) NOT NULL,
  `work_site` int(11) NOT NULL,
  `work_date` date NOT NULL,
  `description` longtext DEFAULT NULL,
  `check_in_location` text NOT NULL,
  `check_in_latitude` varchar(100) DEFAULT NULL,
  `check_in_longitude` varchar(100) DEFAULT NULL,
  `check_out_location` longtext DEFAULT NULL,
  `check_out_latitude` varchar(255) DEFAULT NULL,
  `check_out_longitude` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `labour_attendance`
--

INSERT INTO `labour_attendance` (`attendance_id`, `labour`, `check_in`, `check_out`, `work_time_in_minutes`, `wage_type_desc`, `wage_type_value`, `labour_rate`, `work_site`, `work_date`, `description`, `check_in_location`, `check_in_latitude`, `check_in_longitude`, `check_out_location`, `check_out_latitude`, `check_out_longitude`) VALUES
(1, 12, '2025-06-02 13:32:19', '2025-06-02 21:46:38', 494, 'Quarter', 1.5, 280.00, 7, '2025-06-02', 'Level paya work ', 'East Kolkata Wetlands, Bidhannagar, North 24 Parganas, West Bengal, 700091, India', '22.558558558559', '88.442602019088', 'Sector 5 ', '', ''),
(2, 5, '2025-06-02 13:34:22', '2025-06-02 21:46:38', 492, 'Quarter', 1.5, 490.00, 7, '2025-06-02', 'Level paya work ', 'East Kolkata Wetlands, Bidhannagar, North 24 Parganas, West Bengal, 700091, India', '22.558558558559', '88.442602019088', 'Sector 5 ', '', ''),
(3, 8, '2025-06-02 17:29:29', '2025-06-02 21:46:38', 257, 'Full', 1, 275.00, 7, '2025-06-02', 'Level paya work ', 'Sector V, Bidhannagar, North 24 Parganas, West Bengal, 700091, India', '22.5686129', '88.4462808', 'Sector 5 ', '', ''),
(4, 8, '2025-06-03 11:14:45', NULL, NULL, NULL, NULL, 275.00, 7, '2025-06-03', NULL, 'Sector V, Bidhannagar, North 24 Parganas, West Bengal, 700091, India', '22.568694', '88.446383', NULL, NULL, NULL),
(5, 5, '2025-06-03 11:15:10', '2025-06-03 17:05:50', 351, 'Full', 1, 490.00, 7, '2025-06-03', 'Sakil work', 'East Kolkata Wetlands, Bidhannagar, North 24 Parganas, West Bengal, 700091, India', '22.558558558559', '88.442602019088', 'Merlin 5th Avenue Block-2, MERLIN 5TH AVENUE, Mahish Bathan, Dhapa, Kolkata, West Bengal 700156, India', '22.5686839', '88.4464308'),
(6, 8, '2025-06-04 10:01:55', NULL, NULL, NULL, NULL, 275.00, 8, '2025-06-04', NULL, 'College Street, Bow Bazar North, Kolkata, West Bengal, 700073, India', '22.5778771', '88.3644099', NULL, NULL, NULL),
(7, 5, '2025-06-06 15:49:23', '2025-06-06 15:49:28', 0, 'Half', 0.5, 490.00, 8, '2025-06-06', 'Work', '58, Bidhan Sarani Rd, College Street Bata, New Market Area, Dharmatala, Taltala, Kolkata, West Bengal 700006, India', '22.5778461', '88.3644245', 'College Street, College Street Bata, College Row, College Street, Kolkata, West Bengal 700007, India', '22.5778329', '88.3644104'),
(8, 5, '2025-06-10 09:46:13', '2025-06-10 19:33:33', 587, 'Quarter', 1.5, 490.00, 8, '2025-06-10', 'Amazing amazing Satta Patrol lagyachi aur raging Diya lo', '58, Bidhan Sarani Rd, College Street Bata, New Market Area, Dharmatala, Taltala, Kolkata, West Bengal 700006, India', '', '', '58, Bidhan Sarani Rd, College Street Bata, New Market Area, Dharmatala, Taltala, Kolkata, West Bengal 700006, India', '', ''),
(9, 5, '2025-06-11 09:49:36', NULL, NULL, NULL, NULL, 490.00, 8, '2025-06-11', NULL, '58, Bidhan Sarani Rd, College Street Bata, New Market Area, Dharmatala, Taltala, Kolkata, West Bengal 700006, India', '22.5778939', '88.3644399', NULL, NULL, NULL),
(10, 8, '2025-06-11 10:21:29', '2025-06-11 10:21:54', 0, 'Half', 0.5, 275.00, 7, '2025-06-11', 'Work ', 'College Street Market, No. 64, College St, College Street Bata, College Street Market, College Street, Kolkata, West Bengal 700073, India', '22.5782504', '88.3644536', 'College Street Market, No. 64, College St, College Street Bata, College Street Market, College Street, Kolkata, West Bengal 700073, India', '22.5782504', '88.3644536'),
(11, 8, '2025-06-11 10:22:05', NULL, NULL, NULL, NULL, 275.00, 8, '2025-06-11', NULL, 'College Street, College Street Bata, College Row, College Street, Kolkata, West Bengal 700007, India', '22.5778422', '88.3644183', NULL, NULL, NULL),
(12, 7, '2025-06-11 10:29:20', NULL, NULL, NULL, NULL, 305.00, 8, '2025-06-11', NULL, 'College street ', '', '', NULL, NULL, NULL),
(13, 12, '2025-06-11 12:20:08', '2025-06-11 13:29:03', 69, 'Half', 0.5, 280.00, 7, '2025-06-11', 'Working ', '175, NBCC VT Campus Rd, CE Block(Newtown), Action Area I, Newtown, New Town, West Bengal 700156, India', '22.576576576577', '88.454161690218', '175, NBCC VT Campus Rd, CE Block(Newtown), Action Area I, Newtown, New Town, West Bengal 700156, India', '22.576576576577', '88.454161690218'),
(14, 12, '2025-06-11 12:20:08', NULL, NULL, NULL, NULL, 280.00, 7, '2025-06-11', NULL, '175, NBCC VT Campus Rd, CE Block(Newtown), Action Area I, Newtown, New Town, West Bengal 700156, India', '22.576576576577', '88.454161690218', NULL, NULL, NULL),
(15, 14, '2025-06-11 13:38:51', '2025-06-11 13:40:46', 2, 'Half', 0.5, 490.00, 7, '2025-06-11', 'Cutting 98\'  12\' jorai \n8 slap uthya giraya ', '12, Khashmahal Rd, Nalban Bheri, Dhapa, Kolkata, West Bengal 700105, India', '22.558558558559', '88.442602019088', '12, Khashmahal Rd, Nalban Bheri, Dhapa, Kolkata, West Bengal 700105, India', '22.558558558559', '88.442602019088'),
(16, 13, '2025-06-11 13:42:19', '2025-06-11 19:12:37', 330, 'Full', 1, 290.00, 7, '2025-06-11', 'Jahngir bahi', 'Error fetching location', '', '', 'Error fetching location', '', ''),
(17, 12, '2025-06-12 10:51:16', '2025-06-12 17:23:08', 392, 'Full', 1, 280.00, 7, '2025-06-12', 'Jahnger bahi ', '175, NBCC VT Campus Rd, CE Block(Newtown), Action Area I, Newtown, New Town, West Bengal 700156, India', '22.576576576577', '88.454161690218', '32, Tangra, Kolkata, West Bengal 700015, India', '22.558558558559', '88.384069522715'),
(18, 14, '2025-06-12 10:51:23', '2025-06-12 17:21:31', 390, 'Full', 1, 490.00, 7, '2025-06-12', 'Marbal jori kay', '12, Khashmahal Rd, Nalban Bheri, Dhapa, Kolkata, West Bengal 700105, India', '22.558558558559', '88.442602019088', '12, Khashmahal Rd, Nalban Bheri, Dhapa, Kolkata, West Bengal 700105, India', '22.558558558559', '88.442602019088'),
(19, 15, '2025-06-12 12:44:21', NULL, NULL, NULL, NULL, 265.00, 8, '2025-06-12', NULL, '78, Colootola St, Bara Bazar, Kolkata, West Bengal 700073, India', '22.576576576577', '88.356594779022', NULL, NULL, NULL),
(20, 5, '2025-06-13 09:54:45', NULL, NULL, NULL, NULL, 490.00, 8, '2025-06-13', NULL, '58, Bidhan Sarani Rd, College Street Bata, New Market Area, Dharmatala, Taltala, Kolkata, West Bengal 700006, India', '22.5778554', '88.3644207', NULL, NULL, NULL),
(21, 15, '2025-06-13 09:55:58', NULL, NULL, NULL, NULL, 265.00, 8, '2025-06-13', NULL, '78, Colootola St, Bara Bazar, Kolkata, West Bengal 700073, India', '22.576576576577', '88.356594779022', NULL, NULL, NULL),
(22, 14, '2025-06-13 10:25:20', NULL, NULL, NULL, NULL, 490.00, 9, '2025-06-13', NULL, '78, Colootola St, Bara Bazar, Kolkata, West Bengal 700073, India', '22.576576576577', '88.356594779022', NULL, NULL, NULL),
(23, 8, '2025-06-13 19:46:59', NULL, NULL, NULL, NULL, 275.00, 8, '2025-06-13', NULL, 'College Street Market, No. 64, College St, College Street Bata, College Street Market, College Street, Kolkata, West Bengal 700073, India', '22.5782504', '88.3644536', NULL, NULL, NULL),
(24, 14, '2025-06-14 09:57:57', NULL, NULL, NULL, NULL, 490.00, 8, '2025-06-14', NULL, '78, Colootola St, Bara Bazar, Kolkata, West Bengal 700073, India', '22.576576576577', '88.356594779022', NULL, NULL, NULL),
(25, 12, '2025-06-14 09:58:31', NULL, NULL, NULL, NULL, 280.00, 8, '2025-06-14', NULL, '78, Colootola St, Bara Bazar, Kolkata, West Bengal 700073, India', '22.576576576577', '88.356594779022', NULL, NULL, NULL),
(26, 8, '2025-06-14 09:58:59', NULL, NULL, NULL, NULL, 275.00, 8, '2025-06-14', NULL, 'College Street Market, No. 64, College St, College Street Bata, College Street Market, College Street, Kolkata, West Bengal 700073, India', '22.5782504', '88.3644536', NULL, NULL, NULL),
(27, 5, '2025-06-19 15:53:05', NULL, NULL, NULL, NULL, 490.00, 9, '2025-06-19', NULL, 'H9G5+9V5, Chittaranjan Ave, Bara Bazar, Kolkata, West Bengal 700073, India', '22.5759148', '88.3597358', NULL, NULL, NULL),
(28, 15, '2025-06-19 16:06:13', NULL, NULL, NULL, NULL, 265.00, 9, '2025-06-19', NULL, '78, Colootola St, Bara Bazar, Kolkata, West Bengal 700073, India', '22.576576576577', '88.356594779022', NULL, NULL, NULL),
(29, 6, '2025-06-19 16:28:54', NULL, NULL, NULL, NULL, 450.00, 9, '2025-06-19', NULL, '78, Colootola St, Bara Bazar, Kolkata, West Bengal 700073, India', '22.576576576577', '88.356594779022', NULL, NULL, NULL),
(30, 6, '2025-06-21 10:18:48', NULL, NULL, NULL, NULL, 450.00, 9, '2025-06-21', NULL, '78, Colootola St, Bara Bazar, Kolkata, West Bengal 700073, India', '22.576576576577', '88.356594779022', NULL, NULL, NULL),
(31, 5, '2025-06-21 10:19:24', '2025-06-21 19:51:36', 572, 'Quarter', 1.5, 490.00, 9, '2025-06-21', 'Sakil', '113/1, Chittaranjan Ave, Kolutolla, Kolkata, West Bengal 700073, India', '22.5759671', '88.3596319', '24, Acharya Prafulla Chandra Rd, Sealdah, Raja Bazar, Kolkata, West Bengal 700014, India', '22.567363', '88.3709868'),
(32, 15, '2025-06-21 10:32:43', '2025-06-21 19:39:48', 547, 'Quarter', 1.5, 265.00, 9, '2025-06-21', 'Sakil', '78, Colootola St, Bara Bazar, Kolkata, West Bengal 700073, India', '22.576576576577', '88.356594779022', '3A/H/17, Garpar, Machuabazar, Kolkata, West Bengal 700009, India', '22.576576576577', '88.376108161261'),
(33, 7, '2025-06-21 10:33:22', NULL, NULL, NULL, NULL, 305.00, 9, '2025-06-21', NULL, 'H9G5+9V5, Chittaranjan Ave, Bara Bazar, Kolkata, West Bengal 700073, India', '22.575904', '88.3596846', NULL, NULL, NULL),
(34, 8, '2025-06-21 10:33:57', NULL, NULL, NULL, NULL, 275.00, 9, '2025-06-21', NULL, 'Error fetching location', '', '', NULL, NULL, NULL),
(35, 5, '2025-06-23 12:47:49', '2025-06-23 18:45:11', 357, 'Full', 1, 490.00, 7, '2025-06-23', '4 slap uthaye 4 slap sarkaye fir slap giraye 4 ka lime sidha kiye \n2 ghonta pani k jugar mai waist hogaya ', 'Merlin 5th Avenue Block-1, MERLIN 5TH AVENUE, Mahish Bathan, Dhapa, Kolkata, West Bengal 700156, India', '22.5688956', '88.4462717', 'Merlin 5th Avenue Block-1, MERLIN 5TH AVENUE, Mahish Bathan, Dhapa, Kolkata, West Bengal 700156, India', '22.5686263', '88.4461764'),
(36, 15, '2025-06-23 13:28:31', NULL, NULL, NULL, NULL, 265.00, 7, '2025-06-23', NULL, '12, Khashmahal Rd, Nalban Bheri, Dhapa, Kolkata, West Bengal 700105, India', '22.558558558559', '88.442602019088', NULL, NULL, NULL),
(37, 8, '2025-06-23 13:28:45', NULL, NULL, NULL, NULL, 275.00, 7, '2025-06-23', NULL, 'Merlin 5th Avenue Block-2, MERLIN 5TH AVENUE, Mahish Bathan, Dhapa, Kolkata, West Bengal 700156, India', '22.5686043', '88.4465394', NULL, NULL, NULL),
(38, 6, '2025-06-24 14:22:30', '2025-06-24 19:09:04', 287, 'Full', 1, 450.00, 7, '2025-06-24', '4pic salf jorai', 'HF56+CR Hatgachha, Kolkata, West Bengal, India', '22.558558558559', '88.462112851212', 'HF56+CR Hatgachha, Kolkata, West Bengal, India', '22.558558558559', '88.462112851212'),
(39, 8, '2025-06-24 14:23:53', NULL, NULL, NULL, NULL, 275.00, 7, '2025-06-24', NULL, 'Mohishbathan, Nalban Bheri, Dhapa, West Bengal 700156, India', '22.5697369', '88.4450824', NULL, NULL, NULL),
(40, 15, '2025-06-24 15:54:58', NULL, NULL, NULL, NULL, 265.00, 9, '2025-06-24', NULL, '3A/H/17, Garpar, Machuabazar, Kolkata, West Bengal 700009, India', '22.576576576577', '88.376108161261', NULL, NULL, NULL),
(41, 6, '2025-06-25 10:47:42', '2025-06-25 19:20:52', 513, 'Quarter', 1.5, 450.00, 7, '2025-06-25', 'Jorai', '175, NBCC VT Campus Rd, CE Block(Newtown), Action Area I, Newtown, New Town, West Bengal 700156, India', '22.576576576577', '88.454161690218', '12, Khashmahal Rd, Nalban Bheri, Dhapa, Kolkata, West Bengal 700105, India', '22.558558558559', '88.442602019088'),
(42, 5, '2025-06-25 11:01:53', '2025-06-25 22:27:46', 686, 'Double', 2, 490.00, 5, '2025-06-25', 'Mandir ka Pathar Laga  22 ps take uatha', '15C, RN Tagore Rd, Krishnanagar, West Bengal 741101, India', '23.4121552', '88.4943022', '98, High St, Krishnanagar, West Bengal 741101, India', '23.4122727', '88.4942733'),
(43, 7, '2025-06-25 11:44:04', NULL, NULL, NULL, NULL, 305.00, 7, '2025-06-25', NULL, 'Merlin 5th Avenue Block-2, MERLIN 5TH AVENUE, Mahish Bathan, Dhapa, Kolkata, West Bengal 700156, India', '22.5686317', '88.4463499', NULL, NULL, NULL),
(44, 5, '2025-06-26 08:33:26', NULL, NULL, NULL, NULL, 490.00, 5, '2025-06-26', NULL, '15c, RN Tagore Rd, Krishnanagar, West Bengal 741101, India', '23.4122127', '88.4943116', NULL, NULL, NULL),
(45, 6, '2025-06-26 10:57:40', '2025-06-26 19:10:04', 492, 'Quarter', 1.5, 450.00, 7, '2025-06-26', 'Jorai', '12, Khashmahal Rd, Nalban Bheri, Dhapa, Kolkata, West Bengal 700105, India', '22.558558558559', '88.442602019088', '12, Khashmahal Rd, Nalban Bheri, Dhapa, Kolkata, West Bengal 700105, India', '22.558558558559', '88.442602019088'),
(46, 7, '2025-06-26 11:50:09', NULL, NULL, NULL, NULL, 305.00, 7, '2025-06-26', NULL, 'Merlin 5th Avenue Block-2, MERLIN 5TH AVENUE, Mahish Bathan, Dhapa, Kolkata, West Bengal 700156, India', '22.568568', '88.4465839', NULL, NULL, NULL),
(47, 15, '2025-06-26 11:50:27', '2025-06-26 19:08:38', 438, 'Full', 1, 265.00, 7, '2025-06-26', 'Raju Da', 'Error fetching location', '', '', 'RS Software, DN Block, Sector V, Bidhannagar, West Bengal 700091, India', '22.576576576577', '88.434648307979'),
(48, 11, '2025-06-26 11:14:00', NULL, NULL, NULL, NULL, 275.00, 7, '2025-06-26', NULL, 'Sector 5 ', '', '', NULL, NULL, NULL),
(49, 8, '2025-06-26 12:07:57', NULL, NULL, NULL, NULL, 275.00, 7, '2025-06-26', NULL, 'Error fetching location', '', '', NULL, NULL, NULL),
(50, 5, '2025-06-27 08:45:42', '2025-06-27 21:44:49', 779, 'Double', 2, 490.00, 5, '2025-06-27', '5pc tiles 6 pc patti cutting. \n2pc counter full complt', '27, RN Tagore Rd, Krishnanagar, West Bengal 741101, India', '23.4118013', '88.4953231', 'CF6V+WPQ, Krishnanagar, West Bengal 741101, India', '23.4122632', '88.4943891'),
(51, 15, '2025-06-27 10:40:04', NULL, NULL, NULL, NULL, 265.00, 7, '2025-06-27', NULL, '12, Khashmahal Rd, Nalban Bheri, Dhapa, Kolkata, West Bengal 700105, India', '22.558558558559', '88.442602019088', NULL, NULL, NULL),
(52, 7, '2025-06-27 10:40:16', NULL, NULL, NULL, NULL, 305.00, 8, '2025-06-27', NULL, '58, Bidhan Sarani Rd, College Street Bata, New Market Area, Dharmatala, Taltala, Kolkata, West Bengal 700006, India', '22.577924', '88.3643836', NULL, NULL, NULL),
(53, 6, '2025-06-27 10:40:24', '2025-06-27 10:48:21', 8, 'Half', 0.5, 450.00, 8, '2025-06-27', 'Tile fitting ', '78, Colootola St, Bara Bazar, Kolkata, West Bengal 700073, India', '22.576576576577', '88.356594779022', '78, Colootola St, Bara Bazar, Kolkata, West Bengal 700073, India', '22.576576576577', '88.356594779022'),
(54, 5, '2025-06-28 09:09:04', '2025-06-28 21:52:12', 763, 'Double', 2, 490.00, 5, '2025-06-28', '\n3 pc counter full complt \n1 counter half finis \nOr tilesh nhi hai \n', '15C, RN Tagore Rd, Krishnanagar, West Bengal 741101, India', '23.4121983', '88.4942317', 'R.N. TAGORE ROAD, High St, opp. PADIA BUILDING, Krishnanagar, West Bengal 741101, India', '23.4121168', '88.4945236'),
(55, 6, '2025-06-28 10:44:08', '2025-06-28 18:58:27', 494, 'Quarter', 1.5, 450.00, 7, '2025-06-28', 'Jorai। \nHall clear', '175, NBCC VT Campus Rd, CE Block(Newtown), Action Area I, Newtown, New Town, West Bengal 700156, India', '22.576576576577', '88.454161690218', '175, NBCC VT Campus Rd, CE Block(Newtown), Action Area I, Newtown, New Town, West Bengal 700156, India', '22.576576576577', '88.454161690218'),
(56, 15, '2025-06-28 11:32:25', '2025-06-28 18:58:34', 446, 'Full', 1, 265.00, 7, '2025-06-28', 'Raju DA', '175, NBCC VT Campus Rd, CE Block(Newtown), Action Area I, Newtown, New Town, West Bengal 700156, India', '22.576576576577', '88.454161690218', '175, NBCC VT Campus Rd, CE Block(Newtown), Action Area I, Newtown, New Town, West Bengal 700156, India', '22.576576576577', '88.454161690218'),
(57, 7, '2025-06-28 11:50:16', NULL, NULL, NULL, NULL, 305.00, 7, '2025-06-28', NULL, 'Merlin 5th Avenue Block-2, MERLIN 5TH AVENUE, Mahish Bathan, Dhapa, Kolkata, West Bengal 700156, India', '22.5685879', '88.44637', NULL, NULL, NULL),
(58, 8, '2025-06-28 12:02:51', NULL, NULL, NULL, NULL, 275.00, 7, '2025-06-28', NULL, 'Error fetching location', '', '', NULL, NULL, NULL),
(59, 5, '2025-06-29 09:02:57', '2025-06-29 20:51:11', 708, 'Double', 2, 490.00, 5, '2025-06-29', '1 pc counter full finish ', '98, RN Tagore Road, Tagore road, beside Nnoni, R.N, Krishnanagar, West Bengal 741101, India', '23.4121221', '88.4943532', 'CF6V+WPQ, Krishnanagar, West Bengal 741101, India', '23.4122994', '88.4943716'),
(60, 9, '2025-06-29 09:13:45', NULL, NULL, NULL, NULL, 320.00, 5, '2025-06-29', NULL, 'Cathedral Road, Krishnanagar City, Krishnanagar, Krishnagar-I, Nadia, West Bengal, 741101, India', '23.405405405405', '88.488274266993', NULL, NULL, NULL),
(61, 5, '2025-06-30 09:12:42', NULL, NULL, NULL, NULL, 490.00, 5, '2025-06-30', NULL, '15C, RN Tagore Rd, Krishnanagar, West Bengal 741101, India', '23.4121839', '88.4942306', NULL, NULL, NULL),
(62, 5, '2025-07-01 09:17:02', NULL, NULL, NULL, NULL, 490.00, 5, '2025-07-01', NULL, 'CF6V+WR3, Nadia, Krishnanagar, West Bengal 741101, India', '23.4122407', '88.4944921', NULL, NULL, NULL),
(63, 5, '2025-07-02 10:34:54', '2025-07-02 21:40:15', 665, 'Double', 2, 490.00, 5, '2025-07-02', 'Cash counter finis lift front floor clening ', '2/D, RN Tagore Rd, Krishnanagar, West Bengal 741101, India', '23.4120473', '88.4943505', '1, RN Tagore Rd, Krishnanagar, West Bengal 741101, India', '23.4125701', '88.4942565'),
(64, 5, '2025-07-03 09:23:45', '2025-07-03 22:03:52', 760, 'Double', 2, 490.00, 5, '2025-07-03', 'Niche ka florr finish. \nFist floor lift wall ka cutting', '98, RN Tagore Rd, Shona Porti, Krishnanagar, West Bengal 741101, India', '23.4125028', '88.4942595', '21, R.N.Tagore Road, High St, Krishnanagar, West Bengal 741101, India', '23.4124983', '88.494326'),
(65, 5, '2025-07-04 09:22:29', NULL, NULL, NULL, NULL, 490.00, 5, '2025-07-04', NULL, '1, RN Tagore Rd, Krishnanagar, West Bengal 741101, India', '23.4125948', '88.494219', NULL, NULL, NULL),
(66, 5, '2025-07-05 11:56:29', NULL, NULL, NULL, NULL, 490.00, 5, '2025-07-05', NULL, '1, RN Tagore Rd, Krishnanagar, West Bengal 741101, India', '23.4125631', '88.4942896', NULL, NULL, NULL),
(67, 15, '2025-07-09 10:18:45', NULL, NULL, NULL, NULL, 300.00, 2, '2025-07-09', NULL, '62/1, Durga Charan Doctor Ln, Maula Ali, Taltala, Kolkata, West Bengal 700014, India', '22.558558558559', '88.364558690591', NULL, NULL, NULL),
(68, 9, '2025-07-11 12:48:55', '2025-07-11 12:53:07', 4, 'Half', 0.5, 370.00, 5, '2025-07-11', 'Fhfhfhdyxhfydhfhf', '39/3, Mali Para, Krishnanagar, West Bengal 741101, India', '23.405405405405', '88.50790778691', '39/3, Mali Para, Krishnanagar, West Bengal 741101, India', '23.405405405405', '88.50790778691'),
(69, 5, '2025-07-11 12:53:28', '2025-07-11 21:46:17', 533, 'Quarter', 1.5, 550.00, 5, '2025-07-11', 'Piler 1 pc fitting upar la 10 inch tukra baki  ... Mandir top finish ', 'হাইস্ট্রীট, আর.এন. ঠাকুর রোড, কৃষ্ণনগর, নদীয়া, CF6V+XPM, Krishnanagar, West Bengal 741101, India', '23.4124956', '88.4942821', '1, RN Tagore Rd, Krishnanagar, West Bengal 741101, India', '23.4125601', '88.494271'),
(70, 5, '2025-07-12 09:13:50', NULL, NULL, NULL, NULL, 550.00, 5, '2025-07-12', NULL, '98, RN Tagore Rd, Shona Porti, Krishnanagar, West Bengal 741101, India', '23.4124768', '88.4942533', NULL, NULL, NULL),
(71, 15, '2025-07-12 09:19:30', NULL, NULL, NULL, NULL, 300.00, 5, '2025-07-12', NULL, 'Error fetching location', '', '', NULL, NULL, NULL),
(72, 9, '2025-07-12 09:22:48', NULL, NULL, NULL, NULL, 370.00, 5, '2025-07-12', NULL, '145, Mali Para, Krishnanagar, West Bengal 741101, India', '23.405405405405', '88.488274266993', NULL, NULL, NULL),
(73, 5, '2025-07-13 09:24:53', '2025-07-13 22:27:04', 782, 'Double', 2, 550.00, 5, '2025-07-13', 'Piller cmplt lift face marbale cutting ', 'CF7V+2PQ, Mohitosh Biswas St, Krishnanagar, West Bengal 741101, India', '23.4126026', '88.4942962', '1, RN Tagore Rd, Krishnanagar, West Bengal 741101, India', '23.4125898', '88.4942659'),
(74, 9, '2025-07-13 09:25:51', NULL, NULL, NULL, NULL, 370.00, 5, '2025-07-13', NULL, 'Error fetching location', '', '', NULL, NULL, NULL),
(75, 5, '2025-07-14 08:20:00', NULL, NULL, NULL, NULL, 550.00, 5, '2025-07-14', NULL, 'আর.এন.ঠাকুর রোড, হাইষ্ট্রীট, কৃষ্ণনগর, নদীয়া ।, CF6V+XPC, Krishnanagar, West Bengal 741101, India', '23.4124869', '88.4942938', NULL, NULL, NULL),
(76, 9, '2025-07-14 08:20:26', '2025-07-14 22:47:22', 867, 'Double', 2, 370.00, 5, '2025-07-14', 'Sakil Bhai ', 'Error fetching location', '', '', 'Error fetching location', '', ''),
(77, 6, '2025-07-14 13:30:42', NULL, NULL, NULL, NULL, 510.00, 7, '2025-07-14', NULL, '78, Colootola St, Bara Bazar, Kolkata, West Bengal 700073, India', '22.576576576577', '88.356594779022', NULL, NULL, NULL),
(78, 17, '2025-07-14 13:32:00', NULL, NULL, NULL, NULL, 300.00, 8, '2025-07-14', NULL, 'College street ', '', '', NULL, NULL, NULL),
(79, 5, '2025-07-15 08:03:48', '2025-07-15 21:17:07', 793, 'Double', 2, 550.00, 5, '2025-07-15', '3 counter finish', '40, RN Tagore Road, High Street, near Debnath High School, Krishnanagar, West Bengal 741101, India', '23.4125134', '88.4941863', '1, RN Tagore Rd, Krishnanagar, West Bengal 741101, India', '23.4125597', '88.4942953'),
(80, 9, '2025-07-15 08:07:10', NULL, NULL, NULL, NULL, 370.00, 5, '2025-07-15', NULL, 'Error fetching location', '', '', NULL, NULL, NULL),
(81, 6, '2025-07-15 09:43:42', NULL, NULL, NULL, NULL, 510.00, 8, '2025-07-15', NULL, '3A/H/17, Garpar, Machuabazar, Kolkata, West Bengal 700009, India', '22.576576576577', '88.376108161261', NULL, NULL, NULL),
(82, 15, '2025-07-15 10:20:36', NULL, NULL, NULL, NULL, 300.00, 5, '2025-07-15', NULL, '145, Mali Para, Krishnanagar, West Bengal 741101, India', '23.405405405405', '88.488274266993', NULL, NULL, NULL),
(83, 18, '2025-07-15 10:20:00', NULL, NULL, NULL, NULL, 315.00, 5, '2025-07-15', NULL, 'Krishna nagar ', '', '', NULL, NULL, NULL),
(84, 19, '2025-07-15 10:26:00', NULL, NULL, NULL, NULL, 315.00, 5, '2025-07-15', NULL, 'Krishna nagar ', '', '', NULL, NULL, NULL),
(85, 15, '2025-07-16 12:38:51', '2025-07-16 19:27:20', 408, 'Full', 1, 300.00, 10, '2025-07-16', 'Raju da', 'Error fetching location', '', '', 'H8VX+RF Kolkata, West Bengal, India', '22.594594594595', '88.348637523643'),
(86, 17, '2025-07-16 12:39:00', NULL, NULL, NULL, NULL, 300.00, 10, '2025-07-16', NULL, 'Salkia ', '', '', NULL, NULL, NULL),
(87, 18, '2025-07-16 12:40:00', NULL, NULL, NULL, NULL, 315.00, 10, '2025-07-16', NULL, 'Howrah', '', '', NULL, NULL, NULL),
(88, 5, '2025-07-17 09:02:11', NULL, NULL, NULL, NULL, 550.00, 5, '2025-07-17', NULL, 'CF7V+2PQ, Mohitosh Biswas St, Krishnanagar, West Bengal 741101, India', '23.4126147', '88.4943074', NULL, NULL, NULL),
(89, 9, '2025-07-17 10:17:48', NULL, NULL, NULL, NULL, 370.00, 5, '2025-07-17', NULL, 'CGF2+94 Parmedia, West Bengal, India', '23.423423423423', '88.50032532167', NULL, NULL, NULL),
(90, 18, '2025-07-17 10:50:04', '2025-07-17 18:10:19', 440, 'Full', 1, 315.00, 10, '2025-07-17', 'Judai complete ho chuka hai ', '50/2/1, Shri Aurobindo Rd, Babudanga, Bandhaghat, Salkia, Howrah, West Bengal 711106, India', '22.6017575', '88.343173', 'Plaza market, Bank of India, 63, Shri Aurobindo Rd, near State, Babudanga, Golabari, Bandhaghat, Salkia, Howrah, West Bengal 711106, India', '22.6017543', '88.3431552'),
(91, 6, '2025-07-18 09:56:44', NULL, NULL, NULL, NULL, 510.00, 8, '2025-07-18', NULL, '78, Colootola St, Bara Bazar, Kolkata, West Bengal 700073, India', '22.576576576577', '88.356594779022', NULL, NULL, NULL),
(92, 18, '2025-07-18 10:29:46', '2025-07-18 19:15:17', 526, 'Quarter', 1.5, 310.00, 10, '2025-07-18', 'Sakil', 'Plaza market, Bank of India, 63, Shri Aurobindo Rd, near State, Babudanga, Golabari, Bandhaghat, Salkia, Howrah, West Bengal 711106, India', '22.6017796', '88.3430507', 'Plaza market, Bank of India, 63, Shri Aurobindo Rd, near State, Babudanga, Golabari, Bandhaghat, Salkia, Howrah, West Bengal 711106, India', '22.6016964', '88.3430459'),
(93, 5, '2025-07-18 10:31:37', '2025-07-18 19:17:49', 526, 'Quarter', 1.5, 550.00, 5, '2025-07-18', 'Aath peace Mal cut ke uth Gaya aur Char peace Gira ke line cut Gaya', '15C, RN Tagore Rd, Krishnanagar, West Bengal 741101, India', '23.4122405', '88.494263', 'Plaza market, Bank of India, 63, Shri Aurobindo Rd, near State, Babudanga, Golabari, Bandhaghat, Salkia, Howrah, West Bengal 711106, India', '22.6017115', '88.3430398'),
(94, 7, '2025-07-18 10:15:00', NULL, NULL, NULL, NULL, 305.00, 8, '2025-07-18', NULL, 'College street ', '', '', NULL, NULL, NULL),
(95, 15, '2025-07-18 10:32:37', '2025-07-18 19:15:18', 523, 'Quarter', 1.5, 300.00, 10, '2025-07-18', 'Sakil', '100, Surendranagar, Liluah, Howrah, West Bengal 711204, India', '22.612612612613', '88.340686923561', '100, Surendranagar, Liluah, Howrah, West Bengal 711204, India', '22.612612612613', '88.340686923561'),
(96, 19, '2025-07-18 10:21:00', NULL, NULL, NULL, NULL, 320.00, 5, '2025-07-18', NULL, 'Krishna nagar ', '', '', NULL, NULL, NULL),
(97, 4, '2025-07-18 10:30:00', NULL, NULL, NULL, NULL, 300.00, 5, '2025-07-18', NULL, 'Krishna nagar ', '', '', NULL, NULL, NULL),
(98, 8, '2025-07-18 10:31:00', '2025-07-18 19:17:15', 526, 'Quarter', 1.5, 300.00, 10, '2025-07-18', 'Shakeel Bhai', 'Salkia ', '', '', 'Plaza market, Bank of India, 63, Shri Aurobindo Rd, near State, Babudanga, Golabari, Bandhaghat, Salkia, Howrah, West Bengal 711106, India', '22.6017549', '88.343108'),
(99, 11, '2025-07-18 10:33:00', NULL, NULL, NULL, NULL, 275.00, 10, '2025-07-18', NULL, 'Salkia ', '', '', NULL, NULL, NULL),
(100, 6, '2025-07-19 09:48:03', NULL, NULL, NULL, NULL, 510.00, 8, '2025-07-19', NULL, '78, Colootola St, Bara Bazar, Kolkata, West Bengal 700073, India', '22.576576576577', '88.356594779022', NULL, NULL, NULL),
(101, 7, '2025-07-19 10:08:37', NULL, NULL, NULL, NULL, 305.00, 8, '2025-07-19', NULL, 'Error fetching location', '', '', NULL, NULL, NULL),
(102, 5, '2025-07-19 10:14:33', NULL, NULL, NULL, NULL, 550.00, 10, '2025-07-19', NULL, 'Plaza market, Bank of India, 63, Shri Aurobindo Rd, near State, Babudanga, Golabari, Bandhaghat, Salkia, Howrah, West Bengal 711106, India', '22.6017238', '88.3430258', NULL, NULL, NULL),
(103, 18, '2025-07-19 10:17:53', NULL, NULL, NULL, NULL, 310.00, 10, '2025-07-19', NULL, 'Plaza market, Bank of India, 63, Shri Aurobindo Rd, near State, Babudanga, Golabari, Bandhaghat, Salkia, Howrah, West Bengal 711106, India', '22.6017148', '88.3431354', NULL, NULL, NULL),
(104, 15, '2025-07-19 10:42:34', NULL, NULL, NULL, NULL, 300.00, 10, '2025-07-19', NULL, '100, Surendranagar, Liluah, Howrah, West Bengal 711204, India', '22.612612612613', '88.340686923561', NULL, NULL, NULL),
(105, 8, '2025-07-19 10:42:45', NULL, NULL, NULL, NULL, 300.00, 10, '2025-07-19', NULL, '50/9, Benaras Rd, Babudanga, Bandhaghat, Salkia, Howrah, West Bengal 711106, India', '22.6018271', '88.3431649', NULL, NULL, NULL),
(106, 5, '2025-07-20 09:34:59', '2025-07-20 19:22:25', 587, 'Quarter', 1.5, 550.00, 10, '2025-07-20', 'Raging complete', '50/2/1, Shri Aurobindo Rd, Babudanga, Bandhaghat, Salkia, Howrah, West Bengal 711106, India', '22.6017881', '88.3431853', '36-50, Shri Aurobindo Rd, Babudanga, Bandhaghat, Mali Panchghara, Howrah, West Bengal 711106, India', '22.6017171', '88.3435208'),
(107, 18, '2025-07-20 09:35:03', '2025-07-20 19:22:55', 588, 'Quarter', 1.5, 310.00, 10, '2025-07-20', 'Sakeel', 'Plaza market, Bank of India, 63, Shri Aurobindo Rd, near State, Babudanga, Golabari, Bandhaghat, Salkia, Howrah, West Bengal 711106, India', '22.6017243', '88.3432071', '72/1, Benaras Rd, Babudanga, Bandhaghat, Salkia, Howrah, West Bengal 711106, India', '22.6016434', '88.3440853'),
(108, 9, '2025-07-20 09:47:57', NULL, NULL, NULL, NULL, 370.00, 10, '2025-07-20', NULL, 'Error fetching location', '', '', NULL, NULL, NULL),
(109, 8, '2025-07-21 11:53:55', NULL, NULL, NULL, NULL, 300.00, 10, '2025-07-21', NULL, '63, Shri Aurobindo Rd, Babudanga, Bandhaghat, Salkia, Howrah, West Bengal 711106, India', '22.6018391', '88.3431244', NULL, NULL, NULL),
(110, 18, '2025-07-21 11:54:18', '2025-07-21 19:21:11', 447, 'Full', 1, 310.00, 10, '2025-07-21', 'Raju da', '50/17, opposite Salkia Plaza Market, Babudanga, Bandhaghat, Salkia, Howrah, West Bengal 711106, India', '22.6018748', '88.3432248', '31, Shri Aurobindo Rd, Babudanga, Bandhaghat, Mali Panchghara, Howrah, West Bengal 711104, India', '22.6017162', '88.3440251'),
(111, 6, '2025-07-21 11:54:18', '2025-07-21 19:19:30', 445, 'Full', 1, 510.00, 10, '2025-07-21', 'Jorai', '173/7/2, Tikiapara, Howrah, West Bengal 711101, India', '22.594594594595', '88.329121588691', '173/7/2, Tikiapara, Howrah, West Bengal 711101, India', '22.594594594595', '88.329121588691'),
(112, 15, '2025-07-21 11:54:36', '2025-07-21 19:22:48', 448, 'Full', 1, 300.00, 10, '2025-07-21', 'Raju da', 'H8VX+RF Kolkata, West Bengal, India', '22.594594594595', '88.348637523643', 'H8VX+RF Kolkata, West Bengal, India', '22.594594594595', '88.348637523643'),
(113, 7, '2025-07-21 11:54:37', NULL, NULL, NULL, NULL, 305.00, 10, '2025-07-21', NULL, 'Error fetching location', '', '', NULL, NULL, NULL),
(114, 18, '2025-07-22 10:19:28', NULL, NULL, NULL, NULL, 310.00, 10, '2025-07-22', NULL, 'Plaza market, Bank of India, 63, Shri Aurobindo Rd, near State, Babudanga, Golabari, Bandhaghat, Salkia, Howrah, West Bengal 711106, India', '22.6017075', '88.3431032', NULL, NULL, NULL),
(115, 15, '2025-07-22 10:23:34', NULL, NULL, NULL, NULL, 300.00, 7, '2025-07-22', NULL, 'RS Software, DN Block, Sector V, Bidhannagar, West Bengal 700091, India', '22.576576576577', '88.434648307979', NULL, NULL, NULL),
(116, 5, '2025-07-22 10:26:48', NULL, NULL, NULL, NULL, 550.00, 10, '2025-07-22', NULL, 'Plaza market, Bank of India, 63, Shri Aurobindo Rd, near State, Babudanga, Golabari, Bandhaghat, Salkia, Howrah, West Bengal 711106, India', '22.6016827', '88.3431116', NULL, NULL, NULL),
(117, 6, '2025-07-22 10:35:07', NULL, NULL, NULL, NULL, 510.00, 7, '2025-07-22', NULL, '12, Khashmahal Rd, Nalban Bheri, Dhapa, Kolkata, West Bengal 700105, India', '22.558558558559', '88.442602019088', NULL, NULL, NULL),
(118, 8, '2025-07-22 11:21:00', NULL, NULL, NULL, NULL, 300.00, 7, '2025-07-22', NULL, 'MERLIN 5TH AVENUE, Merlin 5th Avenue Block-2, Merlin 5th Avenue, Mahish Bathan, Dhapa, Kolkata, West Bengal 700156, India', '22.5685515', '88.4463135', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `labour_rates`
--

CREATE TABLE `labour_rates` (
  `rate_id` bigint(20) NOT NULL,
  `labour` bigint(20) NOT NULL,
  `labour_rate` double(10,2) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `labour_rates`
--

INSERT INTO `labour_rates` (`rate_id`, `labour`, `labour_rate`, `created_by`, `created_date_time`) VALUES
(1, 5, 550.00, 2, '2025-07-07 19:49:04'),
(2, 6, 510.00, 2, '2025-07-07 19:50:31'),
(3, 7, 305.00, 2, '2025-05-15 10:25:53'),
(4, 8, 300.00, 2, '2025-07-07 19:51:40'),
(5, 9, 370.00, 2, '2025-07-07 19:53:20'),
(6, 10, 370.00, 2, '2025-05-17 08:20:58'),
(7, 11, 275.00, 2, '2025-05-17 08:21:10'),
(8, 12, 280.00, 2, '2025-05-17 08:21:52'),
(9, 13, 290.00, 2, '2025-05-17 08:22:40'),
(10, 4, 300.00, 2, '2025-07-12 21:01:56'),
(11, 14, 490.00, 2, '2025-06-11 13:37:40'),
(12, 15, 300.00, 2, '2025-07-07 19:46:53'),
(13, 16, 290.00, 2, '2025-06-11 13:38:18'),
(14, 17, 300.00, 2, '2025-07-07 20:08:05'),
(15, 19, 320.00, 2, '2025-07-17 12:53:01'),
(16, 18, 310.00, 2, '2025-07-17 12:50:36');

-- --------------------------------------------------------

--
-- Table structure for table `labour_special_wages`
--

CREATE TABLE `labour_special_wages` (
  `spcl_wage_id` bigint(20) NOT NULL,
  `labour` bigint(20) NOT NULL,
  `payment_date` date NOT NULL,
  `payment` double(15,2) NOT NULL,
  `payment_type` enum('receive','advance') NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date_time` datetime NOT NULL,
  `updated_by` bigint(20) DEFAULT NULL,
  `updated_date_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `labour_wages`
--

CREATE TABLE `labour_wages` (
  `wages_id` bigint(20) NOT NULL,
  `labour` bigint(20) NOT NULL,
  `payment_date` date NOT NULL,
  `paid_amount` double(20,2) NOT NULL,
  `payment_type` enum('weekly') NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date_time` datetime NOT NULL,
  `updated_by` bigint(20) DEFAULT NULL,
  `updated_date_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `labour_wages`
--

INSERT INTO `labour_wages` (`wages_id`, `labour`, `payment_date`, `paid_amount`, `payment_type`, `created_by`, `created_date_time`, `updated_by`, `updated_date_time`) VALUES
(1, 7, '2025-06-14', 3000.00, 'weekly', 3, '2025-06-14 12:17:23', NULL, NULL),
(2, 8, '2025-06-14', 3000.00, 'weekly', 3, '2025-06-14 12:17:50', NULL, NULL),
(3, 13, '2025-06-14', 3000.00, 'weekly', 3, '2025-06-14 12:18:15', NULL, NULL),
(4, 12, '2025-06-14', 3000.00, 'weekly', 3, '2025-06-14 12:18:34', NULL, NULL),
(5, 15, '2025-06-14', 3000.00, 'weekly', 3, '2025-06-14 12:20:20', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `machines`
--

CREATE TABLE `machines` (
  `machine_id` bigint(20) NOT NULL,
  `work_site` bigint(20) NOT NULL,
  `no_of_cutting_machine` int(11) NOT NULL,
  `no_of_grinder_machine` int(11) NOT NULL,
  `no_of_polish_machine` int(11) NOT NULL,
  `no_of_hand_machine` int(11) NOT NULL,
  `no_of_aluminium_channel` int(11) NOT NULL,
  `no_of_matam` int(11) NOT NULL,
  `created_by` bigint(20) NOT NULL,
  `created_date_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `machines`
--

INSERT INTO `machines` (`machine_id`, `work_site`, `no_of_cutting_machine`, `no_of_grinder_machine`, `no_of_polish_machine`, `no_of_hand_machine`, `no_of_aluminium_channel`, `no_of_matam`, `created_by`, `created_date_time`) VALUES
(1, 4, 12, 5, 3, 3, 3, 0, 4, '2025-05-14 14:54:48'),
(2, 3, 1, 0, 1, 2, 1, 0, 4, '2025-05-14 12:02:37'),
(3, 2, 2, 2, 0, 0, 1, 0, 4, '2025-05-14 12:06:40'),
(4, 7, 1, 1, 0, 0, 1, 0, 3, '2025-06-03 21:46:05');

-- --------------------------------------------------------

--
-- Table structure for table `machines_transfer`
--

CREATE TABLE `machines_transfer` (
  `machine_transfer_id` bigint(20) NOT NULL,
  `source_work_site` bigint(20) NOT NULL,
  `destination_work_site` bigint(20) NOT NULL,
  `no_of_cutting_machine` int(11) NOT NULL,
  `no_of_grinder_machine` int(11) NOT NULL,
  `no_of_polish_machine` int(11) NOT NULL,
  `no_of_hand_machine` int(11) NOT NULL,
  `no_of_aluminium_channel` int(11) NOT NULL,
  `no_of_matam` int(11) NOT NULL,
  `transfered_by` bigint(20) NOT NULL,
  `transfered_date_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `machines_transfer`
--

INSERT INTO `machines_transfer` (`machine_transfer_id`, `source_work_site`, `destination_work_site`, `no_of_cutting_machine`, `no_of_grinder_machine`, `no_of_polish_machine`, `no_of_hand_machine`, `no_of_aluminium_channel`, `no_of_matam`, `transfered_by`, `transfered_date_time`) VALUES
(1, 4, 7, 1, 1, 0, 0, 1, 0, 3, '2025-06-03 21:45:31');

-- --------------------------------------------------------

--
-- Table structure for table `master_module_access`
--

CREATE TABLE `master_module_access` (
  `module_access_id` int(11) NOT NULL,
  `module_access_desc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `master_module_access`
--

INSERT INTO `master_module_access` (`module_access_id`, `module_access_desc`) VALUES
(1, 'View Users'),
(2, 'Add User'),
(3, 'Edit User'),
(4, 'Delete User'),
(5, 'View Group Access'),
(6, 'Update Group Access'),
(7, 'View Work Site'),
(8, 'Add Work Site'),
(9, 'Edit Work Site'),
(10, 'Delete Work Site'),
(11, 'View Note Book'),
(12, 'Add Note Book'),
(13, 'Edit Note Book'),
(14, 'Check Note Book'),
(15, 'Delete Note Book'),
(16, 'Note Book Notification'),
(17, 'View Labour Rates'),
(18, 'Save Labour Rates'),
(19, 'Delete Labour Rates'),
(20, 'View Labour Wages'),
(21, 'Add Labour Wages'),
(22, 'Edit Labour Wages'),
(23, 'Delete Labour Wages'),
(24, 'Accept Labour Wages'),
(25, 'View Labour Special Wages'),
(26, 'Add Labour Special Wages'),
(27, 'Edit Labour Special Wages'),
(28, 'Delete Labour Special Wages'),
(29, 'Labour Attendances (For Labours)'),
(30, 'Check In (For Labours)'),
(31, 'Check Out (For Labours)'),
(32, 'Delete Attendance'),
(33, 'Manage Attendances'),
(34, 'View Machines'),
(35, 'Save Machine'),
(36, 'Delete Machine'),
(37, 'Transfer Machine'),
(38, 'Reports'),
(39, 'Labour Detailed Report'),
(40, 'Labour Attendance Report'),
(41, 'Labour Normal Wages Report'),
(42, 'Labour Special Wages Report'),
(43, 'Machine Reports'),
(44, 'Machine Transfer Reports'),
(45, 'Create Attendance'),
(46, 'Update Attendance');

-- --------------------------------------------------------

--
-- Table structure for table `master_role`
--

CREATE TABLE `master_role` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(255) NOT NULL,
  `tag` varchar(10) NOT NULL,
  `is_active` enum('yes','no') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `master_role`
--

INSERT INTO `master_role` (`role_id`, `role_name`, `tag`, `is_active`) VALUES
(-1, 'Administrator', 'AD', 'yes'),
(1, 'Supervisor-I', 'SV-I', 'yes'),
(2, 'Supervisor-II', 'SV-II', 'yes'),
(3, 'Supervisor-III', 'SV-III', 'yes'),
(4, 'Labour', 'LB', 'yes');

-- --------------------------------------------------------

--
-- Table structure for table `mas_wages_type`
--

CREATE TABLE `mas_wages_type` (
  `wages_type_id` int(11) NOT NULL,
  `wages_type_desc` varchar(255) NOT NULL,
  `wages_type_value` float NOT NULL,
  `min_mins` int(11) NOT NULL,
  `max_mins` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `mas_wages_type`
--

INSERT INTO `mas_wages_type` (`wages_type_id`, `wages_type_desc`, `wages_type_value`, `min_mins`, `max_mins`) VALUES
(1, 'Half', 0.5, 0, 240),
(2, 'Full', 1, 241, 480),
(3, 'Quarter', 1.5, 480, 600),
(4, 'Double', 2, 601, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `mm_work_site`
--

CREATE TABLE `mm_work_site` (
  `work_site_id` int(11) NOT NULL,
  `work_site_name` varchar(255) NOT NULL,
  `work_site_location` varchar(255) NOT NULL,
  `is_active` enum('yes','no') NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_date_time` datetime NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `mm_work_site`
--

INSERT INTO `mm_work_site` (`work_site_id`, `work_site_name`, `work_site_location`, `is_active`, `created_by`, `created_date_time`, `updated_by`, `updated_date_time`) VALUES
(1, 'Alipore', 'New Road', 'yes', 4, '2025-05-07 17:07:05', NULL, NULL),
(2, 'The volt ', 'Park street ', 'yes', 4, '2025-05-12 11:02:05', 4, '2025-05-16 08:31:53'),
(3, 'New alipore ', 'P 71 ', 'yes', 4, '2025-05-12 11:02:05', 4, '2025-05-15 22:29:12'),
(4, 'Home ', 'Bakultala ', 'yes', 4, '2025-05-12 17:09:57', NULL, NULL),
(5, 'Agamani Basanti', 'Krishna nagar ', 'yes', 4, '2025-05-17 08:36:42', NULL, NULL),
(6, 'Shyam kunj ', 'Lord sinha road ', 'no', 4, '2025-05-20 12:24:41', 2, '2025-06-02 15:12:58'),
(7, 'Merlin The Fourth ', 'https://maps.app.goo.gl/uBt5EqMF7Lk9DqWL9?g_st=aw', 'yes', 2, '2025-06-02 13:27:26', NULL, NULL),
(8, 'Adi dhakeswari', 'College Street ', 'yes', 2, '2025-06-02 15:15:36', NULL, NULL),
(9, 'Ali park', 'Mohammad Ali Park ', 'yes', 3, '2025-06-13 10:21:02', NULL, NULL),
(10, 'Salkia ', 'Howrah Salkia', 'yes', 3, '2025-07-16 12:38:20', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `note_books`
--

CREATE TABLE `note_books` (
  `note_book_id` bigint(20) NOT NULL,
  `note_title` varchar(100) NOT NULL,
  `work_site` int(11) NOT NULL,
  `description` text NOT NULL,
  `work_date` date NOT NULL,
  `is_active` enum('yes','no') NOT NULL,
  `checked` enum('yes','no') NOT NULL,
  `checked_by` int(11) DEFAULT NULL,
  `checked_date_time` datetime DEFAULT NULL,
  `check_note` varchar(255) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_date_time` datetime NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `note_books`
--

INSERT INTO `note_books` (`note_book_id`, `note_title`, `work_site`, `description`, `work_date`, `is_active`, `checked`, `checked_by`, `checked_date_time`, `check_note`, `created_by`, `created_date_time`, `updated_by`, `updated_date_time`) VALUES
(1, 'Merlin work sataust Roshan ', 7, '9am Morning bakultala se Chanel lekar gya 10.40 Merlin side in check out 6:20 ', '2025-06-03', 'yes', 'no', NULL, NULL, NULL, 3, '2025-06-03 21:42:58', NULL, NULL),
(2, 'Park srcus shop', 2, 'Party\' material roff camical 4,200 \nFevi queek 1 pic\'s 70\nFull clothe 1 pic\'s 40\nParty Amount 4310 \nSelf material 2 speed diamond\nSelf 300\nParty\' payment received ', '2025-06-14', 'yes', 'no', NULL, NULL, NULL, 3, '2025-06-14 15:30:30', 3, '2025-06-14 15:32:25'),
(3, 'Jan bazar ', 9, ' Party\' material \n5 fevi queek 350\n 4 Cloth 40 240 \nParty\' material amount 590 pending \nSelf material Bhekum 450', '2025-06-13', 'yes', 'no', NULL, NULL, NULL, 3, '2025-06-14 15:35:03', 3, '2025-06-14 15:35:29');

-- --------------------------------------------------------

--
-- Table structure for table `release_versions`
--

CREATE TABLE `release_versions` (
  `release_id` bigint(20) NOT NULL,
  `app_name` varchar(255) NOT NULL,
  `release_version` varchar(20) NOT NULL,
  `release_message` varchar(255) NOT NULL,
  `released_on` date NOT NULL,
  `is_latest` enum('yes','no') NOT NULL,
  `is_update_mandatory` enum('yes','no') NOT NULL,
  `app_file` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `release_versions`
--

INSERT INTO `release_versions` (`release_id`, `app_name`, `release_version`, `release_message`, `released_on`, `is_latest`, `is_update_mandatory`, `app_file`) VALUES
(1, 'Labour', '1.0.0', 'A new version of app is available. Please update', '2025-05-01', 'no', 'no', 'apk_files/labour_1-0-0.apk'),
(2, 'Labour', '1.0.1', 'A new version of app is available. Please update', '2025-05-03', 'no', 'no', 'apk_files/labour_1-0-1.apk'),
(3, 'Labour', '1.0.2', 'A new version of app is available. Please update', '2025-06-12', 'no', 'no', 'apk_files/labour_1-0-2.apk'),
(4, 'Labour', '1.0.3', 'A new version of app is available. Please update', '2025-07-22', 'yes', 'no', 'apk_files/labour_1-0-3.apk');

-- --------------------------------------------------------

--
-- Table structure for table `user_details`
--

CREATE TABLE `user_details` (
  `user_id` bigint(20) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(80) NOT NULL,
  `mobile` varchar(12) DEFAULT NULL,
  `aadhar_no` bigint(20) NOT NULL,
  `pan_no` varchar(20) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `user_role` int(11) NOT NULL,
  `is_active` enum('yes','no') NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_date_time` datetime NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `updated_date_time` datetime DEFAULT NULL,
  `user_ptext` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `user_details`
--

INSERT INTO `user_details` (`user_id`, `full_name`, `username`, `email`, `password`, `mobile`, `aadhar_no`, `pan_no`, `profile_pic`, `user_role`, `is_active`, `created_by`, `created_date_time`, `updated_by`, `updated_date_time`, `user_ptext`) VALUES
(1, 'Administrator', 'sdev', NULL, '$2y$12$UBg1JiQ1uk5LyPoZk2lny.0JvpepxVWY0QqUjxEVNkdNn2xiIWvpK', NULL, 0, NULL, NULL, -1, 'yes', 0, '0000-00-00 00:00:00', 0, '0000-00-00 00:00:00', 'sdev'),
(2, 'Alok Jha', 'Alok8391', 'alokjha646@gmail.com', '$2y$12$oYdnwQfqdgu0P9v/MblUQeCjrglv3R9p6w2jFYeOoQYY9CcfFpPVe', '9831350111', 157906721679, 'AHFPJ2803G', '', -1, 'yes', 1, '2025-05-02 20:34:11', NULL, NULL, '8391'),
(3, 'Aakash Jha', 'akash', '', '$2y$12$x/SdRFX9p7dJs7bnwSzd8.zDOO/bUz8jRNu3o1LtInd/QRoi0.pAO', '7044353014', 772555099970, '', '', 1, 'yes', 1, '2025-05-05 04:37:54', 2, '2025-06-01 20:16:27', 'jha'),
(4, 'Akbar ', 'Akbar ', '', '$2y$12$SIxVn2vWr0rNTX1/9uE.tuNLtQX5UfTtwB/czKN13LjzJ8g1NJeL2', '', 897543558713, '', '', 4, 'yes', 3, '2025-05-06 08:23:15', NULL, NULL, '123123'),
(5, 'Sakil', 'sakil', '', '$2y$12$i4V2gOsu4rE8nvVmsvVXC.nrHf.oLyS1vCjT7eOX.edwRY1MJFEJG', '8240499309', 597575066743, '', '', 4, 'yes', 3, '2025-05-07 17:03:02', 2, '2025-06-02 13:17:56', 'Sakil'),
(6, 'Raju bag ', 'Raju da', '', '$2y$12$EyDSNGG9m1yk4ThDADqAXepZG..EUolJUxF22/CUlQ0BoL4Ic.o5u', '', 730462136893, '', '', 4, 'yes', 3, '2025-05-14 12:08:16', NULL, NULL, '123123'),
(7, 'Sintu ', 'Sintu ', '', '$2y$12$XZ.okXuvw6kbZl19aLyk9Oc2YILRG9J0QCtVPOuy0Jz8aG40oBm4u', '', 700352846392, '', '', 4, 'yes', 3, '2025-05-15 10:24:57', NULL, NULL, '123123'),
(8, 'Konkon ', 'Konkon Dhara ', '', '$2y$12$LpdFq3uz82.tyauHNXYFou3Ess7XYAmhLhXpoGTd9MKnVp1wXzqEy', '', 732210363813, '', '', 4, 'yes', 3, '2025-05-15 10:26:01', NULL, NULL, '123123'),
(9, 'Sakir hossain ', 'Sakir hossain ', 'shossaon967@gmail.com', '$2y$12$JzEoWgfBmzJROkQXn8q1W.cTV02IDn75CiUnC67zlrS42MlxSZkHS', '8240516908', 201820260362, 'Aloph2193l', 'images/pro_pic/20250628200335.jpg', 4, 'yes', 3, '2025-05-15 13:27:37', 9, '2025-06-28 20:03:35', '8981458449'),
(10, 'Arman ', 'Arman ', '', '$2y$12$Uy3xYMUmT5lGkuqHm98NX.1L.xVdhWYBSLk1zcPbpc6B19Sr/EilK', '', 711446796447, '', '', 4, 'yes', 3, '2025-05-17 08:20:07', NULL, NULL, '123123'),
(11, 'Afroz ', 'Afroz ', '', '$2y$12$CTeIy2XAE5cEesaJGBXFeOgeFwrps5qG5yKDZouXRkSswfP0fzJ.6', '', 723542476447, '', '', 4, 'yes', 3, '2025-05-17 08:20:58', NULL, NULL, '123123'),
(12, 'Raja ', 'Raja ', '', '$2y$12$0oxGFlxRmxNL/o3LdsQt1.QbHr7B2qPG5rEwMJybmDEKvmmQzrNEO', '', 764883726544, '', '', 4, 'yes', 3, '2025-05-17 08:21:36', NULL, NULL, '123123'),
(13, 'Nehal', 'Nehal ', '', '$2y$12$Dkp4yzdjFc5KRi02B6/9Gugk6E2IWvXrNg3//Rtx8zbXldrV052w.', '', 990646743675, '', '', 4, 'yes', 3, '2025-05-17 08:22:28', NULL, NULL, '123123'),
(14, 'Jahangir ', 'Jahangir ', '', '$2y$12$t0nt1aLvKSt8qW7J5A50b.P8FarcrXQD.UjOyhG34wMNYAMD95/Me', '9330546729', 726327462822, '', '', 4, 'yes', 3, '2025-06-03 17:09:32', NULL, NULL, '123123'),
(15, 'Afzal ', 'Afzal ', '', '$2y$12$UKb/KAwVvzpKbn4EPyL32O.Vl5EUxq8Nvb2Mz2AIOzzaDIJgXZXge', '9330732691', 711645284077, '', '', 4, 'yes', 3, '2025-06-03 17:13:00', NULL, NULL, '123123'),
(16, 'Nehal ', 'SK ', '', '$2y$12$Z6bOwUdhqhGlESWyj5P2me2vFKQIrUUqLCLy1m9X3blboPUXfOe9.', '6291514475', 775321389023, '', '', 4, 'yes', 3, '2025-06-11 13:32:18', NULL, NULL, '123123'),
(17, 'Nasim khan ', 'Nasim ', '', '$2y$12$cQNPKeYGAuoa3y7fq9D6se5tbLaiGM1p.fMlvzu2kXMNsL18OtxuO', '8420490623', 721164826612, '', '', 4, 'yes', 3, '2025-06-23 12:49:21', NULL, NULL, '123123'),
(18, 'Jakir Hossain ', 'Jakir ', '', '$2y$12$z9.HFYQCa28zx0ggXlB9T.RgqV4WC82pc8MWSh1qg3vu8utCkR8ke', '8927650499', 260868274513, '', '', 4, 'yes', 3, '2025-07-11 12:55:05', NULL, NULL, 'Jakir123'),
(19, 'MD Sabir', 'Sabir ', '', '$2y$12$7wqR3yJMldukq/vHbgCez.xMuR6cH8bVdijPBHp3.7UMaoaYLZV2m', '8271414250', 291007025419, '', '', 4, 'yes', 3, '2025-07-11 12:58:19', NULL, NULL, 'Sabir123');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `labour_attendance`
--
ALTER TABLE `labour_attendance`
  ADD PRIMARY KEY (`attendance_id`);

--
-- Indexes for table `labour_rates`
--
ALTER TABLE `labour_rates`
  ADD PRIMARY KEY (`rate_id`);

--
-- Indexes for table `labour_special_wages`
--
ALTER TABLE `labour_special_wages`
  ADD PRIMARY KEY (`spcl_wage_id`);

--
-- Indexes for table `labour_wages`
--
ALTER TABLE `labour_wages`
  ADD PRIMARY KEY (`wages_id`);

--
-- Indexes for table `machines`
--
ALTER TABLE `machines`
  ADD PRIMARY KEY (`machine_id`);

--
-- Indexes for table `machines_transfer`
--
ALTER TABLE `machines_transfer`
  ADD PRIMARY KEY (`machine_transfer_id`);

--
-- Indexes for table `master_module_access`
--
ALTER TABLE `master_module_access`
  ADD PRIMARY KEY (`module_access_id`);

--
-- Indexes for table `master_role`
--
ALTER TABLE `master_role`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `mas_wages_type`
--
ALTER TABLE `mas_wages_type`
  ADD PRIMARY KEY (`wages_type_id`);

--
-- Indexes for table `mm_work_site`
--
ALTER TABLE `mm_work_site`
  ADD PRIMARY KEY (`work_site_id`);

--
-- Indexes for table `note_books`
--
ALTER TABLE `note_books`
  ADD PRIMARY KEY (`note_book_id`);

--
-- Indexes for table `release_versions`
--
ALTER TABLE `release_versions`
  ADD PRIMARY KEY (`release_id`);

--
-- Indexes for table `user_details`
--
ALTER TABLE `user_details`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `labour_attendance`
--
ALTER TABLE `labour_attendance`
  MODIFY `attendance_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT for table `labour_rates`
--
ALTER TABLE `labour_rates`
  MODIFY `rate_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `labour_special_wages`
--
ALTER TABLE `labour_special_wages`
  MODIFY `spcl_wage_id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `labour_wages`
--
ALTER TABLE `labour_wages`
  MODIFY `wages_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `machines`
--
ALTER TABLE `machines`
  MODIFY `machine_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `machines_transfer`
--
ALTER TABLE `machines_transfer`
  MODIFY `machine_transfer_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `master_module_access`
--
ALTER TABLE `master_module_access`
  MODIFY `module_access_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `mas_wages_type`
--
ALTER TABLE `mas_wages_type`
  MODIFY `wages_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `mm_work_site`
--
ALTER TABLE `mm_work_site`
  MODIFY `work_site_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `note_books`
--
ALTER TABLE `note_books`
  MODIFY `note_book_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `release_versions`
--
ALTER TABLE `release_versions`
  MODIFY `release_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_details`
--
ALTER TABLE `user_details`
  MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
