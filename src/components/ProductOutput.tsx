import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { IProduct } from "../@types/types";
import { useProductStock } from "../contexts/ProductStockContext";
import CurrentProductOutput from "./CurrentProductOutput";
import ProductOutputList from "./ProductOutputList";
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

  const { finishOutput, stock, success, setSuccess, getTotalInStock } =
    useProductStock();
  const [stockCopy] = useState<IProduct[]>(stock);

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
        setBarcode("");
        setQuantity(1);
        target.select();
      }
      e.preventDefault();
    }
  };

  const outputProduct = (barcode: string, quantity: number) => {
    const product: IProduct[] = stockCopy.filter((prod: IProduct) => prod.barcode === barcode);

    if (product.length === 0) {
      setErrorMessage(`Produto não cadastrado`);
      return;
    }

    let totalQuantity: number = quantity;
    let totalInStock: number = getTotalInStock(barcode);

    for (let i = 0; i < outputProducts.length; i++) {
      if (outputProducts[i].barcode === barcode)
        totalQuantity += outputProducts[i].quantity;
    }

    if (totalQuantity > totalInStock) {
      setErrorMessage(
        `Não há quantidade suficiente no estoque. Total em estoque: ${totalInStock}`
      );
      return;
    }

    const productIsInOutput: IProduct[] = outputProducts.filter(
      (prod: IProduct) => prod.barcode === barcode
    );

    if (productIsInOutput.length > 0) {
      for (let i = 0; i < outputProducts.length; i++) {
        if (outputProducts[i].barcode === barcode) {
          outputProducts[i].quantity += quantity;
          break;
        }
      }
      setOutputProducts(outputProducts);
    } else {
      const product: IProduct = Object.assign(
        stockCopy.filter((prod: IProduct) => prod.barcode === barcode)[0]
      );
      const copy: IProduct = {
        quantity: quantity,
        description: product.description,
        barcode: product.barcode,
        localization: "",
      };
      copy.quantity = quantity;
      setOutputProducts([...outputProducts, copy]);
    }

    setErrorMessage(null);
    console.log(outputProducts);
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

  const handleFormSubmit = () => {
    finishOutput(outputProducts);
    setErrorMessage("");
    setQuantity(1);
  };

  const closeMessage = () => {
    setSuccess("");
    setOutputProducts([]);
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
        <SelectQuantityModal
          setShow={setShowQuantity}
          handleSubmit={handleSubmit}
          quantityRef={quantityRef}
        />
      )}
      {errorMessage !== null && (
        <p className="text-gray-500 mt-4">{errorMessage}</p>
      )}
      {success.length > 0 && (
        <div className="flex items-center py-4 px-8 rounded border border-green-600
          bg-green-100 relative mt-4 text-green-600">
          <span
            className="absolute right-1 top-0 cursor-pointer text-lg"
            onClick={closeMessage}
          >
            x
          </span>
          <p className="">{success}</p>
        </div>
      )}
      <ProductOutputList
        quantity={quantity}
        outputProducts={outputProducts}
        handleFinish={handleFormSubmit}
      />
    </div>
  );
}
