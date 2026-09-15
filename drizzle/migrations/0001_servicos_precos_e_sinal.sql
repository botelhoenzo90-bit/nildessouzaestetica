CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'corporal',
  name text NOT NULL,
  description text,
  price_cents integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Público pode ler serviços" ON public.services
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin gerencia serviços" ON public.services
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

ALTER TABLE public.business_settings
  ADD COLUMN IF NOT EXISTS deposit_percent integer NOT NULL DEFAULT 40,
  ADD COLUMN IF NOT EXISTS payment_link text NOT NULL DEFAULT 'https://link.mercadopago.com.br/nildesestetica';

INSERT INTO public.services (category, name, description, price_cents, sort_order) VALUES
  ('corporal', 'Massagem Relaxante (30 min)', NULL, 12000, 10),
  ('corporal', 'Massagem Relaxante (50 min)', NULL, 15000, 20),
  ('corporal', 'Massagem Modeladora', NULL, 18000, 30),
  ('corporal', 'Drenagem Linfática', NULL, 16000, 40),
  ('corporal', 'Ventosaterapia', NULL, 20000, 50),
  ('corporal', 'Massagem Golden', NULL, 15000, 60),
  ('facial', 'Limpeza de Pele', NULL, 15000, 10),
  ('facial', 'Auriculoterapia', NULL, 8000, 20),
  ('facial', 'Design de Sobrancelhas', NULL, 4000, 30),
  ('facial', 'Design de Sobrancelhas + Henna', NULL, 6000, 40),
  ('facial', 'Brow Lamination', 'Valor a definir no painel', 0, 50),
  ('pacote', 'Pacote Modeladora', '4 sessões de Massagem Modeladora', 57600, 10),
  ('pacote', 'Pacote Relax', '4 sessões de Massagem Relaxante + 4 sessões de Auriculoterapia', 68000, 20),
  ('pacote', 'Pacote Ventosa + Relax', '4 sessões de Ventosaterapia + 4 sessões de Massagem Relaxante', 68000, 30),
  ('pacote', 'Pacote Pele + Relaxamento', '1 Limpeza de Pele Facial + 1 Massagem nos Pés', 15000, 40),
  ('pacote', 'Pacote Completo — Autocuidado', '2 Massagens Modeladoras, 2 Massagens Relaxantes, 2 Auriculoterapias, 1 Ventosaterapia, 1 Limpeza de Pele Facial e 1 Massagem nos Pés', 80000, 50);
