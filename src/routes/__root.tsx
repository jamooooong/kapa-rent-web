import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import Header from "../components/layout/header";
import Footer from "../components/layout/Footer";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Header />
      <div className="bg-surface h-full min-h-screen pb-24">
        <Outlet />
      </div>
      <Footer />
    </React.Fragment>
  );
}
