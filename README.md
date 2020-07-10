# NCTU-DB-proj
A final term project repo in NCTU

## Directory Description
- **/proposal** Project proposal
- **/src** All code goes in here
    - **fetch** The crawlers to fetch raw data
    - **sql** SQL codes to update/query tables

## MySQL Setup
**Check your db encoding is utf8/utf8mb4**
> cd src/sql

Enter MySQL console
```
CREATE DATABASE db_final;
use db_final;
source init.sql;
```

Update content
```
source update.sql;
```

## Python 3rd party libs
> pip install -r pip-requirements

## Table Description
+ job
> job_id, com_id, pos_id, area_id
+ job_info
> job_id, job_name, degree, low_salary, high_salary, exp_year, job_type, worktime, is_night, needed_num
+ company
> com_id, com_name, capital, emp_number, addr
+ pos
> pos_id, pos_name, pos_type
+ localarea
> area_id, area_cc_name, area_td_name, area_cctd_name
+ Spec
```
isnight : 1(日班), 2(夜班), 3(都有)
degree : 0(不拘), 1(國中以下), 2(高中/高職), 3(專科), 4(大學), 5(碩士), 6(博士)
```

## Functionality
+ 簡易查詢 : 職缺名稱/公司名稱 + 地區
+ 複合查詢
+ 反向分析