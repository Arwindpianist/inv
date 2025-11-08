export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card text-card-foreground rounded-2xl shadow-[0_0_20px_rgba(92,141,247,0.15)] p-6 border border-border/20">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Total Items</h2>
          <p className="text-3xl font-semibold">-</p>
        </div>
        <div className="bg-card text-card-foreground rounded-2xl shadow-[0_0_20px_rgba(92,141,247,0.15)] p-6 border border-border/20">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Low Stock</h2>
          <p className="text-3xl font-semibold">-</p>
        </div>
        <div className="bg-card text-card-foreground rounded-2xl shadow-[0_0_20px_rgba(92,141,247,0.15)] p-6 border border-border/20">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Recent Scans</h2>
          <p className="text-3xl font-semibold">-</p>
        </div>
      </div>
    </div>
  );
}

