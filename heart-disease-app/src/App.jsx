import React, { useState } from "react";
import {
  Heart,
  Activity,
  Wind,
  Droplet,
  Timer,
  User,
  Cigarette,
  Thermometer,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Server,
  Loader2,
  ChevronDown,
} from "lucide-react";

// --- Configuration ---
const INITIAL_FORM_STATE = {
  age: 65,
  anaemia: 0,
  creatinine_phosphokinase: 250,
  diabetes: 0,
  ejection_fraction: 35,
  high_blood_pressure: 1,
  platelets: 250000,
  serum_creatinine: 1.9,
  serum_sodium: 130,
  sex: 1,
  smoking: 0,
  time: 120,
};

const API_URL = "https://heart-failure-prediction-qe7o.onrender.com";

// --- Components ---

const FormField = ({
  label,
  name,
  value,
  type = "number",
  options,
  onChange,
  icon: Icon,
  unit,
}) => {
  // Internal state for the custom dropdown visibility
  const [isOpen, setIsOpen] = React.useState(false);

  // Helper to handle selecting an option
  const handleSelect = (selectedValue) => {
    // Mimic a standard event object so the parent's handleChange works
    onChange({ target: { name, value: selectedValue } });
    setIsOpen(false);
  };

  // Find the label for the current value (for the button text)
  const selectedLabel =
    type === "select" ? options.find((opt) => opt.value == value)?.label : "";

  return (
    <div className="space-y-1.5 group relative">
      <label className="text-sm font-medium text-slate-600 flex items-center gap-2">
        {Icon && <Icon size={16} className="text-teal-500" />}
        {label}
      </label>

      <div className="relative">
        {type === "select" ? (
          <>
            {/* The Trigger Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`w-full pl-4 pr-10 py-2.5 text-left bg-slate-50 border rounded-lg text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all hover:bg-white ${
                isOpen
                  ? "border-teal-500 ring-2 ring-teal-500/20 bg-white"
                  : "border-slate-200"
              }`}
            >
              {selectedLabel}
              <ChevronDown
                size={16}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* The Dropdown Options Panel */}
            {isOpen && (
              <>
                {/* Invisible Backdrop to close when clicking outside */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
                />

                {/* The Options List */}
                <div className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                  {options.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`px-4 py-2.5 cursor-pointer text-sm transition-colors border-b border-slate-50 last:border-0 ${
                        value === opt.value
                          ? "bg-teal-50 text-teal-700 font-medium"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          // Standard Input for Numbers
          <div className="relative">
            <input
              type="number"
              name={name}
              value={value}
              onChange={onChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all hover:bg-white"
              placeholder="0"
            />
            {unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium pointer-events-none select-none">
                {unit}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const wakeBackend = async () => {
    setStatus("waking");
    setError(null);
    try {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 2500));
      setStatus("ready");
    } catch (err) {
      setError("Could not connect to the server. Please try again.");
      setStatus("idle");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("predicting");
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      setResult({
        prediction: data.prediction, // 0 or 1
        probability_death: data.probability_death, // 0–1
      });
    } catch (err) {
      setError("An error occurred during prediction.");
    } finally {
      setStatus("ready");
    }
  };

  if (status === "idle" || status === "waking") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              {status === "waking" && (
                <div className="absolute inset-0 bg-teal-100 rounded-full animate-ping opacity-75"></div>
              )}
              <div className="relative bg-teal-500 p-4 rounded-full shadow-lg shadow-teal-200 z-10">
                <Heart className="w-8 h-8 text-white" fill="currentColor" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-800">
                Heart Health AI
              </h1>
              <p className="text-slate-500">
                Advanced risk prediction using clinical markers.
              </p>
            </div>
            <button
              onClick={wakeBackend}
              disabled={status === "waking"}
              className="w-full py-3.5 px-6 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold rounded-xl shadow-lg shadow-teal-200 transition-all flex items-center justify-center gap-2 group"
            >
              {status === "waking" ? (
                <>
                  {" "}
                  <Loader2 className="animate-spin" /> Connecting...{" "}
                </>
              ) : (
                <>
                  {" "}
                  <Server size={18} /> Load Prediction Model{" "}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-teal-500 p-3 rounded-xl shadow-md shadow-teal-100">
              <Heart className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">
                Clinical Prediction Form
              </h1>
              <p className="text-sm text-slate-500">
                Enter patient vitals below
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 font-medium">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            Model Online
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User size={14} /> Patient Demographics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    label="Age"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    unit="yrs"
                  />
                  <FormField
                    label="Sex"
                    name="sex"
                    value={form.sex}
                    onChange={handleChange}
                    type="select"
                    options={[
                      { value: 1, label: "Male" },
                      { value: 0, label: "Female" },
                    ]}
                  />
                  <FormField
                    label="Smoking"
                    name="smoking"
                    value={form.smoking}
                    onChange={handleChange}
                    type="select"
                    icon={Cigarette}
                    options={[
                      { value: 0, label: "Non-Smoker" },
                      { value: 1, label: "Smoker" },
                    ]}
                  />
                  <FormField
                    label="Diabetes"
                    name="diabetes"
                    value={form.diabetes}
                    onChange={handleChange}
                    type="select"
                    icon={Droplet}
                    options={[
                      { value: 0, label: "No" },
                      { value: 1, label: "Yes" },
                    ]}
                  />
                </div>
              </section>

              <div className="h-px bg-slate-100 w-full" />

              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Thermometer size={14} /> Clinical Markers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  <FormField
                    label="Anaemia"
                    name="anaemia"
                    value={form.anaemia}
                    onChange={handleChange}
                    type="select"
                    icon={Wind}
                    options={[
                      { value: 0, label: "None" },
                      { value: 1, label: "Present" },
                    ]}
                  />
                  <FormField
                    label="BP Level"
                    name="high_blood_pressure"
                    value={form.high_blood_pressure}
                    onChange={handleChange}
                    type="select"
                    icon={Activity}
                    options={[
                      { value: 0, label: "Normal" },
                      { value: 1, label: "High" },
                    ]}
                  />
                  <FormField
                    label="CPK Level"
                    name="creatinine_phosphokinase"
                    value={form.creatinine_phosphokinase}
                    onChange={handleChange}
                    unit="mcg/L"
                  />
                  <FormField
                    label="Ejection Fraction"
                    name="ejection_fraction"
                    value={form.ejection_fraction}
                    onChange={handleChange}
                    icon={Heart}
                    unit="%"
                  />
                  <FormField
                    label="Serum Creatinine"
                    name="serum_creatinine"
                    value={form.serum_creatinine}
                    onChange={handleChange}
                    unit="mg/dL"
                  />
                  <FormField
                    label="Serum Sodium"
                    name="serum_sodium"
                    value={form.serum_sodium}
                    onChange={handleChange}
                    unit="mEq/L"
                  />
                  <div className="md:col-span-2 xl:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      label="Platelets"
                      name="platelets"
                      value={form.platelets}
                      onChange={handleChange}
                      unit="k/mL"
                    />
                    <FormField
                      label="Follow-up"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      icon={Timer}
                      unit="days"
                    />
                  </div>
                </div>
              </section>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={status === "predicting"}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-[0.99] flex items-center justify-center gap-3"
                >
                  {status === "predicting" ? (
                    <>
                      <Loader2 className="animate-spin text-teal-400" /> Running
                      Analysis...
                    </>
                  ) : (
                    <>
                      <Stethoscope size={20} className="text-teal-400" />{" "}
                      Analyze Risk Factors
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Activity size={18} /> About Model
              </h4>
              <p className="text-sm text-blue-800/80 leading-relaxed">
                Uses Random Forest classifier on 299 clinical records.
              </p>
            </div>

            {result && (
              <div
                className={`rounded-2xl p-6 border-2 shadow-sm animate-in slide-in-from-bottom-4 fade-in duration-500 ${
                  result.prediction === 1
                    ? "bg-red-50 border-red-100"
                    : "bg-emerald-50 border-emerald-100"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">
                    Analysis Result
                  </h3>
                  {result.prediction === 1 ? (
                    <AlertCircle className="text-red-500" size={24} />
                  ) : (
                    <CheckCircle2 className="text-emerald-500" size={24} />
                  )}
                </div>
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      Risk Classification
                    </p>
                    <p
                      className={`text-3xl font-bold mt-1 ${
                        result.prediction === 1
                          ? "text-red-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {result.prediction === 1 ? "High Risk" : "Low Risk"}
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                      <span>Survival</span>
                      <span>Mortality</span>
                    </div>
                    <div className="h-4 bg-white rounded-full overflow-hidden border border-slate-200 flex">
                      <div
                        className="h-full bg-emerald-400"
                        style={{
                          width: `${(1 - result.probability_death) * 100}%`,
                        }}
                      />
                      <div
                        className="h-full bg-red-400"
                        style={{ width: `${result.probability_death * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
