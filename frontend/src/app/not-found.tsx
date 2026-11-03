import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="font-serif text-5xl">That page is not on the chart.</h1>
      <Link href="/" className="mt-6 inline-block text-clinic">
        Back home
      </Link>
    </div>
  );
}
