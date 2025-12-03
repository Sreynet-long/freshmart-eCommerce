import { Suspense } from "react";
import ClientWrapper from "./ClientWrapper";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading search ...</div>}>
      <ClientWrapper />
    </Suspense>
  );
}
