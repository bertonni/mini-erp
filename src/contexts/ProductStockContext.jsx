import { createContext, useMemo, useState, useContext } from "react";

const ProductStockContext = createContext();

export const useProductStock = () => {
  return useContext(ProductStockContext);
};

export function ProductStockProvider({ children }) {

  const storedStock = JSON.parse(window.localStorage.getItem('stock'));

  const [stock, setStock] = useState(storedStock || []);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addProduct = (product) => {
    const currProduct = stock.filter((prod) => prod.barcode === product.barcode);

    if (currProduct.length === 0) {
      stock.push(product);

      window.localStorage.setItem('stock', JSON.stringify(stock));
      setStock([...stock, product]);
      setSuccess("Produto cadastrado com sucesso");
      setError("");
    } else {
      setError("Produto já existe no estoque, não é possível cadastrar em duplicidade");
      setSuccess("");
    }
  };

  const memoedValues = useMemo(() => ({
    stock,
    error,
    success,
    setError,
    setSuccess,
    addProduct
  }), [stock, error, success]);

  return (
    <ProductStockContext.Provider value={memoedValues}>
      {children}
    </ProductStockContext.Provider>
  );
}