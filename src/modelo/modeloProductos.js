import { model, Schema } from "mongoose";
import mongoosepaginatev2 from "mongoose-paginate-v2"

const collectionProdcutos = "perfumes"
const esquema = new Schema ({
    categoria: String,
    img: String,
    nombre:{
        type:String,
        index:true
    },
    precio:Number,
    stock:Number})

    esquema.plugin(mongoosepaginatev2)

export const modeloProducto = model(collectionProdcutos,esquema)