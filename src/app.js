import express from "express";
import productRouter from "./routes/products.router.js";
import cartRouter from './routes/cart.router.js'; 

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// Usa el router de productos
app.use("/api/products", productRouter);
app.use('/api/carts', cartRouter);

// Inicia el servidor
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});