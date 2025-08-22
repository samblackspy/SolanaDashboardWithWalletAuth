"use client";

import { useDashboard } from "@/context/DashboardDataProvider";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ApiKeyModal } from "@/components/dashboard/ApiKeyModal";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

export default function DashboardPage() {
  const { apiKey, isKeyInitialized } = useDashboard();

  if (!isKeyInitialized) {
    return <LoadingScreen />;
  }

  if (!apiKey) {
    return <ApiKeyModal />;
  }

  return <DashboardLayout />;
}
