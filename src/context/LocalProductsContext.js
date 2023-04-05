import { useContext,createContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const LocalProductsContext = createContext()


const initialValue =[]


export const LocalProductsProvider = ({children}) => {
    const [products,setProducts] = useLocalStorage("products",initialValue);

    const addProduct = (product,size,quantity) => {
        let foundProduct ;
        if(products.length > 0) {
            foundProduct = products.find((x) => x.product._id === product._id && x.size === size)
        }
        if(foundProduct){
            let foundProductIndex = products.indexOf(foundProduct);
            foundProduct.quantity += quantity;
            products.splice(foundProductIndex,1)
            setProducts([...products,foundProduct])
        }
        if(!foundProduct){
            if(products.length === 0) return setProducts([{product,size,quantity}])
            if(products.length > 0) return setProducts([...products,{product,size,quantity}])
        }
    }

    const clearStorage = () => {
        setProducts(initialValue)
    }

    const removeProduct = (product,size) => {
        let foundProduct = products.find((x) => x.product._id === product._id && x.size === size)
        let foundProductIndex = products.indexOf(foundProduct)
        products.splice(foundProductIndex,1)
        setProducts([...products])
    }

    return (
        <LocalProductsContext.Provider value={{ products, clearStorage, addProduct, removeProduct  }}>
        {children}
      </LocalProductsContext.Provider>
    )
}


export const useLocalProductsContext = () => {
    const productsState = useContext(LocalProductsContext);
    return productsState;
}