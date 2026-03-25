import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import api from '../utils/api';
import { Calendar, Clock, User, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: '', patientName: '', date: '', timeSlot: '', reason: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/doctors');
      setDoctors(data);
    } catch (error) {
      console.error('Failed to fetch doctors');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/appointments', formData);
      toast.success('Appointment booked successfully');
      setShowForm(false);
      fetchAppointments();
    } catch (error) {
      toast.error('Booking failed');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

  return (
    <div className="p-8 ml-64 bg-grayLight min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-charcoal">Appointments</h1>
          <p className="text-gray-500">Schedule and manage visits</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : <><Calendar size={20} /> Book New</>}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-10 animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-primary">Select Doctor</label>
              <select 
                required className="w-full p-3 bg-gray-50 rounded-xl outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary"
                value={formData.doctorId} onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
              >
                <option value="">Choose a doctor...</option>
                {doctors.map(d => <option key={d._id} value={d._id}>{d.name} ({d.specialization})</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-primary">Patient Name</label>
              <input 
                type="text" required className="w-full p-3 bg-gray-50 rounded-xl outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary"
                value={formData.patientName} onChange={(e) => setFormData({...formData, patientName: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-primary">Date</label>
              <input 
                type="date" required className="w-full p-3 bg-gray-50 rounded-xl outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary"
                value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="space-y-1 lg:col-span-3">
              <label className="text-sm font-bold text-primary mb-2 block">Available Time Slots</label>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot} type="button"
                    onClick={() => setFormData({...formData, timeSlot: slot})}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      formData.timeSlot === slot 
                      ? 'bg-primary text-white scale-105 shadow-md' 
                      : 'bg-white text-gray-400 border border-gray-100 hover:border-primary'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1 lg:col-span-3">
              <label className="text-sm font-bold text-primary">Reason for Visit</label>
              <textarea 
                className="w-full p-3 bg-gray-50 rounded-xl outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary h-20"
                value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})}
              ></textarea>
            </div>
            <div className="lg:col-span-3 flex justify-end">
              <Button type="submit" variant="accent">Confirm Appointment</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {appointments.map(app => (
          <div key={app._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-wrap items-center justify-between gap-6 hover:shadow-md transition-all">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-primary bg-opacity-10 rounded-2xl text-primary">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-charcoal flex items-center gap-2">
                  {app.patientName} 
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    app.status === 'Confirmed' ? 'bg-success bg-opacity-10 text-success' : 
                    app.status === 'Pending' ? 'bg-accent bg-opacity-10 text-accent' : 'bg-error bg-opacity-10 text-error'
                  }`}>
                    {app.status}
                  </span>
                </h3>
                <p className="text-sm text-gray-500 font-medium">with Dr. {app.doctorId?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-xs text-gray-400 font-bold uppercase">Date</p>
                <p className="text-charcoal font-bold">{app.date}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 font-bold uppercase">Time</p>
                <p className="text-charcoal font-bold">{app.timeSlot}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {app.status === 'Pending' && (
                <>
                  <button onClick={() => updateStatus(app._id, 'Confirmed')} className="p-2 text-success hover:bg-success hover:bg-opacity-10 rounded-lg transition-all"><CheckCircle /></button>
                  <button onClick={() => updateStatus(app._id, 'Cancelled')} className="p-2 text-error hover:bg-error hover:bg-opacity-10 rounded-lg transition-all"><XCircle /></button>
                </>
              )}
              {app.status === 'Confirmed' && (
                 <button onClick={() => updateStatus(app._id, 'Completed')} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold">Mark Completed</button>
              )}
              <button className="p-2 text-gray-400 hover:text-primary rounded-lg transition-all"><MessageSquare size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;
