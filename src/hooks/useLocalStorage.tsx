import { useEffect, useState } from "react";
import { IProduct, IuseLocalStorage } from '../@types/types';


export default function useLocalStorage( {key, defaultValue} : IuseLocalStorage) {
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(key);

    if (jsonValue) return JSON.parse(jsonValue);    
    return defaultValue;

  });

  useEffect(() => {
    value.sort((a: IProduct, b: IProduct) => {
      if (a.localization < b.localization) return -1;
      else if (a.localization > b.localization) return 1;
      return 0;
    });
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
