import { useState } from "react"

const useLocalStorage = (key,initialValue) => {
    const [state,setState] = useState(()=> {
        try{
            let item = localStorage.getItem(key);
            if(item){
                return JSON.parse(item);
            } else {
                return initialValue;
            }
        } catch(err){
            console.log(err);
            return initialValue;
        }
    })

    const setItem = (value) => {
        try{
            localStorage.setItem(key,JSON.stringify(value));
            setState(value)
        } catch(err){
            console.log(err);
        }
    };
    return[state,setItem]
}


export default useLocalStorage;