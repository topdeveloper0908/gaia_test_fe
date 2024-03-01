"use client";
import CustomerDashboard from "@/components/CustomerDashboard";
import React, { Suspense } from "react";
import Cookies from "js-cookie";

export function Customer() {
  const token = Cookies.get("token");
  
  return <CustomerDashboard />;
}

export default function SuspenseUser() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Customer />
    </Suspense>
  );
}
