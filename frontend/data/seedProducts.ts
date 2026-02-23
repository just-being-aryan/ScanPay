import { Product } from "../types/product";

export const PRODUCTS: Product[] = [
  {
    productId: "p1",
    sku: "DEC-SHIRT-WHITE-M",
    articleNumber: "A1001",
    barcode: "SKU123",
    name: "White Linen Shirt",
    size: "M",
    price: 1999,
    mrp: 3400,
    image: require("../assets/products/shirt.jpg"),
  },
  {
    productId: "p2",
    sku: "DEC-TSHIRT-BLACK-L",
    articleNumber: "A1002",
    barcode: "SKU456",
    name: "Black T-Shirt",
    size: "L",
    price: 999,
    mrp: 1600,
    image: require("../assets/products/tshirt.jpg"),
  },
  {
    productId: "p3",
    sku: "DEC-HEADPHONE-NC",
    articleNumber: "A1003",
    barcode: "123456",
    name: "Noise Cancelling Headphones",
    size: "One Size",
    price: 5999,
    mrp: 8399,
    image: require("../assets/products/headphone.jpg"),
  },
];