import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ChildProvider } from "@/contexts/ChildContext";
import HomePage from "@/pages/HomePage";
import ReadingZonePage from "@/pages/ReadingZonePage";
import MathZonePage from "@/pages/MathZonePage";
import GamePage from "@/pages/GamePage";
import ProfilePage from "@/pages/ProfilePage";
import RewardsPage from "@/pages/RewardsPage";
import ParentDashboard from "@/pages/ParentDashboard";
import ChildManagement from "@/pages/ChildManagement";
import Layout from "@/components/organisms/Layout";
function App() {
  return (
<ChildProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="math" element={<MathZonePage />} />
              <Route path="reading" element={<ReadingZonePage />} />
              <Route path="game/:levelId" element={<GamePage />} />
              <Route path="rewards" element={<RewardsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="parent" element={<ParentDashboard />} />
              <Route path="parent/manage-children" element={<ChildManagement />} />
            </Route>
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            style={{ zIndex: 9999 }}
          />
        </div>
      </BrowserRouter>
    </ChildProvider>
  );
}

export default App;