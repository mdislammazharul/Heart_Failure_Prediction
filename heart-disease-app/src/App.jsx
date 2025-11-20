import React, { useState } from "react";
import DataHead from "./components/DataHead";
import ModelSummary from "./components/ModelSummary";
import EDAGallery from "./components/EDAGallery";
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
  Terminal,
  Cpu,
  Container,
  Code2,
  Github,
  Globe,
  PlayCircle,
  BarChart2, // Kept strictly to prevent crash
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

// --- Sub Components ---

const CodeBlock = ({ title, code }) => (
  <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-900 text-slate-300 my-4 shadow-md font-mono text-sm">
    <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
      <span className="text-xs font-mono text-teal-400 flex items-center gap-2">
        <Terminal size={12} /> {title}
      </span>
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
      </div>
    </div>
    <div className="p-4 overflow-x-auto">
      <pre className="leading-relaxed whitespace-pre-wrap">{code}</pre>
    </div>
  </div>
);

const TechBadge = ({ icon: Icon, label, desc }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
    <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
      <Icon size={20} />
    </div>
    <div>
      <h4 className="font-bold text-slate-800 text-sm">{label}</h4>
      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
    </div>
  </div>
);

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
  const [isOpen, setIsOpen] = React.useState(false);
  const handleSelect = (selectedValue) => {
    onChange({ target: { name, value: selectedValue } });
    setIsOpen(false);
  };
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
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`w-full pl-4 pr-10 py-2.5 text-left bg-slate-50 border rounded-lg text-slate-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all hover:bg-white ${
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
            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsOpen(false)}
                />
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
          <div className="relative">
            <input
              type="number"
              name={name}
              value={value}
              onChange={onChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all hover:bg-white"
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

// --- Main Application ---

export default function App() {
  const [view, setView] = useState("landing");
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const wakeBackend = async () => {
    setStatus("waking");
    setError(null);
    try {
      const res = await fetch(`${API_URL}/`);
      const data = await res.json();
      if (data.hello === "world") {
        setStatus("ready");
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err) {
      console.error(err);
      setError(
        "Server took too long to respond or is offline. Please try again."
      );
      setStatus("idle");
    }
  };

  const enterApp = () => {
    setView("app");
    window.scrollTo(0, 0);
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
        prediction: data.prediction,
        probability_death: data.probability_death,
      });
    } catch (err) {
      console.error(err);
      setError("An error occurred during prediction.");
    } finally {
      setStatus("ready");
    }
  };

  // --- View: Landing Page ---
  if (view === "landing") {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        {/* Hero Section */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wider border border-teal-100">
                  <Activity size={14} />
                  End-to-End Machine Learning
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                  Heart Failure <br />
                  <span className="text-teal-600">Prediction System</span>
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                  A full-stack ML application predicting patient survival with{" "}
                  <strong>86.7% accuracy</strong> using Random Forest. Deployed
                  with FastAPI, Docker, and Render.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  {status === "ready" ? (
                    <button
                      onClick={enterApp}
                      className="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-200 hover:bg-teal-700 hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                      <PlayCircle size={20} />
                      Open Prediction Tool
                    </button>
                  ) : (
                    <button
                      onClick={wakeBackend}
                      disabled={status === "waking"}
                      className="px-8 py-4 bg-slate-900 text-white rounded-xl font-bold shadow-xl shadow-slate-300 hover:bg-slate-800 hover:scale-105 transition-all disabled:opacity-80 disabled:cursor-wait flex items-center justify-center gap-2"
                    >
                      {status === "waking" ? (
                        <>
                          <Loader2 className="animate-spin" /> Connecting to
                          Render...
                        </>
                      ) : (
                        <>
                          <Server size={20} /> Load Prediction Model
                        </>
                      )}
                    </button>
                  )}
                </div>

                {status === "waking" && (
                  <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100 max-w-md">
                    <strong>Note:</strong> Free tier servers sleep after 15m of
                    inactivity. This may take up to 60 seconds to wake up.
                  </div>
                )}
                {error && (
                  <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex-1 w-full lg:max-w-md">
                <ModelSummary />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto px-6 py-16 space-y-24">
          {/* Tech Stack Section */}
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
              <Code2 className="text-teal-500" /> Technical Architecture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <TechBadge
                icon={Terminal}
                label="FastAPI Backend"
                desc="Python asynchronous API for high-performance inference."
              />
              <TechBadge
                icon={Container}
                label="Dockerized"
                desc="Containerized application for consistent deployment."
              />
              <TechBadge
                icon={Globe}
                label="Render Cloud"
                desc="Auto-deployed CI/CD pipeline from GitHub."
              />
              <TechBadge
                icon={Cpu}
                label="Scikit-Learn"
                desc="Random Forest Classifier trained on 299 clinical records."
              />
            </div>
          </section>

          {/* --- ROW 1: DATASET --- */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="text-teal-500" /> Clinical Dataset
            </h2>
            {/* Full width container for table */}
            <div className="w-full">
              <DataHead />
            </div>
          </section>

          {/* --- ROW 2: FEATURE ANALYSIS --- */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart2 className="text-teal-500" /> Feature Analysis
            </h2>
            <EDAGallery />
          </section>

          {/* Reproduction / DevOps Section */}
          <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-slate-300 overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Github size={200} />
            </div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Terminal className="text-teal-400" /> How to Reproduce
                </h2>
                {/* Updated GitHub Link */}
                <a
                  href="https://github.com/mdislammazharul/Heart_Failure_Prediction"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-teal-400 hover:text-teal-300 hover:underline flex items-center gap-2"
                >
                  <Github size={16} />
                  View Source on GitHub →
                </a>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Container size={16} /> Using Docker
                  </h3>
                  <p className="text-sm text-slate-400 mb-3">
                    Pull the image and run the container exposing port 8000.
                  </p>
                  <CodeBlock
                    title="BASH"
                    code={`docker build -t heart-failure-api .\ndocker run -p 8000:8000 heart-failure-api`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Code2 size={16} /> Local Development
                  </h3>
                  <p className="text-sm text-slate-400 mb-3">
                    Clone the repo and install dependencies via pip.
                  </p>
                  <CodeBlock
                    title="BASH"
                    code={`git clone https://github.com/mdislammazharul/Heart_Failure_Prediction\ncd Heart_Failure_Prediction\npip install -r requirements.txt\nuvicorn main:app --reload`}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="bg-white border-t border-slate-200 py-12 mt-12">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-slate-500 text-sm">
              © 2025 Heart Failure Prediction Project. Built by{" "}
              <span className="font-bold text-slate-800">
                Md. Islam Mazharul
              </span>
              .
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Deployed on Render • Frontend on GitHub Pages
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // --- View: Prediction App ---
  return (
    <div className="min-h-screen p-4 md:p-8 font-sans bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView("landing")}
              className="bg-teal-500 p-3 rounded-xl shadow-md shadow-teal-100 hover:bg-teal-600 transition-colors group"
            >
              <ChevronDown className="w-6 h-6 text-white rotate-90 group-hover:-translate-x-1 transition-transform" />
            </button>
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
            System Online
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

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Activity size={18} /> About Model
              </h4>
              <p className="text-sm text-blue-800/80 leading-relaxed">
                Uses Random Forest classifier trained on 299 clinical records.
                <br />
                <br />
                <strong>Metrics:</strong> Accuracy 86.7% | ROC-AUC 0.909
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
