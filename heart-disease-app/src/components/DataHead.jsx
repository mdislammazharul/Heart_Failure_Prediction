import React, { useEffect, useState } from "react";
import { Database, FileSpreadsheet } from "lucide-react";

export default function DataHead() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/head10.json`)
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then(setRows)
      .catch((err) => {
        console.error("Load failed:", err);
        setRows([]);
      });
  }, []);

  if (!rows)
    return <div className="p-4 text-slate-500 text-sm">Loading dataset...</div>;
  if (rows.length === 0)
    return <div className="p-4 text-slate-500 text-sm">No data available.</div>;

  const headers = Object.keys(rows[0]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Database size={20} className="text-blue-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Dataset Preview</h3>
          <p className="text-xs text-slate-500">
            Raw data sample (First 10 records)
          </p>
        </div>
      </div>

      {/* Horizontal scroll wrapper */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              {headers.map((h) => (
                // whitespace-normal allows wrapping, min-w ensures it doesn't squash too much
                <th
                  key={h}
                  className="px-4 py-3 border-b border-slate-200 whitespace-normal min-w-[100px] align-bottom leading-tight"
                >
                  {h.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                {headers.map((h) => (
                  // whitespace-nowrap keeps the data values on one line
                  <td
                    key={h}
                    className="px-4 py-3 text-slate-600 font-mono text-xs whitespace-nowrap"
                  >
                    {r[h]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
        <span className="text-xs font-medium text-slate-400 flex items-center justify-center gap-2">
          <FileSpreadsheet size={14} /> Scroll horizontally to view all columns
        </span>
      </div>
    </div>
  );
}
