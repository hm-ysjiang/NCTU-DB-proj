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
> job_id, degree, low_salary, high_salary, exp_year, job_type, worktime, is_night, needed_number
+ company
> com_id, com_name, capital, emp_number, address
+ pos
> pos_id, pos_name, pos_type
+ localarea
> area_id, area_cc_name, area_td_name, area_cctd_name