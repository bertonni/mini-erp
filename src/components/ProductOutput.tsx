import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { IProduct } from "../@types/types";
import { useProductStock } from "../contexts/ProductStockContext";
import CurrentProductOutput from "./CurrentProductOutput";
import ProductOutputDetail from "./ProductOutputDetail";
import SelectQuantityModal from "./SelectQuantityModal";

export default function ProductOutput() {
  const [barcode, setBarcode] = useState<string>("");
  const [currentBarcode, setCurrentBarcode] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [showQuantity, setShowQuantity] = useState<boolean>(false);
  const [outputProducts, setOutputProducts] = useState<IProduct[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const barcodeRef = useRef<HTMLInputElement>(null);
  const quantityRef = useRef<HTMLInputElement>(null);

  const { finishOutput, stock, success, setSuccess } = useProductStock();

  useEffect(() => {
    if (success.length > 0) {
      setTimeout(() => setSuccess(''), 2000);
    }
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "F3" || e.code === "F2") {
      e.preventDefault();
      setShowQuantity(true);
    }

    if (e.code === "ControlLeft" || e.code === "KeyJ" || e.code === "Enter") {
      if (e.code === "KeyJ" || e.code === "Enter") {
        const target = e.target as HTMLInputElement;
        setCurrentBarcode(barcode);
        outputProduct(barcode, quantity);

        target.select();
      }
      e.preventDefault();
    }
  };

  const outputProduct = (barcode: string, quantity: number) => {
    const prod: IProduct[] = Array.from(stock.filter(
      (prod: IProduct) => prod.barcode === barcode
    ));
    const product: IProduct[] = Array.from(prod);

    let totalQuantity: number = 0;

    for (let i = 0; i < product.length; i++) {
      totalQuantity += product[i].quantity;
    }

    if (product.length === 0) {
      setErrorMessage(`Produto não encontrado`);
      return;
    }

    if (quantity > totalQuantity) {
      setErrorMessage(
        `Não há quantidade suficiente no estoque. Total em estoque: ${totalQuantity}`
      );
      return;
    }

    setErrorMessage(null);

    if (product.length > 0) {
      for (let i = 0; i < product.length; i++) {
        if (quantity >= product[i].quantity) {
          quantity = quantity - product[i].quantity;
          const copy = Object.assign({}, product[i]);
          copy.quantity = quantity;
          setOutputProducts([...outputProducts, copy]);
          product[i].quantity = 0;
          continue;
        } else {
          const copy = Object.assign({}, product[i]);
          copy.quantity = quantity;
          product[i].quantity -= quantity;
          setOutputProducts([...outputProducts, copy]);
          break;
        }
      }
    }
  };

  const focusBarcodeInput = () => {
    barcodeRef.current.focus();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setQuantity(parseInt(quantityRef.current.value));

    setShowQuantity(false);
    barcodeRef.current.focus();
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    finishOutput(outputProducts);
  };

  return (
    <div
      className="flex flex-col items-center w-full sm:w-8/12 lg:w-6/12 min-h-[80vh]"
      onClick={focusBarcodeInput}
    >
      <CurrentProductOutput quantity={quantity} barcode={currentBarcode} />
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
          onKeyDown={handleKeyDown}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500
        focus:border-sky-500 block w-full p-2.5 focus:outline-none text-center select-all"
          required
        />
      </div>
      {showQuantity && (
        <SelectQuantityModal setShow={setShowQuantity} handleSubmit={handleSubmit} quantityRef={quantityRef} />
      )}
      {errorMessage !== null && (
        <p className="text-gray-500 mt-4">{errorMessage}</p>
      )}

      <form
        onSubmit={(e) => handleFormSubmit(e)}
        className="w-full flex flex-col items-center gap-2 mt-10"
      >
        {outputProducts.length > 0 && success.length === 0 && (
          <div className="flex items-center w-full gap-4">
            <span className="text-gray-600 font-semibold text-center w-14">
              Qtd
            </span>
            <span className="text-gray-600 font-semibold flex-1">Produto</span>
          </div>
        )}
        {success.length === 0 && outputProducts.map((output, index) => (
          <div
            className="flex items-center justify-between border-b w-full"
            key={index}
          >
            <div className="flex items-center w-full gap-4">
              <span className="text-gray-600 text-lg w-14 text-center">
                {output.quantity}
              </span>
              <span className="text-gray-600 text-lg flex-1">
                {output.description}
              </span>
            </div>
          </div>
        ))}

        {outputProducts.length > 0 && success.length === 0 && (
          <input
            type="submit"
            className="px-4 py-2 rounded bg-sky-500 text-gray-50 mt-6 cursor-pointer hover:bg-sky-400"
            value={"Finalizar Saída"}
          />
        )}
        {success}
      </form>
    </div>
  );
}
