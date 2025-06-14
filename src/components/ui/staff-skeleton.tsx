
import { Skeleton } from "@/components/ui/skeleton";

const StaffCardSkeleton = () => {
  return (
    <div className="group bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden w-full p-8">
      <div className="text-center">
        <div className="relative mb-6">
          {/* Circular image skeleton with gradient border */}
          <div className="relative mx-auto w-32 h-32 mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-blue-200 to-purple-200 rounded-full p-1 animate-pulse">
              <Skeleton className="w-full h-full rounded-full" />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6 mx-auto" />
            <Skeleton className="h-3 w-4/5 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StaffSkeleton = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-gray-50 relative overflow-hidden w-full min-h-screen">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full">
        {/* Header skeleton */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-indigo-200 to-blue-200 mb-8 animate-pulse">
            <Skeleton className="w-10 h-10" />
          </div>
          <Skeleton className="h-12 w-64 mx-auto mb-6" />
          <Skeleton className="h-4 w-96 mx-auto mb-2" />
          <Skeleton className="h-4 w-80 mx-auto" />
          <Skeleton className="w-32 h-1 mx-auto rounded-full mt-6" />
        </div>

        {/* Staff cards skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-16">
          {[...Array(6)].map((_, index) => (
            <StaffCardSkeleton key={index} />
          ))}
        </div>

        {/* Button skeleton */}
        <div className="text-center">
          <Skeleton className="h-12 w-40 mx-auto rounded-2xl" />
        </div>
      </div>
    </section>
  );
};

export { StaffSkeleton, StaffCardSkeleton };
