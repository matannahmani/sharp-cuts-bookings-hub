
import { Navbar } from "@/components/Navbar";
import { ReservationForm } from "@/components/ReservationForm";
import { ServicesSection } from "@/components/ServicesSection";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-barbershop-dark text-barbershop-light py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Sharp Cuts Barbershop</h1>
          <p className="text-xl mb-8">Experience the finest in men's grooming</p>
          <Button className="bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-cream">
            Book Now
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-barbershop-cream">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-barbershop-dark">Our Services</h2>
          <ServicesSection />
        </div>
      </section>

      {/* Reservation Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-barbershop-dark">Book an Appointment</h2>
          <ReservationForm />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-barbershop-dark text-barbershop-light">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
          <div className="space-y-4">
            <p>123 Main Street, Your City</p>
            <p>Phone: (555) 123-4567</p>
            <p>Email: info@sharpcuts.com</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
