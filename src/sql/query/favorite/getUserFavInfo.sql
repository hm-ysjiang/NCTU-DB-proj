-- given username
-- render he/she 's favorite list

SELECT
        t.job_id,
        t.job_name,
        t.low_salary,
        t.high_salary,
        t.area_cctd_name,
        p.pos_field,
        p.pos_name
FROM
        (
                SELECT
                        t.job_id,
                        t.job_name,
                        t.low_salary,
                        t.high_salary,
                        l.area_cctd_name,
                        t.pos_id
                FROM
                        (
                                SELECT
                                        t.job_id,
                                        j.job_name,
                                        j.low_salary,
                                        j.high_salary,
                                        t.area_id,
                                        t.pos_id
                                FROM
                                        (
                                                SELECT
                                                        j.job_id,
                                                        j.area_id,
                                                        j.pos_id
                                                FROM
                                                        job j,
                                                        favorite f
                                                WHERE
                                                        f.username = "${username}"
                                                        AND j.job_id = f.job_id
                                        ) AS t,
                                        jobinfo j
                                WHERE
                                        j.job_id = t.job_id
                        ) AS t,
                        localarea AS l
                WHERE
                        t.area_id = l.area_id
        ) AS t,
        position p
WHERE
        t.pos_id = p.pos_id;