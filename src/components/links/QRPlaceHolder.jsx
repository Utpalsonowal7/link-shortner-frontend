import { useRef, useEffect } from "react";

const QRPlaceholder = ({ url }) => {
     const canvasRef = useRef(null);

     useEffect(() => {
          // using a free QR API since we cant use external libs in this env
          // in your actual project use: npm install qrcode
          // import QRCode from 'qrcode'; QRCode.toCanvas(canvasRef.current, url)
     }, [url]);

     return (
          <div className="flex flex-col items-center gap-3">
               <div className="bg-white p-2.5 rounded-lg">
                    <img
                         src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(url || "https://snip.io")}`}
                         alt="QR Code"
                         className="w-28 h-28 block"
                    />
               </div>
               <div className="flex gap-2 w-full">
                    <a
                         href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url || "")}`}
                         download="qr.png"
                         target="_blank"
                         rel="noreferrer"
                         className="flex-1 text-center text-xs font-semibold py-2 border border-border rounded-lg text-muted-2 hover:text-text hover:border-muted-2 transition-colors"
                    >
                         Download
                    </a>

                    <a
                         href={url}
                         target="_blank"
                         rel="noreferrer"
                         className="flex-1 text-center text-xs font-semibold py-2 border border-border rounded-lg text-muted-2 hover:text-text hover:border-muted-2 transition-colors"
                    >
                         Preview
                    </a>
               </div>
          </div>
     );
};

export default QRPlaceholder;
