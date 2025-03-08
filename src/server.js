import express from "express"
import mongoose from "mongoose"
import productosRouter from "./routes/productosRouter.js"
import carritoRouter from "./routes/carritoRouter.js" 
import  {engine} from "express-handlebars"
import path from "path"


const app = express()

app.engine("handlebars",engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.set("views" , path.join(process.cwd(),"src/views"))

app.use(express.static('public'));
app.use("/",express.static(path.join(process.cwd(),"/src","/public")))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/productos",productosRouter)
app.use("/carrito",carritoRouter)


mongoose.connect("mongodb+srv://S4yMau:Maurobenitez1%40@clustermauro.myxev.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMauro", {dbName:"Perfumes"})
    .then(()=>console.log("Base de datos ok"))
    
app.listen(8080, ()=> console.log("Server 8080"))
