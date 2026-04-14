# Data Center Failure Detection & Alert System

## Overview

This project simulates data center–style monitoring metrics, applies rule-based checks to detect operational issues (for example overheating, power stress, cooling failure, network degradation, and downtime), assigns **Warning** or **Critical** severity, exports a structured **alerts report**, and provides a lightweight **Streamlit** dashboard for exploration. It is intentionally small and readable—suitable for learning, portfolios, and interviews.

## Features

- **Synthetic monitoring data** — Generates `sample_data.csv` with timestamps, server IDs, and metrics such as temperature, CPU/memory utilization, power load, cooling status, latency, packet loss, and uptime.
- **Deterministic rule engine** — `failure_rules.py` evaluates thresholds and combined conditions (e.g., severe heat with cooling failure, power stress during outage, latency plus packet loss).
- **Alerts pipeline** — `main.py` scans each row, collects all issues, and writes `alerts_report.csv` with timestamp, server, issue, severity, and recommended action.
- **Operational dashboard** — `dashboard.py` summarizes alert counts and plots key metrics over time with **matplotlib**.

## Tools Used

| Tool | Role |
|------|------|
| **Python** | Core language |
| **pandas** | Load CSVs, tabular processing, export reports |
| **matplotlib** | Time-series charts in the dashboard |
| **Streamlit** | Simple interactive web UI |

## How to Run the Project

**Prerequisites:** Python 3.10+ recommended.

1. **Clone or copy** this folder to your machine.

2. **Create a virtual environment (optional but recommended):**
   ```bash
   python -m venv .venv
   ```
   Activate it (Windows PowerShell):
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Generate sample data and build the alerts report:**
   ```bash
   python data_generator.py
   python main.py
   ```

5. **Launch the dashboard:**
   ```bash
   python -m streamlit run dashboard.py
   ```
   Open the URL shown in the terminal (typically `http://localhost:8501`).

**Outputs:** `sample_data.csv` (inputs), `alerts_report.csv` (detected issues).

## Why This Matters for Data Center Operations

Data centers depend on **early detection** and **clear prioritization** when metrics drift from normal. Automated monitoring turns raw telemetry into **actionable signals**: which servers are affected, how serious the situation is, and what to do next. Rule-based systems (like this one) mirror common real-world patterns—threshold alerts, correlated failures, and severity routing—before teams adopt larger platforms or ML. A small project demonstrates that you understand **operational metrics**, **incident triage**, and **reporting**, not just coding in isolation.

## Resume-Ready Project Description

**Data Center Failure Detection & Alert System — Python**  
Built a Python pipeline that simulates server monitoring data, applies configurable failure rules with Warning/Critical severity and recommended actions, exports alerts to CSV, and visualizes results in a Streamlit dashboard with pandas and matplotlib. Demonstrates practical skills in **data ingestion**, **rule-based anomaly detection**, **tabular reporting**, and **operational dashboards** relevant to IT infrastructure and reliability-focused roles.
