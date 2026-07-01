// src/hooks/useTitle.js
import { useEffect } from "react";

const useTitle = (title) => {
     useEffect(() => {
          document.title = `${title} — Yourapp`;
     }, [title]);
};

export default useTitle;