-- given job_id
-- render needed info of the job

SELECT
        j.job_id,
        j.job_name,
        j.degree,
        j.low_salary,
        j.high_salary,
        j.exp_year,
        j.job_type,
        j.worktime,
        j.is_night,
        j.needed_num,
        l.area_id,
        l.area_cctd_name,
        p.pos_id,
        p.pos_field,
        p.pos_name,
        c.com_id,
        c.com_name
FROM
        job,
        jobinfo j,
        localarea l,
        position p,
        company c
WHERE
        job.job_id = j.job_id
        AND job.area_id = l.area_id
        AND job.pos_id = p.pos_id
        AND job.com_id = c.com_id
        AND job.job_id = $ { job_id };