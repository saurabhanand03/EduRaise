import csv
from bs4 import BeautifulSoup
from selenium import webdriver

def get_url(search_term):
    """Generate a url from search term"""
    template = 'https://www.amazon.com/s?k={}'
    search_term = search_term.replace(' ', '+')

    # add term query to url
    url = template.format(search_term)

    # add page query placeholder
    url += '&page={}'

    return url

def extract_record(item):
    """Extract and return data from a single record"""
    
    # description and url
    atag = item.h2.a
    description = atag.text.strip()
    url = 'https://www.amazon.com' + atag.get('href')

    # price
    try:
        price_parent = item.find('span', 'a-price')
        price = price_parent.find('span', 'a-offscreen').text
    except AttributeError:
        return

    # imagelink
    try:
        imagelink = item.img.get('src')
    except:
        imagelink = ''

    # rank and rating
    try:
        rating = item.i.text
        review_count = item.find('span', {'class': 'a-size-base', 'class': 's-underline-text'}).text
    except AttributeError:
        rating = ''
        review_count = ''

    result = (description, price, imagelink, rating, review_count, url)

    return result

def topThree(list):
    topThree = [list[0], list[1], list[2]]
    return topThree

def main(search_term):
    """Run main program routine"""
    # startup the webdriver
    driver = webdriver.Chrome()

    records = []
    url = get_url(search_term)

    for page in range(1, 2):
        driver.get(url.format(page))
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        results = soup.find_all('div', {'data-component-type': 's-search-result'})
        
        for item in results:
            record = extract_record(item)
            if record:    
                records.append(record)
    
    driver.close()

    for e in topThree(records):
        print(e[1])

    # save data to csv file
    with open('results.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Description', 'Price', 'ImageLink', 'Rating',  'ReviewCount', 'Url'])
        writer.writerows(records)

main('chairs')