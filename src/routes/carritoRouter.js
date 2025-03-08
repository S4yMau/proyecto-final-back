import { modelocarrito } from "../modelo/modeloCarrito.js";
import { Router } from "express";

const route = Router()

route.get("/", async (req,res)=>{
    try{
        const productos = await modelocarrito.findOne().populate("productos.productoId") 
        const perfumes = JSON.parse(JSON.stringify(productos))
        let perfumesSolos = perfumes.productos
        
        
        return res.render("carrito", {perfumesSolos})
    } catch(e){
        return res.status (500).json({mensaje:"Error"})
    }
})

route.post("/:pid/asignar",async(req,res)=>{
    let carrito = await modelocarrito.findOne()
    if (!carrito) {
        carrito = await modelocarrito.create({
            productos:[]
        }) 
    }
    const {pid}=req.params
    
    const indexProd= carrito.productos.findIndex(prod => prod.productoId.toString()==pid)
    if (indexProd===-1) {
        carrito.productos.push({productoId:pid,cantidad: 1})
    } else {
        carrito.productos[indexProd]={productoId:carrito.productos[indexProd].productoId,cantidad:carrito.productos[indexProd].cantidad+1} 
    }
    const carritoActualizado=await modelocarrito.findByIdAndUpdate(carrito._id.toString(),carrito,{new:true}).populate("productos.productoId")
    res.status(201).json({carrito:carritoActualizado})
})

/* route.post("/",async(req,res)=>{
    const carritoNuevo= await modelocarrito.create({
        productos:[]
    })  
    res.status(201).json({cart:carritoNuevo})
}) */

/* route.get("/:id",async (req,res)=>{
    const {id}=req.params
    const carritoBuscado = await modelocarrito.findById(id).populate("productos.productoId")
    res.status(200).json({listaProductos:carritoBuscado?.productos})
}) */

route.put("/:id",async(req,res)=>{
    const {id}=req.params
    const {producto}=req.body
    const carritoBuscado = await modelocarrito.findById(id).lean()
    const nuevoCarrito ={
        ...carritoBuscado,
        productos
    }
    const carritoActualizado= await modelocarrito.findByIdAndUpdate(id,nuevoCarrito,{new:true}).populate("productos.productoId")
    res.status(201).json({carrito:carritoActualizado})
})

route.put("/:pid/asignar",async(req,res)=>{
    const {pid}=req.params
    const {cantidad} = req.body
    
    const carritoBuscado= await modelocarrito.findOne().lean()
    const indexProd= carritoBuscado.productos.findIndex(prod=> prod.productoId.toString()==pid)
    carritoBuscado.productos[indexProd]={...carritoBuscado.productos[indexProd],cantidad}
    const carritoActualizado= await modelocarrito.findByIdAndUpdate(carritoBuscado._id.toString(),carritoBuscado,{new:true}).populate("productos.productoId")
    res.status(201).json({carrito:carritoActualizado})
})

route.delete("/:pid/delete", async (req,res)=>{
    const {pid}=req.params
    let carritoBuscado= await modelocarrito.findOne().lean()
    JSON.parse(JSON.stringify(carritoBuscado))
    console.log(carritoBuscado.productos);
    
        carritoBuscado ={
        ...carritoBuscado,
        productos:carritoBuscado.productos.filter(prod=>prod.productoId != pid)
    }
    const carritoActualizado= await modelocarrito.findByIdAndUpdate(carritoBuscado._id.toString(),carritoBuscado,{
        new:true,
    }).populate("productos.productoId")
    res.status(201).json({carrito:carritoActualizado})
})
export default route