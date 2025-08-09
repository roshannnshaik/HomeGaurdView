interface StatsOverviewProps {
  stats?: {
    visitors: number;
    detections: number;
    alerts: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <section className="bg-white border-t border-gray-200">
      <div className="px-4 py-4">
        <h3 className="text-lg font-semibold text-dark-gray mb-4">Today's Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-light-gray p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-primary-blue">
              {stats?.visitors || 0}
            </div>
            <div className="text-sm text-gray-600">Visitors</div>
          </div>
          <div className="bg-light-gray p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-soft-teal">
              {stats?.detections || 0}
            </div>
            <div className="text-sm text-gray-600">Detections</div>
          </div>
          <div className="bg-light-gray p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-accent-coral">
              {stats?.alerts || 0}
            </div>
            <div className="text-sm text-gray-600">Alerts</div>
          </div>
        </div>
      </div>
    </section>
  );
}
