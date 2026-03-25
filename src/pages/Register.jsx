import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import Button from '../components/Button';
import { Mail, Lock, User, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Admin'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error details:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed - check network or server';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grayLight flex items-center justify-center p-4">
      <div className="bg-primary w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
        <div className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white mb-2">Join CareSync</h1>
            <p className="text-secondary opacity-70">Register your clinic management account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input 
                type="text" 
                placeholder="Full Name"
                required
                className="w-full bg-white border-none py-3 pl-12 pr-4 rounded-xl shadow-inner focus:ring-4 focus:ring-accent outline-none text-charcoal"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input 
                type="email" 
                placeholder="Clinic Email"
                required
                className="w-full bg-white border-none py-3 pl-12 pr-4 rounded-xl shadow-inner focus:ring-4 focus:ring-accent outline-none text-charcoal"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input 
                type="password" 
                placeholder="Password"
                required
                className="w-full bg-white border-none py-3 pl-12 pr-4 rounded-xl shadow-inner focus:ring-4 focus:ring-accent outline-none text-charcoal"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="relative">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <select 
                className="w-full bg-white border-none py-3 pl-12 pr-4 rounded-xl shadow-inner focus:ring-4 focus:ring-accent outline-none text-charcoal appearance-none"
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="Admin">Admin</option>
                <option value="Doctor">Doctor</option>
              </select>
            </div>

            <Button 
              type="submit" 
              variant="accent" 
              className="w-full py-4 text-lg font-bold mt-4"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Register Account'}
            </Button>
          </form>

          <div className="mt-8 text-center text-white text-opacity-80">
            <p>Already have an account? <Link to="/login" className="text-accent font-bold hover:underline">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
