import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import api from '../utils/api';
import { UserSquare2, Phone, Mail, Clock, Camera, Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', specialization: '', phone: '', email: '', availableDays: []
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/doctors');
      setDoctors(data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    }
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day) 
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('specialization', formData.specialization);
    data.append('phone', formData.phone);
    data.append('email', formData.email);
    data.append('availableDays', JSON.stringify(formData.availableDays));
    if (image) data.append('image', image);

    try {
      await api.post('/doctors', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Doctor added successfully');
      setShowForm(false);
      fetchDoctors();
    } catch (error) {
      toast.error('Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="p-8 ml-64 bg-grayLight min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-charcoal">Doctor Management</h1>
          <p className="text-gray-500">Manage clinic medical staff</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : <><Plus size={20} /> Add Doctor</>}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-10 animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-primary transition-colors cursor-pointer relative group">
                  {image ? (
                    <img src={URL.createObjectURL(image)} alt="Preview" className="w-32 h-32 rounded-full object-cover" />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                      <Camera size={32} />
                      <span className="text-xs mt-2">Upload Photo</span>
                    </div>
                  )}
                  <input 
                    type="file" className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-primary">Full Name</label>
                  <input 
                    type="text" required className="w-full p-3 bg-gray-50 rounded-xl mt-1 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-primary">Specialization</label>
                  <input 
                    type="text" required className="w-full p-3 bg-gray-50 rounded-xl mt-1 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary"
                    placeholder="e.g. Cardiologist"
                    value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-primary">Phone Number</label>
                  <input 
                    type="text" required className="w-full p-3 bg-gray-50 rounded-xl mt-1 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary"
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-primary">Email Address</label>
                  <input 
                    type="email" required className="w-full p-3 bg-gray-50 rounded-xl mt-1 outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-primary"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-primary mb-3 block">Available Days</label>
              <div className="flex flex-wrap gap-2">
                {days.map(day => (
                  <button
                    key={day} type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.availableDays.includes(day) 
                      ? 'bg-primary text-white shadow-md' 
                      : 'bg-white text-gray-400 border border-gray-200 hover:border-primary'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="accent" disabled={loading} className="w-full md:w-auto">
                {loading ? 'Saving...' : 'Add Doctor to Clinic'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map(doctor => (
          <div key={doctor._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group border-t-8 border-primary">
            <div className="p-8">
              <div className="flex items-center gap-6 mb-6">
                <img 
                  src={doctor.profilePhoto || 'https://via.placeholder.com/150'} 
                  alt={doctor.name} 
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary ring-opacity-10"
                />
                <div>
                  <h3 className="text-xl font-bold text-charcoal">{doctor.name}</h3>
                  <p className="text-primary font-medium">{doctor.specialization}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Phone size={18} className="text-accent" /> {doctor.phone}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Mail size={18} className="text-accent" /> {doctor.email}
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-500">
                  <Clock size={18} className="text-accent mt-1" />
                  <div className="flex flex-wrap gap-1">
                    {doctor.availableDays?.map((day, i) => (
                      <span key={i} className="bg-gray-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{day.slice(0,3)}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="accent" className="flex-1">View Profile</Button>
                <button className="p-3 bg-error bg-opacity-10 text-error rounded-xl hover:bg-opacity-20 transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
