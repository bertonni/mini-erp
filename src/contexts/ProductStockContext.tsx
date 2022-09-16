import {
  createContext,
  useMemo,
  useState,
  useContext,
  ReactNode,
  FC,
  PropsWithChildren,
} from "react";
import { IProduct, ProductContextType } from "../@types/types";
import useLocalStorage from "../hooks/useLocalStorage";

const ProductStockContext = createContext<ProductContextType | null>(null);

export const useProductStock = () => {
  return useContext(ProductStockContext);
};

const ProductStockProvider: FC<PropsWithChildren> = ({ children }) => {
  const [stock, setStock] = useLocalStorage("stock", []);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const addProduct = (product: IProduct) => {
    const currProduct = stock.filter(
      (prod: IProduct) =>
        prod.barcode === product.barcode &&
        prod.localization === product.localization
    )[0];

    const stockCopy: IProduct[] = Array.from(stock);

    if (!currProduct) {
      setStock([...stock, product]);
      setSuccess("Produto cadastrado com sucesso");
      setError("");
    } else {
      currProduct.quantity += product.quantity;

      for (let i = 0; i < stockCopy.length; i++) {
        if (
          stockCopy[i].barcode === product.barcode &&
          stockCopy[i].localization === product.localization
        ) {
          stockCopy[i] = currProduct;
          break;
        }
      }
      setError("");

      setSuccess("Produto cadastrado com sucesso");
      setStock(stockCopy);
    }
    console.log(localStorage.getItem("stock"));
  };

  const finishOutput = (products: IProduct[]) => {
    const stockCopy: IProduct[] = Array.from(stock);
    console.log(products);
    for (let i = 0; i < products.length; i++) {
      const currProduct: IProduct = Object.assign({}, products[i]);
      
      const currentIndex: number = stockCopy.findIndex(
        (prod: IProduct) =>
          prod.barcode === currProduct.barcode &&
          prod.description === currProduct.description &&
          prod.localization === currProduct.localization
      );

      const prod: IProduct = stockCopy.filter(
        (prod: IProduct) =>
          prod.barcode === currProduct.barcode &&
          prod.description === currProduct.description &&
          prod.localization === currProduct.localization
      )[0];

      // prod.quantity -= currProduct.quantity;
      stockCopy[currentIndex] = prod;
    }
    setStock(stockCopy);
    setSuccess("Saída finalizada com sucesso");
    // const indexes: string[] = [];

    // if (product.length > 0) {
    //   let updated = false;

    //   for (let i = 0; i < product.length; i++) {
    //     if (updated) break;
    //     if (quantity >= product[i].quantity) {
    //       quantity = quantity - product[i].quantity;
    //       indexes.push(product[i].localization);
    //       product[i].quantity = 0;
    //       updated = true;
    //     } else {
    //       product[i].quantity = product[i].quantity - quantity;
    //       updated = true;
    //     }
    //   }
    // }

    const updated = stock.filter((prod: IProduct) => prod.quantity !== 0);

    setStock(updated);
  };

  const memoedValues = useMemo(
    () => ({
      stock,
      error,
      success,
      setError,
      setSuccess,
      addProduct,
      finishOutput,
    }),
    [stock, error, success]
  );

  return (
    <ProductStockContext.Provider value={memoedValues}>
      {children}
    </ProductStockContext.Provider>
  );
};

export default ProductStockProvider;
