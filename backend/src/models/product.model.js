import mongoose from 'mongoose'


const productSchema = new mongoose.Schema({
   name : {
    type : String,
    require : true,
   },

   barcode : {
    type : String,
    unique : true
   },

   articleNumber : {
    type : String,
    unique : true
   },
   price : {
    type : Number,
    require : true
   },
    imageUrl: {
        type : String,
    },

    isActive: { 
        type: Boolean, 
        default: true 
    }


},{timestamps: true})




export default mongoose.model('Product', productSchema);