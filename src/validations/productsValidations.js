import  productData  from "../utils/productData"

const validateIsAllDataSend = (data,messages) => {
    if (
      !data.type ||
      !data.category ||
      !data.gender ||
      !data.brand ||
      !data.imageUrl ||
      !data.color ||
      !data.price ||
      !data.sizes
    ) messages.push("Type, category, brand, gender, imageUrl, color, price, sizes should be provided in order to continue!")
  };
  
  const validateDataType = (data,messages) => {
    if (data.type !== "clothing" && data.type !== "shoes") {
      messages.push("Type should be clothing or shoes!") 
    }
  };
  
  const validateDataCategory = (data,messages) => {
    if (data.type === "clothing") {
      if (!productData.clothingOptions.includes(data.category)) {
        messages.push(`Clothing type does not support${data.category}!`)
      }
    }
    if (data.type === "shoes") {
      if (!productData.shoeOptions.includes(data.category)) {
        messages.push(`Shoes type does not support${data.category}!`)
      }
    }
  };
  const validateName = (data,messages) => {
    if(!/[\w\s-]+/ig.test(data.name)){
      messages.push("Name is not in valid format.")
    }
  }
  
  const validateDataGender = (data,messages) => {
    if (!productData.genders.includes(data.gender)) {
      messages.push(`Genders does not support${data.gender}!`)
    }
  };
  
  const validateDataBrand = (data,messages) => {
    if (!productData.brands.includes(data.brand)) {
      messages.push(`Brands does not support${data.brand}!`)
    }
  };
  
  const validateDataImageUrl = (data,messages) => {
    if (
      !/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/i.test(
        data.imageUrl
      )
    ) {
      messages.push("ImageUrl is not valid!")
    }
  };
  
  
  const validateDataColor = (data,messages) => {
    if (!productData.colors.includes(data.color.toLowerCase())) {
      messages.push(`Colors supported are ${productData.colors.join(',')}`)
    }
  };
  
  const validateDataPrice = (data,messages) => {
    if (isNaN(data.price)) {
      messages.push("Price should be a number!")
    }
  };

  const validateDataSizesValues = (data,messages) => {
    for (const key in data.sizes) {
        if(isNaN(data.sizes[key])){
            messages.push("Size value is not valid!")
        }
    }
  }

  // const validateOnSaleValue = (data,messages) => {
  //   for (const key in data.sizes) {
  //       if(isNaN(data.sizes[key])){
  //           messages.push("Size value is not valid!")
  //       }
  //   }
  // }

  const validateDataSizes = (data,messages) => {
    let comparisionArray =[];
    if(data.type === 'clothing') comparisionArray = productData.clothingSizes;
    if(data.type === 'shoes') comparisionArray = productData.shoeSizes;

    for (const key in data.sizes) {
        if(!comparisionArray.includes(key)) messages.push(`${data.type} does not support size ${key}!`)
    }
    
    comparisionArray.forEach(size => {
      if(!data.sizes.hasOwnProperty(size)){
        data.sizes[size] = 0
      }
    })
  }



// should add 0 to sizes that are not added


  const validateAllData = (data) => {
    let messages  = []; 
    validateIsAllDataSend(data,messages);
    validateDataType(data,messages);
    validateDataCategory(data,messages);
    validateName(data,messages);
    validateDataGender(data,messages);
    validateDataBrand(data,messages);
    validateDataImageUrl(data,messages);
    validateDataColor(data,messages);
    validateDataImageUrl(data,messages);
    validateDataPrice(data,messages);
    validateDataSizes(data,messages);
    validateDataSizesValues(data,messages)
    return messages;
  }

  const productsValidations = {
    validateAllData
  }

  export default productsValidations;