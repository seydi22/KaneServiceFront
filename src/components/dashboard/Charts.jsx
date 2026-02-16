import { Card, CardContent, Typography, Box } from '@mui/material'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const COLORS = ['var(--color-primary)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-error)', 'var(--color-purple)', 'var(--color-purple)', 'var(--color-info)', 'var(--color-info-light)']

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: 1.5,
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: 0.5, color: 'var(--text-primary)' }}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{
              color: entry.color,
              fontWeight: 500
            }}
          >
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString('fr-FR') : entry.value}
          </Typography>
        ))}
      </Box>
    )
  }
  return null
}

export const LineChartCard = ({ title, data, dataKey, xKey = 'name' }) => {
  if (!data || data.length === 0) {
    return (
      <Card sx={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {title}
          </Typography>
          <Box sx={{ textAlign: 'center', padding: 4, color: 'var(--text-secondary)' }}>
            Aucune donnée disponible
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.125rem', sm: '1.25rem' },
            marginBottom: 3,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em'
          }}
        >
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
            <XAxis
              dataKey={xKey}
              stroke="var(--text-secondary)"
              style={{ fontSize: '0.75rem' }}
            />
            <YAxis
              stroke="var(--text-secondary)"
              style={{ fontSize: '0.75rem' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '0.875rem' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="var(--color-primary)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-primary)', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export const BarChartCard = ({ title, data, dataKey, xKey = 'name' }) => {
  if (!data || data.length === 0) {
    return (
      <Card sx={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {title}
          </Typography>
          <Box sx={{ textAlign: 'center', padding: 4, color: 'var(--text-secondary)' }}>
            Aucune donnée disponible
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.125rem', sm: '1.25rem' },
            marginBottom: 3,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em'
          }}
        >
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
            <XAxis
              dataKey={xKey}
              stroke="var(--text-secondary)"
              style={{ fontSize: '0.75rem' }}
            />
            <YAxis
              stroke="var(--text-secondary)"
              style={{ fontSize: '0.75rem' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '0.875rem' }}
            />
            <Bar
              dataKey={dataKey}
              fill="var(--color-primary)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export const PieChartCard = ({ title, data, dataKey = 'value', nameKey = 'name' }) => {
  if (!data || data.length === 0) {
    return (
      <Card sx={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {title}
          </Typography>
          <Box sx={{ textAlign: 'center', padding: 4, color: 'var(--text-secondary)' }}>
            Aucune donnée disponible
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.125rem', sm: '1.25rem' },
            marginBottom: 3,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em'
          }}
        >
          {title}
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ [nameKey]: name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={90}
              fill="var(--color-primary)"
              dataKey={dataKey}
              stroke="var(--bg-primary)"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
