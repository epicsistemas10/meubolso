interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: number;
  type?: 'default' | 'success' | 'danger' | 'warning';
}

export default function StatCard({ title, value, icon, trend, type = 'default' }: StatCardProps) {
  const getTypeColor = () => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'danger':
        return 'text-danger';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="bg-bg-card rounded-lg border border-gray-800 p-6 hover:border-primary/50 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-muted mb-2">{title}</p>
          <h3 className={`text-2xl font-bold ${getTypeColor()}`}>{value}</h3>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <i className={`${trend >= 0 ? 'ri-arrow-up-line text-success' : 'ri-arrow-down-line text-danger'} text-sm w-4 h-4 flex items-center justify-center`}></i>
              <span className={`text-xs ${trend >= 0 ? 'text-success' : 'text-danger'}`}>
                {Math.abs(trend)}% vs mês anterior
              </span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg gradient-primary flex items-center justify-center`}>
          <i className={`${icon} text-white text-xl w-6 h-6 flex items-center justify-center`}></i>
        </div>
      </div>
    </div>
  );
}
