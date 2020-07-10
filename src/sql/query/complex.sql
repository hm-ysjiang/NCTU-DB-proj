-- 複合查詢 : 透過 jobinfo 內的 constraint 搜尋職缺

-- log
-- 2020/7/10 : 幹你娘這個出來也是empty set
-- 2020/7/10 : 基於jobinfo 的查詢可以run了

SET @name = '經理', @degree = 6, @salary = 100000, @exp_year = NULL, @job_type = 0,
    @worktime_min = NULL, @worktime_max = NULL, @is_night = NULL, @needed_num = NULL;

SELECT  company.com_name AS COM_NAME,
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