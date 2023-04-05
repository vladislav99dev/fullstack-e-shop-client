import { url } from "../constants";

const requester = (service,method,profileId,productId,size,quantity) => {
    let fetchUrl = `${url}/users/products/${productId}/${service}`;

    let options = {
        method:method,
        headers: {
            'content-type':'application/json'
        },
        body: JSON.stringify({
            profileId:profileId,
            size:size,
            quantity:quantity
        })
    };

    if(method === "POST") fetchUrl = `${fetchUrl}-add`;
    if(method === "DELETE") fetchUrl = `${fetchUrl}-remove`;
    if(method === "GET") fetchUrl = `${fetchUrl}-get`;
    return fetch(fetchUrl,options)
}


export const addToFavourites = requester.bind(null,"favourites","POST");
export const removeFromFavourties = requester.bind(null,"favourites","DELETE");
export const getFavourites = requester.bind(null,"favourites","GET");

export const addToCart = requester.bind(null,"cart","POST");
export const removeFromCart = requester.bind(null,"cart","DELETE");
export const getCart = requester.bind(null,"cart","GET");
