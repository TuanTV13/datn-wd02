import React from "react";
import ReactDOM from "react-dom";
import AddressForm from "./components/addressform";

const App = () => {
  return (
    <div>
      <h1>Form chọn địa chỉ</h1>
      <AddressForm />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
export default App;