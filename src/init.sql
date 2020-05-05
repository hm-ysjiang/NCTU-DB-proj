CREATE TABLE localarea (
    area_id smallint NOT NULL,
    area_cc_name varchar(10) NOT NULL,
    area_td_name varchar(10) NOT NULL,
    area_cctd_name varchar(10) NOT NULL,
    PRIMARY KEY (area_id)
);

LOAD data LOCAL INFILE './sql/rawdata/localareaname.csv' INTO TABLE localarea FIELDS TERMINATED by ',' ENCLOSED by '"' LINES TERMINATED by '\n' IGNORE 1 LINES;