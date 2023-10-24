import { useEffect, useState } from "react";
import "./App.css";

type BarGraphProps = {
  values: number[];
  labels?: string[];
  numTicks?: number;
  yLabel?: string;
  title?: string;
  xLabel?: string;
  darkMode?: boolean;
};

type BarProps = {
  value: number;
  label: string;
  maxValue: number;
  negativeNumbers: boolean;
};

const BarGraph = ({
  values,
  labels = values.map((i) => i.toString()) || [],
  numTicks = 10,
  yLabel = "",
  title = "",
  xLabel = "",
  darkMode = false,
}: BarGraphProps) => {
  const [negativeNumbers, setNegativeNumbers] = useState(false);

  useEffect(() => {
    setNegativeNumbers(false);
    values.forEach((value) => {
      if (value < 0) {
        setNegativeNumbers(true);
        console.log(value);
      }
    });
  }, [values, negativeNumbers]);

  const maxValue = Math.max(...values.map(Math.abs));

  // If negative numbers, want to allocate half the ticks to negative numbers
  numTicks /= negativeNumbers ? 2 : 1;

  const idealTicks = maxValue / numTicks;
  const numDigitsIdeaTicks = idealTicks.toString().split(".")[0].length;

  // So if the num of digits is 3, then the friendly digits are 100, 200, 500, 1000
  const friendlyDigits = [
    1 * Math.pow(10, numDigitsIdeaTicks - 1),
    2 * Math.pow(10, numDigitsIdeaTicks - 1),
    5 * Math.pow(10, numDigitsIdeaTicks - 1),
    1 * Math.pow(10, numDigitsIdeaTicks),
  ];

  // Gets the closest friendly tick to the ideal tick
  const friendlyTick = friendlyDigits.reduce(
    (best, cur) =>
      cur - Math.abs(idealTicks) >= 0 && Math.abs(cur) - idealTicks < Math.abs(best) - idealTicks
        ? cur
        : best,
    Number.MAX_SAFE_INTEGER
  );
  const ticks: number[] = [];
  if (negativeNumbers) {
    for (let i = numTicks; i > 0; i--) {
      ticks.push(-friendlyTick * i);
    }
  }
  for (let i = 0; i <= numTicks; i++) {
    ticks.push(friendlyTick * i);
  }
  const lastTick = friendlyTick * numTicks;
  return (
    <div className={`bar-graph ${darkMode ? " dark" : ""}`}>
      <h1 className="title">{title}</h1>
      <div className="graph-container">
        <div className="y-label">
          <p>{yLabel}</p>
        </div>
        <div className="tick-label-container">
          {ticks.map((tick, index) => {
            return (
              <div key={index} className="tick-label">
                {tick}
              </div>
            );
          })}
        </div>
        <div className="bar-container-grid">
          <div className="tick-container">
            {ticks.map((tick, index) => {
              return (
                <div key={index} className="tick-line" style={tick == 0 ? { zIndex: "1" } : {}}>
                  <div className="tick"></div>
                </div>
              );
            })}
          </div>
          <div
            className="bar-container"
            style={negativeNumbers ? { alignItems: "center" } : { alignItems: "flex-end" }}
          >
            {values.map((bar, index) => (
              <Bar
                key={index}
                value={bar}
                label={labels[index]}
                maxValue={lastTick}
                negativeNumbers={negativeNumbers}
              />
            ))}
          </div>
        </div>
      </div>
      <h3 className="x-label">{xLabel}</h3>
    </div>
  );
};
const Bar = ({ value, label = value.toString(), maxValue, negativeNumbers }: BarProps) => {
  const [hovered, setHovered] = useState(false);
  const barHeight = Math.abs(value / maxValue) * 100;
  return (
    <div
      className={`bar ${hovered ? "hovered" : ""}`}
      style={
        negativeNumbers
          ? {
              height: `${barHeight / 2}%`,
              transform: value < 0 ? "translateY(50%)" : "translateY(-50%)",
            }
          : { height: `${barHeight}%` }
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`bar-top-label ${hovered ? "hovered" : ""}`}>{value}</div>
      <div
        className={`bar-color ${hovered ? "hovered" : " "} ${value < 0 ? "negative" : " "}`}
      ></div>
      <div className={`bar-label ${hovered ? "hovered" : " "}`}>{label}</div>
    </div>
  );
};
function App() {
  const [values, setValues] = useState([90, 85, 32, 90]);
  const [label, setLabel] = useState(["Jan", "Feb", "Mar", "Apr"]);
  const [numTicks, setNumTicks] = useState(10);
  const [yLabel, setYLabel] = useState("Love (out of 100).");
  const [xLabel, setXLabel] = useState("Month");
  const [title, setTitle] = useState("How much I love each month.");
  const [darkMode, setDarkMode] = useState(false);
  return (
    <>
      <div className="demo-container">
        <BarGraph
          values={values}
          labels={label}
          numTicks={numTicks}
          yLabel={yLabel}
          xLabel={xLabel}
          title={title}
          darkMode={darkMode}
        />
      </div>
      <div className="testing-control-board">
        <div className="testing-control">
          <label>Values:</label>
          <input
            defaultValue={values.toString()}
            type="text"
            onChange={(e) => setValues(e.target.value.split(",").map(Number))}
          />
        </div>
        <div className="testing-control">
          <label>Labels:</label>
          <input
            defaultValue={label.toString()}
            type="text"
            onChange={(e) => {
              // If the input is empty, set the label to an empty array rather than an array with an empty string
              if (e.target.value.length == 0) setLabel([]);
              else setLabel(e.target.value.split(","));
            }}
          />
        </div>
        <div className="testing-control">
          <label>NumTicks:</label>
          <input
            defaultValue={numTicks}
            type="text"
            onChange={(e) => setNumTicks(parseInt(e.target.value))}
          />
        </div>
        <div className="testing-control">
          <label>Title:</label>
          <input defaultValue={title} type="text" onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="testing-control">
          <label>X-Label:</label>
          <input defaultValue={xLabel} type="text" onChange={(e) => setXLabel(e.target.value)} />
        </div>
        <div className="testing-control">
          <label>Y-Label:</label>
          <input defaultValue={yLabel} type="text" onChange={(e) => setYLabel(e.target.value)} />
        </div>
        <div className="testing-control">
          <label>Dark mode:</label>
          <input type="checkbox" onChange={(e) => setDarkMode(e.target.checked)} />
        </div>
      </div>
    </>
  );
}

export default App;
