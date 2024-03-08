import { promises as fs } from 'fs';


export default class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.lastId = 0;
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);
            if (Array.isArray(this.products) && this.products.length > 0) {
                this.lastId = Math.max(...this.products.map(product => product.id));
            }
        } catch (error) {
            console.error('Error al cargar los productos:', error);
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error al guardar los productos:', error);
        }
    }

    async getProducts() {
        return this.products;
    }
    
    generateUniqueId() {
        // Incrementar el último ID y devolverlo
        return ++this.lastId;
    }
    async getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.error(`Producto no encontrado.`);
            return null;
        }
    }

    async deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            await this.saveProducts();
        } else {
            console.error(`Producto con ID ${id} no encontrado.`);
        }
    }

    async addProduct(newProduct) {
        // Añadir el nuevo producto a la lista de productos
        this.products.push(newProduct);
        // Guardar los productos actualizados en el archivo
        await this.saveProducts();
    }
}