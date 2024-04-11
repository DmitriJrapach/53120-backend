import express from 'express';
import CartManager from '../services/cartManager.js'; 

const router = express.Router();
const cartManager = new CartManager('./data/cart.json'); 

router.post("/", async (req, res) => {
    try {
        // Crear un nuevo carrito
        const newCart = await cartManager.createCart();
        res.json(newCart);
    } catch (error) {
        console.error("Error al crear el carrito: ", error);
        res.status(500).json({ error: "Error al crear el carrito" });
    }
});

// Ruta para obtener los productos de un carrito específico
router.get("/:cid", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);

        // Obtener los productos del carrito por su ID
        const cartProducts = await cartManager.getCartProducts(cartId);
        if (!cartProducts) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        res.json(cartProducts);
    } catch (error) {
        console.error("Error al obtener los productos del carrito: ", error);
        res.status(500).json({ error: "Error al obtener los productos del carrito" });
    }
});

// Ruta para agregar un producto a un carrito específico
router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        // Agregar el producto al carrito
        const updatedCart = await cartManager.addProductToCart(cartId, productId);
        if (!updatedCart) {
            return res.status(404).json({ error: "Carrito o producto no encontrado" });
        }

        res.json(updatedCart);
    } catch (error) {
        console.error("Error al agregar el producto al carrito: ", error);
        res.status(500).json({ error: "Error al agregar el producto al carrito" });
    }
});

export default router;