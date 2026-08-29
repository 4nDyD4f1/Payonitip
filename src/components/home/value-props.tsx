import { Card, CardContent } from "@/components/ui/card";
import { Award, Rocket, MapPin } from "lucide-react";

const VALUES = [
  {
    icon: <Award className="w-8 h-8 text-[#ef85f8] dark:text-[#f5b0fb]" />,
    title: "Autentik",
    desc: "Mitra langsung pembuat pempek legendaris di Palembang. Dijamin rasa asli tanpa kompromi.",
  },
  {
    icon: <Rocket className="w-8 h-8 text-[#ef85f8] dark:text-[#f5b0fb]" />,
    title: "Pengiriman Cepat",
    desc: "Layanan sameday menjamin pempek tiba dalam kondisi segar dan nikmat.",
  },
  {
    icon: <MapPin className="w-8 h-8 text-[#ef85f8] dark:text-[#f5b0fb]" />,
    title: "Tracking Real-time",
    desc: "Pantau perjalanan paket dari dapur Palembang hingga tiba di pintu rumah Anda.",
  },
];

export function ValueProps() {
  return (
    <section className="py-16 bg-white dark:bg-[#0F172A]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1C1E] dark:text-[#F1F5F9]">
            Kenapa Memilih Payonitip?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {VALUES.map((val, idx) => (
            <Card key={idx} className="bg-white dark:bg-[#0F172A] border-none shadow-[0px_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0px_4px_20px_rgba(0,0,0,0.3)] rounded-[16px] transition-transform hover:-translate-y-2 duration-300">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold text-[#1A1C1E] dark:text-[#F1F5F9] mb-3">
                  {val.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {val.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
