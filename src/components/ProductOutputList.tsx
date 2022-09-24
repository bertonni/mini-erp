import { IProductOutputListProps } from "../@types/types";
import { useProductStock } from "../contexts/ProductStockContext";

const ProductOutputList = ({
  outputProducts,
  quantity,
  handleFinish,
}: IProductOutputListProps) => {
  const { success } = useProductStock();

  if (success.length > 0) return;
  
  return (
    <div className="w-full flex flex-col items-center gap-2 mt-10">
      {outputProducts.length > 0 && (
        <div className="flex items-center w-full gap-4">
          <span className="text-gray-600 font-semibold text-center w-14">
            Qtd
          </span>
          <span className="text-gray-600 font-semibold flex-1">Produto</span>
        </div>
      )}
      {outputProducts.map((output, index) => (
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

      {outputProducts.length > 0 && (
        <button
          onClick={handleFinish}
          type="submit"
          className="px-4 py-2 rounded bg-sky-500 text-gray-50 mt-6 cursor-pointer hover:bg-sky-400"
        >
          Finalizar Saída
        </button>
      )}
      {success}
    </div>
  );
};

export default ProductOutputList;
