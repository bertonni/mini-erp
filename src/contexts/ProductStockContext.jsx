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

    const stockCopy = Array.from(stock);

    product.quantity = parseInt(product.quantity);
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

  const finishOutput = (products) => {
    const prod = stock.filter((prod) => prod.barcode === barcode);
    const product = Array.from(prod);
    const currProduct = Object.assign({}, product[0]);

    let totalQuantity = 0;

    for (let i = 0; i < product.length; i++) {
      totalQuantity += product[i].quantity;
    }

    if (quantity > totalQuantity) {
      setError(`Não há quantidade suficiente no estoque. Total em estoque: ${totalQuantity}`);
      return;
    }

    const indexes = [];

    if (product.length > 0) {
      let updated = false;

      for (let i = 0; i < product.length; i++) {
        if (updated) break;
        if (quantity >= product[i].quantity) {
          quantity = parseInt(quantity) - product[i].quantity;
          indexes.push(product[i].localization);
          product[i].quantity = 0;
          updated = true;
        } else {
          product[i].quantity = product[i].quantity - parseInt(quantity);
          updated = true;
        }
      }
    }

    const updated = stock.filter((prod) => prod.quantity !== 0);

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
}
