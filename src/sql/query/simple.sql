-- 簡易查詢 : 職缺名稱/公司名稱 + 地區
-- log
-- 2020/7/10 : 幹不知道為啥出來是empty set
-- 2020/7/10 : 輸入特定關鍵字(@name)和地區(@cc, @td)的功能可以run了。Output 除了 jobinfo 和 com_name 以外還需要有什麼?
SELECT
        t.*,
        p.pos_field,
        p.pos_name,
        l.area_cctd_name
FROM
        (
                SELECT
                        job.job_id,
                        job.pos_id AS pos_id,
                        job.area_id AS area_id,
                        jobinfo.job_name,
                        company.com_name,
                        jobinfo.low_salary,
                        jobinfo.high_salary
                FROM
                        jobinfo,
                        company,
                        job
                WHERE
                        jobinfo.job_id = job.job_id
                        AND job.com_id = company.com_id
                        AND (
                                (jobinfo.job_name LIKE CONCAT("%", "nike", "%"))
                                OR (company.com_name LIKE CONCAT("%", "nike", "%"))
                        )
        ) AS t,
        position p,
        localarea l
WHERE
        t.pos_id = p.pos_id
        AND t.area_id = l.area_id;