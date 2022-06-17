import "App.css";
import Data from "Data";

function App({ data, onChange }) {
  return (
    <div style={{ margin: 10 }}>
      <Data authObj={data} onChange={onChange} />
    </div>
  );
}

export default App;
