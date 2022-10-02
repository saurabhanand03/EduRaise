import requests
import base64
import json
import pandas as pd
import random
from datetime import date

def upload(data):
    url = 'https://majorleaguehack.wixsite.com/reverseraise/_functions-dev/upload'
    headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}

    payload = json.dumps(data) ## Pass in all product details at once
    response = requests.post(url, data=payload, headers=headers)
    try:
        data = response.json()
        print(data)
    except requests.exceptions.RequestException:
        print(response.text)

def get_filename(name):
    return name.lower().replace(" ", "_") + '.png'
 
def get_sku(name):
    return name.lower().replace(" ", "_") + '_g'

def get_metadescription(color, name):
    year = date.today().year
    return f'{year} edition{color} soy wax candles - hand poured and hand crafted. CandleCraftys {name} best candles for living spaces and ambience. Buy now!'
 
def get_image(name):
    filename = f'image/saves/save-{name}.png'
    with open(filename, "rb") as f:
        im_bytes = f.read()
    im_b64 = base64.b64encode(im_bytes).decode("utf8")
    return im_b64
 
def get_seotitle(row):
    name = row['Title']
    notes = (row['Top notes'].split(', ') + row['Mid notes'].split(', ') + row['Base notes'].split(', '))
    note = random.choice(notes)
    color = row['color_literal']
    return f'{name} - {note} scented {color} soy candles'

df = pd.read_csv('data.csv')
for i, row in df.iterrows():
    name = row['Title']
    color = row['color_literal']
    if 'Discontinued' not in name:
        print(name)

        data = {
            'image': {
                'base64': get_image(name),
                'folder': 'programmatic',
                'filename': get_filename(name),
                'mimetype': 'image/png'
            },
            'product': {
                'name': name,
                'description': row['adlib'],
                'price': 20,
                'sku': get_sku(name),
                'visible': True,
                'productType': 'physical',
                'product_weight': 1,
                'product_ribbon': '',
                "seoData": {
                    "tags": [{
                            "type": "title",
                            "children": get_seotitle(row),
                            "custom": False,
                            "disabled": False
                        },
                        {
                            "type": "meta",
                            "props": {
                                "name": "description",
                                "content": get_metadescription(color, name)
                            },
                            "custom": False,
                            "disabled": False
                        }
                    ]
                }
            }
        }
    upload(data)
