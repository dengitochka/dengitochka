import { ProductPrice }  from '../../models/price.js';

export async function getProducts(req, res) {
    const param = {
        productId: Number.parseInt(req.query.productId), 
        isAllProducts: req.query.isAllProducts === 'true'
    };
    if (!param.isAllProducts && (param.productId === undefined || param.productId === null)) {
        let message = "ProductId does not have value.";
        console.log("ProductId does not have value.");
        return res.status(400).send(message)
    }
    
    try {
        let products = param.isAllProducts ? 
            await ProductPrice.find() : await ProductPrice.findOne({id: param.productId});
        res.json(products);
    }
    catch(err) {
        console.log(err);
        res.json();
    }
}