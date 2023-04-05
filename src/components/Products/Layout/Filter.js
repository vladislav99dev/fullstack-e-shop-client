import { useReducer } from "react";

import productData from "../../../utils/productData";

import { getManyFiltered } from "../../../services/productsRequester";

const initialFilterState = {
    type:'',
    category:'',
    brand:'',
    color:'',
    size:[]
  }

const reducerFilterState = (state,action) => {
    switch(action.type) {
      case 'type':
      return {
        type: action.payload,
        category: state.category,
        brand: state.brand,
        color: state.color,
        size: state.size,
      };
      case 'category':
        return {
          type: state.type,
          category: action.payload,
          brand: state.brand,
          color: state.color,
          size: state.size,
        };
      case 'brand':
          return {
            type: state.type,
            category: state.category,
            brand: action.payload,
            color: state.color,
            size: state.size,
          };
      case 'color':
          return {
            type: state.type,
            category: state.category,
            brand: state.brand,
            color: action.payload,
            size: state.size,
          };
      case 'size':
            return {
              type: state.type,
              category: state.category,
              brand: state.brand,
              color: state.color,
              size: action.payload
            };
      case 'reset':
            return {
              type:'',
              category:'',
              brand:'',
              color:'',
              size:[],
        };
    }
  }

const Filter = ({
    gender,
    setFilteredProducts
}) => {
  const [filterState,dispatch] = useReducer(reducerFilterState,initialFilterState);


  const setFilterState = (state,event) => {
    if(state === 'size') {
        if(filterState.size.includes(event.target.innerText)) {
            const newArr = filterState.size.filter(x => x !== event.target.innerText)
            dispatch({type:state,payload:[]})
            return dispatch({type:state,payload:[...newArr]})
        }
         return dispatch({type:state,payload:[...filterState.size,event.target.innerText]})}
    dispatch({type:state,payload:event.target.value})
  }

  const submitHandler = async(event) => {
    event.preventDefault();

    try{
      let response ;
        if(gender === 'all') response = await getManyFiltered({...filterState})
        if(gender !== 'all') response = await getManyFiltered({...filterState,gender})
        const jsonResponse = await response.json();
        setFilteredProducts(jsonResponse.products)
    }catch(err) {
      console.log(err);
    }
    
  }

    return (
        <form onSubmit={submitHandler} className="mt-4 py-4 border-2 rounded-md border-[#00df9a]">
            <div className="flex justify-center">
            < label className="w-[35%] text-center z-10 rounded-3xl bg-green-200 ">Type</label>
            </div>
            <div className="flex justify-center -mt-2">
              <select onChange={setFilterState.bind(null,"type")} className="capitalize w-[40%] text-center py-[0.25rem] border-2 rounded-2xl border-green-200" type="text" name="type">
                <option></option>
                {productData.types.map(x => <option key={x} value={x} className="capitalize">{x}</option>)}
              </select>
            </div>

            <div className="flex justify-center mt-2">
            < label className="w-[35%] text-center z-10 rounded-3xl bg-green-200 ">Category</label>
            </div>
            <div className="flex justify-center -mt-2">
              <select onChange={setFilterState.bind(null,"category")} className="capitalize w-[40%] text-center py-[0.25rem] border-2 rounded-2xl border-green-200" type="text" name="category">
                <option></option>
                {filterState.type === 'shoes' ? productData.shoeOptions.map(x => 
                    <option key={x} value={x} className="capitalize">{x}</option>
                )
                : productData.clothingOptions.map(x => 
                    <option key={x} className="capitalize" value={x}>{x}</option>
                )}
              </select>
            </div>

            <div className="flex justify-center mt-2">
            < label className="w-[35%] text-center z-10 rounded-3xl bg-green-200 ">Brand</label>
            </div>
            <div className="flex justify-center -mt-2">
              <select onChange={setFilterState.bind(null,"brand")} className="capitalize w-[40%] text-center py-[0.25rem] border-2 rounded-2xl border-green-200" type="text" name="brand">
                <option></option>
                {productData.brands.map(x => <option key={x} value={x} className="capitalize" >{x}</option>)}
              </select>
            </div>

            <div className="flex justify-center mt-2">
            < label className="w-[35%] text-center z-10 rounded-3xl bg-green-200 ">Color</label>
            </div>
            <div className="flex justify-center -mt-2">
              <select onChange={setFilterState.bind(null,"color")} className="capitalize w-[40%] text-center py-[0.25rem] border-2 rounded-2xl border-green-200" type="text" name="color">
                <option></option>
                {productData.colors.map(x => <option key={x} value={x} className="capitalize" >{x}</option>)}
              </select>
            </div>

            <div className="flex justify-center mt-2">
            < label className="w-[35%] text-center z-10 rounded-3xl bg-green-200 ">Size</label>
            </div>
            <div className="flex justify-center -mt-2">
              <div className="w-[40%] grid grid-cols-3 gap-y-2 gap-x-2 lg:gap-x-16 py-14 border-2 rounded-2xl border-green-200" type="text" name="size">
                {filterState.type === 'shoes' 
                ? productData.shoeSizes.map(x => 
                <p 
                onClick={setFilterState.bind(null,"size")} 
                key={x}  
                className={'rounded-md text-center ' + (filterState.size.includes(x) ? 'bg-green-200' :'border-2')}
                >{x}</p>
                )
                : productData.clothingSizes.map(x => 
                <p 
                onClick={setFilterState.bind(null,"size")} 
                key={x}  
                className={'rounded-md text-center ' + (filterState.size.includes(x) ? 'bg-green-200' :'border-2')}
                >{x}</p>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-2">
              <button className="py-2 px-10 rounded-md italic font-bold text-xl text-white bg-green-300 hover:bg-green-200 ease-in-out duration-500">Submit</button>
            </div>
        </form>
    )
}

export default Filter;





            // const index = filterState.indexOf(event.target.innerText);
            // const newArr = filterState.size.filter(x => x !== event.target.innerText)
            // dispatch({type:state,payload:[]});
            // return dispatch({type:state, payload:newArr})