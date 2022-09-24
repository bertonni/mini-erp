import { useEffect, useState } from "react";
import { IProduct, IProductDetailProps } from "../@types/types";
import { useProductStock } from "../contexts/ProductStockContext";

export default function ProductDetail({
  barcode,
  description,
}: IProductDetailProps) {
  const [product, setProduct] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const { stock } = useProductStock();

  useEffect(() => {
    let prod: IProduct[];
    if (barcode.length > 0) {
      prod = stock.filter((pro: IProduct) => pro.barcode === barcode);
    } else if (description.length > 0) {
      prod = stock.filter((pro: IProduct) =>
        pro.description.toLowerCase().includes(description)
      );
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
    <div className="mt-6 flex flex-col items-start w-full max-w-md">
      {product.map((prod: IProduct, index: number) => (
        <div
          key={index}
          className="first mt-2 w-full flex flex-col justify-between px-4 py-2 h-20 rounded border
            border-gray-300"
        >
          <h1 className="text-gray-500 text-xl">
            <b>Produto:</b> {prod.description}
          </h1>
          <div className="flex items-center justify-between">
            <h1 className="text-sm text-gray-500">
              <b className="">Localização:</b> {prod.localization}
            </h1>
            <p className="text-sm text-gray-500">
              <b className="">Quantidade:</b> {prod.quantity}
            </p>
          </div>
          {/* <hr className="border-b mt-1" /> */}
        </div>
      ))}
      <p className="text-gray-500 mt-4">
        <b>Total em estoque:</b> {totalQuantity}
      </p>
    </div>
  );
}
