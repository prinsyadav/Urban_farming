import React from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Map,
  Sprout,
  Calendar,
  RotateCw,
  Droplets,
  Users,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileNav({
  activeTab,
  setActiveTab,
  showFarmers = false,
  className,
}) {
  return (
    <div className={`md:hidden ${className}`}>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Menu className="h-4 w-4" />
            <span>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <div className="py-4">
            <div className="space-y-1 flex flex-col">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("overview")}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" /> Overview
              </Button>
              <Button
                variant={activeTab === "plots" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("plots")}
              >
                <Map className="h-4 w-4 mr-2" /> Plots
              </Button>
              <Button
                variant={activeTab === "crops" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("crops")}
              >
                <Sprout className="h-4 w-4 mr-2" /> Crops
              </Button>
              <Button
                variant={activeTab === "schedule" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("schedule")}
              >
                <Calendar className="h-4 w-4 mr-2" /> Schedules
              </Button>
              <Button
                variant={activeTab === "rotations" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("rotations")}
              >
                <RotateCw className="h-4 w-4 mr-2" /> Rotations
              </Button>
              <Button
                variant={activeTab === "activities" ? "default" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab("activities")}
              >
                <Droplets className="h-4 w-4 mr-2" /> Activities
              </Button>
              {showFarmers && (
                <Button
                  variant={activeTab === "farmers" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveTab("farmers")}
                >
                  <Users className="h-4 w-4 mr-2" /> Farmers
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function MobileTabIndicator({ activeTab }) {
  return (
    <div className="md:hidden mb-4">
      <div className="bg-card p-2 rounded-md border flex items-center gap-2">
        {activeTab === "overview" && <LayoutDashboard className="h-4 w-4" />}
        {activeTab === "plots" && <Map className="h-4 w-4" />}
        {activeTab === "crops" && <Sprout className="h-4 w-4" />}
        {activeTab === "schedule" && <Calendar className="h-4 w-4" />}
        {activeTab === "rotations" && <RotateCw className="h-4 w-4" />}
        {activeTab === "activities" && <Droplets className="h-4 w-4" />}
        {activeTab === "farmers" && <Users className="h-4 w-4" />}
        <span className="text-sm font-medium">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </span>
      </div>
    </div>
  );
}
