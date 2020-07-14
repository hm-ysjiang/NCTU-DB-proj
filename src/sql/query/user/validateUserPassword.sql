-- check if passwd is valid
SELECT
    *
FROM
    user
WHERE
    username = "${username}"
    AND passwd = "${passwd}";