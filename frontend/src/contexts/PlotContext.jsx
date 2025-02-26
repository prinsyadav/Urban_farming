import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const PlotContext = createContext();

export function PlotProvider({ children }) {
  const [plots, setPlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlots();
  }, []);

  const fetchPlots = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/plots");
      if (!response.ok) {
        throw new Error("Failed to fetch plots");
      }
      const data = await response.json();
      setPlots(data.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching plots:", err);
      setError("Failed to load plots");
    } finally {
      setIsLoading(false);
    }
  };

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
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add plot");
      }

      const newPlot = await response.json();
      setPlots([...plots, newPlot.data]);
      toast.success("Plot added successfully");
      return newPlot.data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

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

      setPlots(plots.filter((plot) => plot.plot_id !== plotId));
      toast.success("Plot deleted successfully");
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  const updatePlot = async (plotId, plotData) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/plots/${plotId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(plotData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update plot");
      }

      const updatedPlot = await response.json();
      setPlots(
        plots.map((plot) => (plot.plot_id === plotId ? updatedPlot.data : plot))
      );
      toast.success("Plot updated successfully");
      return updatedPlot.data;
    } catch (err) {
      toast.error(err.message);
      throw err;
    }
  };

  return (
    <PlotContext.Provider
      value={{
        plots,
        isLoading,
        error,
        fetchPlots,
        addPlot,
        deletePlot,
        updatePlot,
      }}
    >
      {children}
    </PlotContext.Provider>
  );
}

export function usePlot() {
  const context = useContext(PlotContext);
  if (context === undefined) {
    throw new Error("usePlot must be used within a PlotProvider");
  }
  return context;
}
