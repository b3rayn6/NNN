import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, Users, MapPin, Phone, Share2, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FormData {
  cedula: string;
  nombreApellido: string;
  centroElectoral: string;
  telefono: string;
  redesSociales: string;
  horaAsistencia: string;
}

const RegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    cedula: '',
    nombreApellido: '',
    centroElectoral: '',
    telefono: '',
    redesSociales: '',
    horaAsistencia: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.cedula.trim()) {
      newErrors.cedula = 'La cédula es requerida';
    } else if (!/^\d{7,11}$/.test(formData.cedula.replace(/[-\s]/g, ''))) {
      newErrors.cedula = 'Formato de cédula inválido';
    }

    if (!formData.nombreApellido.trim()) {
      newErrors.nombreApellido = 'Nombre y apellido son requeridos';
    }

    if (!formData.centroElectoral.trim()) {
      newErrors.centroElectoral = 'Centro electoral es requerido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'Teléfono es requerido';
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.telefono)) {
      newErrors.telefono = 'Formato de teléfono inválido';
    }

    if (!formData.horaAsistencia) {
      newErrors.horaAsistencia = 'Hora de asistencia es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Error en el formulario",
        description: "Por favor, corrige los errores antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('registrations')
        .insert({
          cedula: formData.cedula,
          nombre_apellido: formData.nombreApellido,
          centro_electoral: formData.centroElectoral,
          telefono: formData.telefono,
          redes_sociales: formData.redesSociales || null,
          hora_asistencia: formData.horaAsistencia
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Registro exitoso",
        description: "Los datos han sido registrados correctamente en la base de datos.",
      });

      // Limpiar formulario
      setFormData({
        cedula: '',
        nombreApellido: '',
        centroElectoral: '',
        telefono: '',
        redesSociales: '',
        horaAsistencia: ''
      });
    } catch (error) {
      console.error('Error saving registration:', error);
      toast({
        title: "Error al guardar",
        description: "Ocurrió un error al guardar los datos. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-elegant animate-fade-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
            <Users className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Registro Electoral
          </CardTitle>
          <CardDescription className="text-lg">
            Complete sus datos para el registro en el sistema electoral
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cédula */}
            <div className="space-y-2">
              <Label htmlFor="cedula" className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Cédula de Identidad *
              </Label>
              <Input
                id="cedula"
                type="text"
                placeholder="Ej: 12.345.678"
                value={formData.cedula}
                onChange={(e) => handleInputChange('cedula', e.target.value)}
                className={`transition-all duration-300 ${errors.cedula ? 'border-destructive focus:border-destructive' : 'focus:border-primary'}`}
              />
              {errors.cedula && (
                <p className="text-sm text-destructive mt-1">{errors.cedula}</p>
              )}
            </div>

            {/* Nombre y Apellido */}
            <div className="space-y-2">
              <Label htmlFor="nombreApellido" className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Nombre y Apellido *
              </Label>
              <Input
                id="nombreApellido"
                type="text"
                placeholder="Ej: Juan Pérez García"
                value={formData.nombreApellido}
                onChange={(e) => handleInputChange('nombreApellido', e.target.value)}
                className={`transition-all duration-300 ${errors.nombreApellido ? 'border-destructive focus:border-destructive' : 'focus:border-primary'}`}
              />
              {errors.nombreApellido && (
                <p className="text-sm text-destructive mt-1">{errors.nombreApellido}</p>
              )}
            </div>

            {/* Centro Electoral */}
            <div className="space-y-2">
              <Label htmlFor="centroElectoral" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Centro Electoral *
              </Label>
              <Input
                id="centroElectoral"
                type="text"
                placeholder="Ej: Escuela Nacional Bolivariana"
                value={formData.centroElectoral}
                onChange={(e) => handleInputChange('centroElectoral', e.target.value)}
                className={`transition-all duration-300 ${errors.centroElectoral ? 'border-destructive focus:border-destructive' : 'focus:border-primary'}`}
              />
              {errors.centroElectoral && (
                <p className="text-sm text-destructive mt-1">{errors.centroElectoral}</p>
              )}
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                Teléfono *
              </Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="Ej: +58 412-123-4567"
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                className={`transition-all duration-300 ${errors.telefono ? 'border-destructive focus:border-destructive' : 'focus:border-primary'}`}
              />
              {errors.telefono && (
                <p className="text-sm text-destructive mt-1">{errors.telefono}</p>
              )}
            </div>

            {/* Redes Sociales */}
            <div className="space-y-2">
              <Label htmlFor="redesSociales" className="text-sm font-medium flex items-center gap-2">
                <Share2 className="w-4 h-4 text-primary" />
                Redes Sociales
              </Label>
              <Input
                id="redesSociales"
                type="text"
                placeholder="Ej: @usuario o enlace de perfil"
                value={formData.redesSociales}
                onChange={(e) => handleInputChange('redesSociales', e.target.value)}
                className="transition-all duration-300 focus:border-primary"
              />
            </div>

            {/* Hora de Asistencia */}
            <div className="space-y-2">
              <Label htmlFor="horaAsistencia" className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                Hora de Asistencia *
              </Label>
              <Input
                id="horaAsistencia"
                type="time"
                value={formData.horaAsistencia}
                onChange={(e) => handleInputChange('horaAsistencia', e.target.value)}
                className={`transition-all duration-300 ${errors.horaAsistencia ? 'border-destructive focus:border-destructive' : 'focus:border-primary'}`}
              />
              {errors.horaAsistencia && (
                <p className="text-sm text-destructive mt-1">{errors.horaAsistencia}</p>
              )}
            </div>

            {/* Botón de Envío */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-lg font-semibold"
              size="lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Registrando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Registrar Datos
                </div>
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            Los campos marcados con * son obligatorios
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistrationForm;