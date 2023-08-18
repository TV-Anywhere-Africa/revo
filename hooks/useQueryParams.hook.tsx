import { useEffect, useState } from "react";
/**
 * Get URL query param value by param name/key
 * @param paramName
 * @returns Query param value
 */
const useQueryParam = (paramName: string): string | null | undefined => {
  const [paramValue, setParamValue] = useState<string | null | undefined>();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let pv = params.get(paramName);
    if (pv) setParamValue(pv);
  }, [paramName]);
  return paramValue;
};

export default useQueryParam;
