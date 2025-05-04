
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { fetchServices, createService, updateService, deleteService } from "@/services/serviceManagementService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ServiceForm } from "@/components/ServiceForm";
import { Separator } from "@/components/ui/separator";

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

const ServiceManagement = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [servicesByCategory, setServicesByCategory] = useState<Record<string, Service[]>>({});
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth/login');
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadServices();
    }
  }, [user]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await fetchServices();
      
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
    } catch (error) {
      console.error("Error loading services:", error);
      toast({
        title: "Error",
        description: "Failed to load services. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (serviceData: any) => {
    try {
      await createService(serviceData);
      toast({
        title: "Success",
        description: "Service added successfully!",
      });
      loadServices();
      setIsFormOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add service.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateService = async (serviceData: any) => {
    if (!editingService) return;
    
    try {
      await updateService(editingService.id, serviceData);
      toast({
        title: "Success",
        description: "Service updated successfully!",
      });
      loadServices();
      setIsFormOpen(false);
      setEditingService(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update service.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(id);
        toast({
          title: "Success",
          description: "Service deleted successfully!",
        });
        loadServices();
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete service.",
          variant: "destructive",
        });
      }
    }
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const openAddDialog = () => {
    setEditingService(null);
    setIsFormOpen(true);
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-barbershop-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-barbershop-dark">Service Management</h1>
          <Button 
            onClick={openAddDialog} 
            className="bg-barbershop-gold hover:bg-barbershop-gold/90 text-barbershop-dark"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Service
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center my-12">
            <Loader2 className="h-8 w-8 animate-spin text-barbershop-gold" />
          </div>
        ) : (
          <div className="grid gap-8">
            {Object.entries(servicesByCategory).length > 0 ? (
              Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                <Card key={category}>
                  <CardHeader className="bg-barbershop-dark text-barbershop-light py-4">
                    <CardTitle className="text-xl font-bold text-barbershop-gold">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {categoryServices.map((service, index) => (
                      <div key={service.id}>
                        <div className="p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <h4 className="font-semibold">{service.name}</h4>
                                <span className="font-bold text-barbershop-gold">${service.price}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm text-gray-500">
                                <p>{service.description || 'No description'}</p>
                                <span>{service.duration} min</span>
                              </div>
                            </div>
                            <div className="flex items-center ml-4 space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => openEditDialog(service)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700 hover:bg-red-50" 
                                onClick={() => handleDeleteService(service.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {index < categoryServices.length - 1 && <Separator />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">No services found</h3>
                <p className="text-gray-500 mb-4">Start by adding your first service.</p>
                <Button 
                  onClick={openAddDialog}
                  className="bg-barbershop-gold hover:bg-barbershop-gold/90 text-barbershop-dark"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add New Service
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>
          <ServiceForm 
            service={editingService} 
            onSubmit={editingService ? handleUpdateService : handleAddService}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingService(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceManagement;
