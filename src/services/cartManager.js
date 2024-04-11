import { promises as fs } from 'fs';

export default class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.carts = [];
        this.lastCartId = 0;
        this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.carts = JSON.parse(data);
            if (Array.isArray(this.carts) && this.carts.length > 0) {
                this.lastCartId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            console.error('Error al cargar los carritos:', error);
        }
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error al guardar los carritos:', error);
        }
    }

    async createCart(initialProducts = []) {
        const newCart = {
            id: this.generateUniqueId(),
            products: initialProducts
        };
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCartProducts(cartId) {
        const cart = this.carts.find(cart => cart.id === cartId);
        if (cart) {
            return cart.products;
        } else {
            console.error(`Carrito no encontrado.`);
            return null;
        }
    }

    async addProductToCart(cartId, productId) {
        const cart = this.carts.find(cart => cart.id === cartId);
        if (cart) {
            // Verificar si el producto ya está en el carrito
            const existingProduct = cart.products.find(product => product.id === productId);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.products.push({ id: productId, quantity: 1 });
            }
            await this.saveCarts();
            return cart;
        } else {
            console.error(`Carrito no encontrado.`);
            return null;
        }
    }

    generateUniqueId() {
        return ++this.lastCartId;
    }
}