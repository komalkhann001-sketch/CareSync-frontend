import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import api from '../utils/api';
import { FileText, Plus, Download, Search, Pill } from 'lucide-react';
import { toast } from 'react-toastify';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '', appointmentId: '', medicineName: '', dosage: '', duration: '', notes: ''
  });

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();
    fetchAppointments();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const { data } = await api.get('/prescriptions');
      setPrescriptions(data);
    } catch (error) {
      toast.error('Failed to fetch prescriptions');
    }
  };

  const fetchPatients = async () => {
    try {
      const { data } = await api.get('/patients');
      setPatients(data);
    } catch (error) {}
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data.filter(a => a.status === 'Confirmed' || a.status === 'Completed'));
    } catch (error) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/prescriptions', formData);
      toast.success('Prescription created');
      setShowForm(false);
      fetchPrescriptions();
    } catch (error) {
      toast.error('Failed to save prescription');
    }
  };

  return (
    <div className="p-8 ml-64 bg-grayLight min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-charcoal">Prescriptions</h1>
          <p className="text-gray-500">Medical records and medication</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : <><Plus size={20} /> Create New</>}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-10 shadow-xl border-t-8 border-accent">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-primary">Patient</label>
              <select 
                required className="w-full p-3 bg-gray-50 rounded-xl outline-none ring-1 ring-gray-200"
                value={formData.patientId} onChange={(e) => setFormData({...formData, patientId: e.target.value})}
              >
                <option value="">Select Patient...</option>
                {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-primary">Linked Appointment</label>
              <select 
                className="w-full p-3 bg-gray-50 rounded-xl outline-none ring-1 ring-gray-200"
                value={formData.appointmentId} onChange={(e) => setFormData({...formData, appointmentId: e.target.value})}
              >
                <option value="">Select Appointment (Optional)...</option>
                {appointments.map(a => <option key={a._id} value={a._id}>{a.date} - {a.patientName}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-primary">Medicine Name</label>
              <input 
                type="text" required className="w-full p-3 bg-gray-50 rounded-xl outline-none ring-1 ring-gray-200"
                value={formData.medicineName} onChange={(e) => setFormData({...formData, medicineName: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                <label className="text-sm font-bold text-primary">Dosage</label>
                <input 
                  type="text" required placeholder="e.g. 1-0-1" className="w-full p-3 bg-gray-50 rounded-xl outline-none ring-1 ring-gray-200"
                  value={formData.dosage} onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-primary">Duration</label>
                <input 
                  type="text" required placeholder="e.g. 5 days" className="w-full p-3 bg-gray-50 rounded-xl outline-none ring-1 ring-gray-200"
                  value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
              </div>
            </div>
            <div className="lg:col-span-2 space-y-1">
              <label className="text-sm font-bold text-primary">Instructions / Notes</label>
              <textarea 
                className="w-full p-3 bg-gray-50 rounded-xl outline-none ring-1 ring-gray-200 h-24"
                value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
              ></textarea>
            </div>
            <div className="lg:col-span-2 flex justify-end gap-3">
              <Button type="submit" variant="accent">Save Prescription</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prescriptions.map(pres => (
          <Card key={pres._id} className="border-l-8 border-success">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success bg-opacity-10 rounded-lg text-success"><Pill size={20} /></div>
                <div>
                  <h3 className="font-bold text-charcoal">{pres.patientId?.name}</h3>
                  <p className="text-xs text-gray-500">{new Date(pres.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button className="text-primary hover:scale-110 transition-transform"><Download size={20} /></button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-4">
              <p className="text-sm font-extrabold text-primary mb-1 uppercase tracking-wider">{pres.medicineName}</p>
              <div className="flex justify-between text-xs text-gray-600 font-medium">
                <span>Dosage: {pres.dosage}</span>
                <span>Duration: {pres.duration}</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 italic">"{pres.notes || 'No extra notes'}"</p>
            
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary bg-opacity-20 flex items-center justify-center text-[10px] font-bold text-primary">Dr</div>
              <p className="text-xs font-bold text-charcoal">Prescribed by Dr. {pres.doctorId?.name || 'CareSync Team'}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Prescriptions;
