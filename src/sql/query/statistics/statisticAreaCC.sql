-- area the most jobs are in

SELECT
    area_cc_name
FROM
    ($ { base }) as t
GROUP BY
    area_cc_name
ORDER BY
    COUNT(*) DESC
LIMIT
    1;