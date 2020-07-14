SELECT
    t.*
FROM
    (
        SELECT
            t.*
        FROM
            (
                SELECT
                    t.*,
                    l.area_cctd_name
                FROM
                    (
                        SELECT
                            job.job_id,
                            job.pos_id AS pos_id,
                            job.area_id AS area_id,
                            jobinfo.job_name,
                            jobinfo.low_salary,
                            jobinfo.high_salary
                        FROM
                            jobinfo,
                            company,
                            job
                        WHERE
                            jobinfo.job_id = job.job_id
                            AND job.com_id = company.com_id
                            AND (
                                (
                                    jobinfo.job_name LIKE CONCAT("%", "${search}", "%")
                                )
                                OR (
                                    company.com_name LIKE CONCAT("%", "${search}", "%")
                                )
                            )
                    ) AS t,
                    localarea l
                WHERE
                    AND t.area_id = l.area_id
                    AND (
                        ("${area_cc}" = "")
                        OR ("${area_cc}" = l.area_cc_name)
                    )
                    AND (
                        ("${area_td}" = "")
                        OR ("${area_td}" = l.area_td_name)
                    )
            ) AS t,
            position p
        WHERE
            t.pos_id = p.pos_id
            AND (
                ("${pos_name}" = "")
                OR ("${pos_name}" = p.pos_name)
            )
            AND (
                ("${pos_field}" = "")
                OR ("${pos_field}" = p.pos_field)
            )
    ) AS t,
    jobinfo j
WHERE
    t.job_id = j.job_id
    AND (
        ($ { degree } IS NULL)
        OR ($ { degree } >= j.degree)
    )
    AND (
        ($ { exp_year } IS NULL)
        OR ($ { exp_year } >= j.exp_year)
    )
    AND (
        ($ { worktime } IS NULL)
        OR ($ { worktime } >= j.worktime)
    )
    AND (
        $ { is_night } = 3
        OR $ { is_night } = j.is_night
    )
    AND (j.needed_num > 0)
    AND ($ { job_type } = j.job_type)
    AND (
        ($ { salary } IS NULL)
        OR (
            (
                j.high_salary IS NULL
                AND j.low_salary >= $ { salary }
            )
            OR (j.low_salary >= $ { salary })
        )
    );