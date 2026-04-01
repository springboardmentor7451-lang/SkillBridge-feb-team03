// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Profile from "./pages/Profile";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/profile" element={<Profile />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import MovingCloudBackground from "./components/MovingCloudBackground";

export default function App() {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} disableTransitionOnChange storageKey="skillbridge-theme">
      <AuthProvider>
        <SocketProvider>
          <div className="relative min-h-screen">
            <MovingCloudBackground />
            <div className="relative z-10">
              <AppRoutes />
              <Toaster position="top-right" richColors />
            </div>
          </div>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

