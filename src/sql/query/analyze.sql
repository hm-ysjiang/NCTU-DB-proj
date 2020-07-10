-- analysis : 基於輸入項分析選定的職缺資訊

-- log
-- need to figure out what kind info may be useful

SET @info = 'result.degree',
    @name = '經理', @degree = NULL, @salary = 100000, @exp_year = NULL, @job_type = 0,
    @worktime_min = NULL, @worktime_max = NULL, @is_night = NULL, @needed_num = NULL;

-- create temp table & insert
CREATE TEMPORARY TABLE result(
    job_id int NOT NULL,
    com_name varchar(100) NOT NULL,
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
INSERT INTO result(job_id, com_name, job_name, degree, low_salary, high_salary, exp_year, job_type, worktime, is_night, needed_num)
SELECT  job.job_id AS JOB_ID,
        company.com_name AS COM_NAME,
        jobinfo.job_name AS JOB_NAME,
        jobinfo.degree AS DEGREE,
        jobinfo.low_salary AS LOW_SALARY,
        jobinfo.high_salary AS HIGH_SALARY,
        jobinfo.exp_year AS EXP_YEAR,
        jobinfo.job_type AS JOB_TYPE,
        jobinfo.worktime AS WORKTIME,
        jobinfo.is_night AS IS_NIGHT,
        jobinfo.needed_num AS NEEDED_NUM

FROM    job, jobinfo, company

WHERE   job.job_id = jobinfo.job_id
        AND job.com_id = company.com_id
        AND ((@name is NULL)          OR (JOB_NAME LIKE CONCAT('%', @name, '%'))       )
        AND ((@degree is NULL)        OR (@degree >= DEGREE)                           )
        AND ((@exp_year is NULL)      OR (@exp_year >= EXP_YEAR)                       )
        AND ((@worktime_min is NULL)  OR (@worktime_min <= WORKTIME)                   )
        AND ((@worktime_max is NULL)  OR (@worktime_max >= WORKTIME)                   )
        AND ((@is_night is NULL)      OR (@is_night = IS_NIGHT)                        )
        AND ((@needed_num is NULL)    OR (@needed_num <= NEEDED_NUM)                   )
        AND ((@job_type is NULL)      OR (@job_type = JOB_TYPE)                        )

        AND ((@salary is NULL)        OR
            ((@job_type = JOB_TYPE)                                                              -- 要馬沒有指定薪資
            AND ((HIGH_SALARY is NULL AND LOW_SALARY >= @salary) OR (HIGH_SALARY >= @salary))))  -- 要馬要有設定type才能指定薪資
;
-- end of insertion

-- query info in need
select * from result;
select avg(degree), avg(exp_year), avg(worktime) from result;
select degree, count(*) from result GROUP BY degree;
select exp_year, count(*) from result GROUP BY exp_year;
select worktime, count(*) from result GROUP BY worktime;


-- drop temp table
DROP TEMPORARY TABLE result;



