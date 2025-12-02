import { Suspense } from "react";
import SearchResults from "./SearchResults";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading search ...</div>}>
      <SearchResults />
    </Suspense>
  );
}
