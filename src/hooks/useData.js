import { useState, useEffect, useCallback, useRef } from "react";

export const useData = (serviceMethod) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isMountedRef = useRef(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await serviceMethod();
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setData(result || []);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message || "Failed to load data");
        setData([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [serviceMethod]);

  useEffect(() => {
    isMountedRef.current = true;
    loadData();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMountedRef.current = false;
    };
  }, [loadData]);

  return { data, loading, error, reload: loadData, setData };
};