import Leaderboard from "./Leaderboard";
import { Suspense } from "react";
import LeaderboardSuspense from "./LeaderboardSuspense";

export const dynamic = "force-dynamic";

export default async function LeaderboardsPage() {
  return (
    <div>
      <Suspense
        fallback={
          <>
            <LeaderboardSuspense />
          </>
        }
      >
        <Leaderboard />
      </Suspense>
    </div>
  );
}
