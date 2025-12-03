"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SearchContent() {
  const params = useSearchParams();
  const query = params.get("query") || "";

  return <div>Searching for: {query}</div>;
}

export default function SearchClient() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
