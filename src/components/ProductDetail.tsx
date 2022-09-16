import { useEffect, useState } from "react";
import { IProduct } from "../@types/types";
import { useProductStock } from "../contexts/ProductStockContext";

export default function ProductDetail({ barcode, description }) {
  const [product, setProduct] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const { stock } = useProductStock();

  useEffect(() => {
    let prod:IProduct[];
    if (barcode.length > 0) {
      prod = stock.filter((pro:IProduct) => pro.barcode === barcode);
    } else if (description.length > 0) {
      prod = stock.filter((pro:IProduct) => pro.description.toLowerCase().includes(description));
    }
    if (prod.length === 0) {
      setProduct(null);
      return;
    }
    setProduct(prod);

    let totalQuantity = 0;

    for (let i = 0; i < prod.length; i++) {
      totalQuantity += prod[i].quantity;
    }

    setTotalQuantity(totalQuantity);
  }, [barcode, description]);

  if (!product)
    return <p className="mt-6 text-gray-500">Produto não encontrado</p>;

  return (
    <div className="mt-6 flex flex-col items-start w-4/5 max-w-md">
      {product.map((prod: IProduct, index: number) => (
        <div key={index} className="mt-4 w-full">
          <h1 className="text-gray-500 text-2xl"><b>Produto:</b> {prod.description}</h1>
          <div className="flex items-center justify-between">
            <h1 className="text-gray-500"><b>Localização:</b> {prod.localization}</h1>
            <p className="text-gray-500">
              <b>Quantidade:</b> {prod.quantity}
            </p>
          </div>
          <hr className="border-b-2 mt-1" />
        </div>
      ))}
      {product && (
        <p className="text-gray-600 mt-4">Total em estoque: {totalQuantity}</p>
      )}
    </div>
  );
}
