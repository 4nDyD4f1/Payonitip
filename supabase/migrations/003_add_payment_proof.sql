-- Add payment_proof column to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_proof TEXT DEFAULT '';

-- Create a storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public) VALUES ('payment_proofs', 'payment_proofs', true) ON CONFLICT DO NOTHING;

-- Policy to allow anyone to upload payment proofs (so even guests/users can upload during checkout)
CREATE POLICY "Public Upload Payment Proofs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment_proofs');

-- Policy to allow anyone to read (so admin dashboard can show it easily)
CREATE POLICY "Public Read Payment Proofs" ON storage.objects FOR SELECT USING (bucket_id = 'payment_proofs');

