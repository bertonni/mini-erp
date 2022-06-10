import React, { useEffect, useRef, useState } from 'react'
import { useProductStock } from '../contexts/ProductStockContext';

export default function ProductOutput() {

  const [barcode, setBarcode] = useState('');
  const [showData, setShowData] = useState(false);
  const [outputProducts, setOutputProducts] = useState([]);
  const [searchedProduct, setSearchedProduct] = useState('');
  const barcodeRef = useRef();

  const { setError, setSuccess } = useProductStock();

  useEffect(() => {
    setError("");
    setSuccess("");
  }, []);

  useEffect(() => {
    if (barcode.length === 0) setShowData(false);
  }, [barcode]);

  const handleKeyDown = (e) => {
    if (e.code === 'F3' || e.code === 'F2') e.preventDefault();

    if (e.code === "ControlLeft" || e.code === "KeyJ" || e.code === "Enter") {
      if (e.code === "KeyJ" || e.code === "Enter") {
        setShowData(true);
        e.target.select();
      }
      e.preventDefault();
    }
  };

  const focusBarcodeInput = () => {
    barcodeRef.current.focus();
  }

  return (
    <div className="flex flex-col items-center w-full sm:w-8/12 lg:w-6/12 min-h-[80vh]" onClick={focusBarcodeInput}>
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
      {/* {showData &&
        <ProductDetail barcode={barcode} />
      } */}
    </div>
  )
}
