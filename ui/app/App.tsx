import { Page, AppHeader } from "@dynatrace/strato-components-preview/layouts";
import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import { Data } from "./pages/Data";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { HostList } from "./pages/Host.List";
HostList
export const App = () => {
  return (
    <Page>
      <Page.Header>
        <AppHeader>
          <AppHeader.NavItems>
            <AppHeader.AppNavLink as={Link} to="/" />
          </AppHeader.NavItems>
        </AppHeader>
      </Page.Header>
      <Page.Main>
        <Routes>
          <Route path="/" element={<HostList />} />
        </Routes>
      </Page.Main>
    </Page>
  );
};
