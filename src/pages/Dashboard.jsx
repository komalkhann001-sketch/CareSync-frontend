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
    <div className="p-6 md:p-10 bg-secondary min-h-screen animate-premium">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black text-primary tracking-tighter">
            Clinic <span className="text-accent underline decoration-accent/20 underline-offset-8">Insight</span>
          </h1>
          <p className="text-charcoal/50 text-sm md:text-base font-medium tracking-wide">Excellence in health management & statistics</p>
        </div>
        <div className="text-[10px] md:text-xs font-black bg-white border-b-2 border-accent text-primary px-4 md:px-6 py-2 md:py-3 rounded-full shadow-md uppercase tracking-widest whitespace-nowrap">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
        <StatCard title="Total Patients" value={stats.patients} icon={<Users size={30} />} delay={0.1} />
        <StatCard title="Total Doctors" value={stats.doctors} icon={<UserSquare2 size={30} />} delay={0.2} />
        <StatCard title="Total Appointments" value={stats.appointments} icon={<CalendarClock size={30} />} delay={0.3} />
        <StatCard title="Pending Review" value={stats.pending} icon={<Clock size={30} />} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Card title="Live Appointments Flux" icon={CalendarClock} className="luxury-glass overflow-hidden">
            <div className="overflow-x-auto -mx-4 md:-mx-8">
              <div className="inline-block min-w-full align-middle px-4 md:px-8">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-accent font-black border-b border-accent/10">
                      <th className="pb-5 uppercase text-[9px] md:text-[10px] tracking-widest px-2">Patient</th>
                      <th className="pb-5 uppercase text-[9px] md:text-[10px] tracking-widest px-2 hidden md:table-cell">Specialist</th>
                      <th className="pb-5 uppercase text-[9px] md:text-[10px] tracking-widest px-2">Schedule</th>
                      <th className="pb-5 uppercase text-[9px] md:text-[10px] tracking-widest px-2 text-right md:text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentAppointments.map((app, i) => (
                      <tr key={i} className="hover:bg-accent/5 transition-all group duration-300">
                        <td className="py-5 px-2">
                          <p className="font-black text-sm md:text-base text-primary group-hover:text-accent transition-colors truncate max-w-[100px] md:max-w-none">{app.patientName}</p>
                          <p className="text-[9px] md:text-[10px] text-charcoal/40 uppercase tracking-tighter">Registered</p>
                        </td>
                        <td className="py-5 px-2 font-bold text-charcoal/80 text-xs hidden md:table-cell">{app.doctorId?.name || 'Unassigned'}</td>
                        <td className="py-5 px-2">
                          <p className="text-charcoal/70 text-[10px] md:text-xs font-bold whitespace-nowrap">{app.date}</p>
                          <p className="text-[9px] md:text-[10px] text-accent font-black">{app.timeSlot}</p>
                        </td>
                        <td className="py-5 px-2 text-right md:text-left">
                          <span className={`px-2 md:px-4 py-1 rounded-full text-[8px] md:text-[10px] uppercase font-black tracking-widest shadow-sm inline-block ${
                            app.status === 'Confirmed' ? 'bg-success/10 text-success border border-success/20' : 
                            app.status === 'Pending' ? 'bg-accent/10 text-accent border border-accent/20' :
                            'bg-error/10 text-error border border-error/20'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
          <Card title="Executive Actions" icon={ArrowRight} className="luxury-glass border-t-4 border-accent">
            <div className="space-y-4 md:space-y-5">
              <button className="w-full flex items-center justify-between p-4 md:p-5 obsidian-gradient rounded-2xl transition-all group shadow-xl border border-white/5 active:scale-95">
                <span className="font-black text-[10px] md:text-xs uppercase tracking-widest text-white group-hover:text-accent transition-colors text-left">New Appointment</span>
                <CalendarClock className="text-accent scale-75 md:scale-100 group-hover:rotate-12 transition-transform" />
              </button>
              <button className="w-full flex items-center justify-between p-4 md:p-5 border-2 border-accent/20 bg-white rounded-2xl transition-all group active:scale-95">
                <span className="font-black text-[10px] md:text-xs uppercase tracking-widest text-primary text-left">Onboard Patient</span>
                <Users className="text-accent scale-75 md:scale-100 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
