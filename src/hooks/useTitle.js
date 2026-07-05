// src/hooks/useTitle.js
import { useEffect } from "react";

const useTitle = (title) => {
     useEffect(() => {
          document.title = `${title}`;
     }, [title]);
};

export default useTitle;