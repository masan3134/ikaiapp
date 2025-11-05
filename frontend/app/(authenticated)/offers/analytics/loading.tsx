import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export default function AnalyticsLoading() {
  return (
    <div className="p-6">
      <LoadingSkeleton variant="grid" rows={2} columns={2} />
    </div>
  );
}
