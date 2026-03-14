import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#22c55e', '#0ea5e9', '#f97316', '#a855f7', '#e11d48'];

export default function CourseDistributionChart({ data }) {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="chart-card" style={{ animationDelay: '0.2s' }}>
      <h3>Students per Course (Pie)</h3>
      <div className="chart-inner">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={safeData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {safeData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="course-legend">
        {safeData.map((item, index) => (
          <li key={item.name} className="course-legend-item">
            <span
              className="course-legend-color"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="course-legend-text">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

