# Streamlit dashboard: monitoring data and alerts.

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import streamlit as st

BASE = Path(__file__).resolve().parent

st.set_page_config(page_title="DC Monitoring", layout="wide")
st.title("Data center monitoring")

sample_path = BASE / "sample_data.csv"
alerts_path = BASE / "alerts_report.csv"

df = pd.read_csv(sample_path)
alerts_df = pd.read_csv(alerts_path)

df["timestamp"] = pd.to_datetime(df["timestamp"])
df = df.sort_values("timestamp")

total_alerts = len(alerts_df)
critical_alerts = int((alerts_df["severity"] == "Critical").sum())

c1, c2 = st.columns(2)
c1.metric("Total alerts", total_alerts)
c2.metric("Critical alerts", critical_alerts)

st.subheader("Alerts")
st.dataframe(alerts_df, use_container_width=True, hide_index=True)

st.subheader("Metrics over time")
fig, axes = plt.subplots(3, 1, figsize=(10, 7), sharex=True)
axes[0].plot(df["timestamp"], df["temperature_f"], color="tab:red", linewidth=1)
axes[0].set_ylabel("Temp (F)")
axes[0].grid(True, alpha=0.3)

axes[1].plot(df["timestamp"], df["power_load_percent"], color="tab:blue", linewidth=1)
axes[1].set_ylabel("Power load (%)")
axes[1].grid(True, alpha=0.3)

axes[2].plot(df["timestamp"], df["network_latency_ms"], color="tab:green", linewidth=1)
axes[2].set_ylabel("Latency (ms)")
axes[2].set_xlabel("Time")
axes[2].grid(True, alpha=0.3)

fig.autofmt_xdate()
fig.tight_layout()
st.pyplot(fig)
plt.close(fig)
