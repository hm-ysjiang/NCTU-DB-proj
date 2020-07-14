-- check if a job in one's favorite list

SELECT
    *
FROM
    favorite f
WHERE
    f.username = "${username}"
    AND f.job_id = $ { job_id };