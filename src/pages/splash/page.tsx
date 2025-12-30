import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <img 
          src="https://static.readdy.ai/image/32e34e04a919b9271ef3ff4f79b7fd86/739492c7d57166e7909ba9a7593d80a6.png" 
          alt="Meu Bolso" 
          className="h-48 w-auto object-contain mx-auto animate-bounce-slow"
        />
        <div className="mt-8 flex justify-center gap-2">
          <div className="w-2 h-2 bg-[#34C759] rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-[#34C759] rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-[#34C759] rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  );
}
