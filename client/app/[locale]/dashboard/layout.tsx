'use client';

import DashboardNav from "@/components/DashboardNav";
import { FeedbackProvider } from "@/context/FeedbackContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <FeedbackProvider>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-color1  py-0.5">
        <div className="w-full md:flex-none md:duration-100  md:w-[200px] ">
          <DashboardNav />
        </div>
        <div className="flex-grow p-4 sm:p-6 md:overflow-y-auto md:p-12 md:pt-8 bg-gray-50 text-gray-950 rounded-2xl">
          {children}
        </div>
      </div>
    </FeedbackProvider>
  );
}