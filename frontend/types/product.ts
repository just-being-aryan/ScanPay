import { ImageSourcePropType } from "react-native";

export type Product = {
  sku: string;
  name: string;
  size: string;
  price: number;
  mrp: number;
  image: ImageSourcePropType;
};
