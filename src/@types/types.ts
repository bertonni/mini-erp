import { FormEvent, MutableRefObject } from "react";

export type ProductContextType = {
  stock: IProduct[];
  error: string;
  success: string;
  setError: (value: string) => void;
  setSuccess: (value: string) => void;
  addProduct: (product: IProduct) => void;
  finishOutput: (products: IProduct[]) => void;
}

export interface IProduct {
  barcode: string;
  description: string;
  localization: string;
  quantity: number;
}

export interface ICurrentProductOutput {
  quantity: number;
  barcode: string;
}

export interface IQuantityModal {
  setShow: (value: boolean) => void;
  quantityRef: MutableRefObject<HTMLInputElement>;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}