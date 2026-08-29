"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { Product } from "@/types";
import { RotateCcw, ZoomIn, ZoomOut, Move, Check, Upload } from "lucide-react";

interface Props {
  product: Product;
  onComplete: (dataUrl: string, uploadedImageUrl: string) => void;
}

interface ImgState {
  x: number;   // center x on canvas
  y: number;   // center y on canvas
  scale: number;
  rotation: number;
}

const CW = 500; // canvas width
const CH = 500; // canvas height

export default function ImageEditor({ product, onComplete }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const fileRef    = useRef<HTMLInputElement>(null);
  const [productImg, setProductImg] = useState<HTMLImageElement | null>(null);
  const [userImg,    setUserImg]    = useState<HTMLImageElement | null>(null);
  const [state, setState] = useState<ImgState>({ x: CW / 2, y: CH / 2, scale: 1, rotation: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragOff,  setDragOff]  = useState({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  /* ── load product background (showimg) ── */
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = product.image;
    img.onload  = () => setProductImg(img);
    img.onerror = () => setProductImg(null);
  }, [product.image]);

  /* ── draw ── */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, CW, CH);

    // 1. Product background
    if (productImg) {
      ctx.drawImage(productImg, 0, 0, CW, CH);
    } else {
      ctx.fillStyle = "#f5ede0";
      ctx.fillRect(0, 0, CW, CH);
    }

    // 2. User image — NO clip, place freely anywhere on canvas
    if (userImg) {
      ctx.save();
      ctx.translate(state.x, state.y);
      ctx.rotate((state.rotation * Math.PI) / 180);
      ctx.scale(state.scale, state.scale);

      // Default size: fit to ~40% of canvas
      const maxDim = CW * 0.4;
      const iw = userImg.naturalWidth;
      const ih = userImg.naturalHeight;
      const base = Math.min(maxDim / iw, maxDim / ih);
      const dw = iw * base;
      const dh = ih * base;

      ctx.drawImage(userImg, -dw / 2, -dh / 2, dw, dh);
      ctx.restore();
    } else {
      // Guide overlay when no image uploaded yet
      ctx.save();
      ctx.strokeStyle = "rgba(245,158,11,0.7)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      const pad = 40;
      ctx.strokeRect(pad, pad, CW - pad * 2, CH - pad * 2);
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(245,158,11,0.08)";
      ctx.fillRect(pad, pad, CW - pad * 2, CH - pad * 2);
      ctx.fillStyle = "#b45309";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Upload your image", CW / 2, CH / 2 - 12);
      ctx.font = "13px sans-serif";
      ctx.fillStyle = "#92400e";
      ctx.fillText("Then drag & resize freely", CW / 2, CH / 2 + 14);
      ctx.restore();
    }
  }, [productImg, userImg, state]);

  useEffect(() => { draw(); }, [draw]);

  /* ── file upload ── */
  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        setUserImg(img);
        // Place at center of canvas by default
        setState({ x: CW / 2, y: CH / 2, scale: 1, rotation: 0 });
      };
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setUploadedUrl(data.url);
    } catch { /* silent */ }
    finally { setUploading(false); }
  };

  /* ── helpers to convert mouse/touch pos to canvas coords ── */
  const toCanvas = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const sx = CW / rect.width;
    const sy = CH / rect.height;
    return { x: (clientX - rect.left) * sx, y: (clientY - rect.top) * sy };
  };

  /* ── mouse ── */
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
    draggingRef.current = false;
  };

  /* ── touch ── */
  const draggingRef = useRef(false);
  const dragOffRef  = useRef({ x: 0, y: 0 });

  const onTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!userImg) return;
    const t = e.touches[0];
    const p = toCanvas(t.clientX, t.clientY);
    draggingRef.current = true;
    dragOffRef.current  = { x: p.x - state.x, y: p.y - state.y };
    setDragging(true);
    setDragOff({ x: p.x - state.x, y: p.y - state.y });
  };

  // Native touchmove with passive:false so preventDefault() actually works
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault(); // stops page scroll while dragging on canvas
      const t = e.touches[0];
      const p = toCanvas(t.clientX, t.clientY);
      setState(s => ({ ...s, x: p.x - dragOffRef.current.x, y: p.y - dragOffRef.current.y }));
    };

    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => canvas.removeEventListener("touchmove", handleTouchMove);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = () => {
    const dataUrl = canvasRef.current?.toDataURL("image/png") || "";
    onComplete(dataUrl, uploadedUrl);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">

      {/* Canvas */}
      <div className="w-full max-w-[500px] mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-amber-200"
        style={{ aspectRatio: "1/1" }}>
        <canvas
          ref={canvasRef}
          width={CW} height={CH}
          className={`block w-full h-full ${userImg ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}    onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart} onTouchEnd={onMouseUp}
        />
      </div>

      {/* File input */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

      {/* Controls */}
      {!userImg ? (
        <button onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold shadow w-full max-w-[500px] justify-center">
          <Upload size={18} />
          {uploading ? "Uploading..." : "Upload Your Image"}
        </button>
      ) : (
        <div className="w-full max-w-[500px] flex flex-col gap-3">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button onClick={() => setState(s => ({ ...s, scale: Math.min(s.scale + 0.1, 5) }))}
              className="flex items-center gap-1 bg-white border border-amber-200 hover:bg-amber-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              <ZoomIn size={15} /> Zoom +
            </button>
            <button onClick={() => setState(s => ({ ...s, scale: Math.max(s.scale - 0.1, 0.1) }))}
              className="flex items-center gap-1 bg-white border border-amber-200 hover:bg-amber-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              <ZoomOut size={15} /> Zoom −
            </button>
            <button onClick={() => setState(s => ({ ...s, rotation: s.rotation + 90 }))}
              className="flex items-center gap-1 bg-white border border-amber-200 hover:bg-amber-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              <RotateCcw size={15} /> Rotate
            </button>
            <button onClick={() => setState({ x: CW / 2, y: CH / 2, scale: 1, rotation: 0 })}
              className="bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
              Reset
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
            <Move size={11} /> Drag image freely anywhere on the product
          </p>

          <div className="flex gap-2">
            <button onClick={() => fileRef.current?.click()}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors">
              Change Image
            </button>
            <button onClick={handleConfirm} disabled={uploading}
              className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors text-sm">
              <Check size={15} />
              {uploading ? "Uploading..." : "Confirm Design"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
