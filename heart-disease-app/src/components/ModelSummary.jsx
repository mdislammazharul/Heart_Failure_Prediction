import React, { useEffect, useState } from "react";
import {
  Target,
  BarChart2,
  CheckCircle,
  BrainCircuit,
  GitCommit,
} from "lucide-react";

const MetricCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white hover:shadow-md transition-all group">
    <div
      className={`p-2 rounded-full ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}
    >
      <Icon size={20} className={color.replace("bg-", "text-")} />
    </div>
    <div className="text-2xl font-bold text-slate-800">{value}</div>
    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
      {label}
    </div>
  </div>
);

export default function ModelSummary() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/model_metrics.json`)
      .then((r) => r.json())
      .then(setMetrics)
      .catch(() => setMetrics(null));
  }, []);

  if (!metrics) return null;

  const selected = metrics.selected_model;
  const m = metrics.models[selected];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <BrainCircuit size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Model Performance</h3>
            <p className="text-xs text-slate-500">
              Architecture: {selected.replace("_", " ").toUpperCase()}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">
          Best Model Selected
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard
          label="Accuracy"
          value={(m.accuracy * 100).toFixed(1) + "%"}
          icon={Target}
          color="bg-blue-500"
        />
        <MetricCard
          label="ROC-AUC"
          value={m.roc_auc}
          icon={BarChart2}
          color="bg-indigo-500"
        />
        <MetricCard
          label="F1 Score"
          value={m.f1}
          icon={CheckCircle}
          color="bg-teal-500"
        />
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <GitCommit size={16} className="text-slate-400" />
          <p className="text-xs font-bold text-slate-400 uppercase">
            Optimal Hyperparameters
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(m.best_params).map(([k, v]) => (
            <div
              key={k}
              className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-mono border border-slate-200"
            >
              <span className="text-slate-400 mr-1">
                {k.replace("model__", "")}:
              </span>
              <span className="font-semibold text-slate-700">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
