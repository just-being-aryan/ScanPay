import { ImageSourcePropType } from "react-native";

export type Product = {
  productId: string;
  sku: string;
  articleNumber: string;
  barcode: string;
  name: string;
  size: string;
  price: number;
  mrp: number;
  image: ImageSourcePropType;
};