// import React from "react";
import { IProduct, ICurrentProductOutput } from "../@types/types";
import { useProductStock } from "../contexts/ProductStockContext";

export default function CurrentProductOutput ({ quantity, barcode }: ICurrentProductOutput) {
  const { stock } = useProductStock();
  const product:IProduct = stock.filter((prod:IProduct) => prod.barcode === barcode)[0];

  return (
    <div className="h-12 rounded mt-6 bg-cyan-600 text-gray-50 w-full flex items-center gap-2">
      <div className="flex flex-col items-center justify-center p-2">
        <h1 className="font-bold text-gray-50 cursor-default" title="Quantidade">Quant.</h1>
        <span className="text-gray-50">{quantity}</span>
      </div>
      <div className="flex flex-col items-center justify-center py-2">
        <span className="text-transparent">tes</span>
        <span className="text-gray-50 font-medium">x</span>
      </div>
      <div className="flex flex-col justify-start h-full items-start flex-1 pl-4">
        <h1 className="font-bold text-gray-50 align-top">Produto</h1>
        <span className="text-gray-50">{product?.description}</span>
      </div>
      <div className="flex flex-col justify-start h-full items-start flex-1 pl-4">
        <h1 className="font-bold text-gray-50 align-top">Localização</h1>
        <span className="text-gray-50">{product?.localization}</span>
      </div>
    </div>
  );
}
