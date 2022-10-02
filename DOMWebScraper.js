function readData (item) {
    let row = []
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
    
    row.push(csvInput(title));
    row.push(csvInput(url));
    row.push(csvInput(price));
    row.push(csvInput(imagelink));
    row.push(csvInput(rating));
    return row;
    // cols.push(row.join(","));
}

function csvInput(string) {
    string = string.replaceAll('"', '"\"');
    string = '"' + string + '"';
    return string;
}

function main() {
    let x = document.getElementsByClassName("s-main-slot s-result-list s-search-results sg-row")[0]
    let items = x.querySelectorAll('[data-component-type="s-search-result"]');
    let cols = ["Description,Link,Price,ImageLink,Rating"];

    for (item of items) {
        let row = readData(item)
        cols.push(row.join(","));
    }
    
    let csvContent = "data:text/csv;charset=utf-8," + cols.join("\n");
    
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
}

main()