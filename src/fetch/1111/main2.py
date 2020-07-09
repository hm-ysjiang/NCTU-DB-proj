from bs4 import BeautifulSoup as Soup
from datetime import datetime
from pathlib import Path
from selenium import webdriver
import os
import pandas as pd
import re
import requests as req
import time
import data


# Driver Location
DRIVER_PATH = r"C:\temp\selenium_chrome"

# Query Settings
_url = 'https://www.1111.com.tw/search/job?d0={0}&fs=2&page='
_jurl = 'https://www.1111.com.tw/job/{0}/'
_curl = 'https://www.1111.com.tw/corp/{0}/'


# Globals
driver = None
t_job = []
t_job_info = []
t_company = []
jid_map = {}
cid_map = {}
CAT_LIM = 200
# CAT_LIM = None


def job_detail(jid):
    r = req.get(_jurl.format(jid))
    if r.ok:
        people = r'\N'
        duration = 0
        time = 0

        soup = Soup(r.text, 'html.parser')
        datalist = soup.find('ul', class_='dataList').find_all('li')
        try:
            for li in datalist:
                if not li.find('div', class_='listTitle'):
                    continue
                title = li.find('div', class_='listTitle').text
                if title == '需求人數：':
                    m = re.search(r'[0-9]+', li.find('div',
                                                     class_='listContent').text)
                    if not m:
                        people = 0
                    else:
                        people = int(m.group())
                elif title == '工作時間：':
                    cont = li.find('div', class_='listContent').text
                    if cont.find('日班') != -1:
                        time += 1
                    if cont.find('晚班') != -1:
                        time += 2
                    m = re.search(r'(\d+:\d+).*?(\d+:\d+)', cont)
                    if not m:
                        duration = 8
                    else:
                        _start = m.group(1).split(':')
                        _end = m.group(2).split(':')
                        start = float(_start[0]) + float(_start[1]) / 60
                        end = float(_end[0]) + float(_end[1]) / 60
                        duration = end - start
        except Exception as e:
            print(e)
            return {'ok': False, 'msg': 'Exception error'}
        return {'ok': True, 'people': people, 'duration': duration, 'time': time}
    else:
        return {'ok': False, 'msg': 'Connection Failed'}


def comp_detail(cid):
    r = req.get(_curl.format(cid))
    if r.ok:
        addr = r'\N'
        emp = r'\N'
        cap = r'\N'

        soup = Soup(r.text, 'html.parser')
        datalist = soup.find('ul', class_='dataList').find_all('li')
        try:
            for li in datalist:
                if not li.find('div', class_='listTitle'):
                    continue
                title = li.find('div', class_='listTitle').text
                cont = li.find('div', class_='listContent').text
                if title == '聯絡地址：':
                    if cont.endswith('地圖'):
                        cont = cont[:-2]
                    addr = cont
                    if addr[:5] in data.localarea.keys():
                        cap = data.localarea[addr[:5]]
                    elif addr[:6] in data.localarea.keys():
                        cap = data.localarea[addr[:6]]
                    elif addr[:7] in data.localarea.keys():
                        cap = data.localarea[addr[:7]]
                elif title == '員工人數：':
                    m = re.search(r'[0-9]+', cont)
                    if m:
                        emp = int(m.group())
        except Exception as e:
            print(e)
        return {'cap': cap, 'addr': addr, 'emp': emp, 'phone': cid}


def load_page(url, pid):
    driver.get(url)
    jbs = driver.find_elements_by_css_selector('li.jbInfo')
    cnt = 0
    for res in jbs:
        soup = Soup(res.get_attribute('outerHTML'), 'html.parser')

        try:
            # Check not dup
            raw_jid = int(soup.find('a', class_='position0Link')['href'][5:-1])
            if raw_jid in jid_map.keys():
                continue

            # Only get those dominant
            needs = soup.find('div', class_='needs')
            area = needs.find(
                'span', class_='d-inline d-lg-none').text
            if area not in data.localarea.keys():
                continue

            # Parse salary
            sal_l, sal_u = r'\N', r'\N'
            parttime = 0
            raw_salary = needs.find_all('span')[1].text
            if raw_salary.startswith('月薪'):
                m = re.search(r'[0-9,]+~?[0-9,]*', raw_salary)
                if not m:
                    continue
                sal = [int(x.replace(',', '')) for x in m.group().split('~')]
                if len(sal) == 1:
                    sal = [sal[0], sal[0]]
                sal_l, sal_u = sal
            elif raw_salary.startswith('時薪'):
                parttime = 1
                m = re.search(r'[0-9,]+', raw_salary)
                if not m:
                    continue
                sal_l, sal_u = int(m.group()), int(m.group())
            elif raw_salary.startswith('面議'):
                sal_l = 40000
            else:
                continue

            # Get Details
            det = job_detail(raw_jid)
            if not det['ok']:
                print(f'Detail Fail: {det["msg"]}')
                continue

            # Parse Degree
            raw_degree = needs.find_all('span')[3].text.split(',')
            degree = 0
            for deg in raw_degree:
                degree |= data.degree_bitmask.get(deg, 0)

            # Set company
            com = soup.find('a', class_='d-block organ')
            raw_cid = int(com['href'][6:-1])
            if raw_cid not in cid_map.keys():
                cid_map[raw_cid] = len(cid_map)
                company = [len(cid_map)-1, com.text]
                cdet = comp_detail(raw_cid)
                if cdet:
                    company.extend([cdet['cap'], cdet['emp'],
                                    cdet['addr'], cdet['phone']])
                t_company.append(company)
            cid = cid_map[raw_cid]

            # Parse exp years
            m = re.search(r'[0-9,]+', needs.find_all('span')[2].text)
            exp = 0
            if m:
                exp = int(m.group())

            jid_map[raw_jid] = len(jid_map)

            job = [len(jid_map)-1, cid, pid, data.localarea[area]]
            job_info = [len(jid_map)-1, degree, sal_l, sal_u,
                        exp, parttime, det['duration'], det['time'], det['people'], raw_jid]
            t_job.append(job)
            t_job_info.append(job_info)
            cnt += 1
        except Exception as e:
            print(e, end='\n================\n')

    p = []
    for opt in Soup(driver.find_element_by_css_selector(
            'select.custom-select').get_attribute('outerHTML'), 'html.parser').find_all('option'):
        if opt.has_attr('selected'):
            p = [int(x) for x in opt.text.split(' / ')]
    return (len(p) > 1 and p[0] != p[-1]), cnt


def run(d0):
    # Setup query url
    url = _url.format(d0)

    # Validate and get some basic info
    page = 0
    cnt = 0
    while True:
        rc = load_page(url + str(page + 1), d0)
        cnt += rc[1]
        if (not rc[0]) or (CAT_LIM and cnt >= CAT_LIM):
            break
        print(f'{d0}: {cnt}')
        page += 1


def dump():
    # jbInfo
    df = pd.DataFrame(t_job_info, columns=['job_id', 'degree', 'low_salary', 'high_salary',
                                           'exp_year', 'job_type', 'worktime', 'isnight', 'needed_num', 'url'])
    dir = f'fetch/1111/result'
    print(f"Dumped {dir + f'/jobinfo.csv'}")
    df.to_csv(dir + f'/jobinfo.csv', index=False, line_terminator='\n')
    # company
    df = pd.DataFrame(t_company, columns=[
                      'com_id', 'com_name', 'capital', 'emp_num', 'addr', 'phone'])
    dir = f'fetch/1111/result'
    print(f"Dumped {dir + f'/company.csv'}")
    df.to_csv(dir + f'/company.csv', index=False, line_terminator='\n')


def dumpJb(posfield, posname):
    df = pd.DataFrame(t_job, columns=['job_id', 'com_id', 'pos_id', 'area_id'])

    dir = f'fetch/1111/result/{posfield}'
    if not os.path.isdir(dir):
        os.makedirs(dir)

    print(f"Dumped {dir + f'/{posname}.csv'}")
    df.to_csv(dir + f'/{posname}.csv', index=False, line_terminator='\n')
    t_job.clear()


if __name__ == '__main__':
    if Path().absolute().parts[-2:] == ('NCTU-DB-proj', 'src'):
        starttime = datetime.now()
        driver = webdriver.Chrome(DRIVER_PATH+r'\chromedriver.exe')
        for d0, (field, name) in data.d_fn.items():
            run(d0)
            dumpJb(field, name)
        driver.close()
        dump()
        endtime = datetime.now()
        print(f'Used time: {endtime - starttime}')
    else:
        print('You should run this in .../NCTU-DB-proj/src')
