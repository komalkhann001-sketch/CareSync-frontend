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
    <div className="p-8 ml-64 bg-grayLight min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-charcoal">Patient Management</h1>
          <p className="text-gray-500">View and register clinic patients</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'outline' : 'primary'}>
          {showForm ? 'Cancel' : <><UserPlus size={20} /> Add Patient</>}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <Card key={patient._id} className="relative group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary font-bold text-lg uppercase">
                  {patient.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-charcoal">{patient.name}</h3>
                  <p className="text-sm text-gray-500">{patient.age} years • {patient.gender}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-primary"><Edit size={16} /></button>
                <button className="p-2 text-gray-400 hover:text-error"><Trash2 size={16} /></button>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone size={16} className="text-primary" /> {patient.phone}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar size={16} className="text-primary" /> Registered: {new Date(patient.createdAt).toLocaleDateString()}
              </div>
            </div>
            <Button variant="outline" className="w-full mt-6 text-sm">View Full History</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Patients;
