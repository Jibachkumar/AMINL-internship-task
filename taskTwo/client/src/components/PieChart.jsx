import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from "recharts";

export default function PieCharts({ data }) {
  const productData = data?.data.map((item) => ({
    name: item.product.name,
    value: Number(item.totalQuantity),
  }));

  // 🎨 Generate random colors for each product
  const COLORS = productData?.map((_, i) => `hsl(${(i * 40) % 360}, 70%, 60%)`);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={productData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {productData?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
