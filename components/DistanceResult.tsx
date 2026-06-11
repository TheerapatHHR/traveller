interface DistanceResultProps {
  distance: string;
}

export function DistanceResult({ distance }: DistanceResultProps) {
  return (
    <div className="rounded-lg border border-border bg-card px-6 py-5">
      <p className="text-sm text-muted-foreground">Distance</p>
      <p className="mt-1 text-3xl font-bold">
        {distance}{' '}
        <span className="text-lg font-normal text-muted-foreground">km</span>
      </p>
    </div>
  );
}
