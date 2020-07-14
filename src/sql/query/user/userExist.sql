-- check if user exists
SELECT
    *
FROM
    user
WHERE
    username = "${username}";