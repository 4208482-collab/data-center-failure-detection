# Load monitoring data, run failure detection, export alerts report.

import sys
from pathlib import Path

import pandas as pd

_root = Path(__file__).resolve().parent
if str(_root) not in sys.path:
    sys.path.insert(0, str(_root))

from failure_rules import detect_issues

COLUMNS = [
    "timestamp",
    "server_id",
    "issue_detected",
    "severity",
    "recommended_action",
]


if __name__ == "__main__":
    data_path = _root / "sample_data.csv"
    out_path = _root / "alerts_report.csv"

    df = pd.read_csv(data_path)
    alerts = []

    for _, row in df.iterrows():
        for issue in detect_issues(row):
            alerts.append(
                {
                    "timestamp": row["timestamp"],
                    "server_id": row["server_id"],
                    "issue_detected": issue["issue_detected"],
                    "severity": issue["severity"],
                    "recommended_action": issue["recommended_action"],
                }
            )

    alerts_df = pd.DataFrame(alerts, columns=COLUMNS)
    alerts_df.to_csv(out_path, index=False)

    total = len(alerts_df)
    critical_count = (alerts_df["severity"] == "Critical").sum()

    print(f"Total alerts: {total}")
    print(f"Critical alerts: {critical_count}")
    print()
    print("First 10 alerts:")
    print(alerts_df.head(10).to_string(index=False))
    print()
    print(f"Report saved to: {out_path}")
