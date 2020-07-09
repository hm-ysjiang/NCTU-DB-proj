-- 透過 job_info 內的 constraint 搜尋職缺
-- Input Variables
-- $NAM, $DEGREE, $SALARY,
-- $EXP_YEAR, $JOB_TYPE, $WORKTIME_MIN, $WORKTIME_MAX, $IS_NIGHT, $NEEDED_NUMBER


SELECT  job_info.job_name AS JOB_NAME,
        job_info.degree AS DEGREE,
        job_info.low_salary AS LOW_SALARY,
        job_info.high_salary AS HIGH_SALARY,
        job_info.exp_year AS EXP_YEAR,
        job_info.job_type AS JOB_TYPE,
        job_info.worktime AS WORKTIME,
        job_info.is_night AS IS_NIGHT,
        job_info.needed_number AS NEEDED_NUMBER

FROM    joball
        INNER JOIN job_info
        USING job_id

WHERE       (($NAM = NULL)          OR (JOB_NAME LIKE "%$NAM%")                         )
        AND (($DEGREE = NULL)        OR ($DEGREE >= DEGREE)                             )
        AND (($EXP_YEAR = NULL)      OR ($EXP_YEAR >= EXP_YEAR)                         )
        AND (($WORKTIME_MIN = NULL)  OR ($WORKTIME_MIN <= WORKTIME)                     )
        AND (($WORKTIME_MAX = NULL)  OR ($WORKTIME_MAX >= WORKTIME)                     )
        AND (($IS_NIGHT = NULL)      OR ($IS_NIGHT = IS_NIGHT)                          )
        AND (($NEEDED_NUMBER = NULL) OR ($NEEDED_NUMBER <= NEEDED_NUMBER)               )
        AND (($JOB_TYPE = NULL)      OR ($JOB_TYPE = JOB_TYPE)                          )

        AND (($SALARY = NULL)        OR                                                    -- 要馬沒有指定薪資
             (($JOB_TYPE = JOB_TYPE) AND ($SALARY BETWEEN LOW_SALARY AND HIGH_SALARY))  )  -- 要馬要有設定type才能指定薪資
;