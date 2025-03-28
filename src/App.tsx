import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import WalletConnectError from "./components/alerts/WalletConnectError";
import "./App.css";
import MyApps from "./pages/myapps/myapps";
import AppReviews from "./pages/myapps/appReviews";
import AppStatsAdmin from "./pages/myapps/appStatistics";
import AppAirdrops from "./pages/myapps/airdrop/appAirdrops";
import AppUpdates from "./pages/myapps/appUpdates";
import Ownerchange from "./pages/myapps/changeOwner";
import AirdropInfo from "./pages/myapps/airdrop/airdropInfo";
import UserMessages from "./pages/messages/messages";
import AppOwnerMessage from "./pages/myapps/message";
import FeaturesBugsAdmin from "./pages/myapps/featurebugs";
import BugReportsAdmin from "./pages/myapps/bugsreport";
import AostoreAi from "./pages/myapps/aostoreai";
import TasksAdmin from "./pages/myapps/tasks";

function App() {
  const [theme, setTheme] = useState("");
  const [activeIndex, setActiveIndex] = useState(0); //sidebar's active index
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Load the Default theme into the local Storage
  useEffect(() => {
    // save the active index to local storage
    const savedIndex = localStorage.getItem("activeIndex");
    if (savedIndex) {
      setActiveIndex(Number(savedIndex));
    }

    // Add delay transition to root to match sidebar and navbar
    const root = document.getElementById("root");
    root?.classList.add("transition-colors");
    root?.classList.add("duration-300");

    // Check for saved user preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    } else {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Check if user has connected to Arweave Wallet
  const walletAddress = localStorage.getItem("walletAddress");

  return (
    <Router>
      <div className="flex h-screen w-screen">
        <Sidebar
          theme={theme}
          updateTheme={setTheme}
          activeIndex={activeIndex}
          updateActiveIndex={setActiveIndex}
          isCollapsed={isCollapsed}
        />
        <div className="nav-content flex-grow">
          <Navbar
            theme={theme}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
          {/* Pages Content go here */}
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="messages"
              element={
                walletAddress ? <UserMessages /> : <WalletConnectError />
              }
            />

            <Route
              path="/projectairdropsadmin/:AppId"
              element={walletAddress ? <AppAirdrops /> : <WalletConnectError />}
            />

            <Route
              path="/projectreviews/:AppId"
              element={walletAddress ? <AppReviews /> : <WalletConnectError />}
            />
            <Route
              path="/projectstats/:AppId"
              element={
                walletAddress ? <AppStatsAdmin /> : <WalletConnectError />
              }
            />
            <Route
              path="/projectfeaturesbugs/:AppId"
              element={
                walletAddress ? <FeaturesBugsAdmin /> : <WalletConnectError />
              }
            />

            <Route
              path="/projectbugreports/:AppId"
              element={
                walletAddress ? <BugReportsAdmin /> : <WalletConnectError />
              }
            />
            <Route
              path="/projectaostoreai/:AppId"
              element={walletAddress ? <AostoreAi /> : <WalletConnectError />}
            />
            <Route
              path="/projecttasks/:AppId"
              element={walletAddress ? <TasksAdmin /> : <WalletConnectError />}
            />
            <Route
              path="/projectairdrops/:AppId"
              element={walletAddress ? <AppAirdrops /> : <WalletConnectError />}
            />
            <Route
              path="/projectupdates/:AppId"
              element={walletAddress ? <AppUpdates /> : <WalletConnectError />}
            />

            <Route
              path="/ownerchange/:AppId"
              element={walletAddress ? <Ownerchange /> : <WalletConnectError />}
            />
            <Route
              path="/sendupdates/:AppId"
              element={
                walletAddress ? <AppOwnerMessage /> : <WalletConnectError />
              }
            />
            <Route
              path="/airdropinfo/:AirdropId"
              element={walletAddress ? <AirdropInfo /> : <WalletConnectError />}
            />

            <Route
              path="myapps"
              element={walletAddress ? <MyApps /> : <WalletConnectError />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
