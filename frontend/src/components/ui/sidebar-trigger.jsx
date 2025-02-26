import { Menu } from "lucide-react";
import { Button } from "./button";
import { useSidebar } from "../providers/use-sidebar";

export function SidebarTrigger() {
  const { setIsOpen } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden"
      onClick={() => setIsOpen((prev) => !prev)}
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
} 