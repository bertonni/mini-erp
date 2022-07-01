import { useEffect, useState } from "react";
import { useProductStock } from "../contexts/ProductStockContext";

export default function ProductDetail({ barcode }) {
  const [product, setProduct] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const { stock } = useProductStock();

  useEffect(() => {
    const prod = stock.filter((pro) => pro.barcode === barcode);

    if (prod.length === 0) return;

    setProduct(prod);

    let totalQuantity = 0;

    for (let i = 0; i < prod.length; i++) {
      totalQuantity += prod[i].quantity;
    }

    setTotalQuantity(totalQuantity);
  }, [barcode]);

  if (!product)
    return <p className="mt-6 text-gray-500">Produto não encontrado</p>;

  return (
    <div className="mt-6 flex flex-col items-start">
      {product.map((prod, index) => (
        <div key={index}>
          <h1 className="text-gray-500 text-2xl">{prod.description}</h1>
          <h1 className="text-gray-500">{prod.localization}</h1>
          <p className="text-gray-500">
            Quantidade em Estoque: {prod.quantity}
          </p>
          <hr className="border-b-2 py-2" />
        </div>
      ))}
      {product && (
        <p className="text-gray-600 mt-4">Total em estoque: {totalQuantity}</p>
      )}
    </div>
  );
}
