import { useEffect, useState } from 'react'
import "./App.css";

type BarGraphProps = {
  values: number[];
  labels?: string[];
  numTicks?: number;
  yLabel?: string;
  title?: string;
  xLabel?: string;
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
  yLabel: yLabel = "",
  title = "",
  xLabel = "",
}: BarGraphProps) => {
  const [negativeNumbers, setNegativeNumbers] = useState(false);

  useEffect(() => {
    values.forEach((value) => {
      if (value < 0) {
        setNegativeNumbers(true);
        console.log(value);
      }
    });
  }, [values, negativeNumbers]);

  const maxValue = Math.max(...values.map(Math.abs));

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
  const friendlyTick = friendlyDigits.reduce(function (best, cur) {
    return cur - Math.abs(idealTicks) >= 0 &&
      Math.abs(cur) - idealTicks < Math.abs(best) - idealTicks
      ? cur
      : best;
  }, Number.MAX_SAFE_INTEGER);

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
    <div className="bar-graph">
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
  const [values] = useState([90, 85, 32, 90]);
  const [labels] = useState(["Jan", "Feb", "Mar", "Apr"]);
  return (
    <>
      <div className="demo-container">
        <BarGraph
          values={values}
          labels={labels}
          numTicks={10}
          yLabel="Love (out of 100)."
          xLabel="Month"
          title="How much I love each month."
        />
        <div className="testing-control-board">
          <div className="testing-control">
            <label>Values:</label>
            <input type="text" value={values} onChange={(e) => console.log(e.target.value)} />
          </div>
          <div className="testing-control">
            <label>Labels:</label>
            <input type="text" value={labels} onChange={(e) => console.log(e.target.value)} />
          </div>
          <div className="testing-control">
            <label>NumTicks:</label>
            <input type="text" value={10} onChange={(e) => console.log(e.target.value)} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
