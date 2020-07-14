-- suggest jobs
-- where the suggestion are given with analyzing the most popular positions from jobs in favorite list

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
                                                        job j
                                                WHERE
                                                        j.pos_id IN (
                                                                SELECT
                                                                        pos_id
                                                                FROM
                                                                        (
                                                                                SELECT
                                                                                        p.pos_id,
                                                                                        COUNT(*) AS cnt
                                                                                FROM
                                                                                        favorite f,
                                                                                        job j,
                                                                                        position p
                                                                                WHERE
                                                                                        f.username = "${username}"
                                                                                        AND f.job_id = j.job_id
                                                                                        AND j.pos_id = p.pos_id
                                                                                GROUP BY
                                                                                        p.pos_id
                                                                                ORDER BY
                                                                                        cnt DESC
                                                                                LIMIT
                                                                                        3
                                                                        ) AS t
                                                        )
                                                        AND j.job_id NOT IN (
                                                                SELECT
                                                                        j.job_id
                                                                FROM
                                                                        favorite f,
                                                                        job j
                                                                WHERE
                                                                        f.username = "${username}"
                                                                        AND f.job_id = j.job_id
                                                        )
                                                ORDER BY
                                                        RAND()
                                                LIMIT
                                                        10
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