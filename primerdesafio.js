class Product {
    constructor (title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description; 
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
    updateStock(newStock) {
        this.stock = newStock;
    }
}

class ProductManager {
    constructor () {
        this.products = [];
        this.lastId = 0;
    }
    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.error(`Todos los campos son obligatorios`);
            return;
        }
       
        const codeExists = this.products.some(existingProduct => existingProduct.code === product.code)
        if (!codeExists) { 
            const newId = ++this.lastId;
        
            product.id = newId;
            this.products.push(product); 
        } else {
            console.error (`El código de producto ya existe.`);
            return;
        }
    }
    getProducts() {
        return this.products;
    }
    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if(product) {
            return product;
        } else {
            console.error (`Producto no encontrado.`);
            return null;
        }
    }
}

const productManager = new ProductManager ();

const product1 = new Product(`laptop`,`laptop i3 12gen, 16gb ram, Nvidia rtx 3060ti, FHD screen`, `$800`, `./assets/laptop.png`, 1, 25 )
const product2 = new Product(`pc`, `pc i5 13gen, 16gb ram, Nvidia RTX 4050`, `$1200`, `./assets/pc.webp`, 2, 15)

productManager.addProduct(product1)
productManager.addProduct(product2)

console.log(productManager.getProducts()); // Mostrar todos los productos
console.log(productManager.getProductById(1)); // Obtener producto por id (existentes)
console.log(productManager.getProductById(3)); // Obtener producto por id (no existente)

const productContainer = document.getElementById('product-container');
productManager.products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.innerHTML = `
        <h2>${product.title}</h2>
        <h3>${product.description}</h3>
        <p>Precio: ${product.price}</p>
        <img src="${product.thumbnail}" alt="Imagen del producto" width="200" height="200">
        <p>Código: ${product.code}</p>
        <p>Stock disponible: ${product.stock}</p>
    `;
    productContainer.appendChild(productElement);
});