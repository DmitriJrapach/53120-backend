
const fs = require('fs').promises;

class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.lastId = 0;
        this.loadProducts().then(() => this.init()); // Initialize product manager after loading products
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
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al guardar los productos:', error);
        }
    }

    async addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.error(`Todos los campos son obligatorios`);
            return;
        }

        const codeExists = this.products.some(existingProduct => existingProduct.code === product.code)
        if (!codeExists) {
            const newId = ++this.lastId;
            product.id = newId;
            this.products.push(product);
            await this.saveProducts();
        } else {
            console.error(`El código de producto ya existe.`);
        }
    }

    async getProducts() {
        return this.products;
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

    async updateProduct(id, updatedFields) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedFields };
            await this.saveProducts();
        } else {
            console.error(`Producto con ID ${id} no encontrado.`);
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

    async init() {
        const product1 = new Product(`laptop`, `laptop i3 12gen, 16gb ram, Nvidia rtx 3060ti, FHD screen`, `$800`, `./assets/laptop.png`, 1, 25)
        const product2 = new Product(`pc`, `pc i5 13gen, 16gb ram, Nvidia RTX 4050`, `$1200`, `./assets/pc.webp`, 2, 15)

        await this.addProduct(product1);
        await this.addProduct(product2);

        console.log(await this.getProducts()); // Mostrar todos los productos
        console.log(await this.getProductById(1)); // Obtener producto por id (existentes)
        console.log(await this.getProductById(3)); // Obtener producto por id (no existente)

        // Actualizar producto
        await this.updateProduct(1, { price: "$900", stock: 20 });
        console.log(await this.getProductById(1));

        // Eliminar producto
        await this.deleteProduct(2);
        console.log(await this.getProducts());
    }
}

const productManager = new ProductManager('products.json');