import { promises as fs } from 'fs';
import Product from './product.js';

export default class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.lastId = 0;
        this.loadProducts().then(() => this.init()); 
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
        const productsToAdd = [
            new Product(`laptop`, `laptop i3 12gen, 16gb ram, Nvidia rtx 3060ti, FHD screen`, 800, `./assets/laptop.png`, 1, 25),
            new Product(`pc`, `pc i5 13gen, 16gb ram, Nvidia RTX 4050`, 1200, `./assets/pc.webp`, 2, 15),
            new Product(`Smartphone`, `Smartphone Android 10, 8GB RAM, 128GB almacenamiento, Cámara 48MP`, 600, `./assets/smartphone.png`, 3, 30),
            new Product(`Tablet`, `Tablet 10", 4GB RAM, 64GB almacenamiento, Pantalla HD, Wi-Fi`, 300, `./assets/tablet.png`, 4, 20),
            new Product(`Smart TV`, `Smart TV 55" 4K Ultra HD, HDR, Dolby Vision, Android TV`, 1000, `./assets/smart_tv.png`, 5, 10),
            new Product(`Cámara DSLR`, `Cámara DSLR Full Frame 24.2MP, 4K Video, Wi-Fi, Bluetooth`, 1500, `./assets/camera.png`, 6, 15),
            new Product(`Auriculares Bluetooth`, `Auriculares Bluetooth Over-Ear, Cancelación de Ruido, Micrófono Integrado`, 200, `./assets/headphones.png`, 7, 40),
            new Product(`Altavoz Inteligente`, `Altavoz Inteligente con Asistente de Voz, Wi-Fi, Bluetooth, Control de Hogar`, 120, `./assets/smart_speaker.png`, 8, 50),
            new Product(`Monitor Gaming`, `Monitor Gaming 27" Curvo, Resolución QHD, Frecuencia de Actualización 144Hz`, 400, `./assets/gaming_monitor.png`, 9, 25),
            new Product(`Teclado Mecánico`, `Teclado Mecánico RGB, Interruptores Cherry MX, Diseño Compacto`, 150, `./assets/mechanical_keyboard.png`, 10, 35)
        ];

        for (const product of productsToAdd) {
            await this.addProduct(product);
        }

        console.log(await this.getProducts()); // Mostrar todos los productos
        console.log(await this.getProductById(1)); // Obtener producto por id (existentes)
    }
}