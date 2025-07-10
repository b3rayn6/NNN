import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import RegistrationForm from "@/components/RegistrationForm";
import { Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Sistema de Registro Electoral
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Completa el formulario con tus datos para registrarte en el sistema electoral
            </p>
          </div>
          
          <Link to="/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Dashboard Admin
            </Button>
          </Link>
        </div>
        
        <RegistrationForm />
      </div>
    </div>
  );
};

export default Index;
