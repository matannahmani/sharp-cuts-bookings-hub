
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ReservationForm = () => {
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    date: "",
    time: "",
    service: "",
  });

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('reservations')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Reservation Submitted",
        description: "We'll contact you to confirm your appointment.",
      });

      setFormData({
        client_name: "",
        client_email: "",
        client_phone: "",
        date: "",
        time: "",
        service: "",
      });
    } catch (error) {
      console.error('Error submitting reservation:', error);
      toast({
        title: "Error",
        description: "Could not submit reservation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <Input
        type="text"
        placeholder="Your Name"
        value={formData.client_name}
        onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
        required
      />
      <Input
        type="email"
        placeholder="Email"
        value={formData.client_email}
        onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
        required
      />
      <Input
        type="tel"
        placeholder="Phone"
        value={formData.client_phone}
        onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
        required
      />
      <Input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
      />
      <Input
        type="time"
        value={formData.time}
        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
        required
      />
      <select
        className="w-full p-2 border rounded"
        value={formData.service}
        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
        required
      >
        <option value="">Select Service</option>
        <option value="haircut">Haircut</option>
        <option value="shave">Shave</option>
        <option value="beard-trim">Beard Trim</option>
        <option value="full-service">Full Service</option>
      </select>
      <Button type="submit" className="w-full bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-cream">
        Book Appointment
      </Button>
    </form>
  );
};
