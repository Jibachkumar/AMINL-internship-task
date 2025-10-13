import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function PieCharts({ data }) {
  const productData = data?.data.map((item) => ({
    name: item.product.name,
    value: Number(item.totalQuantity),
  }));
  console.log(productData);
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
          fill="#8884d8"
          label
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
