from bs4 import BeautifulSoup as Soup
import requests as req

# Settings
headers = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36'}
_url = 'https://www.1111.com.tw/search/job?d0={0}&fs=2&page='
d0 = 100101
jobclass = ''

# Loaded Data
data = []


def load_page(url):
    r = req.get(url, headers=headers)
    if (r.ok):
        r.encoding = 'utf-8'
        soup = Soup(r.text, 'html.parser')
        reslist = soup.find('li', class_='loaded')
        jobs = reslist.find_all('li', class_='jbInfo')
        print(jobs)


def run(debugmsg=False):
    global _url, d0, jobclass
    # Setup query url
    url = _url.format(d0)

    # Validate and get some basic info
    r = req.get(url, headers=headers)
    if (r.ok):
        r.encoding = 'utf-8'
        # Da SOUP
        soup = Soup(r.text, 'html.parser')
        # Try to get the row count
        row_cnt = None
        for div in soup.find('li', class_='jbPagination').find_all('div'):
            if div.has_attr('data-row-count'):
                row_cnt = int(div['data-row-count'])
        # If success
        if row_cnt:
            load_page(url + '1')
            # for page in range(row_cnt // 20):
            #     load_page(url + str(page + 1))


if __name__ == '__main__':
    run(True)
