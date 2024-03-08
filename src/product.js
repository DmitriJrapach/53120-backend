export default class Product {
    constructor({ id, title, description, code, price, stock, category, thumbnails }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = true; // Por defecto
        this.stock = stock;
        this.category = category;
        this.thumbnails = thumbnails || []; // Si no se proporcionan thumbnails, establecer como array vacío
    }
}