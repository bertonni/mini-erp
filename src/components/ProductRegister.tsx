import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { IProduct } from "../@types/types";
import { useProductStock } from "../contexts/ProductStockContext";

export default function ProductRegister() {
  const [barcode, setBarcode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [localization, setLocalization] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const { stock, addProduct, error, success } = useProductStock();

  const barcodeRef = useRef(null);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "ControlLeft" || e.code === "KeyJ" || e.code === "Enter") {
      e.preventDefault();
    }
  };

  const resetForm = () => {
    setBarcode("");
    setDescription("");
    setLocalization("");
    setQuantity(0);
    barcodeRef.current.focus();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newProduct: IProduct = {
      barcode,
      description,
      localization,
      quantity,
    };
    addProduct(newProduct);
    resetForm();
  };

  return (
    <div className="flex flex-col items-center w-full sm:w-8/12 lg:w-6/12">
      <form onSubmit={(e) => handleSubmit(e)} className="w-full">
        <div className="mt-6 w-full">
          <label
            htmlFor="barcode"
            className="block mb-1 text-sm font-medium text-gray-500"
          >
            Código de Barras
          </label>
          <input
            ref={barcodeRef}
            type="text"
            id="barcode"
            value={barcode}
            autoFocus
            name="barcode"
            autoComplete="off"
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-sky-500
          focus:border-sky-500 block w-full p-2.5 focus:outline-none text-center"
            required
          />
        </div>
        <div className="mt-3 w-full">
          <label
            htmlFor="description"
            className="block mb-1 text-sm font-medium text-gray-500"
          >
            Descrição do Produto
          </label>
          <input
            type="text"
            id="description"
            value={description}
            name="description"
            autoComplete="off"
            onChange={(e) => setDescription(e.target.value)}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-sky-500
            focus:border-sky-500 block w-full p-2.5 focus:outline-none text-center"
            required
          />
        </div>
        <div className="mt-3 w-full flex items-center gap-2">
          <div className="flex-1">
            <label
              htmlFor="localization"
              className="block mb-1 text-sm font-medium text-gray-500"
            >
              Localização
            </label>
            <input
              type="text"
              id="localization"
              value={localization}
              name="localization"
              autoComplete="off"
              onChange={(e) => setLocalization(e.target.value.toUpperCase())}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-sky-500
            focus:border-sky-500 block w-full p-2.5 focus:outline-none text-center uppercase"
              required
            />
          </div>
          <div className="w-28">
            <label
              htmlFor="quantity"
              className="block mb-1 text-sm font-medium text-gray-500"
            >
              Quantidade
            </label>
            <input
              type="number"
              min={1}
              value={quantity}
              id="quantity"
              name="quantity"
              autoComplete="off"
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900
                text-sm rounded focus:ring-sky-500 focus:border-sky-500 block
                w-full p-2.5 focus:outline-none text-center"
              required
            />
          </div>
        </div>
        <div className="mt-4 w-full flex justify-center">
          <button className="px-4 py-2 bg-sky-500 text-white hover:bg-sky-400 rounded w-6/12 transition-all">
            Cadastrar
          </button>
        </div>
      </form>
      {error.length > 0 && (
        <p className="text-gray-500 text-center mt-6">{error}</p>
      )}
      {success.length > 0 && (
        <p className="text-gray-500 text-center mt-6">{success}</p>
      )}
    </div>
  );
}
