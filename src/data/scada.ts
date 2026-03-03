import { ScadaDataPoint } from "@/lib/types";
import { subDays, subHours, subMinutes, format } from "date-fns";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function assignQuality(rand: () => number): "good" | "suspect" | "bad" {
  const r = rand();
  if (r < 0.005) return "bad";
  if (r < 0.02) return "suspect";
  return "good";
}

function generateTimestamps(days: number): Date[] {
  const now = new Date();
  const timestamps: Date[] = [];

  if (days <= 30) {
    // 15-minute intervals
    const totalIntervals = days * 24 * 4;
    for (let i = totalIntervals; i >= 0; i--) {
      timestamps.push(subMinutes(now, i * 15));
    }
  } else {
    // Hourly intervals
    const totalHours = days * 24;
    for (let i = totalHours; i >= 0; i--) {
      timestamps.push(subHours(now, i));
    }
  }

  return timestamps;
}

function generatePerformanceRatio(
  timestamps: Date[],
  rand: () => number
): ScadaDataPoint[] {
  return timestamps.map((ts) => {
    const hour = ts.getHours();
    const dayOfYear =
      Math.floor(
        (ts.getTime() - new Date(ts.getFullYear(), 0, 0).getTime()) /
          86400000
      );

    // Daily pattern: higher in midday
    const dailyCycle = Math.sin(((hour - 6) / 12) * Math.PI);
    const dailyFactor = dailyCycle > 0 ? dailyCycle * 0.02 : 0;

    // Seasonal pattern: slight variation across the year
    const seasonalFactor = Math.sin(((dayOfYear - 80) / 365) * 2 * Math.PI) * 0.01;

    // Base value centered at 0.80
    const base = 0.80 + dailyFactor + seasonalFactor;

    // Noise
    const noise = (rand() - 0.5) * 0.02;

    // Occasional dips (about 2% of the time)
    const dip = rand() < 0.02 ? -0.06 * rand() : 0;

    const value = clamp(base + noise + dip, 0.70, 0.88);

    return {
      timestamp: format(ts, "yyyy-MM-dd'T'HH:mm:ss"),
      metric: "performance_ratio",
      value: parseFloat(value.toFixed(4)),
      quality: assignQuality(rand),
    };
  });
}

function generateAvailability(
  timestamps: Date[],
  rand: () => number
): ScadaDataPoint[] {
  return timestamps.map((ts) => {
    // Mostly high availability
    let value = 0.97 + rand() * 0.02; // 0.97 - 0.99

    // Rare drops (~1% of the time)
    if (rand() < 0.01) {
      value = 0.90 + rand() * 0.05; // 0.90 - 0.95
    }

    return {
      timestamp: format(ts, "yyyy-MM-dd'T'HH:mm:ss"),
      metric: "availability",
      value: parseFloat(clamp(value, 0.85, 1.0).toFixed(4)),
      quality: assignQuality(rand),
    };
  });
}

function generateBessSoh(
  timestamps: Date[],
  totalDays: number,
  rand: () => number
): ScadaDataPoint[] {
  const totalPoints = timestamps.length;

  return timestamps.map((ts, i) => {
    // Linear decline from 0.98 to 0.94 over 365 days
    const progress = i / totalPoints;
    const decline = (0.98 - 0.94) * (totalDays / 365) * progress;
    const base = 0.98 - decline;

    // Small noise
    const noise = (rand() - 0.5) * 0.002;

    const value = clamp(base + noise, 0.90, 0.99);

    return {
      timestamp: format(ts, "yyyy-MM-dd'T'HH:mm:ss"),
      metric: "bess_soh",
      value: parseFloat(value.toFixed(4)),
      quality: assignQuality(rand),
    };
  });
}

function generateBessSoc(
  timestamps: Date[],
  rand: () => number
): ScadaDataPoint[] {
  return timestamps.map((ts) => {
    const hour = ts.getHours();
    const minute = ts.getMinutes();
    const fractionalHour = hour + minute / 60;

    // 2 cycles per day: charge during morning (6-12), discharge (12-18),
    // charge evening (18-24), discharge night (0-6)
    const cycleAngle = (fractionalHour / 12) * 2 * Math.PI;
    const base = 0.50 + 0.40 * Math.sin(cycleAngle - Math.PI / 2);

    // Noise
    const noise = (rand() - 0.5) * 0.04;

    const value = clamp(base + noise, 0.10, 0.90);

    return {
      timestamp: format(ts, "yyyy-MM-dd'T'HH:mm:ss"),
      metric: "bess_soc",
      value: parseFloat(value.toFixed(4)),
      quality: assignQuality(rand),
    };
  });
}

function generateBessTemperature(
  timestamps: Date[],
  rand: () => number
): ScadaDataPoint[] {
  return timestamps.map((ts) => {
    const hour = ts.getHours();
    const minute = ts.getMinutes();
    const fractionalHour = hour + minute / 60;

    // Daily ambient temperature cycle: peaks around 14:00
    const ambientCycle = Math.sin(((fractionalHour - 8) / 24) * 2 * Math.PI);
    const ambient = 25 + ambientCycle * 5; // 20-30 base range

    // SoC correlation: higher temperature when cycling (mid-charge/discharge)
    const socCycle = Math.sin((fractionalHour / 12) * 2 * Math.PI);
    const socHeat = Math.abs(socCycle) * 3; // 0-3 degrees from cycling

    // Noise
    const noise = (rand() - 0.5) * 2;

    const value = clamp(ambient + socHeat + noise, 18, 40);

    return {
      timestamp: format(ts, "yyyy-MM-dd'T'HH:mm:ss"),
      metric: "bess_temperature",
      value: parseFloat(value.toFixed(2)),
      quality: assignQuality(rand),
    };
  });
}

function generateIrradiance(
  timestamps: Date[],
  rand: () => number
): ScadaDataPoint[] {
  return timestamps.map((ts) => {
    const hour = ts.getHours();
    const minute = ts.getMinutes();
    const fractionalHour = hour + minute / 60;

    // Bell curve: sunrise ~6, sunset ~18, peak at noon
    let value = 0;
    if (fractionalHour >= 6 && fractionalHour <= 18) {
      const normalized = (fractionalHour - 6) / 12; // 0 to 1
      // Sine-based bell curve
      const bell = Math.sin(normalized * Math.PI);
      value = bell * 1000;

      // Cloud noise: random dips
      const cloudFactor = rand() < 0.15 ? 0.4 + rand() * 0.4 : 1.0;
      value *= cloudFactor;

      // General noise
      value += (rand() - 0.5) * 40;
    }

    value = clamp(value, 0, 1050);

    return {
      timestamp: format(ts, "yyyy-MM-dd'T'HH:mm:ss"),
      metric: "irradiance",
      value: parseFloat(value.toFixed(1)),
      quality: assignQuality(rand),
    };
  });
}

function generatePowerOutput(
  timestamps: Date[],
  rand: () => number
): ScadaDataPoint[] {
  // Assume a nominal capacity factor. Power = irradiance_fraction * PR * capacity
  // We'll generate correlated to irradiance and PR inline.
  const nominalCapacityMw = 50; // 50 MW plant

  return timestamps.map((ts) => {
    const hour = ts.getHours();
    const minute = ts.getMinutes();
    const fractionalHour = hour + minute / 60;

    // Irradiance fraction (same bell curve logic)
    let irradianceFraction = 0;
    if (fractionalHour >= 6 && fractionalHour <= 18) {
      const normalized = (fractionalHour - 6) / 12;
      irradianceFraction = Math.sin(normalized * Math.PI);

      // Cloud noise
      const cloudFactor = rand() < 0.15 ? 0.4 + rand() * 0.4 : 1.0;
      irradianceFraction *= cloudFactor;
    }

    // Performance ratio inline
    const pr = 0.78 + rand() * 0.06; // 0.78-0.84

    const value = clamp(
      irradianceFraction * pr * nominalCapacityMw + (rand() - 0.5) * 1.0,
      0,
      nominalCapacityMw
    );

    return {
      timestamp: format(ts, "yyyy-MM-dd'T'HH:mm:ss"),
      metric: "power_output_mw",
      value: parseFloat(value.toFixed(2)),
      quality: assignQuality(rand),
    };
  });
}

function generateDataCompleteness(
  timestamps: Date[],
  rand: () => number
): ScadaDataPoint[] {
  return timestamps.map((ts) => {
    // Mostly very high
    let value = 0.99 + rand() * 0.01; // 0.99 - 1.00

    // Occasional drops (~2% of the time)
    if (rand() < 0.02) {
      value = 0.95 + rand() * 0.04; // 0.95 - 0.99
    }

    return {
      timestamp: format(ts, "yyyy-MM-dd'T'HH:mm:ss"),
      metric: "data_completeness",
      value: parseFloat(clamp(value, 0.90, 1.0).toFixed(4)),
      quality: assignQuality(rand),
    };
  });
}

export function generateScadaData(
  metric: string,
  days: number
): ScadaDataPoint[] {
  // Use a deterministic seed based on metric name for reproducibility
  let seed = 0;
  for (let i = 0; i < metric.length; i++) {
    seed = (seed * 31 + metric.charCodeAt(i)) % 2147483647;
  }
  if (seed === 0) seed = 12345;

  const rand = seededRandom(seed);
  const timestamps = generateTimestamps(days);

  switch (metric) {
    case "performance_ratio":
      return generatePerformanceRatio(timestamps, rand);
    case "availability":
      return generateAvailability(timestamps, rand);
    case "bess_soh":
      return generateBessSoh(timestamps, days, rand);
    case "bess_soc":
      return generateBessSoc(timestamps, rand);
    case "bess_temperature":
      return generateBessTemperature(timestamps, rand);
    case "irradiance":
      return generateIrradiance(timestamps, rand);
    case "power_output_mw":
      return generatePowerOutput(timestamps, rand);
    case "data_completeness":
      return generateDataCompleteness(timestamps, rand);
    default:
      return [];
  }
}
