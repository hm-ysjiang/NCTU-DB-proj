-- 複合查詢 : 透過 jobinfo 內的 constraint 搜尋職缺

-- log
-- 2020/7/10 : 幹你娘這個出來也是empty set
-- 2020/7/10 : 基於jobinfo 的查詢可以run了
-- 2020/7/12 : 已確認可以work
-- 2020/7/12 : 加上篩選職位類別

-- instruction :
-- @name : 職缺或公司名稱只要存在關鍵字即可
-- @degree : 輸入學歷>=需求學歷
-- @salary : 基本上是 最高薪資 >= 預期薪資，在最高薪資為NULL時則改成 最低薪資大於預期薪資
-- @exp_year : 輸入年資>=需求年資
-- @worktime_min, @worktime_max : (worktime between worktime_min and worktime_max) ? 1 : 0
-- @is_night : 取相符者
-- @needed_num : 輸入人數 <= 需求人數
-- @cc, @td : 須完全相符（我認為做選單最好）

SET @name = '經理', @degree = 6, @salary = 30000, @exp_year = NULL, @job_type = 0,
    @worktime_min = NULL, @worktime_max = NULL, @is_night = 1, @needed_num = 0, @cc = '臺北市', @td = NULL,
    @pos_name = NULL, @pos_field = '管理'
;

SELECT  jobinfo.job_id
FROM    jobinfo, position, company, (
                            SELECT  job.job_id, job.com_id, job.pos_id
                            FROM    job, localarea
                            WHERE       job.area_id = localarea.area_id
                                    AND ((@cc is NULL) OR (@cc = localarea.area_cc_name))
                                    AND ((@td is NULL) OR (@td = localarea.area_td_name))
                            ) AS job
WHERE   job.job_id = jobinfo.job_id
        AND job.com_id = company.com_id
        AND ((@degree is NULL)        OR (@degree >= jobinfo.degree)                           )
        AND ((@exp_year is NULL)      OR (@exp_year >= jobinfo.exp_year)                       )
        AND ((@worktime_min is NULL)  OR (@worktime_min <= jobinfo.worktime)                   )
        AND ((@worktime_max is NULL)  OR (@worktime_max >= jobinfo.worktime)                   )
        AND ((@is_night is NULL)      OR (@is_night = jobinfo.is_night)                        )
        AND ((@needed_num is NULL)    OR (@needed_num <= jobinfo.needed_num)                   )
        AND ((@job_type is NULL)      OR (@job_type = jobinfo.job_type)                        )
        AND ((@salary is NULL)        OR
            ((@job_type = JOB_TYPE)                                                              -- 要馬沒有指定薪資，要馬要有設定type才能指定薪資
            AND ((HIGH_SALARY is NULL AND LOW_SALARY >= @salary) OR (HIGH_SALARY >= @salary))))  -- 沒有薪資上限（通常是面議）則最低薪資需大於預期薪資，否則只要最高薪資大於即可
        -- added after 2020/7/12
        AND ((@name is NULL)          OR (jobinfo.job_name LIKE CONCAT('%', @name, '%'))
                                      OR (company.com_name LIKE CONCAT('%', @name, '%'))       )
        AND job.pos_id = position.pos_id
        AND ((@pos_name is NULL)      OR (@pos_name = position.pos_name)                            )
        AND ((@pos_field is NULL)     OR (@pos_field = position.pos_field)                          )
;