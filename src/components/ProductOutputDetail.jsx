import { useEffect, useState } from "react";
import { useProductStock } from "../contexts/ProductStockContext";

export default function ProductOutputDetail({ barcode, quantity = 1 }) {
  const [product, setProduct] = useState(null);
  const { stock } = useProductStock();

  useEffect(() => {
    const prod = stock.filter((pro) => pro.barcode === barcode);

    if (prod.length === 0) return;

    let totalQuantity = 0;

    for (let i = 0; i < prod.length; i++) {
      totalQuantity += prod[i].quantity;
    }

    const newProd = Object.assign({}, prod[0]);
    newProd.quantity = totalQuantity;
    setProduct(newProd);
  }, [barcode]);

  if (!product)
    return <p className="mt-6 text-gray-500">Produto não encontrado</p>;

  return (
    <div className="mt-6 flex flex-col items-start">
      <h1 className="text-gray-500 text-2xl">{product.description}</h1>
      <p className="text-gray-500">Quantidade: {quantity}</p>
    </div>
  );
}
