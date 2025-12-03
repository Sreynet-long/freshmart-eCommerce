import { Suspense } from "react";
import SearchResults from "../components/SearchResults";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
