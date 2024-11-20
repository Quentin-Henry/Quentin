// Base class for all time systems
class TimeSystem {
  constructor(name, baseInfo, intervalMs) {
    this.name = name;
    this.baseInfo = baseInfo;
    this.intervalMs = intervalMs;
  }

  // Must be implemented by child classes
  calculateTime(date) {
    throw new Error("calculateTime must be implemented");
  }

  // Default implementation that can be overridden if needed
  formatDisplay(hours, minutes, seconds) {
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(number, base = 10) {
    return number.toString(base).padStart(2, "0").toUpperCase();
  }

  getExtraInfo() {
    return this.baseInfo;
  }
}

class RegularTimeSystem extends TimeSystem {
  constructor() {
    super("regular", "Regular Time (Base 60)", 1000);
  }

  calculateTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return {
      secondDeg: (seconds / 60) * 360,
      minuteDeg: ((minutes + seconds / 60) / 60) * 360,
      hourDeg: (((hours % 12) + minutes / 60) / 12) * 360,
      displayText: this.formatDisplay(hours, minutes, seconds),
      extraInfo: this.getExtraInfo(),
      description:
        "The sexagesimal system, originates from Sumerian mathematics. One theory for using 60 is that it relates to finger counting, with 3 segments per finger, 12 per hand.",
    };
  }
  getTimeSubdivisions() {
    return {
      hours: "24",
      minutes: "60",
      seconds: "60",
    };
  }
}

class DecimalTimeSystem extends TimeSystem {
  constructor() {
    super("decimal", "Decimal Time (Base 10)", 864);
  }

  calculateTime(date) {
    const dayProgress = this.getDayProgress(date);
    const totalDecimalSeconds = Math.floor(dayProgress * 100000);

    const decimalHours = Math.floor(totalDecimalSeconds / 10000);
    const decimalMinutes = Math.floor((totalDecimalSeconds % 10000) / 100);
    const decimalSeconds = Math.floor(totalDecimalSeconds % 100);

    return {
      secondDeg: (decimalSeconds / 100) * 360,
      minuteDeg: ((decimalMinutes + decimalSeconds / 100) / 100) * 360,
      hourDeg: ((decimalHours + decimalMinutes / 100) / 10) * 360,
      displayText: this.formatDisplay(
        decimalHours,
        decimalMinutes,
        decimalSeconds
      ),
      extraInfo: this.getExtraInfo(),
      description:
        "This system is designed to simplify timekeeping by using a base-10 structure, similar to the metric system. it was briefly used during the French Revolution.",
    };
  }
  getTimeSubdivisions() {
    return {
      hours: "10",
      minutes: "100",
      seconds: "100",
    };
  }

  getDayProgress(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return (
      (hours * 3600 + minutes * 60 + seconds + milliseconds / 1000) / 86400
    );
  }
}

class HexadecimalTimeSystem extends TimeSystem {
  constructor() {
    super("hexadecimal", "Hexadecimal Time (Base 16)", 136);
  }

  calculateTime(date) {
    const dayProgress = this.getDayProgress(date);
    const totalHexSeconds = Math.floor(dayProgress * (16 * 256 * 256));
    const hexHours = Math.floor(totalHexSeconds / (256 * 256));
    const hexMinutes = Math.floor((totalHexSeconds % (256 * 256)) / 256);
    const hexSeconds = Math.floor(totalHexSeconds % 256);

    const hexFraction = Math.floor(dayProgress * 0xffff)
      .toString(16)
      .padStart(4, "0");

    return {
      secondDeg: (hexSeconds / 256) * 360,
      minuteDeg: ((hexMinutes + hexSeconds / 256) / 256) * 360,
      hourDeg: ((hexHours + hexMinutes / 256) / 16) * 360,
      displayText: this.formatDisplay(hexHours, hexMinutes, hexSeconds, 16),
      extraInfo: `${this.baseInfo} - Fraction: 0x${hexFraction}`,
      description:
        "The base-16 hexadecimal system is used in some clocks, particularly digital ones, to represent time. In this system, numbers are expressed using 16 symbols: 0-9 and A-F, where A represents 10, B is 11, and so on. Hexadecimal is useful for efficiently displaying larger values in a compact format, often seen in 24-hour or military time displays.",
    };
  }

  formatDisplay(hours, minutes, seconds, base = 16) {
    return `${this.pad(hours, base)}:${this.pad(minutes, base)}:${this.pad(
      seconds,
      base
    )}`;
  }

  getDayProgress(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return (
      (hours * 3600 + minutes * 60 + seconds + milliseconds / 1000) / 86400
    );
  }
  getTimeSubdivisions() {
    return {
      hours: "16",
      minutes: "128",
      seconds: "128",
    };
  }
}

// Binary Time System
class BinaryTimeSystem extends TimeSystem {
  constructor() {
    super("binary", "Binary Time", 2695);
  }

  calculateTime(date) {
    const dayProgress = this.getDayProgress(date);
    const totalBinarySeconds = Math.floor(dayProgress * (16 * 32 * 32));

    const binaryHours = Math.floor(totalBinarySeconds / (32 * 32));
    const binaryMinutes = Math.floor((totalBinarySeconds % (32 * 32)) / 32);
    const binarySeconds = Math.floor(totalBinarySeconds % 32);

    const hoursBinary = binaryHours.toString(2).padStart(4, "0");
    const minutesBinary = binaryMinutes.toString(2).padStart(5, "0");
    const secondsBinary = binarySeconds.toString(2).padStart(5, "0");

    return {
      secondDeg: (binarySeconds / 32) * 360,
      minuteDeg: ((binaryMinutes + binarySeconds / 32) / 32) * 360,
      hourDeg: ((binaryHours + binaryMinutes / 32) / 16) * 360,
      displayText: `${hoursBinary}:${minutesBinary}:${secondsBinary}`,
      extraInfo: `Binary Time - Dec: ${binaryHours}:${binaryMinutes}:${binarySeconds}`,
      description: "  ",
    };
  }

  getDayProgress(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return (
      (hours * 3600 + minutes * 60 + seconds + milliseconds / 1000) / 86400
    );
  }
  getTimeSubdivisions() {
    return {
      hours: "16",
      minutes: "32",
      seconds: "32",
    };
  }
}

// Octal Time System
class OctalTimeSystem extends TimeSystem {
  constructor() {
    super("octal", "Octal Time (Base 8)", 336);
  }

  calculateTime(date) {
    const dayProgress = this.getDayProgress(date);
    const totalOctalSeconds = Math.floor(dayProgress * (8 * 64 * 64));

    const octalHours = Math.floor(totalOctalSeconds / (64 * 64));
    const octalMinutes = Math.floor((totalOctalSeconds % (64 * 64)) / 64);
    const octalSeconds = Math.floor(totalOctalSeconds % 64);

    return {
      secondDeg: (octalSeconds / 64) * 360,
      minuteDeg: ((octalMinutes + octalSeconds / 64) / 64) * 360,
      hourDeg: ((octalHours + octalMinutes / 64) / 8) * 360,
      displayText: `${octalHours.toString(8)}:${this.pad(
        octalMinutes,
        8
      )}:${this.pad(octalSeconds, 8)}`,
      extraInfo: this.getExtraInfo(),
      description: "   ",
    };
  }

  getDayProgress(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return (
      (hours * 3600 + minutes * 60 + seconds + milliseconds / 1000) / 86400
    );
  }
  getTimeSubdivisions() {
    return {
      hours: "8",
      minutes: "64",
      seconds: "64",
    };
  }
}

// Fibonacci Time System
class FibonacciTimeSystem extends TimeSystem {
  constructor() {
    super("fibonacci", "Fibonacci Time (13h:55m:89s)", 108);
    this.fibHours = 13;
    this.fibMinutes = 55;
    this.fibSeconds = 89;
  }

  calculateTime(date) {
    const dayProgress = this.getDayProgress(date);
    const totalFibSeconds = Math.floor(
      dayProgress * (this.fibHours * this.fibMinutes * this.fibSeconds)
    );

    const hours = Math.floor(
      totalFibSeconds / (this.fibMinutes * this.fibSeconds)
    );
    const minutes = Math.floor(
      (totalFibSeconds % (this.fibMinutes * this.fibSeconds)) / this.fibSeconds
    );
    const seconds = Math.floor(totalFibSeconds % this.fibSeconds);

    return {
      secondDeg: (seconds / this.fibSeconds) * 360,
      minuteDeg:
        ((minutes + seconds / this.fibSeconds) / this.fibMinutes) * 360,
      hourDeg: ((hours + minutes / this.fibMinutes) / this.fibHours) * 360,
      displayText: this.formatDisplay(hours, minutes, seconds),
      extraInfo: this.getExtraInfo(),
      description: "natural-feeling rhythms based on the golden ratio",
    };
  }

  getDayProgress(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return (
      (hours * 3600 + minutes * 60 + seconds + milliseconds / 1000) / 86400
    );
  }
  getTimeSubdivisions() {
    return {
      hours: "13",
      minutes: "55",
      seconds: "89",
    };
  }
}

// Golden Ratio Time System
class GoldenTimeSystem extends TimeSystem {
  constructor() {
    super("golden", "Golden Ratio Time", 132);
    this.φ = (1 + Math.sqrt(5)) / 2;
    this.goldenHours = Math.floor(16 * this.φ);
    this.goldenMinutes = Math.floor(60 * this.φ);
    this.goldenSeconds = Math.floor(60 * this.φ);
  }

  calculateTime(date) {
    const dayProgress = this.getDayProgress(date);
    const totalGoldenSeconds = Math.floor(
      dayProgress * (this.goldenHours * this.goldenMinutes * this.goldenSeconds)
    );

    const hours = Math.floor(
      totalGoldenSeconds / (this.goldenMinutes * this.goldenSeconds)
    );
    const minutes = Math.floor(
      (totalGoldenSeconds % (this.goldenMinutes * this.goldenSeconds)) /
        this.goldenSeconds
    );
    const seconds = Math.floor(totalGoldenSeconds % this.goldenSeconds);

    return {
      secondDeg: (seconds / this.goldenSeconds) * 360,
      minuteDeg:
        ((minutes + seconds / this.goldenSeconds) / this.goldenMinutes) * 360,
      hourDeg:
        ((hours + minutes / this.goldenMinutes) / this.goldenHours) * 360,
      displayText: this.formatDisplay(hours, minutes, seconds),
      extraInfo: `${this.baseInfo} (φ ≈ ${this.φ.toFixed(3)})`,
      description: "natural-feeling rhythms based on the golden ratio",
    };
  }

  getDayProgress(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return (
      (hours * 3600 + minutes * 60 + seconds + milliseconds / 1000) / 86400
    );
  }
  getTimeSubdivisions() {
    return {
      hours: "25",
      minutes: "97",
      seconds: "97",
    };
  }
}

class QuantumTimeSystem extends TimeSystem {
  constructor() {
    super("quantum", "Quantum Probability Time", 50); // Faster update rate for smooth animations
    this.planckTime = 5.391e-44; // Planck time in seconds
    this.uncertaintyScale = {
      hours: 0.1, // Lowest uncertainty
      minutes: 0.2, // Medium uncertainty
      seconds: 0.3, // Highest uncertainty
    };
  }

  calculateTime(date) {
    const regular = this.getRegularTime(date);
    const dayProgress = this.getDayProgress(date);

    // Calculate quantum uncertainties
    const uncertainties = this.calculateUncertainties(regular);

    // Generate probability distributions
    const distributions = this.generateDistributions(regular, uncertainties);

    // Calculate most probable positions for hands
    const { hourDeg, minuteDeg, secondDeg } = this.calculateHandPositions(
      regular,
      uncertainties
    );

    // Format quantum state notation
    const displayText = this.formatQuantumState(regular, uncertainties);

    return {
      secondDeg,
      minuteDeg,
      hourDeg,
      displayText,
      extraInfo: this.getQuantumInfo(uncertainties),
      description:
        "The clock's hands exist in multiple positions at once. The uncertainty in each hand's position grows smaller over time, seconds are more uncertain than hours. based Heisenberg's Uncertainty Principle.",
      // Add probability cloud data for rendering
      probabilityCloud: {
        hours: distributions.hours,
        minutes: distributions.minutes,
        seconds: distributions.seconds,
      },
    };
  }

  getRegularTime(date) {
    return {
      hours: date.getHours() % 12,
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      milliseconds: date.getMilliseconds(),
    };
  }

  calculateUncertainties(time) {
    // Uncertainty increases for smaller time units
    const timeFactors = {
      hours: Math.sin((time.hours * Math.PI) / 12) * 0.5 + 1,
      minutes: Math.sin((time.minutes * Math.PI) / 30) * 0.5 + 1,
      seconds: Math.sin((time.seconds * Math.PI) / 30) * 0.5 + 1,
    };

    return {
      hours: this.uncertaintyScale.hours * timeFactors.hours,
      minutes: this.uncertaintyScale.minutes * timeFactors.minutes,
      seconds: this.uncertaintyScale.seconds * timeFactors.seconds,
    };
  }

  generateDistributions(time, uncertainties) {
    const generateGaussian = (mean, uncertainty, points = 360) => {
      const distribution = new Array(points).fill(0);
      for (let i = 0; i < points; i++) {
        const x = (i / points) * 360;
        const delta = (x - mean + 360) % 360;
        const adjustedDelta = delta > 180 ? delta - 360 : delta;
        distribution[i] = Math.exp(
          -(adjustedDelta ** 2) / (2 * uncertainty ** 2)
        );
      }
      return distribution;
    };

    return {
      hours: generateGaussian(
        (time.hours * 30 + time.minutes / 2) % 360,
        uncertainties.hours * 30
      ),
      minutes: generateGaussian(
        (time.minutes * 6 + time.seconds / 10) % 360,
        uncertainties.minutes * 6
      ),
      seconds: generateGaussian(
        (time.seconds * 6) % 360,
        uncertainties.seconds * 6
      ),
    };
  }

  calculateHandPositions(time, uncertainties) {
    // Add quantum jitter to regular positions
    const jitter = (base, uncertainty) => {
      const randomFactor = (Math.random() - 0.5) * uncertainty;
      return (base + randomFactor + 360) % 360;
    };

    return {
      hourDeg: jitter(
        (time.hours * 30 + time.minutes / 2) % 360,
        uncertainties.hours * 30
      ),
      minuteDeg: jitter(
        (time.minutes * 6 + time.seconds / 10) % 360,
        uncertainties.minutes * 6
      ),
      secondDeg: jitter(time.seconds * 6, uncertainties.seconds * 6),
    };
  }

  formatQuantumState(time, uncertainties) {
    const formatComponent = (value, uncertainty) => {
      const delta = Math.round(uncertainty * 100) / 100;
      return `${value.toString().padStart(2, "0")}±${delta}`;
    };

    return `${formatComponent(
      time.hours,
      uncertainties.hours
    )}:${formatComponent(
      time.minutes,
      uncertainties.minutes
    )}:${formatComponent(time.seconds, uncertainties.seconds)}`;
  }

  getQuantumInfo(uncertainties) {
    return `${this.baseInfo}\nΔt(h):${uncertainties.hours.toFixed(
      3
    )} Δt(m):${uncertainties.minutes.toFixed(
      3
    )} Δt(s):${uncertainties.seconds.toFixed(3)}`;
  }

  getDayProgress(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return (
      (hours * 3600 + minutes * 60 + seconds + milliseconds / 1000) / 86400
    );
  }
  getTimeSubdivisions() {
    return {
      hours: "24",
      minutes: "60",
      seconds: "60",
    };
  }
}

// True Binary Time System (Base 2)
class TrueBinaryTimeSystem extends TimeSystem {
  constructor() {
    super("trueBinary", "True Binary Time (Base 2)", 1000);
  }

  calculateTime(date) {
    const dayProgress = this.getDayProgress(date);
    // Using powers of 2: 8 hours (2^3), 8 minutes (2^3), 8 seconds (2^3)
    const totalBinarySeconds = Math.floor(dayProgress * (8 * 8 * 8));

    const binaryHours = Math.floor(totalBinarySeconds / (8 * 8));
    const binaryMinutes = Math.floor((totalBinarySeconds % (8 * 8)) / 8);
    const binarySeconds = Math.floor(totalBinarySeconds % 8);

    // Convert to binary strings
    const hoursBinary = binaryHours.toString(2).padStart(3, "0");
    const minutesBinary = binaryMinutes.toString(2).padStart(3, "0");
    const secondsBinary = binarySeconds.toString(2).padStart(3, "0");

    return {
      secondDeg: (binarySeconds / 8) * 360,
      minuteDeg: ((binaryMinutes + binarySeconds / 8) / 8) * 360,
      hourDeg: ((binaryHours + binaryMinutes / 8) / 8) * 360,
      displayText: `${hoursBinary}:${minutesBinary}:${secondsBinary}`,
      extraInfo: `Pure Binary (Base 2) - Dec: ${binaryHours}:${binaryMinutes}:${binarySeconds}`,
      description: "   ",
    };
  }

  getDayProgress(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return (
      (hours * 3600 + minutes * 60 + seconds + milliseconds / 1000) / 86400
    );
  }

  getTimeSubdivisions() {
    return {
      hours: "8",
      minutes: "8",
      seconds: "8",
    };
  }
}

// Base 7 Time System (Septimal)
class SeptimalTimeSystem extends TimeSystem {
  constructor() {
    super("septimal", "Septimal Time (Base 7)", 1000);
  }

  calculateTime(date) {
    const dayProgress = this.getDayProgress(date);
    // Using powers of 7: 7 hours, 49 minutes, 49 seconds
    const totalSeptalSeconds = Math.floor(dayProgress * (7 * 49 * 49));

    const septalHours = Math.floor(totalSeptalSeconds / (49 * 49));
    const septalMinutes = Math.floor((totalSeptalSeconds % (49 * 49)) / 49);
    const septalSeconds = Math.floor(totalSeptalSeconds % 49);

    return {
      secondDeg: (septalSeconds / 49) * 360,
      minuteDeg: ((septalMinutes + septalSeconds / 49) / 49) * 360,
      hourDeg: ((septalHours + septalMinutes / 49) / 7) * 360,
      displayText: `${septalHours.toString(7)}:${septalMinutes
        .toString(7)
        .padStart(2, "0")}:${septalSeconds.toString(7).padStart(2, "0")}`,
      extraInfo: `Septimal Time (Base 7) - Dec: ${septalHours}:${septalMinutes}:${septalSeconds}`,
      description: "   ",
    };
  }

  getDayProgress(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return (
      (hours * 3600 + minutes * 60 + seconds + milliseconds / 1000) / 86400
    );
  }

  getTimeSubdivisions() {
    return {
      hours: "7",
      minutes: "49",
      seconds: "49",
    };
  }
}

// Prime Number Time System
class PrimeTimeSystem extends TimeSystem {
  constructor() {
    super("prime", "Prime Time (2,3,5)", 1000);
  }

  calculateTime(date) {
    const dayProgress = this.getDayProgress(date);
    // Using first three prime numbers: 2 hours, 3 minutes, 5 seconds
    const totalPrimeSeconds = Math.floor(dayProgress * (2 * 3 * 5));

    const primeHours = Math.floor(totalPrimeSeconds / (3 * 5));
    const primeMinutes = Math.floor((totalPrimeSeconds % (3 * 5)) / 5);
    const primeSeconds = Math.floor(totalPrimeSeconds % 5);

    return {
      secondDeg: (primeSeconds / 5) * 360,
      minuteDeg: ((primeMinutes + primeSeconds / 5) / 3) * 360,
      hourDeg: ((primeHours + primeMinutes / 3) / 2) * 360,
      displayText: this.formatDisplay(primeHours, primeMinutes, primeSeconds),
      extraInfo: `Prime Numbers (2h:3m:5s)`,
      description: "Its Prime Time",
    };
  }

  getDayProgress(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return (
      (hours * 3600 + minutes * 60 + seconds + milliseconds / 1000) / 86400
    );
  }

  getTimeSubdivisions() {
    return {
      hours: "2",
      minutes: "3",
      seconds: "5",
    };
  }
}

// Duodecimal (Base 12) Time System
class DuodecimalTimeSystem extends TimeSystem {
  constructor() {
    super("duodecimal", "Duodecimal Time (Base 12)", 200);
  }

  calculateTime(date) {
    const dayProgress = this.getDayProgress(date);
    // 12 hours, 144 minutes (12²), 144 seconds (12²)
    const totalDuoSeconds = Math.floor(dayProgress * (12 * 144 * 144));

    const duoHours = Math.floor(totalDuoSeconds / (144 * 144));
    const duoMinutes = Math.floor((totalDuoSeconds % (144 * 144)) / 144);
    const duoSeconds = Math.floor(totalDuoSeconds % 144);

    // Convert to base-12 notation (using A and B for 10 and 11)
    const toBase12 = (num) => {
      if (num < 10) return num.toString();
      return "AB"[num - 10];
    };

    const formatDuo = (num) => {
      const first = Math.floor(num / 12);
      const second = num % 12;
      return `${toBase12(first)}${toBase12(second)}`;
    };

    return {
      secondDeg: (duoSeconds / 144) * 360,
      minuteDeg: ((duoMinutes + duoSeconds / 144) / 144) * 360,
      hourDeg: ((duoHours + duoMinutes / 144) / 12) * 360,
      displayText: `${toBase12(duoHours)}:${formatDuo(duoMinutes)}:${formatDuo(
        duoSeconds
      )}`,
      extraInfo: `Base 12 (A=10, B=11) - Dec: ${duoHours}:${duoMinutes}:${duoSeconds}`,
      description: "  ",
    };
  }

  getDayProgress(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return (
      (hours * 3600 + minutes * 60 + seconds + milliseconds / 1000) / 86400
    );
  }

  getTimeSubdivisions() {
    return {
      hours: "12",
      minutes: "144",
      seconds: "144",
    };
  }
}

// Pi Time System - Based on π and its powers
class PiTimeSystem extends TimeSystem {
  constructor() {
    super("pi", "π Time System", 314);
    this.π = Math.PI;
  }

  calculateTime(date) {
    const dayProgress = this.getDayProgress(date);
    // Using π, π², and π³ for divisions
    const piHours = Math.floor(this.π * 10); // ~31 hours
    const piMinutes = Math.floor(this.π * this.π * 10); // ~98 minutes
    const piSeconds = Math.floor(this.π * this.π * this.π); // ~31 seconds

    const totalPiSeconds = Math.floor(
      dayProgress * (piHours * piMinutes * piSeconds)
    );

    const hours = Math.floor(totalPiSeconds / (piMinutes * piSeconds));
    const minutes = Math.floor(
      (totalPiSeconds % (piMinutes * piSeconds)) / piSeconds
    );
    const seconds = Math.floor(totalPiSeconds % piSeconds);

    return {
      secondDeg: (seconds / piSeconds) * 360,
      minuteDeg: ((minutes + seconds / piSeconds) / piMinutes) * 360,
      hourDeg: ((hours + minutes / piMinutes) / piHours) * 360,
      displayText: this.formatDisplay(hours, minutes, seconds),
      extraInfo: `π Time (${piHours}h:${piMinutes}m:${piSeconds}s)`,
      description: "yum pie",
    };
  }

  getDayProgress(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return (
      (hours * 3600 + minutes * 60 + seconds + milliseconds / 1000) / 86400
    );
  }

  getTimeSubdivisions() {
    return {
      hours: Math.floor(this.π * 10).toString(),
      minutes: Math.floor(this.π * this.π * 10).toString(),
      seconds: Math.floor(this.π * this.π * this.π).toString(),
    };
  }
}

// Base 20 Time System
class VigesimalTimeSystem extends TimeSystem {
  constructor() {
    super("vigesimal", "Base 20 Time", 50);
  }

  calculateTime(date) {
    const dayProgress = this.getDayProgress(date);
    // 20 hours, 400 minutes (20²), 400 seconds (20²)
    const totalVigSeconds = Math.floor(dayProgress * (20 * 400 * 400));

    const vigHours = Math.floor(totalVigSeconds / (400 * 400));
    const vigMinutes = Math.floor((totalVigSeconds % (400 * 400)) / 400);
    const vigSeconds = Math.floor(totalVigSeconds % 400);

    // Convert to base-20 notation (using A-J for 10-19)
    const toBase20 = (num) => {
      if (num < 10) return num.toString();
      return String.fromCharCode(65 + (num - 10)); // A=10, B=11, etc.
    };

    const formatVig = (num) => {
      const first = Math.floor(num / 20);
      const second = num % 20;
      return `${toBase20(first)}${toBase20(second)}`;
    };

    return {
      secondDeg: (vigSeconds / 400) * 360,
      minuteDeg: ((vigMinutes + vigSeconds / 400) / 400) * 360,
      hourDeg: ((vigHours + vigMinutes / 400) / 20) * 360,
      displayText: `${toBase20(vigHours)}:${formatVig(vigMinutes)}:${formatVig(
        vigSeconds
      )}`,
      extraInfo: `Base 20 (A-J = 10-19) - Dec: ${vigHours}:${vigMinutes}:${vigSeconds}`,
      description: "   ",
    };
  }

  getDayProgress(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return (
      (hours * 3600 + minutes * 60 + seconds + milliseconds / 1000) / 86400
    );
  }

  getTimeSubdivisions() {
    return {
      hours: "20",
      minutes: "400",
      seconds: "400",
    };
  }
}

// Harmonic Time System - Based on musical intervals
class HarmonicTimeSystem extends TimeSystem {
  constructor() {
    super("harmonic", "Harmonic Time", 440); // 440Hz is concert pitch A
    this.harmonicSeries = [1, 2, 3, 4, 5, 6, 7, 8]; // First 8 harmonics
  }

  calculateTime(date) {
    const dayProgress = this.getDayProgress(date);

    // Using musical ratios for time divisions
    const harmonicHours = 12; // One octave (2:1 ratio)
    const harmonicMinutes = 60; // Perfect fifth (3:2 ratio) * octave
    const harmonicSeconds = 120; // Major third (5:4 ratio) * octave

    const totalHarmonicSeconds = Math.floor(
      dayProgress * (harmonicHours * harmonicMinutes * harmonicSeconds)
    );

    const hours = Math.floor(
      totalHarmonicSeconds / (harmonicMinutes * harmonicSeconds)
    );
    const minutes = Math.floor(
      (totalHarmonicSeconds % (harmonicMinutes * harmonicSeconds)) /
        harmonicSeconds
    );
    const seconds = Math.floor(totalHarmonicSeconds % harmonicSeconds);

    // Calculate musical interval positions
    const hourInterval = this.getMusicalInterval(hours, harmonicHours);
    const minuteInterval = this.getMusicalInterval(minutes, harmonicMinutes);
    const secondInterval = this.getMusicalInterval(seconds, harmonicSeconds);

    return {
      secondDeg: (seconds / harmonicSeconds) * 360,
      minuteDeg:
        ((minutes + seconds / harmonicSeconds) / harmonicMinutes) * 360,
      hourDeg: ((hours + minutes / harmonicMinutes) / harmonicHours) * 360,
      displayText: this.formatDisplay(hours, minutes, seconds),
      extraInfo: `Harmonic Time (${hourInterval}:${minuteInterval}:${secondInterval})`,
      description: "Based on the Cirle of Fiths, western musical rhythms",
    };
  }

  getMusicalInterval(value, max) {
    const ratios = {
      0: "P1", // Perfect unison
      0.25: "M3", // Major third
      0.33: "P5", // Perfect fifth
      0.5: "P8", // Perfect octave
      0.67: "M10", // Major tenth
      0.75: "P12", // Perfect twelfth
      0.83: "M13", // Major thirteenth
      1: "P15", // Double octave
    };

    const position = value / max;
    const closest = Object.entries(ratios).reduce((a, b) => {
      return Math.abs(a[0] - position) < Math.abs(b[0] - position) ? a : b;
    });

    return closest[1];
  }
  getDayProgress(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    return (
      (hours * 3600 + minutes * 60 + seconds + milliseconds / 1000) / 86400
    );
  }

  getTimeSubdivisions() {
    return {
      hours: "12",
      minutes: "60",
      seconds: "120",
    };
  }
}

class ClockController {
  constructor() {
    this.timeSystems = new Map();
    this.currentSystem = null;
    this.setupTimeSystems();
  }

  setupTimeSystems() {
    const systems = [
      new RegularTimeSystem(),
      new DecimalTimeSystem(),
      new HexadecimalTimeSystem(),
      new BinaryTimeSystem(),
      new OctalTimeSystem(),
      new FibonacciTimeSystem(),
      new GoldenTimeSystem(),
      new QuantumTimeSystem(),
      new TrueBinaryTimeSystem(),
      new SeptimalTimeSystem(),
      new PrimeTimeSystem(),
      new DuodecimalTimeSystem(),
      new VigesimalTimeSystem(),
      new PiTimeSystem(),
      new HarmonicTimeSystem(),
    ];

    systems.forEach((system) => {
      this.timeSystems.set(system.name, system);
    });

    this.currentSystem = this.timeSystems.get("regular");
  }

  switchTimeSystem(systemName) {
    const system = this.timeSystems.get(systemName);
    if (system) {
      this.currentSystem = system;
      this.updateClock();
    }
  }

  updateClock() {
    const now = new Date();
    const timeData = this.currentSystem.calculateTime(now);

    // Update UI elements
    this.updateButtons();
    this.updateTimeDisplay(timeData.displayText);
    this.updateExtraInfo(timeData.extraInfo);
    this.updateDescription(timeData.description);
    this.updateHandRotations(
      timeData.secondDeg,
      timeData.minuteDeg,
      timeData.hourDeg
    );
  }

  updateTimeDisplay(text) {
    document.getElementById("timeText").textContent = text;
  }

  updateExtraInfo(text) {
    const extraInfoElement = document.getElementById("extraInfo");
    if (extraInfoElement) {
      extraInfoElement.textContent = text;
    }
  }

  updateDescription(text) {
    const descriptionElement = document.getElementById("clockDescription");
    if (descriptionElement) {
      descriptionElement.textContent = text;
    }
  }

  updateButtons() {
    const subdivisions = this.currentSystem.getTimeSubdivisions();
    const ButtonH = document.getElementById("buttonH");
    ButtonH.innerText = subdivisions.hours + " Hours";
    const ButtonM = document.getElementById("buttonM");
    ButtonM.innerText = subdivisions.minutes + " Minutes";
    const ButtonS = document.getElementById("buttonS");
    ButtonS.innerText = subdivisions.seconds + " Seconds";
    const rotatedImg = document.getElementById("rotatedImg");
    rotatedImg.src = "rotated/Rotated Instances_" + subdivisions.hours + ".png";
  }

  updateHandRotations(secondDeg, minuteDeg, hourDeg) {
    // Add CSS transition only to minute and hour hands
    document.querySelector(".minute-hand").style.transition =
      "transform 0.1s linear";
    document.querySelector(".hour-hand").style.transition =
      "transform 0.1s linear";
    document.querySelector(".second-hand").style.transition = "none";

    document.querySelector(
      ".second-hand"
    ).style.transform = `rotate(${secondDeg}deg)`;
    document.querySelector(
      ".minute-hand"
    ).style.transform = `rotate(${minuteDeg}deg)`;
    document.querySelector(
      ".hour-hand"
    ).style.transform = `rotate(${hourDeg}deg)`;
  }

  startClock() {
    const updateAndSchedule = () => {
      this.updateClock();
      setTimeout(updateAndSchedule, this.currentSystem.intervalMs);
    };
    updateAndSchedule();
  }
}

// Initialize the clock controller
const clockController = new ClockController();
clockController.startClock();

// Handle user clicks on the time system menu (spans)
document.getElementById("clockMenu").addEventListener("click", (event) => {
  const clickedId = event.target.id; // Get the ID of the clicked span
  const systemMapping = {
    base2: "trueBinary",
    Base16B: "binary",
    Base8: "octal",
    Base10: "decimal",
    Base16: "hexadecimal",
    Base60: "regular",
    Baseφ: "golden",
    BaseΨ: "quantum",
    base2: "trueBinary",
    Base7: "septimal",
    BasePrime: "prime",
    Base12: "duodecimal",
    Base20: "vigesimal",
    BasePi: "pi",
    BaseHarmonic: "harmonic",
  };

  // Check if the clicked span has a valid ID that maps to a time system
  if (systemMapping[clickedId]) {
    // Switch to the selected time system
    clockController.switchTimeSystem(systemMapping[clickedId]);

    // Trigger the H button click event programmatically
    const buttonH = document.getElementById("buttonH");
    if (buttonH) {
      buttonH.click(); // Simulate a click on the "H" button
    }

    // Remove the "active" class from all menu items
    const menuItems = document.querySelectorAll(".clockMenuItem");
    menuItems.forEach((item) => {
      item.classList.remove("active");
    });

    // Add the "active" class to the clicked menu item
    const activeMenuItem = document.getElementById(clickedId);
    if (activeMenuItem) {
      activeMenuItem.classList.add("active");
    }
  }
});

const buttons = document.querySelectorAll(".innerbutton");

// Function to remove 'active' class from all buttons
function removeActiveClass() {
  buttons.forEach((button) => {
    button.classList.remove("active");
  });
}

// Add event listener to each button
buttons.forEach((button) => {
  button.addEventListener("click", function () {
    // Remove the 'active' class from all buttons
    removeActiveClass();

    // Add 'active' class to the clicked button
    button.classList.add("active");
  });
});
