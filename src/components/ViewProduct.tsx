import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useProductStock } from "../contexts/ProductStockContext";
import ProductDetail from "./ProductDetail";

export default function ViewProduct() {
  const [barcode, setBarcode] = useState<string>("");
  const [currBarcode, setCurrBarcode] = useState<string>("");
  const [showData, setShowData] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [currDescription, setCurrDescription] = useState<string>("");

  const barcodeRef = useRef<HTMLInputElement>();
  const descriptionRef = useRef<HTMLInputElement>();

  const { setError, setSuccess } = useProductStock();

  useEffect(() => {
    setError("");
    setSuccess("");
  }, []);

  useEffect(() => {
    if (barcode.length === 0) setShowData(false);
  }, [barcode]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "ControlLeft" || e.code === "KeyJ" || e.code === "Enter") {
      e.preventDefault();
      if (e.code === "KeyJ" || e.code === "Enter") {
        const target = e.target as HTMLInputElement;
        setShowData(true);
        setCurrBarcode(barcodeRef.current.value);
        setCurrDescription(descriptionRef.current.value);
        target.select();
        return;
      }
      setShowData(false);
      // e.preventDefault();
    }
  };

  const focusBarcodeInput = () => {
    // barcodeRef.current.focus();
  };

  return (
    <div
      className="flex flex-col items-center w-full sm:w-8/12 lg:w-6/12 min-h-[80vh]"
      onClick={focusBarcodeInput}
    >
      <div className="mt-6 w-full">
        <label
          htmlFor="barcode"
          className="block mb-1 text-sm font-medium text-gray-500"
        >
          Código de Barras
        </label>
        <input
          type="text"
          id="barcode"
          ref={barcodeRef}
          value={barcode}
          autoFocus
          name="barcode"
          autoComplete="off"
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500
        focus:border-sky-500 block w-full p-2.5 focus:outline-none text-center select-all"
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
          ref={descriptionRef}
          value={description}
          name="description"
          autoComplete="off"
          onFocus={(e) => e.stopPropagation()}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500
        focus:border-sky-500 block w-full p-2.5 focus:outline-none text-center select-all"
          required
        />
      </div>
      {showData && <ProductDetail barcode={currBarcode} description={currDescription} />}
    </div>
  );
}
