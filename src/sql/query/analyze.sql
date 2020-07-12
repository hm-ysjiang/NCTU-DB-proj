-- analysis : 基於輸入項分析選定的職缺資訊

-- log
-- need to figure out what kind info may be useful
-- 新增 pos_name, pos_field, cc, td，並且將儲存資訊從薪資上下限改成平均

SET @name = NULL, @degree = NULL, @salary = NULL, @exp_year = NULL, @job_type = NULL,
    @worktime_min = NULL, @worktime_max = NULL, @is_night = NULL, @needed_num = NULL, @cc = NULL, @td = NULL,
    @pos_name = NULL, @pos_field = '管理'
;

-- create temp table & insert
CREATE TEMPORARY TABLE result(
    job_id int NOT NULL,
    pos_field varchar(8) NOT NULL,
    pos_name varchar(20) NOT NULL,
    area_cc_name varchar(10) NOT NULL,
    area_td_name varchar(10) NOT NULL,
    com_name varchar(100) NOT NULL,
    job_name varchar(100) NOT NULL,
    degree tinyint NOT NULL,
    salary int,
    exp_year tinyint NOT NULL,
    job_type boolean NOT NULL,
    worktime float NOT NULL,
    is_night tinyint NOT NULL,
    needed_num tinyint,
    PRIMARY KEY (job_id)
);
INSERT INTO result(job_id, pos_field, pos_name, area_cc_name, area_td_name, com_name, job_name, degree, salary, exp_year, job_type, worktime, is_night, needed_num)
SELECT  job.job_id AS JOB_ID,
        position.pos_field AS POS_FIELD,
        position.pos_name AS POS_NAME,
        job.area_cc_name AS CC_NAME,
        job.area_td_name AS TD_NAME,
        company.com_name AS COM_NAME,
        jobinfo.job_name AS JOB_NAME,
        jobinfo.degree AS DEGREE,
        IF((jobinfo.high_salary is NULL), jobinfo.low_salary, ((jobinfo.low_salary+jobinfo.high_salary)/2)) AS SALARY,
        jobinfo.exp_year AS EXP_YEAR,
        jobinfo.job_type AS JOB_TYPE,
        jobinfo.worktime AS WORKTIME,
        jobinfo.is_night AS IS_NIGHT,
        jobinfo.needed_num AS NEEDED_NUM
FROM    jobinfo, position, company, (
                            SELECT  job.job_id, job.com_id, job.pos_id, localarea.area_cc_name, localarea.area_td_name
                            FROM    job, localarea
                            WHERE       job.area_id = localarea.area_id
                                    AND ((@cc is NULL) OR (@cc = localarea.area_cc_name))
                                    AND ((@td is NULL) OR (@td = localarea.area_td_name))
                            ) AS job
WHERE   job.job_id = jobinfo.job_id
        AND job.com_id = company.com_id
        AND ((@degree is NULL)        OR (@degree >= jobinfo.degree)                           )
        AND ((@exp_year is NULL)      OR (@exp_year >= jobinfo.exp_year)                       )
        AND ((@worktime_min is NULL)  OR (@worktime_min <= jobinfo.worktime)                   )
        AND ((@worktime_max is NULL)  OR (@worktime_max >= jobinfo.worktime)                   )
        AND ((@is_night is NULL)      OR (@is_night = jobinfo.is_night)                        )
        AND ((@needed_num is NULL)    OR (@needed_num <= jobinfo.needed_num)                   )
        AND ((@job_type is NULL)      OR (@job_type = jobinfo.job_type)                        )
        AND ((@salary is NULL)        OR
            ((@job_type = JOB_TYPE)                                                              -- 要馬沒有指定薪資，要馬要有設定type才能指定薪資
            AND ((HIGH_SALARY is NULL AND LOW_SALARY >= @salary) OR (HIGH_SALARY >= @salary))))  -- 沒有薪資上限（通常是面議）則最低薪資需大於預期薪資，否則只要最高薪資大於即可
        -- added after 2020/7/12
        AND ((@name is NULL)          OR (jobinfo.job_name LIKE CONCAT('%', @name, '%'))
                                      OR (company.com_name LIKE CONCAT('%', @name, '%'))       )
        AND job.pos_id = position.pos_id
        AND ((@pos_name is NULL)      OR (@pos_name = position.pos_name)                            )
        AND ((@pos_field is NULL)     OR (@pos_field = position.pos_field)                          )
;
-- end of insertion

-- query info in need
select count(*) from result;

select degree, count(*) from result GROUP BY degree;
select floor((salary/10000)) as salary_intervals, count(*) from result GROUP BY salary_intervals; -- 薪資區間 以萬元為單位
select exp_year, count(*) from result GROUP BY exp_year;
select job_type, count(*) from result GROUP BY job_type;
select worktime, count(*) from result GROUP BY worktime;
select is_night, count(*) from result GROUP BY is_night;
select needed_num, count(*) from result GROUP BY needed_num ORDER BY count(*) DESC;
select area_cc_name, count(*) from result GROUP BY area_cc_name ORDER BY count(*) DESC;
select area_td_name, count(*) from result GROUP BY area_td_name ORDER BY count(*) DESC;

-- drop temp table
DROP TEMPORARY TABLE result;