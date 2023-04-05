import { url } from "../constants";

const requester = (service,data,profileId) => {
    let fetchUrl ='';
    let options = {};
    if(service === 'login'){
        fetchUrl = `${url}/users/login`
        Object.assign(options,{
            method:"POST",
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                email: data.email,
                password: data.password
            })
        })
    }
    if(service === 'register'){
        fetchUrl = `${url}/users/register`
        Object.assign(options,{
            method:"POST",
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                firstName:data.firstName,
                lastName:data.lastName,
                email: data.email,
                country:data.country,
                state:data.state,
                city:data.city,
                zipCode:data.zipCode,
                street:data.street,
                unitNumber:data.unitNumber,
                phoneNumber:data.phoneNumber,
                password: data.password,
            })
        })
    }

    if(service === 'edit' || service ==='change-password') {
        fetchUrl = `${url}/users/${profileId}/${service}`
        Object.assign(options,{
            method:"PUT",
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify({
                ...data
            })
        })
    }

    if(service === 'logout'){
        fetchUrl = `${url}/users/${profileId}/logout`
        Object.assign(options, {
            method: "POST"
        })
    }

    if(service === 'checkUserData'){
        fetchUrl = `${url}/users/${profileId}`
    }

    if(service === 'checkUserData') return fetch(fetchUrl)
    return fetch(fetchUrl,options)
}


export const login = requester.bind(null,'login')
export const register = requester.bind(null,'register')
export const edit = requester.bind(null,'edit')
export const changePassword = requester.bind(null,'change-password')
export const logout = requester.bind(null,'logout')
export const checkUserData = requester.bind(null,'checkUserData')

