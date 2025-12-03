"use client";
import { Suspense } from "react";
import SearchResults from "../components/SearchResults";

export const dynamic = "force-dynamic";
export default function Page() {
  return (
  <Suspense fallback={<div>loading...</div>}>
    <SearchResults />
  </Suspense>
);
}
