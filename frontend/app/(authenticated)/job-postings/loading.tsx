import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export default function JobPostingsLoading() {
  return (
    <div className="p-6">
      <LoadingSkeleton variant="grid" rows={3} columns={2} />
    </div>
  );
}
