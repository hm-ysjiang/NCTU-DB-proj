TRUNCATE job;

TRUNCATE jobinfo;

TRUNCATE company;

LOAD data LOCAL INFILE '../fetch/1111/result/07110636/joball.csv' INTO TABLE job FIELDS TERMINATED by ',' ENCLOSED by '"' LINES TERMINATED by '\n' IGNORE 1 LINES;

LOAD data LOCAL INFILE '../fetch/1111/result/07110636/jobinfo.csv' INTO TABLE jobinfo FIELDS TERMINATED by ',' ENCLOSED by '"' LINES TERMINATED by '\n' IGNORE 1 LINES;

LOAD data LOCAL INFILE '../fetch/1111/result/07110636/company.csv' INTO TABLE company FIELDS TERMINATED by ',' ENCLOSED by '"' LINES TERMINATED by '\n' IGNORE 1 LINES;

DELETE FROM
    favorite
WHERE
    job_id NOT IN (
        SELECT
            job_id
        FROM
            job
    );