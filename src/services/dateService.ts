
import { supabase } from "@/integrations/supabase/client";

interface ServerDateResponse {
  date: string;
  formattedDate: string;
  timestamp: number;
}

export const getServerDate = async (): Promise<ServerDateResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-current-date');
    
    if (error) {
      console.error("Error fetching server date:", error);
      throw new Error(error.message);
    }
    
    return data as ServerDateResponse;
  } catch (error) {
    console.error("Failed to get server date:", error);
    throw error;
  }
};
