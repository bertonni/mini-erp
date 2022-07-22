import React, { useEffect, useRef, useState } from "react";
import { useProductStock } from "../contexts/ProductStockContext";
import ProductOutputDetail from "./ProductOutputDetail";

export default function ProductOutput() {
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showData, setShowData] = useState(false);
  const [showQuantity, setShowQuantity] = useState(false);
  const [outputProducts, setOutputProducts] = useState([]);
  const barcodeRef = useRef();
  const [errorMessage, setErrorMessage] = useState(null);

  const { finishOutput, stock } = useProductStock();

  useEffect(() => {
    if (barcode.length === 0) setShowData(false);
  }, [barcode]);

  const handleKeyDown = (e) => {
    if (e.code === "F3" || e.code === "F2") {
      e.preventDefault();
      setShowQuantity(true);
    }

    if (e.code === "ControlLeft" || e.code === "KeyJ" || e.code === "Enter") {
      if (e.code === "KeyJ" || e.code === "Enter") {
        setShowData(true);
        outputProduct(barcode, quantity);
        setQuantity(1);
        setErrorMessage(null);
        e.target.select();
      }
      e.preventDefault();
    }
  };

  const outputProduct = (barcode, quantity) => {
    const prod = stock.filter((prod) => prod.barcode === barcode);
    const product = Array.from(prod);

    let totalQuantity = 0;

    for (let i = 0; i < product.length; i++) {
      totalQuantity += product[i].quantity;
    }

    if (quantity > totalQuantity) {
      setErrorMessage(`Não há quantidade suficiente no estoque. Total em estoque: ${totalQuantity}`);
      return;
    }

    if (product.length > 0) {

      for (let i = 0; i < product.length; i++) {
        if (quantity >= product[i].quantity) {
          quantity = parseInt(quantity) - product[i].quantity;
          const copy = Object.assign({}, product[i]);
          copy.quantity = quantity;
          setOutputProducts([...outputProducts, copy]);
          product[i].quantity = 0;
        } else {
          const copy = Object.assign({}, product[i]);
          copy.quantity = quantity;
          product[i].quantity = product[i].quantity - parseInt(quantity);
          setOutputProducts([...outputProducts, copy]);
        }
      }
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
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    finishOutput(outputProducts);
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
      {showData && !errorMessage && <ProductOutputDetail barcode={barcode} quantity={quantity} />}
      {errorMessage && <p className="text-gray-500 mt-4">{errorMessage}</p>}

      <form onSubmit={(e) => handleFormSubmit(e)} className="w-full flex flex-col items-center gap-2">
        {outputProducts.map((output, index) => (
          <div className="flex items-center justify-between border-b mt-2 w-full" key={index}>
            <div className="flex items-center flex-col justify-center w-full">
              <span className="text-gray-600 font-semibold">Qtd</span>
              <span className="text-gray-600 text-lg">{output.quantity}</span>
            </div>
            <div className="flex flex-col justify-center w-full">
              <span className="text-gray-600 font-semibold">Produto</span>
              <span className="text-gray-600 text-lg">{output.description}</span>
            </div>
          </div>
        ))}

        {outputProducts.length > 0 &&
          <input type="submit" className="px-4 py-2 rounded bg-sky-500 text-gray-50 mt-6 cursor-pointer hover:bg-sky-400" value={"Finalizar Saída"} />
        }
      </form>
    </div>
  );
}
