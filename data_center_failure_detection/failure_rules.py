# Rule-based failure detection for one row of data center metrics.


def detect_issues(row):
    """
    Take one row (dict-like: pandas Series or dict) and return a list of issues.
    Each issue is a dict with: issue_detected, severity, recommended_action.
    """
    issues = []

    temp = float(row["temperature_f"])
    power = float(row["power_load_percent"])
    cooling = str(row["cooling_status"]).strip().upper()
    latency = float(row["network_latency_ms"])
    loss = float(row["packet_loss_percent"])
    uptime = str(row["uptime_status"]).strip().upper()

    # --- Temperature & cooling ---
    if temp > 90 and cooling == "FAIL":
        issues.append(
            {
                "issue_detected": "Severe overheating with cooling failure",
                "severity": "Critical",
                "recommended_action": "Escalate immediately: reduce load, engage on-site cooling repair, consider controlled shutdown if temperature rises further.",
            }
        )
    else:
        if temp > 90:
            issues.append(
                {
                    "issue_detected": "High temperature",
                    "severity": "Critical",
                    "recommended_action": "Check airflow and cooling; reduce CPU load; verify CRAC/chiller and rack fans.",
                }
            )
        elif temp > 80:
            issues.append(
                {
                    "issue_detected": "Elevated temperature",
                    "severity": "Warning",
                    "recommended_action": "Monitor trend; verify cooling setpoints and rack ventilation.",
                }
            )
        if cooling == "FAIL":
            issues.append(
                {
                    "issue_detected": "Cooling system failure",
                    "severity": "Critical",
                    "recommended_action": "Dispatch facilities/cooling vendor; track inlet temps; shed non-critical workloads.",
                }
            )

    # --- Power & uptime ---
    if power > 95 and uptime == "DOWN":
        issues.append(
            {
                "issue_detected": "Critical power overload during outage",
                "severity": "Critical",
                "recommended_action": "Treat as incident: verify UPS/generator, shed load, restore power safely before bringing services back.",
            }
        )
    else:
        if power > 95:
            issues.append(
                {
                    "issue_detected": "Power overload",
                    "severity": "Critical",
                    "recommended_action": "Reduce non-critical servers; rebalance workloads; check PDU capacity and circuit breakers.",
                }
            )
        elif power > 85:
            issues.append(
                {
                    "issue_detected": "High power load",
                    "severity": "Warning",
                    "recommended_action": "Plan capacity; defer batch jobs; review power trending.",
                }
            )
        if uptime == "DOWN":
            issues.append(
                {
                    "issue_detected": "Host or service down",
                    "severity": "Critical",
                    "recommended_action": "Check hardware, power, and OS; failover if available; open incident ticket.",
                }
            )

    # --- Network ---
    if latency > 120 and loss > 2:
        issues.append(
            {
                "issue_detected": "Major network degradation (latency + packet loss)",
                "severity": "Critical",
                "recommended_action": "Check switches, uplinks, and errors on NICs; isolate flapping links; engage network team.",
            }
        )
    else:
        if latency > 120:
            issues.append(
                {
                    "issue_detected": "Severe network latency",
                    "severity": "Critical",
                    "recommended_action": "Trace path; check congestion, DNS, and upstream provider; review recent changes.",
                }
            )
        elif latency > 80:
            issues.append(
                {
                    "issue_detected": "Elevated network latency",
                    "severity": "Warning",
                    "recommended_action": "Monitor latency trend; review utilization and QoS; check for background sync jobs.",
                }
            )
        if loss > 2:
            issues.append(
                {
                    "issue_detected": "High packet loss",
                    "severity": "Critical",
                    "recommended_action": "Inspect cables, optics, and switch ports; check for duplex mismatches and errors.",
                }
            )

    return issues
