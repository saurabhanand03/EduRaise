import { mediaManager } from'wix-media-backend';
import wixStoresBackend from'wix-stores-backend';
import { ok, notFound, serverError } from'wix-http-functions';


export async function post_echo(request) {
    let response = {
        "headers": {
            "Content-Type": "application/json"
        }
    }
    let body = await request.body.text()
    let data = JSON.parse(body)
    let img_url = await uploadImage(data.image.base64, data.image.folder, data.image.filename, data.image.mimeype)
    let product = await createProduct(data.product)
    response.body = product.productPageUrl
    ok(response)
    wixStoresBackend.addProductMedia(product._id, [{'url':img_url}])

}

// Upload Image
// Returns a URL which can be assigned to a product
function uploadImage(image_base64, image_folder, image_filename, image_mimeype) {
    return new Promise(resolve => {
        let buf = Buffer.from(image_base64, 'base64')
        mediaManager.upload(
            image_folder,
            buf,
            image_filename, {
                "mediaOptions": {
                    "mimeType": image_mimeype,
                    "mediaType": "image"
                },
                "metadataOptions": {
                    "isPrivate": false,
                    "isVisitorUpload": false,
                }
            }
        ).then(res => {
            mediaManager.getDownloadUrl(res.fileUrl).then(url => {
                resolve(url)
            })
        });
    })
}

function createProduct(product){
    return new Promise(resolve => {
        let productID = ''
        wixStoresBackend.createProduct(product).then(res => {
            resolve(res)
        }).catch(err => {console.error(err)})
    })
}