import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome to CareSync!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grayLight flex items-center justify-center p-4">
      <div className="bg-primary w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-white mb-2">CareSync</h1>
            <p className="text-secondary opacity-70">Empowering Smart Clinic Management</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input 
                type="email" 
                placeholder="Clinic Email"
                required
                className="w-full bg-white border-none py-4 pl-12 pr-4 rounded-xl shadow-inner focus:ring-4 focus:ring-accent focus:ring-opacity-50 transition-all outline-none text-charcoal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input 
                type="password" 
                placeholder="Password"
                required
                className="w-full bg-white border-none py-4 pl-12 pr-4 rounded-xl shadow-inner focus:ring-4 focus:ring-accent focus:ring-opacity-50 transition-all outline-none text-charcoal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              variant="accent" 
              className="w-full py-4 text-lg font-bold mt-4"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Login to Dashboard'}
            </Button>
          </form>

          <div className="mt-8 text-center text-white text-opacity-80 space-y-2">
            <p>New to CareSync? <Link to="/register" className="text-accent font-bold hover:underline">Register Clinic</Link></p>
            <div className="pt-4 border-t border-white/10 mt-4">
              <p className="text-sm">Are you a patient? <Link to="/book" className="text-accent font-bold hover:underline">Book an Appointment</Link></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
