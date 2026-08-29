import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="text-6xl font-bold text-amber-300">404</div>
      <h1 className="text-2xl font-bold text-[#3b1c0c]">Page Not Found</h1>
      <p className="text-gray-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
