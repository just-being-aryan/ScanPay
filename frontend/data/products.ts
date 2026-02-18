import { Product } from "../types/product";

export const PRODUCTS: Record<string, Product> = {
  SKU123: {
    sku: "SKU123",
    name: "White Linen Shirt",
    size: "M",
    price: 1999,
     mrp: 3400,
    image: require("../assets/products/shirt.jpg"),
  },

  SKU456: {
    sku: "SKU456",
    name: "Black T-Shirt",
    size: "L",
    price: 999,
     mrp: 1600,
    image: require("../assets/products/tshirt.jpg"),
  },

  "123456": {
    sku: "123456",
    name: "Noise Cancelling Headphones",
    size: "One Size",
    mrp: 8399,
    price: 5999,
    image: require("../assets/products/headphone.jpg"),
  },
};
