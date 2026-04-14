# Build sample_data.csv:500 rows of simulated data center metrics.

import random
from datetime import datetime, timedelta
from pathlib import Path

import pandas as pd

if __name__ == "__main__":
    rng = random.Random(42)
    servers = [f"SRV-{i}" for i in range(101, 111)]
    start = datetime(2025, 1, 1, 8, 0, 0)
    rows = []

    for i in range(500):
        ts = start + timedelta(minutes=i)
        sid = rng.choice(servers)
        roll = rng.random()

        if roll < 0.72:
            cooling = "OK"
            uptime = "UP"
            temp = round(rng.uniform(66.0, 76.0), 1)
            cpu = rng.randint(12, 68)
            mem = rng.randint(35, 74)
            pwr = rng.randint(28, 68)
            lat = rng.randint(3, 28)
            loss = round(rng.uniform(0.0, 0.35), 2)
        elif roll < 0.92:
            cooling = "OK" if rng.random() < 0.88 else "FAIL"
            uptime = "UP"
            temp = round(rng.uniform(77.0, 86.0), 1)
            cpu = rng.randint(78, 91)
            mem = rng.randint(80, 91)
            pwr = rng.randint(76, 90)
            lat = rng.randint(38, 140)
            loss = round(rng.uniform(0.45, 1.8), 2)
        else:
            cooling = "FAIL" if rng.random() < 0.55 else "OK"
            uptime = "DOWN" if rng.random() < 0.5 else "UP"
            if cooling == "FAIL":
                temp = round(rng.uniform(88.0, 102.0), 1)
            else:
                temp = round(rng.uniform(87.0, 98.0), 1)
            cpu = rng.randint(94, 100)
            mem = rng.randint(92, 100)
            pwr = rng.randint(88, 100)
            lat = rng.randint(160, 480)
            loss = round(rng.uniform(2.1, 7.5), 2)

        rows.append(
            {
                "timestamp": ts,
                "server_id": sid,
                "temperature_f": temp,
                "cpu_usage_percent": cpu,
                "memory_usage_percent": mem,
                "power_load_percent": pwr,
                "cooling_status": cooling,
                "network_latency_ms": lat,
                "packet_loss_percent": loss,
                "uptime_status": uptime,
            }
        )

    df = pd.DataFrame(rows)
    df["timestamp"] = df["timestamp"].dt.strftime("%Y-%m-%d %H:%M:%S")
    out = Path(__file__).resolve().parent / "sample_data.csv"
    df.to_csv(out, index=False)
    print(f"Wrote {len(df)} rows to {out}")
