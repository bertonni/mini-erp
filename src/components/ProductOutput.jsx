import React, { useEffect, useRef, useState } from "react";
import { useProductStock } from "../contexts/ProductStockContext";
import ProductOutputDetail from "./ProductOutputDetail";

export default function ProductOutput() {
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showData, setShowData] = useState(false);
  const [showQuantity, setShowQuantity] = useState(false);
  const [outputProducts, setOutputProducts] = useState([]);
  const [searchedProduct, setSearchedProduct] = useState("");
  const barcodeRef = useRef();
  const [errorMessage, setErrorMessage] = useState(null);

  const { error, setError, outputProduct } = useProductStock();

  useEffect(() => {
    if (barcode.length === 0) setShowData(false);
  }, [barcode]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setError("");
    }
  }, [error]);

  const handleKeyDown = (e) => {
    if (e.code === "F3" || e.code === "F2") {
      e.preventDefault();
      setShowQuantity(true);
    }

    if (e.code === "ControlLeft" || e.code === "KeyJ" || e.code === "Enter") {
      if (e.code === "KeyJ" || e.code === "Enter") {
        setShowData(true);
        outputProduct(barcode, quantity);
        e.target.select();
      }
      e.preventDefault();
    }
  };

  const focusBarcodeInput = () => {
    barcodeRef.current.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setQuantity(parseInt(e.target.quantity.value));

    setShowQuantity(false);
    barcodeRef.current.focus();
  }

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
          value={barcode}
          autoFocus
          ref={barcodeRef}
          name="barcode"
          autoComplete="off"
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500
        focus:border-sky-500 block w-full p-2.5 focus:outline-none text-center select-all"
          required
        />
      </div>
      {showQuantity && 
        <div className="fixed bg-black w-screen h-screen inset-0 flex items-center justify-center
          bg-opacity-50"
          onClick={() => setShowQuantity(false)}
        >

          <form className="flex flex-col items-center gap-2 bg-white px-4 py-4 rounded -mt-96" onClick={(e) => e.stopPropagation()} onSubmit={(e) => handleSubmit(e)}>
            <div className="w-full">
              <label
                htmlFor="quantity"
                className="block mb-1 text-sm font-medium text-gray-500"
              >
                Quantidade
              </label>
              <input
                type="number"
                min={1}
                id="quantity"
                name="quantity"
                autoComplete="off"
                autoFocus
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900
                  text-sm rounded focus:ring-sky-500 focus:border-sky-500 block
                  w-full p-2.5 focus:outline-none text-center"
                required
              />
            </div>
            <input type="submit" value="Confirmar" className="rounded py-2 px-4 bg-sky-500 text-gray-50" />
          </form>
        </div>
      }
      {showData && !error && <ProductOutputDetail barcode={barcode} quantity={quantity} />}
      {errorMessage && <p className="text-gray-500">{errorMessage}</p>}
    </div>
  );
}
