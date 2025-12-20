import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Phone, 
  MapPin, 
  Car,
  Battery,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const connectorTypes = ['CCS2', 'CHAdeMO', 'Type2', 'GBT'] as const;

const carModels = [
  { name: 'VinFast VF8', battery: 82, consumption: 18 },
  { name: 'VinFast VF9', battery: 92, consumption: 20 },
  { name: 'VinFast VFe34', battery: 42, consumption: 15 },
  { name: 'Tesla Model 3', battery: 60, consumption: 14 },
  { name: 'Tesla Model Y', battery: 75, consumption: 16 },
  { name: 'Hyundai Ioniq 5', battery: 72, consumption: 17 },
  { name: 'Hyundai Ioniq 6', battery: 77, consumption: 14 },
  { name: 'KIA EV6', battery: 77, consumption: 16 },
  { name: 'Mercedes EQS', battery: 108, consumption: 18 },
  { name: 'BMW iX', battery: 105, consumption: 20 },
  { name: 'Khác', battery: 60, consumption: 16 },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, updateProfile, updateVehicle } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    full_name: user?.profile?.full_name || '',
    phone: '',
    address: '',
  });
  
  const [vehicleData, setVehicleData] = useState({
    name: '',
    battery_kwh: 60,
    consumption_kwh_per_100km: 16,
    preferred_connector: 'CCS2' as typeof connectorTypes[number],
  });

  const handleSelectCar = (car: typeof carModels[0]) => {
    setVehicleData({
      ...vehicleData,
      name: car.name,
      battery_kwh: car.battery,
      consumption_kwh_per_100km: car.consumption,
    });
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!profileData.full_name || !profileData.phone) {
        toast({
          title: 'Thiếu thông tin',
          description: 'Vui lòng nhập họ tên và số điện thoại',
          variant: 'destructive',
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!vehicleData.name) {
        toast({
          title: 'Thiếu thông tin',
          description: 'Vui lòng chọn loại xe',
          variant: 'destructive',
        });
        return;
      }
      setStep(3);
    } else {
      // Save all data
      setLoading(true);
      try {
        await updateProfile({
          ...profileData,
          onboarding_completed: true,
        });
        
        await updateVehicle({
          ...vehicleData,
          soc_current: 50,
        });
        
        toast({
          title: 'Hoàn tất!',
          description: 'Chào mừng bạn đến với SCS GO',
        });
        
        navigate('/dashboard');
      } catch (error) {
        toast({
          title: 'Lỗi',
          description: 'Không thể lưu thông tin. Vui lòng thử lại.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      await updateProfile({
        full_name: profileData.full_name || user?.profile?.full_name || 'User',
        onboarding_completed: true,
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
            <img src="/logo.png" alt="SCS GO" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-bold gradient-text">SCS GO</span>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn(
                'w-3 h-3 rounded-full transition-colors',
                s === step ? 'bg-primary' : s < step ? 'bg-primary/50' : 'bg-secondary'
              )}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2">Thông tin cá nhân</h1>
                <p className="text-muted-foreground">Giúp chúng tôi biết thêm về bạn</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Nguyễn Văn A"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0912 345 678"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ (tùy chọn)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="123 Đường ABC, Quận XYZ"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2">Xe của bạn</h1>
                <p className="text-muted-foreground">Chọn loại xe để AI gợi ý trạm sạc phù hợp</p>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {carModels.map((car) => (
                  <button
                    key={car.name}
                    onClick={() => handleSelectCar(car)}
                    className={cn(
                      'p-3 rounded-xl border text-left transition-all',
                      vehicleData.name === car.name
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{car.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {car.battery} kWh
                    </div>
                  </button>
                ))}
              </div>

              {vehicleData.name && (
                <div className="p-4 bg-secondary/50 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Dung lượng pin</span>
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4 text-primary" />
                      <Input
                        type="number"
                        value={vehicleData.battery_kwh}
                        onChange={(e) => setVehicleData({ ...vehicleData, battery_kwh: Number(e.target.value) })}
                        className="w-20 h-8 text-center"
                      />
                      <span className="text-sm">kWh</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2">Loại sạc ưa thích</h1>
                <p className="text-muted-foreground">Chọn cổng sạc phù hợp với xe của bạn</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {connectorTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setVehicleData({ ...vehicleData, preferred_connector: type })}
                    className={cn(
                      'p-4 rounded-xl border text-center transition-all',
                      vehicleData.preferred_connector === type
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <Zap className={cn(
                      'w-6 h-6 mx-auto mb-2',
                      vehicleData.preferred_connector === type ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    <span className="font-medium">{type}</span>
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="p-4 bg-secondary/50 rounded-xl space-y-2">
                <h3 className="font-medium mb-3">Tóm tắt thông tin</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Họ tên</span>
                  <span>{profileData.full_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Điện thoại</span>
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Xe</span>
                  <span>{vehicleData.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cổng sạc</span>
                  <span>{vehicleData.preferred_connector}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            ) : (
              <Button variant="ghost" onClick={handleSkip} disabled={loading}>
                Bỏ qua
              </Button>
            )}
            
            <Button variant="hero" onClick={handleNext} disabled={loading}>
              {loading ? (
                'Đang lưu...'
              ) : step === 3 ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Hoàn tất
                </>
              ) : (
                <>
                  Tiếp tục
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
