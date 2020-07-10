-- 簡易查詢 : 職缺名稱/公司名稱 + 地區

-- log
-- 2020/7/10 : 幹不知道為啥出來是empty set
-- 2020/7/10 : 輸入特定關鍵字(@name)和地區(@cc, @td)的功能可以run了。Output 除了 jobinfo 和 com_name 以外還需要有什麼?

SET @name = 'nike', @cc = NULL, @td = NULL;

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

FROM    jobinfo, company, (
                                SELECT  job.job_id, job.com_id
                                FROM    job, localarea
                                WHERE       job.area_id = localarea.area_id
                                        AND (@cc is NULL) OR (@cc = localarea.area_cc_name)) -- 判斷是否是NULL要用 "is NULL"
                                        AND (@td is NULL) OR (@td = localarea.area_td_name)) -- 不能用 "= NULL"
                                ) AS job
WHERE   jobinfo.job_id = job.job_id
        AND job.com_id = company.com_id
        AND ((jobinfo.job_name LIKE CONCAT('%', @name, '%')) OR (company.com_name LIKE CONCAT('%', @name, '%'))) -- 記得用CONCAT連結字串不要亂用operator
;