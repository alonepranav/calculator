import { useRef, useState } from "react";
import "./App.css";

function App() {
  const inputRef = useRef(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [a, setA] = useState(false);
  const [h, setH] = useState(false);

  const getHistory = () => {
    const storage = JSON.parse(sessionStorage.getItem("calculator"));
    return storage || [];
  };

  const setHistory = (cal) => {
    const storage = JSON.parse(sessionStorage.getItem("calculator"));

    if (storage === null)
      sessionStorage.setItem(
        "calculator",
        JSON.stringify(
          storage === null
            ? [
                {
                  calculaton: cal,
                },
              ]
            : [
                ...storage,
                {
                  calculaton: cal,
                },
              ]
        )
      );
    else {
      sessionStorage.setItem(
        "calculator",
        JSON.stringify([
          ...storage,
          {
            calculaton: cal,
          },
        ])
      );
    }
  };

  const handleButtonClick = (button) => {
    if (
      ![
        "1",
        "2",
        ".",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "+",
        "-",
        "(",
        ")",
        "*",
        "/",
        "%",
        "=",
        "AC",
        "()",
        ".",
        "<",
        "Enter",
        "Backspace",
      ].includes(button)
    ) {
      return;
    }

    if (button === "<") {
      if (input.length > 0) setInput(input.substring(0, input.length - 1));
      return;
    }

    // inputRef.current.focus();
    setError(false);

    const getCount = (char) => {
      let n = 0;
      for (let i = 0; i < input.length; i++) if (input[i] === char) n++;
      return n;
    };

    if (button === ".") {
      if (!isNaN(input[input.length - 1])) setInput(input + button + "");
      return;
    }

    if (button === "AC")
      // All Clear
      setInput("");
    // -----------------------------------------------------------------------
    // Delete One last character
    else if (button === "<" || button === "Backspace") {
      if (error) {
        setInput("");
      } else setInput(input.slice(0, input.length - 1));
    }
    // Display the result
    // -----------------------------------------------------------------------
    else if (button === "=" || button === "Enter") {
      const left = getCount("(");
      const right = getCount(")");

      if (left === right) {
        if (input) {
          try {
            const answer = eval(input);
            setHistory(input);
            setInput(answer + "");
          } catch (err) {
            setError(true);
            console.log(err);
          }
        }
      }
      // -----------------------------------------------------------------------
      else {
        if (left > right) {
          const n = left - right;
          const close = () => {
            let k = "";
            for (let i = 0; i < n; i++) k += ")";
            return k;
          };
          try {
            console.log(input + close());
            const x = input + close();
            const answer = eval(x);
            setInput(answer + "");
          } catch (err) {
            console.log(err);
            setError(true);
          }
        }
      }
    } else if (!isNaN(button)) {
      setInput(input + button);
    } else if (button === "()" || button === "(" || button === ")") {
      const left = getCount("(");
      const right = getCount(")");

      if (!isNaN(input[input.length - 1])) {
        if (left > right) {
          setA(true);
          setInput(input + ")");
        } else {
          setA(false);
          if (!isNaN(input[input.length - 1])) {
            setInput(input + "*(");
          } else setInput(input + "(");
        }
      } else {
        if (left !== right && a) setInput(input + ")");
        else {
          setA(false);
          if (input[input.length - 1] === ")") setInput(input + "*(");
          else setInput(input + "(");
        }
      }
    } else {
      if (["+", "-", "*", "/", "%"].includes(button)) {
        if (["+", "-", "*", "/", "%", "("].includes(input[input.length - 1])) {
          const temp = input.replace(input[input.length - 1], button);
          setInput(temp);
          return;
        }
        if (["("].includes(input[input.length - 1])) {
          return;
        }
        if (input.length === 0 && button === "-") {
          setInput(input + button);
        } else {
          if (!(input.length === 0)) setInput(input + button);
        }
      }
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen w-screen bg-gradient-to-tl from-cyan-400  via-blue-400 to-purple-600">
        <div className="mb-5 text-white">
          <h1 className="text-center font-semibold mb-2 text-4xl">
            Calculator App
          </h1>
          <p className="text-xl font-semibold">
            Developer :{" "}
            <a href="https://instagram.com/pranavshilavane" target="_blank">
              @PranavShilavane
            </a>
          </p>
        </div>
        <div className="bg-white p-2 w-[330px]">
          <div className="bg-gray-100 py-2 px-1 h-24">
            <input
              type="text"
              ref={inputRef}
              autoFocus
              value={error ? "Format error..." : input}
              onKeyDown={(e) => {
                if (true) handleButtonClick(e.nativeEvent.key);
              }}
              onChange={(e) => {}}
              className={`w-full pr-1 outline-none bg-inherit bg-gray-100 h-11 text-right ${
                input.length < 12 ? "text-5xl" : "text-3xl"
              } ${error ? "text-red-400" : ""}          `}
            />
            <p className="text-right mt-2 text-xl">
              {(() => {
                try {
                  const answer = eval(input);
                  return answer;
                } catch (err) {
                  return "";
                }
              })()}
            </p>
          </div>
          <div className="grid grid-cols-4 bg-white p-2">
            {[
              "AC",
              "()",
              "%",
              "/",
              7,
              8,
              9,
              "*",
              4,
              5,
              6,
              "-",
              1,
              2,
              3,
              "+",
              0,
              ".",
              "<",
              "=",
            ].map((text, i) => {
              return (
                <button
                  key={i}
                  className="inline-flex justify-center items-center w-14 h-14 m-1 text-2xl font-semibold bg-gray-100 rounded-full hover:bg-emerald-300"
                  onClick={() => handleButtonClick(text + "")}
                >
                  {text}
                </button>
              );
            })}
          </div>
          <button
            className="px-2.5 bg-blue-600 text-white py-1 ml-4 my-3 tracking-wider"
            onClick={() => setH(!h)}
          >
            History
          </button>
          <div>
            {h === true ? (
              <ul className="bg-stone-100 my-2 mx-4">
                {getHistory().map((t, i) => (
                  <li className="list-disc list-inside" key={i}>
                    {t.calculaton} = {eval(t.calculaton)}
                  </li>
                ))}
              </ul>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
