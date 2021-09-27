import "./App.css";
import Data from "./Data";

function App({ data, onChange }) {
  return (
    <>
      <Data authObj={data} onChange={onChange} />
    </>
  );
}

export default App;
