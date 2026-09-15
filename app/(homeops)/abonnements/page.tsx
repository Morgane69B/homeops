import { Suspense } from "react";
import { AbonnementsView } from "./abonnements-view";

export default function AbonnementsPage() {
  return (
    <Suspense>
      <AbonnementsView />
    </Suspense>
  );
}
