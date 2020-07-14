-- delete from favorite list

DELETE FROM
    favorite
WHERE
    username = "${username}"
    AND job_id = "${job_id}";