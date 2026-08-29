'use client';

interface DeliveryFormProps {
  values: {
    name: string;
    phone: string;
    address: string;
    notes: string;
  };
  onChange: (field: string, value: string) => void;
}

export function DeliveryForm({ values, onChange }: DeliveryFormProps) {
  return (
    <div className="bg-surface dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0px_4px_20px_rgba(0,0,0,0.3)]">
      <h2 className="text-xl font-bold font-montserrat text-text dark:text-slate-100 mb-6">Detail Pengiriman</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Lengkap <span className="text-red-500">*</span></label>
            <input
              id="name"
              type="text"
              required
              value={values.name}
              onChange={(e) => onChange('name', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-text dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#ef85f8]/20 focus:border-[#ef85f8] transition-all"
              placeholder="Contoh: Budi Santoso"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">Nomor HP <span className="text-red-500">*</span></label>
            <input
              id="phone"
              type="tel"
              required
              value={values.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-text dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#ef85f8]/20 focus:border-[#ef85f8] transition-all"
              placeholder="Contoh: 081234567890"
            />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <label htmlFor="address" className="text-sm font-medium text-slate-700 dark:text-slate-300">Alamat Lengkap <span className="text-red-500">*</span></label>
          <textarea
            id="address"
            required
            rows={3}
            value={values.address}
            onChange={(e) => onChange('address', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-text dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#ef85f8]/20 focus:border-[#ef85f8] transition-all resize-none"
            placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos"
          />
        </div>
        
        <div className="space-y-1.5">
          <label htmlFor="notes" className="text-sm font-medium text-slate-700 dark:text-slate-300">Catatan Pesanan (Opsional)</label>
          <textarea
            id="notes"
            rows={2}
            value={values.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-text dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#ef85f8]/20 focus:border-[#ef85f8] transition-all resize-none"
            placeholder="Contoh: Pempek minta digoreng setengah matang"
          />
        </div>
      </div>
    </div>
  );
}
