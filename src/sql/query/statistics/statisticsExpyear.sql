-- avg exp year of the rendered jobs

SELECT
    AVG(exp_year) as avg
FROM
    ($ { base }) as t;