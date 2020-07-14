-- avg, max, min salary of the rendered jobs

SELECT
    AVG(_salary) AS avg,
    MAX(_salary) AS max,
    MIN(_salary) AS min
FROM
    ($ { base }) as t;