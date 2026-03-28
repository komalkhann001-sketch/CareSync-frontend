import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Stethoscope, 
  CheckCircle2, 
  ArrowLeft,
  Loader2,
  Users
} from 'lucide-react';
import { toast } from 'react-toastify';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    doctorId: '',
    date: '',
    timeSlot: '',
    reason: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await api.get('/doctors');
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/appointments/public-book', formData);
      setSuccess(true);
      toast.success('Your appointment request has been sent!');
      setTimeout(() => navigate('/'), 5000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-grayLight flex items-center justify-center p-6">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-10 text-center animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="text-green-600" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-primary mb-4">Request Sent!</h2>
          <p className="text-gray-600 mb-8">
            Thank you, <span className="font-bold text-primary">{formData.name}</span>. 
            Our clinic will contact you soon to confirm your appointment.
          </p>
          <Link to="/" className="inline-flex items-center text-accent font-bold hover:underline">
            <ArrowLeft size={18} className="mr-2" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center text-primary font-medium hover:text-accent transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back
          </Link>
          <div className="text-right">
            <h1 className="text-primary text-2xl font-black italic tracking-tighter">CareSync</h1>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-5">
            {/* Left Sidebar Info */}
            <div className="md:col-span-2 bg-primary p-10 text-white flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-extrabold mb-6 leading-tight">Book Your Visit with CareSync</h2>
                <p className="text-gray-300 mb-10 leading-relaxed">
                  Experience premium healthcare management. Fill out the form and our specialist will confirm your slot within minutes.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-white/10 p-2 rounded-lg mr-4">
                      <Stethoscope size={20} className="text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold">Expert Doctors</h4>
                      <p className="text-sm text-gray-400">Consult with the best in the field.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-white/10 p-2 rounded-lg mr-4">
                      <Calendar size={20} className="text-accent" />
                    </div>
                    <div>
                      <h4 className="font-bold">Instant Request</h4>
                      <p className="text-sm text-gray-400">No login required for patients.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Health is Wealth</p>
              </div>
            </div>

            {/* Right Form */}
            <div className="md:col-span-3 p-10 bg-white">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all"
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required
                        type="tel" 
                        placeholder="+1 234 567 890"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all"
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">Age</label>
                      <input 
                        required
                        type="number" 
                        placeholder="25"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all"
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">Gender</label>
                      <select 
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all"
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Choose Doctor</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <select 
                      required
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none appearance-none transition-all"
                      onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                    >
                      <option value="">Select a Specialist</option>
                      {doctors.map(doc => (
                        <option key={doc._id} value={doc._id}>{doc.name} - {doc.specialization}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required
                        type="date" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all"
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Preferred Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required
                        type="time" 
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none transition-all"
                        onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Reason for Visit</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-4 text-gray-400" size={18} />
                    <textarea 
                      placeholder="Symptoms or reason..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-accent outline-none min-h-[100px] transition-all"
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    ></textarea>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-accent hover:bg-white hover:text-accent border-2 border-accent text-primary font-black py-4 rounded-2xl shadow-lg shadow-accent/20 transition-all transform active:scale-95 flex items-center justify-center space-x-2 text-lg uppercase tracking-wider"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center space-y-2">
          <p className="text-gray-400 text-sm italic font-medium">
            &copy; {new Date().getFullYear()} CareSync Medical Group. All rights reserved.
          </p>
          <div className="pt-2 border-t border-gray-100 mt-2">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
              Are you a staff member? <Link to="/login" className="text-accent hover:underline">Clinic Login</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookAppointment;
