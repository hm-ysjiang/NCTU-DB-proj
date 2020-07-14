SELECT
    j.job_id,
    jobinfo.job_name,
    jobinfo.low_salary,
    jobinfo.high_salary,
    position.pos_field,
    position.pos_name,
    localarea.area_cctd_name
FROM
    jobinfo,
    position,
    company,
    (
        SELECT
            job.job_id,
            job.com_id,
            job.pos_id
        FROM
            job,
            localarea
        WHERE
            job.area_id = localarea.area_id
            AND (
                ("${area_cc}" = "")
                OR ("${area_cc}" = localarea.area_cc_name)
            )
            AND (
                ("${area_td}" = "")
                OR ("${area_td}" = localarea.area_td_name)
            )
    ) AS j
WHERE
    j.job_id = jobinfo.job_id
    AND j.com_id = company.com_id
    AND (
        ($ { degree } IS NULL)
        OR ($ { degree } >= jobinfo.degree)
    )
    AND (
        ($ { exp_year } IS NULL)
        OR ($ { exp_year } >= jobinfo.exp_year)
    )
    AND (
        ($ { worktime } IS NULL)
        OR ($ { worktime } >= jobinfo.worktime)
    )
    AND (
        $ { is_night } = 3
        OR $ { is_night } = jobinfo.is_night
    )
    AND (jobinfo.needed_num > 0)
    AND ($ { job_type } = jobinfo.job_type)
    AND (
        ($ { salary } IS NULL)
        OR (
            (
                jobinfo.high_salary IS NULL
                AND jobinfo.low_salary >= $ { salary }
            )
            OR (jobinfo.low_salary >= $ { salary })
        )
    )
    AND (
        (
            jobinfo.job_name LIKE CONCAT("%", "${search}", "%")
        )
        OR (
            company.com_name LIKE CONCAT("%", "${search}", "%")
        )
    )
    AND j.pos_id = position.pos_id
    AND (
        ("${pos_name}" = "")
        OR ("${pos_name}" = position.pos_name)
    )
    AND (
        ("${pos_field}" = "")
        OR ("${pos_field}" = position.pos_field)
    );