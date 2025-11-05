import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export default function WizardLoading() {
  return (
    <div className="p-6">
      <LoadingSkeleton variant="form" rows={6} />
    </div>
  );
}
