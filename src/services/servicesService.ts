
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  category: string;
  created_at: string | null;
  updated_at: string | null;
}

interface ServicesResponse {
  services: Service[];
  timestamp: string;
}

export const getServices = async (): Promise<ServicesResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-services');
    
    if (error) {
      console.error("Error fetching services:", error);
      throw new Error(error.message);
    }
    
    return data as ServicesResponse;
  } catch (error) {
    console.error("Failed to get services:", error);
    throw error;
  }
};
