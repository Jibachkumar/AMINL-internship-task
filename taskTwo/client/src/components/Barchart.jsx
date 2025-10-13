import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

export default function Example({ orderData }) {
  return (
    <div className=" w-7xl gap-x-5 flex h-80 mx-auto">
      {/* line chart */}
      <div className="bg-white/80 shadow-md rounded-md p-4 w-2xl">
        <h2 className="font-bold font-serif">Daily Product Sales</h2>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={orderData?.data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalSales"
              stroke="black"
              strokearray="5 5"
              name="Number of Daily Products Sales"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* bar chart */}
      <div className="bg-white/80 shadow-md rounded-md p-4 w-2xl">
        <h2 className="font-bold font-serif">Daily Revenue</h2>

        <BarChart width={600} height={290} data={orderData?.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalRevenue" fill="black" />
        </BarChart>
      </div>
    </div>
  );
}
