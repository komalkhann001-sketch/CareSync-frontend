import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Users, UserSquare2, CalendarClock, Clock, ArrowRight, FileText } from 'lucide-react';
import api from '../utils/api';
import { motion } from 'framer-motion';

import Counter from '../components/Counter';

const StatCard = ({ title, value, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className="h-full"
  >
    <Card className="flex items-center justify-between border-t-4 border-accent luxury-glass card-hover h-full">
      <div className="flex flex-col">
        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent mb-2">{title}</p>
        <h2 className="text-4xl font-black text-primary flex items-baseline gap-1">
          <Counter target={value} />
          <span className="text-xs font-normal text-charcoal/40 uppercase tracking-tighter">Units</span>
        </h2>
      </div>
      <div className="p-4 obsidian-gradient rounded-full text-accent shadow-lg shadow-accent/20">
        {icon}
      </div>
    </Card>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    pending: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [patients, doctors, appointments] = await Promise.all([
          api.get('/patients'),
          api.get('/doctors'),
          api.get('/appointments')
        ]);
        
        setStats({
          patients: patients.data.length,
          doctors: doctors.data.length,
          appointments: appointments.data.length,
          pending: appointments.data.filter(a => a.status === 'Pending').length
        });
        setRecentAppointments(appointments.data.slice(-5).reverse());
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="p-10 ml-64 bg-secondary min-h-screen animate-premium">
      <div className="flex justify-between items-end mb-12">
        <div className="space-y-1">
          <h1 className="text-5xl font-black text-primary tracking-tighter">Clinic <span className="text-accent underline decoration-accent/20 underline-offset-8">Insight</span></h1>
          <p className="text-charcoal/50 font-medium tracking-wide">Excellence in health management & statistics</p>
        </div>
        <div className="text-xs font-black bg-white border-b-2 border-accent text-primary px-6 py-3 rounded-full shadow-md uppercase tracking-widest">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <StatCard title="Total Patients" value={stats.patients} icon={<Users size={30} />} delay={0.1} />
        <StatCard title="Total Doctors" value={stats.doctors} icon={<UserSquare2 size={30} />} delay={0.2} />
        <StatCard title="Total Appointments" value={stats.appointments} icon={<CalendarClock size={30} />} delay={0.3} />
        <StatCard title="Pending Review" value={stats.pending} icon={<Clock size={30} />} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <Card title="Live Appointments Flux" icon={CalendarClock} className="luxury-glass">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-accent font-black border-b border-accent/10">
                    <th className="pb-5 uppercase text-[10px] tracking-widest">Patient Details</th>
                    <th className="pb-5 uppercase text-[10px] tracking-widest">Assigned Specialist</th>
                    <th className="pb-5 uppercase text-[10px] tracking-widest">Time Schedule</th>
                    <th className="pb-5 uppercase text-[10px] tracking-widest">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentAppointments.map((app, i) => (
                    <tr key={i} className="hover:bg-accent/5 transition-all group duration-300">
                      <td className="py-5">
                        <p className="font-black text-primary group-hover:text-accent transition-colors">{app.patientName}</p>
                        <p className="text-[10px] text-charcoal/40 uppercase tracking-tighter">Registered Patient</p>
                      </td>
                      <td className="py-5 font-bold text-charcoal/80 text-sm">{app.doctorId?.name || 'Unassigned'}</td>
                      <td className="py-5">
                        <p className="text-charcoal/70 text-xs font-bold">{app.date}</p>
                        <p className="text-[10px] text-accent font-black">{app.timeSlot}</p>
                      </td>
                      <td className="py-5">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest shadow-sm ${
                          app.status === 'Confirmed' ? 'bg-success/10 text-success border border-success/20' : 
                          app.status === 'Pending' ? 'bg-accent/10 text-accent border border-accent/20' :
                          'bg-error/10 text-error border border-error/20'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentAppointments.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-charcoal/30 flex flex-col items-center gap-2">
                        <Clock size={40} className="mb-2 opacity-10" />
                        <span className="font-black uppercase tracking-widest text-xs">No Recent Flux Data</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        <div className="space-y-8">
          <Card title="Executive Actions" icon={ArrowRight} className="luxury-glass border-t-4 border-accent">
            <div className="space-y-5">
              <button className="w-full flex items-center justify-between p-5 obsidian-gradient rounded-2xl transition-all group shadow-xl hover:shadow-accent/20 border border-white/5 active:scale-95">
                <span className="font-black text-xs uppercase tracking-widest text-white group-hover:text-accent transition-colors">Schedule Appointment</span>
                <CalendarClock className="text-accent group-hover:rotate-12 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-5 border-2 border-accent/20 bg-white hover:bg-accent/5 rounded-2xl transition-all group active:scale-95">
                <span className="font-black text-xs uppercase tracking-widest text-primary">Onboard Patient</span>
                <Users className="text-accent group-hover:scale-110 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-5 border-2 border-primary/10 bg-white hover:bg-primary/5 rounded-2xl transition-all group active:scale-95">
                <span className="font-black text-xs uppercase tracking-widest text-primary">Generate Report</span>
                <FileText className="text-primary group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
