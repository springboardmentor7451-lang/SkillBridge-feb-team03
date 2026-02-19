import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import VolunteerSignup from "./pages/VolunteerSignup";
import NGOSignup from "./pages/NGOSignup";
import VolunteerLogin from "./pages/VolunteerLogin";
import NGOLogin from "./pages/NGOLogin";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup/volunteer" element={<VolunteerSignup />} />
      <Route path="/signup/ngo" element={<NGOSignup />} />
      <Route path="/login/volunteer" element={<VolunteerLogin />} />
      <Route path="/login/ngo" element={<NGOLogin />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;


