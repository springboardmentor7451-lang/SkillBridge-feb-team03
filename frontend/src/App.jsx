import { BrowserRouter } from "react-router-dom";
import AppRouters from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <AppRouters />
    </BrowserRouter>
  );
}

export default App;