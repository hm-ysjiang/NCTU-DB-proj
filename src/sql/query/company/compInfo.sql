-- render company info

select
    *
from
    company
where
    com_id = $ { com_id };