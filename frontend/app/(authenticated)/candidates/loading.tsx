import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export default function CandidatesLoading() {
  return (
    <div className="p-6">
      <LoadingSkeleton variant="table" rows={10} />
    </div>
  );
}
