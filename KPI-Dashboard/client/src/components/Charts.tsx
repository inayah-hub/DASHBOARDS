import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Project } from '@shared/schema';

interface ChartProps {
  projects: Project[];
}

const COLORS = ['#262626', '#525252', '#a3a3a3', '#d4d4d4', '#e5e5e5'];

export function MediaDistributionChart({ projects }: ChartProps) {
  // Aggregate data by media type
  const data = projects.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.media);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: curr.media, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]).sort((a, b) => b.value - a.value);

  if (projects.length === 0) return <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">No data available</div>;

  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e5e5', 
              borderRadius: '8px', 
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            itemStyle={{ color: '#171717' }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="flex flex-wrap gap-4 justify-center mt-2">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span>{entry.name} ({entry.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectStatusChart({ projects }: ChartProps) {
    const data = projects.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: curr.status, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  if (projects.length === 0) return <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">No data available</div>;

  return (
    <div className="w-full h-[250px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f5f5f5" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#737373', fontSize: 12 }}
            width={80}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e5e5', 
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="value" fill="#404040" radius={[0, 4, 4, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
