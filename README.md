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