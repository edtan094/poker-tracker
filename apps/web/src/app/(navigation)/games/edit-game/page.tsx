import { Suspense } from "react";
import ParentOfListOfGames from "./ParentOfListOfGames";
import ListOfGamesSkeleton from "./ListOfGamesSkeleton";

export default async function Games() {
  return (
    <div>
      <div className=" flex justify-center">
        <div>
          <Suspense fallback={<ListOfGamesSkeleton />}>
            <ParentOfListOfGames />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
