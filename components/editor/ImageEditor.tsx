"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { Product } from "@/types";
import { RotateCcw, ZoomIn, ZoomOut, Move, Check, Upload } from "lucide-react";

interface Props {
  product: Product;
  onComplete: (dataUrl: string, uploadedImageUrl: string) => void;
  onCancel?: () => void;
}

interface ImgState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export default function ImageEditor({ product, onComplete, onCancel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [productImg, setProductImg] = useState<HTMLImageElement | null>(null);
  const [userImg, setUserImg] = useState<HTMLImageElement | null>(null);
  const [canvasDim, setCanvasDim] = useState<{ width: number; height: number }>({ width: 600, height: 600 });
  const [state, setState] = useState<ImgState>({ x: 300, y: 300, scale: 1, rotation: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragOff, setDragOff] = useState({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [rawUserImgData, setRawUserImgData] = useState("");

  /* ── Load product background with natural aspect ratio ── */
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = product.image;
    img.onload = () => {
      const nw = img.naturalWidth || 600;
      const nh = img.naturalHeight || 600;
      const targetW = 600;
      const targetH = Math.round((600 * nh) / nw);
      
      setCanvasDim({ width: targetW, height: targetH });
      setState({ x: targetW / 2, y: targetH / 2, scale: 1, rotation: 0 });
      setProductImg(img);
    };
    img.onerror = () => setProductImg(null);
  }, [product.image]);

  /* ── Draw on Canvas ── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const { width: CW, height: CH } = canvasDim;

    ctx.clearRect(0, 0, CW, CH);

    // 1. Draw Product Image (Exact natural aspect ratio, no squashing)
    if (productImg) {
      ctx.drawImage(productImg, 0, 0, CW, CH);
    } else {
      ctx.fillStyle = "#FAF7F2";
      ctx.fillRect(0, 0, CW, CH);
    }

    // 2. Draw User Custom Image
    if (userImg) {
      ctx.save();
      ctx.translate(state.x, state.y);
      ctx.rotate((state.rotation * Math.PI) / 180);
      ctx.scale(state.scale, state.scale);

      // Natural proportional sizing (fit ~45% of canvas width)
      const targetDim = CW * 0.45;
      const iw = userImg.naturalWidth || 200;
      const ih = userImg.naturalHeight || 200;
      const base = Math.min(targetDim / iw, targetDim / ih);
      const dw = iw * base;
      const dh = ih * base;

      ctx.drawImage(userImg, -dw / 2, -dh / 2, dw, dh);
      ctx.restore();
    } else {
      // Guide overlay when no image is uploaded
      ctx.save();
      ctx.strokeStyle = "rgba(103,13,31,0.5)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      const padX = CW * 0.15;
      const padY = CH * 0.18;
      ctx.strokeRect(padX, padY, CW - padX * 2, CH - padY * 2);
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(103,13,31,0.04)";
      ctx.fillRect(padX, padY, CW - padX * 2, CH - padY * 2);
      
      ctx.fillStyle = "#670D1F";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Upload your design or photo", CW / 2, CH / 2 - 12);
      
      ctx.font = "13px sans-serif";
      ctx.fillStyle = "#4B5563";
      ctx.fillText("Position, zoom & rotate freely", CW / 2, CH / 2 + 14);
      ctx.restore();
    }
  }, [productImg, userImg, state, canvasDim]);

  useEffect(() => { draw(); }, [draw]);

  /* ── File Upload ── */
  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUri = e.target?.result as string;
      setRawUserImgData(dataUri);
      const img = new window.Image();
      img.src = dataUri;
      img.onload = () => {
        setUserImg(img);
        setState({ x: canvasDim.width / 2, y: canvasDim.height / 2, scale: 1, rotation: 0 });
      };
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setUploadedUrl(data.url);
    } catch { /* fallback to rawUserImgData */ }
    finally { setUploading(false); }
  };

  /* ── Helpers to convert pointer pos to canvas coords ── */
  const toCanvas = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const sx = canvasDim.width / rect.width;
    const sy = canvasDim.height / rect.height;
    return { x: (clientX - rect.left) * sx, y: (clientY - rect.top) * sy };
  };

  /* ── Mouse Drag ── */
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!userImg) return;
    const p = toCanvas(e.clientX, e.clientY);
    setDragging(true);
    setDragOff({ x: p.x - state.x, y: p.y - state.y });
  };
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return;
    const p = toCanvas(e.clientX, e.clientY);
    setState(s => ({ ...s, x: p.x - dragOff.x, y: p.y - dragOff.y }));
  };
  const onMouseUp = () => {
    setDragging(false);
  };

  /* ── Touch Drag ── */
  const onTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!userImg) return;
    const t = e.touches[0];
    const p = toCanvas(t.clientX, t.clientY);
    setDragging(true);
    setDragOff({ x: p.x - state.x, y: p.y - state.y });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      e.preventDefault();
      const t = e.touches[0];
      const p = toCanvas(t.clientX, t.clientY);
      setState(s => ({ ...s, x: p.x - dragOff.x, y: p.y - dragOff.y }));
    };

    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => canvas.removeEventListener("touchmove", handleTouchMove);
  }, [dragging, dragOff, canvasDim]);

  const handleConfirm = () => {
    const dataUrl = canvasRef.current?.toDataURL("image/png") || "";
    const originalPhoto = uploadedUrl || rawUserImgData;
    onComplete(dataUrl, originalPhoto);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">

      {/* Canvas Viewport */}
      <div 
        className="w-full max-w-[460px] mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-amber-100 bg-[#FAF7F2] flex items-center justify-center"
        style={{ aspectRatio: `${canvasDim.width} / ${canvasDim.height}` }}
      >
        <canvas
          ref={canvasRef}
          width={canvasDim.width}
          height={canvasDim.height}
          className={`block w-full h-full object-contain ${
            userImg ? "cursor-grab active:cursor-grabbing" : "cursor-default"
          }`}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchEnd={onMouseUp}
        />
      </div>

      {/* Hidden File input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {/* Action Controls */}
      {!userImg ? (
        <div className="w-full max-w-[460px] flex gap-2.5">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 bg-[#670D1F] hover:bg-[#520817] text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            <Upload size={16} />
            {uploading ? "Uploading Image..." : "Upload Your Image"}
          </button>
        </div>
      ) : (
        <div className="w-full max-w-[460px] flex flex-col gap-3">
          
          {/* Zoom & Rotation Controls */}
          <div className="flex items-center justify-center gap-2 flex-wrap bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
            <button
              onClick={() => setState(s => ({ ...s, scale: Math.min(s.scale + 0.15, 4) }))}
              className="flex items-center gap-1 bg-white text-gray-800 border border-gray-200 hover:bg-rose-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <ZoomIn size={14} className="text-[#670D1F]" /> Zoom +
            </button>
            <button
              onClick={() => setState(s => ({ ...s, scale: Math.max(s.scale - 0.15, 0.2) }))}
              className="flex items-center gap-1 bg-white text-gray-800 border border-gray-200 hover:bg-rose-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <ZoomOut size={14} className="text-[#670D1F]" /> Zoom −
            </button>
            <button
              onClick={() => setState(s => ({ ...s, rotation: (s.rotation + 90) % 360 }))}
              className="flex items-center gap-1 bg-white text-gray-800 border border-gray-200 hover:bg-rose-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <RotateCcw size={14} className="text-[#670D1F]" /> Rotate
            </button>
            <button
              onClick={() => setState({ x: canvasDim.width / 2, y: canvasDim.height / 2, scale: 1, rotation: 0 })}
              className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            >
              Reset
            </button>
          </div>

          <p className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1 font-medium">
            <Move size={12} className="text-[#670D1F]" /> Drag &amp; move image freely on the product
          </p>

          <div className="flex gap-2.5 pt-1">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors text-center"
            >
              Change Photo
            </button>
            <button
              onClick={handleConfirm}
              disabled={uploading}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#670D1F] hover:bg-[#520817] disabled:opacity-60 text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              <Check size={16} />
              {uploading ? "Saving..." : "Apply Design"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
