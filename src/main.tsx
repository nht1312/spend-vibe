import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import "./index.css";
import { GuidesLayout } from "./ui/layouts/GuidesLayout";
import { GuideCalmSpending } from "./ui/guides/GuideCalmSpending";
import { GuideCoupleFinance } from "./ui/guides/GuideCoupleFinance";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/guides" element={<GuidesLayout />}>
          <Route index element={<GuideCalmSpending />} />
          <Route
            path="quan-ly-chi-tieu-khong-stress"
            element={<GuideCalmSpending />}
          />
          <Route
            path="quan-ly-tai-chinh-vo-chong-khong-cai-nhau"
            element={<GuideCoupleFinance />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
