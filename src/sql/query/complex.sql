-- 複合查詢 : 透過 jobinfo 內的 constraint 搜尋職缺
-- log
-- 2020/7/10 : 幹你娘這個出來也是empty set
-- 2020/7/10 : 基於jobinfo 的查詢可以run了
-- 2020/7/12 : 已確認可以work
-- 2020/7/12 : 加上篩選職位類別
-- instruction :
-- "${search}" : 職缺或公司名稱只要存在關鍵字即可
-- ${degree} : 輸入學歷>=需求學歷
-- ${salary} : 基本上是 最高薪資 >= 預期薪資，在最高薪資為NULL時則改成 最低薪資大於預期薪資
-- ${exp_year} : 輸入年資>=需求年資
-- @worktime_min, ${worktime} : (worktime between worktime_min and worktime_max) ? 1 : 0
-- ${is_night} : 取相符者
-- @needed_num : 輸入人數 <= 需求人數
-- "${area_cc}", "${area_td}" : 須完全相符（我認為做選單最好）
-- SET
--     "${search}" = "經理",
--     ${degree} = 6,
--     ${salary} = 30000,
--     ${exp_year} = NULL,
--     ${job_type} = 0,
--     @worktime_min = NULL,
--     ${worktime} = NULL,
--     ${is_night} = 1,
--     @needed_num = 0,
--     "${area_cc}" = "臺北市",
--     "${area_td}" = NULL,
--     "${pos_name}" = NULL,
--     "${pos_field}" = "管理";
SELECT
    jobinfo.job_id
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
    ) AS job
WHERE
    job.job_id = jobinfo.job_id
    AND job.com_id = company.com_id
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
    AND ($ { is_night } = jobinfo.is_night)
    AND (job_info.needed_num > 0)
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
    AND job.pos_id = position.pos_id
    AND (
        ("${pos_name}" = "")
        OR ("${pos_name}" = position.pos_name)
    )
    AND (
        ("${pos_field}" = "")
        OR ("${pos_field}" = position.pos_field)
    );