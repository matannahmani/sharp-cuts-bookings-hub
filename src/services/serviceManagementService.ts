
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

interface ServiceCreateInput {
  name: string;
  description?: string | null;
  price: number;
  duration: number;
  category: string;
}

interface ServiceResponse {
  success: boolean;
  service?: Service;
  error?: string;
}

interface ServicesResponse {
  services: Service[];
  timestamp: string;
}

// Get all services using the Hono API
export const fetchServices = async (): Promise<ServicesResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('services-api', {
      method: 'GET',
      path: '/services'
    });
    
    if (error) {
      console.error("Error fetching services:", error);
      throw new Error(error.message);
    }
    
    return data as ServicesResponse;
  } catch (error) {
    console.error("Failed to fetch services:", error);
    throw error;
  }
};

// Create a new service
export const createService = async (serviceData: ServiceCreateInput): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('services-api', {
      method: 'POST',
      path: '/services',
      body: serviceData
    });
    
    if (error) {
      console.error("Error creating service:", error);
      throw new Error(error.message);
    }
    
    return data as ServiceResponse;
  } catch (error: any) {
    console.error("Failed to create service:", error);
    throw error;
  }
};

// Update a service
export const updateService = async (id: string, serviceData: Partial<ServiceCreateInput>): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('services-api', {
      method: 'PUT',
      path: `/services/${id}`,
      body: serviceData
    });
    
    if (error) {
      console.error("Error updating service:", error);
      throw new Error(error.message);
    }
    
    return data as ServiceResponse;
  } catch (error: any) {
    console.error("Failed to update service:", error);
    throw error;
  }
};

// Delete a service
export const deleteService = async (id: string): Promise<ServiceResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('services-api', {
      method: 'DELETE',
      path: `/services/${id}`
    });
    
    if (error) {
      console.error("Error deleting service:", error);
      throw new Error(error.message);
    }
    
    return data as ServiceResponse;
  } catch (error: any) {
    console.error("Failed to delete service:", error);
    throw error;
  }
};
