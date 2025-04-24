
import { useState } from "react";
import { Card } from "@/components/ui/card";

const Dashboard = () => {
  // In a real app, this would fetch from a backend
  const [reservations] = useState([
    {
      id: 1,
      name: "John Doe",
      service: "Haircut",
      date: "2025-04-25",
      time: "10:00",
    },
    {
      id: 2,
      name: "Jane Smith",
      service: "Full Service",
      date: "2025-04-25",
      time: "11:00",
    },
  ]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-barbershop-dark">Reservations Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reservations.map((reservation) => (
          <Card key={reservation.id} className="p-4">
            <h3 className="font-bold text-lg mb-2">{reservation.name}</h3>
            <p>Service: {reservation.service}</p>
            <p>Date: {reservation.date}</p>
            <p>Time: {reservation.time}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
