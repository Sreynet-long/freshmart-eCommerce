import { Suspense } from "react";
import SearchResults from "./SearchResults";

export default function page(){
  <Suspense fallback={<div>Loading search ...</div>}>
    <SearchResults/>
  </Suspense>
}