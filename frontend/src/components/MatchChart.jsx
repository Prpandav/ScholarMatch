/**
 * components/MatchChart.jsx
 * --------------------------
 * Horizontal bar chart comparing top 3 scholarships by match score + amount.
 * Uses chart.js via react-chartjs-2.
 */
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useDarkMode } from "../context/DarkModeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function MatchChart({ scholarships }) {
  const { dark } = useDarkMode();
  const textColor = dark ? "#e2e8f0" : "#475569";
  const gridColor = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";

  const labels = scholarships.map((s) =>
    s.name.length > 28 ? s.name.slice(0, 28) + "…" : s.name,
  );

  const data = {
    labels,
    datasets: [
      {
        label: "AI Match Score (%)",
        data: scholarships.map((s) => Math.round(s.match_score * 100)),
        backgroundColor: [
          "rgba(99,102,241,0.8)",
          "rgba(139,92,246,0.8)",
          "rgba(168,85,247,0.8)",
        ],
        borderRadius: 8,
        yAxisID: "y",
      },
      {
        label: "Amount (₹ thousands)",
        data: scholarships.map((s) => Math.round(s.amount / 1000)),
        backgroundColor: [
          "rgba(16,185,129,0.7)",
          "rgba(5,150,105,0.7)",
          "rgba(4,120,87,0.7)",
        ],
        borderRadius: 8,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: textColor, font: { size: 11 } } },
      title: { display: false },
    },
    scales: {
      x: { display: false },
      y: {
        ticks: { color: textColor, font: { size: 10 } },
        grid: { color: gridColor },
      },
      y1: { display: false, type: "linear", position: "right" },
    },
  };

  return (
    <div className="glass-card p-6 mb-6">
      <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        📊 Scholarship Comparison
      </h3>
      <div style={{ height: 160 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
