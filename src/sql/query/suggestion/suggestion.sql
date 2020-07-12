SELECT
    j.job_id,
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
                    f.username = "test"
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
            f.username = "test"
            AND f.job_id = j.job_id
    )
ORDER BY
    RAND()
LIMIT
    10;