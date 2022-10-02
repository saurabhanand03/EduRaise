const puppeteer = require('puppeteer');
const fs = require('fs/promises');

async function search(search_term) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.amazon.com/s?k=" + search_term)

    const items = await page.evaluate(() => {
        let x = document.getElementsByClassName("s-main-slot s-result-list s-search-results sg-row")[0]
        let items = x.querySelectorAll('[data-component-type="s-search-result"]');
    
        let cols = ["Description,Link,Price,ImageLink,Rating"];
        items.forEach((item) => {
            let row = [];
            let atag = item.getElementsByTagName("h2")[0].getElementsByTagName("a")[0];
            let title = atag.text.trim();
            let url = atag.href;

            let price;
            try {
                price = item.querySelector('span.a-price span.a-offscreen').innerHTML;
            } catch (err) {
                price = "";
            }

            let imagelink;
            try {
                imagelink = item.querySelector('img').src;
            } catch (err) {
                imagelink = "";
            }

            let rating;
            try {
                rating = item.querySelector('i span').innerHTML;
            } catch {
                rating = "";
            }            
            
            title = title.replaceAll('"', '"\"');
            title = '"' + title + '"';
            row.push(title);
            row.push(url);
            row.push(price);
            row.push(imagelink);
            row.push(rating);
            cols.push(row.join(","));
        });
        
        return cols;
    })

    console.log(items[0]);
    console.log(items[1]);
    console.log(items[2]);
    
    await fs.writeFile("results2.csv", items.join("\n"));

    await browser.close();
}

search('Table');