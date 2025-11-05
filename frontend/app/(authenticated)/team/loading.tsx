import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export default function TeamLoading() {
  return (
    <div className="p-6">
      <LoadingSkeleton variant="table" rows={8} />
    </div>
  );
}
