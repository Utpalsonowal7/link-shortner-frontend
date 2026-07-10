import { useRef, useEffect } from "react";

const QRPlaceholder = ({ url }) => {
     const canvasRef = useRef(null);

     const handleDownload = async () => {
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
               url || "",
          )}`;

          try {
               const response = await fetch(qrUrl);
               const blob = await response.blob();

               const blobUrl = window.URL.createObjectURL(blob);

               const a = document.createElement("a");
               a.href = blobUrl;
               a.download = "qr.png";
               document.body.appendChild(a);
               a.click();

               a.remove();
               window.URL.revokeObjectURL(blobUrl);
          } catch (err) {
               console.error(err);
          }
     };

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
                    <button
                         onClick={handleDownload}
                         className="flex-1 text-center text-xs font-semibold py-2 border border-border rounded-lg text-muted-2 hover:text-text hover:border-muted-2 transition-colors cursor-pointer"
                    >
                         Download
                    </button>

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
