import { Router } from "express";
import { modeloProducto } from "../modelo/modeloProductos.js";
import methodOverride from "method-override"
const route = Router()
route.use(methodOverride("_method"))
route.get("/", async (req,res)=>{
        let {limit,page,sort, ...query} = req.query
        limit = parseInt(limit) || 10
        page = parseInt(page) || 1
        sort = sort === "desc" ? -1 : sort ==="asc"? 1 : false
        let productos
        if (sort) {
            productos =await modeloProducto.paginate({...query},{limit:limit,page:page,sort:{precio:sort}})
        }
        else {
            productos =await modeloProducto.paginate({...query},{limit:limit,page:page})
        }
        const baseUrl = `${req.protocol}://${req.get('host')}`
        let paginaAnterior
        if(productos.hasPrevPage){
            paginaAnterior = baseUrl+ `/productos?limit=${limit}&page=${page-1}`
        }
        let paginaSiguiente
        if(productos.hasNextPage){
            paginaSiguiente = baseUrl+ `/productos?limit=${limit}&page=${page+1}`
        }

        const perfumes = JSON.parse(JSON.stringify(productos))
        let perfumesSolos = perfumes.docs
        
        
        return res.render("productos",{ perfumesSolos, paginaAnterior,paginaSiguiente })

})



route.get("/buscar", async (req,res)=>{
    const {id} = req.query
    console.log(id);
    
    const productos =await modeloProducto.findById(id).lean()
    console.log(productos);
    
    return res.render("porId",{productos})
})

route.post ("/", async (req,res)=>{
    const body = req.body
    const crearProducto = await modeloProducto.create(body)
    if (!body.stock || !body.img || !body.precio || !body.nombre ) {
        return res.status(400).json({mensaje:"Faltaron llenar campos"})
    }
    res.send("Producto ceado con exito")
})

route.put("/:id", async (req,res)=>{
    const {id} = req.params
    
    const body = req.body
    if (!body.stock || !body.img || !body.precio || !body.nombre ) {
        return res.status(400).json({mensaje:"Faltaron llenar campos"})
    }
    
    const productos = await modeloProducto.findByIdAndUpdate(id,body,{new:true})
    res.render("porId",{productos})
})

route.delete("/:id", async (req,res)=>{
    const {id} = req.params
    const productos =await modeloProducto.deleteOne({_id:id})
    res.send("Se elimino un producto")
})


route.get("/categoria/:categoria", async (req,res)=>{
    let {sort} = req.query
    sort = sort === "desc" ? -1 : sort ==="asc"? 1 : false
    const {categoria} = req.params
    let resultado
    if (sort) {
        resultado = await modeloProducto.aggregate([
        {$match:{categoria:categoria}},
        { $sort: { precio: sort } }
    ]) 
    }
    else {
        resultado = await modeloProducto.aggregate([
            {$match:{categoria:categoria}}
        ]) 
    }
    
    res.json({mensaje:"busqueda realizada",payload:resultado}) 
})

export default route