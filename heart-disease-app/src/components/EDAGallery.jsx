import React, { useState } from "react";
import { Search, LayoutGrid, X } from "lucide-react";

export default function EDAGallery() {
  const [selected, setSelected] = useState(null);

  const figs = [
    {
      src: "figures/correlation_matrix.png",
      alt: "Feature Correlation Matrix",
      desc: "This heatmap visualizes the pairwise correlation between all clinical features. It helps identify which variables are strongly related and where potential multicollinearity issues might exist. Darker colors indicate stronger relationships.",
    },
    {
      src: "figures/death_event.png",
      alt: "Pairplot by Survival Outcome",
      desc: "The pairplot displays how key features interact with each other, grouped by survival status (Blue = Survived, Orange = Deceased). It reveals class separation patterns and feature distributions that drive the model's predictions.",
    },
    {
      src: "figures/histograms.png",
      alt: "Clinical Feature Histograms",
      desc: "These histograms display the distribution of numerical features across the patient population. They highlight skewness, outliers, and the overall range of values, guiding necessary preprocessing steps like scaling.",
    },
  ];

  return (
    <>
      {/* Gallery Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Search size={20} className="text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Exploratory Analysis</h3>
            <p className="text-xs text-slate-500">
              Click on any chart to view detailed insights
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {figs.map((f) => (
            <div
              key={f.src}
              onClick={() => setSelected(f)}
              className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
            >
              <div className="aspect-[4/3] overflow-hidden bg-white p-2">
                <img
                  src={`${import.meta.env.BASE_URL}${f.src}`}
                  alt={f.alt}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 400'%3E%3Crect fill='%23f1f5f9' width='800' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%2394a3b8'%3EImage Loading...%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm p-3 border-t border-slate-100">
                <div className="flex items-center gap-2 justify-center">
                  <LayoutGrid size={14} className="text-teal-500" />
                  <p className="text-xs font-bold text-slate-700 text-center">
                    {f.alt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal / Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Side */}
            <div className="flex-1 bg-slate-100 p-4 flex items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 relative">
              <img
                src={`${import.meta.env.BASE_URL}${selected.src}`}
                alt={selected.alt}
                className="max-h-[60vh] md:max-h-[70vh] object-contain"
              />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full backdrop-blur-md transition-colors text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Text Side */}
            <div className="w-full md:w-80 p-8 bg-white flex flex-col justify-center">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                {selected.alt}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {selected.desc}
              </p>
              <div className="mt-auto pt-6 border-t border-slate-100">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                  Analysis Generated
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  From Python Matplotlib/Seaborn
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
