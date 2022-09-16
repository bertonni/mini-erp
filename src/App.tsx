import { useState } from "react";
import ProductOutput from "./components/ProductOutput";
import ProductRegister from "./components/ProductRegister";
import ViewProduct from "./components/ViewProduct";

function App() {
  const [selectedTab, setSelectedTab] = useState(1);

  return (
    <div className="w-scree h-screen flex flex-col items-center px-10">
      <div className="flex items-center justify-center mt-10">
        <button
          className={`transition-all px-4 py-1 border-b-2 ${selectedTab === 1 ? 'border-sky-400' : 'border-transparent'}`}
          onClick={() => setSelectedTab(1)}
        >
          Cadastrar
        </button>
        <button
          className={`transition-all px-4 py-1 border-b-2 ${selectedTab === 2 ? 'border-sky-400' : 'border-transparent'}`}
          onClick={() => setSelectedTab(2)}
        >
          Consultar
        </button>
        <button
          className={`transition-all px-4 py-1 border-b-2 ${selectedTab === 3 ? 'border-sky-400' : 'border-transparent'}`}
          onClick={() => setSelectedTab(3)}
        >
          Saída
        </button>
      </div>
      <div className="w-full flex justify-center">
        {selectedTab === 1 && (
          <ProductRegister />
        )}
        {selectedTab === 2 && (
          <ViewProduct />
        )}
        {selectedTab === 3 && (
          <ProductOutput />
        )}
      </div>
    </div>
  );
}

export default App;
