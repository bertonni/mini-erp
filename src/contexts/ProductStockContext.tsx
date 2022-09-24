import {
  createContext,
  useMemo,
  useState,
  useContext,
  ReactNode,
  FC,
  PropsWithChildren,
} from "react";
import { IProduct, IuseLocalStorage, ProductContextType } from "../@types/types";
import useLocalStorage from "../hooks/useLocalStorage";

const ProductStockContext = createContext<ProductContextType | null>(null);

export const useProductStock = () => {
  return useContext(ProductStockContext);
};

const ProductStockProvider: FC<PropsWithChildren<ReactNode>> = ({ children }) => {
  const [stock, setStock] = useLocalStorage({key: "stock", defaultValue: []});
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
  };

  const getTotalInStock = (barcode: string) => {
    let total: number = 0;

    const product: IProduct[] = stock.filter((prod: IProduct) => prod.barcode === barcode);

    for (let i = 0; i < product.length; i++) {
      total += product[i].quantity;
    }
    return total;
  }

  const finishOutput = (products: IProduct[]) => {
    const stockCopy: IProduct[] = Array.from(stock);

    for (let i = 0; i < products.length; i++) {
      const currProduct: IProduct = Object.assign({}, products[i]);

      const currentIndex: number = stockCopy.findIndex(
        (prod: IProduct) =>
          prod.barcode === currProduct.barcode &&
          prod.description === currProduct.description
      );

      const prod: IProduct[] = Array.from(stockCopy.filter(
        (prod: IProduct) =>
          prod.barcode === currProduct.barcode &&
          prod.description === currProduct.description
      ));

      let currQuant: number = currProduct.quantity;
      for (let i = 0; i < prod.length; i++) {
        if (currQuant > prod[i].quantity) {
          currQuant -= prod[i].quantity;
          prod[i].quantity = 0;
        } else {
          prod[i].quantity -= currQuant;
          break;
        }
        stockCopy[currentIndex] = prod[i];
      }
    }
    setSuccess("Saída finalizada com sucesso");
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
      getTotalInStock,
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
