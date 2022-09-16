import { FC } from "react";
import { IQuantityModal } from "../@types/types";


const SelectQuantityModal:FC<IQuantityModal> = ({ setShow, quantityRef, handleSubmit }) => {
  
  return (
    <div
      className="fixed bg-black w-screen h-screen inset-0 flex items-center justify-center
          bg-opacity-50"
      onClick={() => setShow(false)}
    >
      <form
        className="flex flex-col items-center gap-2 bg-white px-4 py-4 rounded -mt-96"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => handleSubmit(e)}
      >
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
            ref={quantityRef}
            name="quantity"
            autoComplete="off"
            autoFocus
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900
                  text-sm rounded focus:ring-sky-500 focus:border-sky-500 block
                  w-full p-2.5 focus:outline-none text-center"
            required
          />
        </div>
        <input
          type="submit"
          value="Confirmar"
          className="rounded py-2 px-4 bg-sky-500 text-gray-50"
        />
      </form>
    </div>
  );
}

export default SelectQuantityModal;