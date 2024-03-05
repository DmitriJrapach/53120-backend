import express from "express";
import ProductManager from "./productManager.js";

// Crea una instancia de ProductManager
const productManager = new ProductManager('products.json');

// Crea una instancia de Express
const app = express();

const PORT = 8080;

// Ruta para obtener productos
app.get("/products", async (req, res) => {
    try {
        // Obtener todos los productos desde el ProductManager
        let products = await productManager.getProducts();

        // Verificar si se proporcionó un límite de productos en la consulta
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;

        // Aplicar el límite si se proporciona
        if (limit !== undefined) {
            products = products.slice(0, limit);
        }

        // Enviar los productos como respuesta
        res.json(products);
    } catch (error) {
        // Manejar errores
        console.error("Error al obtener los productos: ", error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

// Ruta para obtener un producto por ID
app.get("/products/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener el producto por ID: ", error);
        res.status(500).json({ error: "Error al obtener producto por ID" });
    }
});

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});