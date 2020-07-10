-- 透過 jobinfo 內的 constraint 搜尋職缺
-- Input Variables :
-- $NAM, $DEGREE, $SALARY,
-- $EXP_YEAR, $JOB_TYPE, $WORKTIME_MIN, $WORKTIME_MAX, $IS_NIGHT, $NEEDED_NUMBER

-- 2020/7/10 : 幹你娘這個出來也是empty set

SET @name='經理', @degree=6, @salary=40000, @exp_year=NULL, @job_type=0,
    @worktime_min=NULL, @worktime_max=NULL, @is_night=NULL, @needed_number=NULL;

SELECT  jobinfo.job_name AS JOB_NAME,
        jobinfo.degree AS DEGREE,
        jobinfo.low_salary AS LOW_SALARY,
        jobinfo.high_salary AS HIGH_SALARY,
        jobinfo.exp_year AS EXP_YEAR,
        jobinfo.job_type AS JOB_TYPE,
        jobinfo.worktime AS WORKTIME,
        jobinfo.is_night AS IS_NIGHT,
        jobinfo.needed_num AS NEEDED_NUM

FROM    job, jobinfo

WHERE   job.job_id = jobinfo.job_id
        AND ((@name = NULL)          OR (JOB_NAME LIKE "%@name%")                       )
        AND ((@degree = NULL)        OR (@degree >= DEGREE)                             )
        AND ((@exp_year = NULL)      OR (@exp_year >= EXP_YEAR)                         )
        AND ((@worktime_min = NULL)  OR (@worktime_min <= WORKTIME)                     )
        AND ((@worktime_max = NULL)  OR (@worktime_max >= WORKTIME)                     )
        AND ((@is_night = NULL)      OR (@is_night = IS_NIGHT)                          )
        AND ((@needed_number = NULL) OR (@needed_number <= NEEDED_NUM)                  )
        AND ((@job_type = NULL)      OR (@job_type = JOB_TYPE)                          )

        AND ((@salary = NULL)        OR                                                    -- 要馬沒有指定薪資
             ((@job_type = JOB_TYPE) AND (@salary BETWEEN LOW_SALARY AND HIGH_SALARY))  )  -- 要馬要有設定type才能指定薪資
;