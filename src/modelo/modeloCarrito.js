import mongoose,{ model, Schema } from "mongoose";


const collectionProdcutos = "carrito"
const esquema = new Schema ({
    productos:{
        type:[{
            cantidad:Number,
            productoId:{
                type:mongoose.Schema.Types.ObjectId,
                ref: "perfumes"
            }
        }],
    default:[]
    }
})

export const modelocarrito = model(collectionProdcutos,esquema)