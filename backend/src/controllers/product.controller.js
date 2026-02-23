import Product from '../models/product.model.js';

export const validateBarcode = async (req,res) => {
    const {barcode} = req.body;
    
    const product = await Product.findOne({barcode, isActive: true});

    if(!product) {
        return res.status(404).json({message : "Product not found"})
    }

    res.json(product);
};

export const validateArticle = async(req,res) => {
    const {articleNumber} = req.body;
    
    const product = await Product.findOne({articleNumber, isActive: true});

    if(!product) {
        return res.status(404),json({message : "Product Not found"});
    }

    res.json(product);
}