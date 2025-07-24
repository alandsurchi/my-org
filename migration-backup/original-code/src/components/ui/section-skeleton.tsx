
import { Skeleton } from "@/components/ui/skeleton";

interface SectionSkeletonProps {
  title?: string;
  cardCount?: number;
  showFilters?: boolean;
}

const SectionSkeleton = ({ 
  title = "Loading...", 
  cardCount = 6, 
  showFilters = false 
}: SectionSkeletonProps) => {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header skeleton */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-r from-gray-200 to-gray-300 mb-8 animate-pulse">
            <Skeleton className="w-10 h-10" />
          </div>
          <Skeleton className="h-12 w-64 mx-auto mb-6" />
          <Skeleton className="h-4 w-96 mx-auto mb-2" />
          <Skeleton className="h-4 w-80 mx-auto" />
          <Skeleton className="w-32 h-1 mx-auto rounded-full mt-6" />
        </div>

        {/* Filters skeleton */}
        {showFilters && (
          <div className="flex flex-col lg:flex-row gap-6 mb-16">
            <Skeleton className="h-14 flex-1 rounded-2xl" />
            <Skeleton className="h-14 w-full lg:w-64 rounded-2xl" />
          </div>
        )}

        {/* Cards skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[...Array(cardCount)].map((_, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden p-6">
              <Skeleton className="h-48 w-full rounded-2xl mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/5" />
              </div>
              <div className="flex justify-between items-center mt-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
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

export default SectionSkeleton;
