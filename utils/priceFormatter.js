const priceFormatter = {
    addFormattedPrice(product){
        product.formattedPrice = (product.pricecent/100).toFixed(2).replace(".", ",")+"€"
        return product;
    }
}

export default priceFormatter;