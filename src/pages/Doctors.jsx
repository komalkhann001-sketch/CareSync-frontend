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
    <div className="p-6 md:p-10 bg-secondary min-h-screen animate-premium">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tighter uppercase">Medical <span className="text-accent underline decoration-accent/20 underline-offset-8">Staff</span></h1>
          <p className="text-charcoal/50 text-xs md:text-sm font-bold uppercase tracking-widest mt-2">Clinic Specialists Directory</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'outline' : 'accent'} className="w-full md:w-auto py-5 px-8 rounded-2xl shadow-xl shadow-accent/10">
          {showForm ? 'Close Directory' : <><Plus size={20} className="mr-2" /> Add Specialist</>}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {doctors.map(doctor => (
          <div key={doctor._id} className="luxury-glass rounded-[2rem] overflow-hidden group border-t-4 border-accent transition-all duration-500 hover:scale-[1.02]">
            <div className="p-8">
              <div className="flex items-center gap-6 mb-8">
                <img 
                  src={doctor.profilePhoto || 'https://via.placeholder.com/150'} 
                  alt={doctor.name} 
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-accent ring-opacity-10 shadow-xl"
                />
                <div>
                  <h3 className="text-xl font-black text-primary tracking-tight uppercase group-hover:text-accent transition-colors">{doctor.name}</h3>
                  <p className="text-accent font-black text-[10px] uppercase tracking-widest">{doctor.specialization}</p>
                </div>
              </div>

              <div className="space-y-4 mb-10 border-t border-accent/5 pt-8">
                <div className="flex items-center gap-4 text-xs font-bold text-charcoal/60 lowercase tracking-wide">
                  <div className="p-2 obsidian-gradient rounded-xl text-accent"><Phone size={14} /></div> {doctor.phone}
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-charcoal/60 lowercase tracking-wide">
                  <div className="p-2 obsidian-gradient rounded-xl text-accent"><Mail size={14} /></div> {doctor.email}
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="accent" className="flex-1 py-4 font-black uppercase text-[10px] tracking-widest rounded-2xl">View Profile</Button>
                <button className="p-4 bg-error/10 text-error rounded-2xl hover:bg-error hover:text-white transition-all duration-300">
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
