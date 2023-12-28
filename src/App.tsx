import { ToastContainer } from "react-toastify";
import { MarketList } from "./features/market-list";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <MarketList />;
      <ToastContainer
        hideProgressBar={true}
        autoClose={2000}
        position="bottom-center"
      />
    </>
  );
}

export default App;
