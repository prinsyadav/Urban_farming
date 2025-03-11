import { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

export const PlotContext = createContext();

export const PlotProvider = ({ children }) => {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all plots
  const fetchPlots = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/plots");
      if (!response.ok) {
        throw new Error("Failed to fetch plots");
      }
      const data = await response.json();
      setPlots(data.data || []);
    } catch (error) {
      console.error("Error fetching plots:", error);
      toast.error("Failed to load plots data");
    } finally {
      setLoading(false);
    }
  };

  // Add a new plot
  const addPlot = async (plotData) => {
    try {
      const response = await fetch("http://localhost:3000/api/plots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(plotData),
      });

      if (!response.ok) {
        throw new Error("Failed to add plot");
      }

      await fetchPlots(); // Refresh plots after adding
      return { success: true };
    } catch (error) {
      console.error("Error adding plot:", error);
      toast.error("Failed to add plot");
      return { success: false, error: error.message };
    }
  };

  // Delete a plot
  const deletePlot = async (plotId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/plots/${plotId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete plot");
      }

      await fetchPlots(); // Refresh plots after deletion
      return { success: true };
    } catch (error) {
      console.error("Error deleting plot:", error);
      toast.error("Failed to delete plot");
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchPlots();
  }, []);

  return (
    <PlotContext.Provider
      value={{
        plots,
        loading,
        fetchPlots,
        addPlot,
        deletePlot,
      }}
    >
      {children}
    </PlotContext.Provider>
  );
};

export const usePlot = () => useContext(PlotContext);
