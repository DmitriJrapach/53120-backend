import express from "express";
import ProductManager from "../services/productManager.js";
import Product from "../services/product.js";

const router = express.Router();
const productManager = new ProductManager('./data/products.json');

// router.use(express.json());
// router.use(express.urlencoded({extended: true}));

router.get("/", async (req, res) => {
    try {
        let products = await productManager.getProducts();
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        if (limit !== undefined) {
            products = products.slice(0, limit);
        }
        res.json(products);
    } catch (error) {
        console.error("Error al obtener los productos: ", error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

router.get("/:pid", async (req, res) => {
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

router.put("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const { title, description, price, thumbnail, code, stock } = req.body;

        // Comprobar si todos los campos obligatorios están presentes
        if (!title || !description || !price ||  !code || !stock) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Obtener el producto existente por su ID
        let existingProduct = await productManager.getProductById(productId);
        if (!existingProduct) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Actualizar los campos del producto con los valores proporcionados
        existingProduct.title = title;
        existingProduct.description = description;
        existingProduct.price = price;
        // existingProduct.thumbnail = thumbnail;
        existingProduct.code = code;
        existingProduct.stock = stock;

        // Guardar los cambios en el ProductManager
        await productManager.updateProduct(productId, existingProduct);

        // Responder con el producto actualizado
        res.json(existingProduct);
    } catch (error) {
        console.error("Error al actualizar el producto: ", error);
        res.status(500).json({ error: "Error al actualizar el producto" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body;
        console.log(req.body)
        // Comprobar si todos los campos obligatorios están presentes
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Generar un ID único utilizando el ProductManager
        const productId = productManager.generateUniqueId();

        // Crear una nueva instancia de Product con el ID generado automáticamente
        const newProduct = new Product({
            id: productId,
            title,
            description,
            code,
            price,
            stock,
            category,
        });

        // Agregar el nuevo producto utilizando el ProductManager
        await productManager.addProduct(newProduct);

        // Responder con el nuevo producto creado
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error al agregar el producto: ", error);
        res.status(500).json({ error: "Error al agregar el producto" });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);

        // Obtener el producto por su ID
        const productToDelete = await productManager.getProductById(productId);
        if (!productToDelete) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        // Eliminar el producto
        await productManager.deleteProduct(productId);

        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el producto: ", error);
        res.status(500).json({ error: "Error al eliminar el producto" });
    }
});


export default router;