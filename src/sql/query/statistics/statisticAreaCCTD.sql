-- area the most jobs are in

SELECT
    area_cctd_name
FROM
    ($ { base }) as t
GROUP BY
    area_cctd_name
ORDER BY
    COUNT(*) DESC
LIMIT
    1;