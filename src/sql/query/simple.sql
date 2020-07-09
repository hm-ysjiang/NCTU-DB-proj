-- 簡易查詢 : 職缺名稱/公司名稱 + 地區
-- 假設 $NAME 和 $CC 和 $TD 是 input

-- Output 除了 jobinfo 還需要有什麼?

-- 2020/7/10 : 幹不知道為啥出來是empty set

SET @name := '', @cc := '臺中市', @td := NULL;

SELECT  jobinfo.job_name AS JOB_NAME,
        jobinfo.degree AS DEGREE,
        jobinfo.low_salary AS LOW_SALARY,
        jobinfo.high_salary AS HIGH_SALARY,
        jobinfo.exp_year AS EXP_YEAR,
        jobinfo.job_type AS JOB_TYPE,
        jobinfo.worktime AS WORKTIME,
        jobinfo.is_night AS IS_NIGHT,
        jobinfo.needed_num AS NEEDED_NUM

FROM    jobinfo, company,
                        (SELECT  job.job_id
                        FROM    job, localarea
                                

                        WHERE       job.area_id = localarea.area_id
                                AND ((@cc = NULL) OR (@cc = localarea.area_cc_name))
                                AND ((@td = NULL) OR (@td = localarea.area_td_name))
                    ) AS job
WHERE   jobinfo.job_id=job.job_id
        AND ((jobinfo.job_name LIKE "%@name%") OR (company.com_name LIKE "%@name%"))
;