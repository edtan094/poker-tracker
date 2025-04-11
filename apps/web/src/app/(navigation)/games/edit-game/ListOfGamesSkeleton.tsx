import Skeleton from "@/components/admin-panel/skeleton/GenericSkeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ListOfGamesSkeleton() {
  const skeletonCards = Array.from({ length: 5 });

  return (
    <>
      {skeletonCards.map((_, index) => {
        return (
          <Card className="mb-4 md:w-[383px] w-[250px]" key={index}>
            <CardHeader>
              <CardTitle className="text-lg md:text-3xl">
                <Skeleton className="h-6 md:h-8 w-1/2" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-1/3 mt-2" />
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Skeleton className="h-10 w-full rounded-md" />
            </CardFooter>
          </Card>
        );
      })}
    </>
  );
}
