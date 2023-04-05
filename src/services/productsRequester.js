import {url} from '../constants.js'

const productsRequester = (method,data,token,productId,profileId) => {
    let fetchUrl =`${url}/admin/products`;

    let options ={
        method:method,
        headers:{
            'content-type':'application/json',
            'Authorization': token
        }
    };

    if (method === "POST") {
        fetchUrl = `${fetchUrl}/create`
    }
    if(method === "PUT"){
        fetchUrl = `${url}/admin/products/${productId}/edit`
    }

    if(method === "GET"){
        fetchUrl = `${url}/products/${productId}`
    }
    if(method === "GET" && (data === "men" || data === "women" || data === "boys" || data === "girls" || data === 'all' || data === 'sale')){
        fetchUrl = `${url}/products/${data}`
    }
    if(method === "DELETE") {
        fetchUrl = `${url}/admin/products/${productId}/delete`
        options.body = JSON.stringify({
            profileId:profileId
        })
    }

    if(method === "POST" || method === "PUT"){
        options.body = JSON.stringify({
            profileId:profileId,
            type:data.type,
            category:data.category,
            name:data.name,
            gender:data.gender,
            brand:data.brand,
            imageUrl:data.imageUrl,
            color:data.color,
            price:data.price,
            sizes:data.sizes,
            onSale:data.onSale,
            salePercantage:data.salePercantage
        })
    }
    if(method === "GET") return fetch(fetchUrl);
    return fetch(fetchUrl,options);
}

export const getManyFiltered = (data) => {
    // for (const property of data) {
    //     if(!data[property]) data[property] = '';
    // }
       let  fetchUrl = `${url}/products/filter`;
       return fetch(fetchUrl,{
        method:"POST",
        headers:{
            'content-type':'application/json'
        },
        body: JSON.stringify({
            type:data.type,
            category:data.category,
            gender:data.gender,
            brand:data.brand,
            color:data.color,
            sizes:data.size
        })
       })
}
export const create = productsRequester.bind(null,"POST");
export const edit = productsRequester.bind(null,"PUT");
export const getOne = productsRequester.bind(null,"GET");
export const getMany = productsRequester.bind(null,"GET");
export const deleteOne = productsRequester.bind(null,"DELETE");



