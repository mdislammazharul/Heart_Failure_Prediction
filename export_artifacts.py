# export_artifacts.py
import pandas as pd
import json
from pathlib import Path

p = Path(__file__).parent

# read dataset
df = pd.read_csv(p / "heart_failure_clinical_records_dataset.csv")

# export head(10)
head10 = df.head(10).to_dict(orient="records")

# example metrics (adjust to match your real output)
metrics = {
    "models": {
        "random_forest": {
            "accuracy": 0.867,
            "roc_auc": 0.909,
            "f1": 0.778,
            "best_params": {"max_depth": 5, "min_samples_split": 10, "n_estimators": 100}
        },
        "logistic_regression": {
            "accuracy": 0.85,
            "roc_auc": 0.908,
            "f1": 0.743,
            "best_params": {"C": 0.1, "solver": "liblinear"}
        }
    },
    "selected_model": "random_forest"
}

out_dir = p / "heart-disease-app" / "public" / "data"
out_dir.mkdir(parents=True, exist_ok=True)

with open(out_dir / "head10.json", "w") as f:
    json.dump(head10, f, indent=2)

with open(out_dir / "model_metrics.json", "w") as f:
    json.dump(metrics, f, indent=2)

print("Exported head10.json and model_metrics.json to heart-disease-app/public/data/")
