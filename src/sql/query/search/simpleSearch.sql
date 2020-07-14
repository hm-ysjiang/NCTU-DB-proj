-- search job by comparing keyword with job_name & com_name

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
                                (
                                        jobinfo.job_name LIKE CONCAT("%", "${search}", "%")
                                )
                                OR (
                                        company.com_name LIKE CONCAT("%", "${search}", "%")
                                )
                        )
        ) AS t,
        position p,
        localarea l
WHERE
        t.pos_id = p.pos_id
        AND t.area_id = l.area_id;