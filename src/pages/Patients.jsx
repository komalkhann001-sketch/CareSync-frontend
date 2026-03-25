import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import api from '../utils/api';
import { Search, UserPlus, Phone, Calendar, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-toastify';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', phone: '', email: '', address: '', medicalHistory: ''
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await api.get('/patients');
      setPatients(data);
    } catch (error) {
      toast.error('Failed to fetch patients');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/patients', formData);
      toast.success('Patient registered successfully');
      setShowForm(false);
      fetchPatients();
    } catch (error) {
      toast.error('Failed to register patient');
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm)
  );

  return (
    <div className="p-6 md:p-10 bg-secondary min-h-screen animate-premium">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tighter uppercase">Patient <span className="text-accent underline decoration-accent/20 underline-offset-8">Base</span></h1>
          <p className="text-charcoal/50 text-xs md:text-sm font-bold uppercase tracking-widest mt-2">Executive Clinic Records</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'outline' : 'accent'} className="w-full md:w-auto shadow-xl shadow-accent/10 py-5 rounded-2xl">
          {showForm ? 'Close Directory' : <><UserPlus size={20} className="mr-2" /> Onboard Patient</>}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-10 animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-bold text-primary">Full Name</label>
              <input 
                type="text" required className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary outline-none"
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-primary">Age</label>
              <input 
                type="number" required className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary outline-none"
                value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-primary">Gender</label>
              <select 
                className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary outline-none"
                value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-primary">Phone</label>
              <input 
                type="text" required className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary outline-none"
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-bold text-primary">Email</label>
              <input 
                type="email" className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary outline-none"
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-1 lg:col-span-1">
              <label className="text-sm font-bold text-primary">Address</label>
              <input 
                type="text" className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary outline-none"
                value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div className="space-y-1 lg:col-span-3">
              <label className="text-sm font-bold text-primary">Medical History</label>
              <textarea 
                className="w-full p-3 bg-gray-50 rounded-xl border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary outline-none h-24"
                value={formData.medicalHistory} onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
              ></textarea>
            </div>
            <div className="lg:col-span-3 flex justify-end">
              <Button type="submit" variant="accent" className="w-full md:w-auto">Register Patient</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or phone..." 
          className="w-full py-4 pl-12 pr-4 bg-white rounded-2xl shadow-sm border-none ring-1 ring-gray-200 focus:ring-4 focus:ring-primary focus:ring-opacity-10 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 transition-all duration-500">
        {filteredPatients.map((patient) => (
          <Card key={patient._id} className="luxury-glass relative group border-t-2 border-accent/10">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 obsidian-gradient rounded-2xl flex items-center justify-center text-accent font-black text-xl shadow-lg border border-white/10 group-hover:scale-110 transition-transform duration-500">
                  {patient.name[0]}
                </div>
                <div>
                  <h3 className="font-black text-primary tracking-tight text-lg uppercase group-hover:text-accent transition-colors">{patient.name}</h3>
                  <p className="text-[10px] text-accent font-black uppercase tracking-widest">{patient.age} Y • {patient.gender}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 border-t border-accent/5 pt-6">
              <div className="flex items-center gap-4 text-xs font-bold text-charcoal/60">
                <div className="p-2 bg-accent/10 rounded-lg text-accent"><Phone size={14} /></div>
                {patient.phone}
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-charcoal/60">
                <div className="p-2 bg-accent/10 rounded-lg text-accent"><Calendar size={14} /></div>
                {new Date(patient.createdAt).toLocaleDateString()}
              </div>
            </div>
            <button className="w-full mt-8 py-4 bg-white/40 hover:bg-accent hover:text-white border border-accent/20 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all duration-300 active:scale-95 shadow-lg">
              Open Medical File
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Patients;
