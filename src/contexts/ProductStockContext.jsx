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
    console.log(localStorage.getItem('stock'));
  };

  const outputProduct = (barcode, quantity) => {
    const product = stock.filter((prod) => prod.barcode === barcode);

    let totalQuantity = 0;

    for (let i = 0; i < product.length; i++) {
      totalQuantity += product[i].quantity;
      console.log(product[i].quantity);
    }

    if (quantity > totalQuantity) {
      setError('Não há quantidade suficiente no estoque');
      return;
    }

    if (product.lenght > 0) {
      console.log('produtos', product);
      // for (let i = 0; i < product.length; i++) {
      //   console.log(product[i]);
      //   if (quantity > product[i].quantity) {
      //     parseItnt(quantity) -= product[i].quantity;
      //     product[i].quantity = 0;
      //   } else {
      //     product[i].quantity = product[i].quantity - parseInt(quantity);
      //   }
      // }
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
      outputProduct,
    }),
    [stock, error, success]
  );

  return (
    <ProductStockContext.Provider value={memoedValues}>
      {children}
    </ProductStockContext.Provider>
  );
}
