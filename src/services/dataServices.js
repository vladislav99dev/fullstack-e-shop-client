

export const productSizeFormater = (data) => {
    data.sizes = data.sizes.split(',');
    data.sizes = data.sizes.map(x => x.split(':')) ;
    data.sizes = Object.fromEntries(data.sizes);
    data.price = Number(data.price);
    for (const key in data.sizes) {
       data.sizes[key] = Number(data.sizes[key]);
    };

    return data;
};

