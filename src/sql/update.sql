TRUNCATE job;

TRUNCATE jobinfo;

TRUNCATE company;

LOAD data LOCAL INFILE '../fetch/1111/result/joball.csv' INTO TABLE job FIELDS TERMINATED by ',' ENCLOSED by '"' LINES TERMINATED by '\n' IGNORE 1 LINES;

LOAD data LOCAL INFILE '../fetch/1111/result/jobinfo.csv' INTO TABLE jobinfo FIELDS TERMINATED by ',' ENCLOSED by '"' LINES TERMINATED by '\n' IGNORE 1 LINES;

LOAD data LOCAL INFILE '../fetch/1111/result/company.csv' INTO TABLE company FIELDS TERMINATED by ',' ENCLOSED by '"' LINES TERMINATED by '\n' IGNORE 1 LINES;