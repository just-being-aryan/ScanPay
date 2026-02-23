import * as SQLite from "expo-sqlite";
import { PRODUCTS } from "../data/seedProducts";

export const db = SQLite.openDatabaseSync("scanpay.db");

export type ProductRow = {
  productId: string;
  id: string;
  name: string;
  barcode: string;
  articleNumber: string;
  price: number;
  mrp: number;
  sku : string;
  size : string;
  image: string;
};

export const initDB = async () => {
  await db.execAsync(`
  CREATE TABLE IF NOT EXISTS products (
    productId TEXT PRIMARY KEY NOT NULL,
    sku TEXT,
    articleNumber TEXT,
    barcode TEXT,
    name TEXT,
    size TEXT,
    price REAL,
    mrp REAL,
    image TEXT
  );
`);
  }

export const seedProducts = async () => {
 for (const p of PRODUCTS) {
  await db.runAsync(
    `INSERT OR REPLACE INTO products
     (productId, sku, articleNumber, barcode, name, size, price, mrp, image)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      p.productId,
      p.sku,
      p.articleNumber,
      p.barcode,
      p.name,
      p.size,
      p.price,
      p.mrp,
      p.image.toString(),
    ]
  );
}
}

export const getProductByBarcode = async (barcode: string) => {
  return await db.getFirstAsync(
    `SELECT * FROM products WHERE barcode = ?;`,
    [barcode]
  );
};

export const getProductByArticle = async (
  article: string
): Promise<ProductRow | null> => {
  return (await db.getFirstAsync(
    `SELECT * FROM products WHERE articleNumber = ?;`,
    [article]
  )) as ProductRow | null;
};






export const initCartTable = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS cart (
      productId TEXT PRIMARY KEY NOT NULL,
      sku TEXT,
      articleNumber TEXT,
      barcode TEXT,
      name TEXT,
      size TEXT,
      price REAL,
      mrp REAL,
      image TEXT,
      qty INTEGER
    );
  `);
};

export const saveCartItems = async (items: any[]) => {
  await db.execAsync(`DELETE FROM cart;`);

  for (const i of items) {
    await db.runAsync(
      `INSERT INTO cart
       (productId, sku, articleNumber, barcode, name, size, price, mrp, image, qty)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        i.productId,
        i.sku,
        i.articleNumber,
        i.barcode,
        i.name,
        i.size,
        i.price,
        i.mrp,
        "",
        i.qty,
      ]
    );
  }
};

export const loadCartItems = async () => {
  return await db.getAllAsync(`SELECT * FROM cart;`);
};