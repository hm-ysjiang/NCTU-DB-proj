CREATE TABLE job (
    job_id int NOT NULL,
    com_id int NOT NULL,
    pos_id int NOT NULL,
    area_id smallint NOT NULL,
    PRIMARY KEY (job_id)
);

CREATE TABLE jobinfo (
    job_id int NOT NULL,
    job_name varchar(100) NOT NULL,
    degree tinyint NOT NULL,
    low_salary int,
    high_salary int,
    exp_year tinyint NOT NULL,
    job_type boolean NOT NULL,
    worktime float NOT NULL,
    is_night tinyint NOT NULL,
    needed_num tinyint,
    PRIMARY KEY (job_id)
);

CREATE TABLE company(
    com_id int NOT NULL,
    com_name varchar(100) NOT NULL,
    capital varchar(10),
    emp_number int,
    addr varchar(100),
    PRIMARY KEY (com_id)
);

CREATE TABLE localarea (
    area_id smallint NOT NULL,
    area_cc_name varchar(10) NOT NULL,
    area_td_name varchar(10) NOT NULL,
    area_cctd_name varchar(10) NOT NULL,
    PRIMARY KEY (area_id)
);

CREATE TABLE position (
    pos_id int NOT NULL,
    pos_field varchar(8) NOT NULL,
    pos_name varchar(20) NOT NULL,
    PRIMARY KEY (pos_id)
);

LOAD data LOCAL INFILE './rawdata/position.csv' INTO TABLE position FIELDS TERMINATED by ',' ENCLOSED by '"' LINES TERMINATED by '\n' IGNORE 1 LINES;

LOAD data LOCAL INFILE './rawdata/localareaname.csv' INTO TABLE localarea FIELDS TERMINATED by ',' ENCLOSED by '"' LINES TERMINATED by '\n' IGNORE 1 LINES;