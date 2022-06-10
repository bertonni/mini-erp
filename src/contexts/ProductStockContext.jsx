import { createContext, useMemo, useState, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
const ProductStockContext = createContext();

export const useProductStock = () => {
  return useContext(ProductStockContext);
};

export function ProductStockProvider({ children }) {
  const [stock, setStock] = useLocalStorage("stock", []);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addProduct = (product) => {
    const currProduct = stock.filter(
      (prod) =>
        prod.barcode === product.barcode &&
        prod.localization === product.localization
    )[0];

    console.log(currProduct);
    const stockCopy = Array.from(stock);

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

  const memoedValues = useMemo(
    () => ({
      stock,
      error,
      success,
      setError,
      setSuccess,
      addProduct,
    }),
    [stock, error, success]
  );

  return (
    <ProductStockContext.Provider value={memoedValues}>
      {children}
    </ProductStockContext.Provider>
  );
}
