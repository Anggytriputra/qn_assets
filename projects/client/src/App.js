import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import AssetTools from "./pages/AssetAndTools/AssetTools";
import SideBar from "./components/SideBar";

import Testing from "./pages/Testing";
import DataAsset from "./pages/AssetAndTools/DataAsset";
import DetailsAsset from "./pages/DetailsAsset";
import SearchByAssetName from "./pages/SearchByAssetName";
import { useState } from "react";
import { Modal } from "./components/Modal";
import RequestAsset from "./pages/RequestAsset";
import TransferAsset from "./pages/AssetAndTools/TransferAsset";
import DetailTransferAsset from "./pages/DetailTransferAsset";
import ReturnAsset from "./pages/AssetAndTools/ReturnAsset";
import ProtectedPage from "./midlleware/ProtectedPage";
import DetailReturnAsset from "./pages/DetailReturnAsset";
import SettingsAssetName from "./pages/settings/SettingsAssetName";
import ProtectedPageSuperAdmin from "./midlleware/ProtectedPageSuperAdmin";
import RoleAccess from "./pages/settings/RoleAccess";
import JenisAsset from "./pages/settings/JenisAsset";
// import DetailsAsset from "./components/DetailsAsset";

const dataurl = [
  { id: 1, url_master: "/", name: "Login" },
  { id: 2, url_master: "/home", name: "Home" },
  { id: 3, url_master: "/dashboard", name: "Dashboard" },
  { id: 4, url_master: "/asset-tools", name: "AssetTools" },
  { id: 5, url_master: "/settings/asset-name", name: "SettingsAssetName" },
  { id: 6, url_master: "/report", name: "Report" },
  { id: 7, url_master: "/asset-tools/data-assets", name: "DataAsset" },
  { id: 8, url_master: "/asset-tools/search", name: "SearchIdAsset" },
  { id: 9, url_master: "/request-asset", name: "RequestAsset" },
  { id: 10, url_master: "/asset-tools/transfer-assets", name: "TransferAsset" },
  {
    id: 11,
    url_master: "/asset-tools/return-assets",
    name: "ReturnAsset",
  },
  { id: 12, url_master: "/testing", name: "Testing" },
  { id: 13, url_master: "/setting/jenis-asset", name: "JenisAsset" },
  { id: 14, url_master: "/setting/role-access", name: "RoleAccess" },
  // {
  //   id: 9,
  //   url_master: `/asset-tools/search/Details/:assetId`,
  //   name: "DetailAsset",
  // },
];

const PAGES = {
  Login: <Login />,
  Dashboard: <SideBar element={<Dashboard />} />,
  Home: <SideBar element={<Home />} />,
  Dashboard: <SideBar element={<Dashboard />} />,
  AssetTools: <AssetTools />,
  Report: <Report />,
  Testing: <SideBar element={<Testing />} />,
  SearchIdAsset: <SideBar element={<SearchByAssetName />} />,
  DetailAsset: <SideBar element={<DetailsAsset />} />,
  DataAsset: <SideBar element={<DataAsset />} />,
  TransferAsset: <SideBar element={<TransferAsset />} />,
  RequestAsset: <SideBar element={<RequestAsset />} />,
  ReturnAsset: (
    <SideBar
      element={
        <ProtectedPage adminOnly={true}>
          <ReturnAsset />
        </ProtectedPage>
      }
    />
  ),
  SettingsAssetName: (
    <SideBar
      element={
        <ProtectedPageSuperAdmin adminOnly={true}>
          <SettingsAssetName />
        </ProtectedPageSuperAdmin>
      }
    />
  ),
  JenisAsset: (
    <SideBar
      element={
        <ProtectedPageSuperAdmin adminOnly={true}>
          <JenisAsset />
        </ProtectedPageSuperAdmin>
      }
    />
  ),
  RoleAccess: (
    <SideBar
      element={
        <ProtectedPageSuperAdmin adminOnly={true}>
          <RoleAccess />
        </ProtectedPageSuperAdmin>
      }
    />
  ),
};

function App() {
  const [openModal, setOpenModal] = useState(false);
  // console.log("open moda App", openModal);
  const location = useLocation();

  return (
    <div className="min-h-full flex flex-col">
      <Routes>
        {dataurl.map((url) => {
          return (
            <Route
              key={url.id}
              path={url.url_master}
              element={PAGES[url.name]}
            />
          );
        })}

        <Route
          path="/asset-tools/search/Details/:assetId"
          element={<SideBar element={<DetailsAsset />} />}
        />
        <Route
          path="/asset-tools/Detail-transfer/:assetId"
          element={<SideBar element={<DetailTransferAsset />} />}
        />

        <Route
          path="/asset-tools/Detail-Return/:assetId"
          element={<SideBar element={<DetailReturnAsset />} />}
        />
        {/* <Route  */}
      </Routes>
    </div>
  );
}

export default App;
