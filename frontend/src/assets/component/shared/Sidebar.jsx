import { useNavigate } from "react-router-dom";
import { Calendar, Home, Inbox, Search, Settings, X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } w-64 bg-white border-r shadow-lg`}
    >
      {/* Close Button for Mobile */}
      <button className="absolute top-3 right-3 md:hidden" onClick={onClose}>
        <X className="w-6 h-6" />
      </button>

      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/")}>
                    <Home className="mr-2 h-5 w-5" />
                    Home
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/about")}>
                    <Inbox className="mr-2 h-5 w-5" />
                    About
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/calendar")}>
                    <Calendar className="mr-2 h-5 w-5" />
                    Calendar
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/search")}>
                    <Search className="mr-2 h-5 w-5" />
                    Search
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
