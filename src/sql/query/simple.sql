-- 簡易查詢 : 職缺名稱/公司名稱 + 地區
--假設 $NAME 和 $CC 和 $TD 是 input

-- Output 除了 job_info 還需要有什麼?

SELECT  job_info.job_name AS JOB_NAME,
        job_info.degree AS DEGREE,
        job_info.low_salary AS LOW_SALARY,
        job_info.high_salary AS HIGH_SALARY,
        job_info.exp_year AS EXP_YEAR,
        job_info.job_type AS JOB_TYPE,
        job_info.worktime AS WORKTIME,
        job_info.is_night AS IS_NIGHT,
        job_info.needed_number AS NEEDED_NUMBER

FROM    job_info
        INNER JOIN
                    (SELECT  joball.job_id
                        FROM    joball
                                INNER JOIN localarea
                                USING area_id

                        WHERE       (($CC = NULL) OR ($CC = localarea.area_cc_name))
                                AND (($TD = NULL) OR ($TD = localarea.area_td_name))
                    ) AS job
        USING job_id

WHERE      (job_info.job_name LIKE "%$NAME%")
        OR (company.com_name LIKE "%$NAME%")
;