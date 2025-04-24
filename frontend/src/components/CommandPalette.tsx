import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "cmdk";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleGenerateSample = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_API_BASE_URL}/generate-sample-data`);
      toast({
        title: "Success",
        description: "Sample data generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate sample data",
        variant: "destructive",
      });
    }
  };

  const handleSimulateCardUpdate = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/card-update`);
      const affectedMerchants = res.data.affected_merchants || [];
      toast({
        title: "Card Update Simulation",
        description: affectedMerchants.length > 0
          ? `Merchants needing card update: ${affectedMerchants.join(", ")}`
          : "No merchants need card updates",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to simulate card update",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => navigate("/")}>
                Go to Dashboard
              </CommandItem>
              <CommandItem onSelect={() => navigate("/transactions")}>
                Go to Transactions
              </CommandItem>
              <CommandItem onSelect={() => navigate("/notifications")}>
                Go to Notifications
              </CommandItem>
              <CommandItem onSelect={() => navigate("/analytics")}>
                Go to Analytics
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Actions">
              <CommandItem onSelect={handleGenerateSample}>
                Generate Sample Data
              </CommandItem>
              <CommandItem onSelect={handleSimulateCardUpdate}>
                Simulate Card Update
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
} 