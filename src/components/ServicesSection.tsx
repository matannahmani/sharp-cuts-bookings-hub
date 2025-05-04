
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { getServices } from "@/services/servicesService";
import { useToast } from "@/components/ui/use-toast";

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  category: string;
}

export const ServicesSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [servicesByCategory, setServicesByCategory] = useState<Record<string, Service[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const response = await getServices();
        
        setServices(response.services);
        
        // Group services by category
        const grouped = response.services.reduce((acc, service) => {
          if (!acc[service.category]) {
            acc[service.category] = [];
          }
          acc[service.category].push(service);
          return acc;
        }, {} as Record<string, Service[]>);
        
        setServicesByCategory(grouped);
        
        toast({
          title: "Services Loaded",
          description: `Retrieved ${response.services.length} services from the database.`,
        });
      } catch (error) {
        console.error("Error fetching services:", error);
        toast({
          title: "Error",
          description: "Failed to load services. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-barbershop-gold" />
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
        <Card key={category} className="overflow-hidden">
          <div className="bg-barbershop-dark text-barbershop-light p-4">
            <h3 className="text-xl font-bold text-barbershop-gold">{category}</h3>
          </div>
          <CardContent className="p-0">
            {categoryServices.map((service, index) => (
              <div key={service.id}>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold">{service.name}</h4>
                    <span className="font-bold text-barbershop-gold">${service.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <p>{service.description}</p>
                    <span>{service.duration} min</span>
                  </div>
                </div>
                {index < categoryServices.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      
      {Object.keys(servicesByCategory).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No services available
        </div>
      )}
    </div>
  );
};
