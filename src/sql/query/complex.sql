-- 透過 job_info 內的 constraint 搜尋職缺
-- Input Variables :
-- $NAM, $DEGREE, $SALARY,
-- $EXP_YEAR, $JOB_TYPE, $WORKTIME_MIN, $WORKTIME_MAX, $IS_NIGHT, $NEEDED_NUMBER

SET @name='經理', @degree=6, @salary=40000, @exp_year=NULL, @job_type=0,
    @worktime_min=NULL, @worktime_max=NULL, @is_night=NULL, @needed_number=NULL;

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

WHERE       ((@name = NULL)          OR (JOB_NAME LIKE "%@name%")                       )
        AND ((@degree = NULL)        OR (@degree >= DEGREE)                             )
        AND ((@exp_year = NULL)      OR (@exp_year >= EXP_YEAR)                         )
        AND ((@worktime_min = NULL)  OR (@worktime_min <= WORKTIME)                     )
        AND ((@worktime_max = NULL)  OR (@worktime_max >= WORKTIME)                     )
        AND ((@is_night = NULL)      OR (@is_night = IS_NIGHT)                          )
        AND ((@needed_number = NULL) OR (@needed_number <= NEEDED_NUMBER)               )
        AND ((@job_type = NULL)      OR (@job_type = JOB_TYPE)                          )

        AND ((@salary = NULL)        OR                                                    -- 要馬沒有指定薪資
             ((@job_type = JOB_TYPE) AND (@salary BETWEEN LOW_SALARY AND HIGH_SALARY))  )  -- 要馬要有設定type才能指定薪資
;