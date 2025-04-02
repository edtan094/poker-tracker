import Leaderboard from "./Leaderboard";
import { Suspense } from "react";
import LeaderboardSuspense from "./LeaderboardSuspense";

export const dynamic = "force-dynamic";

export default async function LeaderboardsPage() {
  return (
    <div>
      <div className="flex justify-center font-bold text-3xl mb-6">
        <h2>Leaderboards</h2>
      </div>
      <Suspense
        fallback={
          <div className="flex md:justify-center">
            <div className=" md:w-[70%]">
              <LeaderboardSuspense />
            </div>
          </div>
        }
      >
        <div className="flex md:justify-center">
          <div className=" md:w-[70%]">
            <Leaderboard />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
