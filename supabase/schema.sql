create extension if not exists "pgcrypto";

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nama varchar(100),
  email varchar(120) not null,
  no_hp varchar(20) not null,
  jenis_kelamin varchar(20) not null,
  pendidikan varchar(50) not null,
  pekerjaan varchar(100) not null,
  jenis_layanan varchar(100) not null,
  q1 integer not null check (q1 between 1 and 10),
  q2 integer not null check (q2 between 1 and 10),
  q3 integer not null check (q3 between 1 and 10),
  q4 integer not null check (q4 between 1 and 10),
  q5 integer not null check (q5 between 1 and 10),
  q6 integer not null check (q6 between 1 and 10),
  q7 integer not null check (q7 between 1 and 10),
  q8 integer not null check (q8 between 1 and 10),
  q9 integer not null check (q9 between 1 and 10),
  q10 integer not null check (q10 between 1 and 10),
  q11 integer not null check (q11 between 1 and 10),
  q12 integer not null check (q12 between 1 and 10),
  q13 integer not null check (q13 between 1 and 10),
  q14 integer not null check (q14 between 1 and 10),
  q15 integer not null check (q15 between 1 and 10),
  saran text
);

alter table public.survey_responses enable row level security;

create policy "Allow public survey inserts"
on public.survey_responses
for insert
to anon, authenticated
with check (true);

create policy "Allow authenticated reads"
on public.survey_responses
for select
to authenticated
using (true);

create index if not exists survey_responses_created_at_idx
on public.survey_responses (created_at desc);

insert into storage.buckets (id, name, public)
values ('skm-assets', 'skm-assets', false)
on conflict (id) do nothing;

create policy "Allow authenticated asset uploads"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'skm-assets');

create policy "Allow authenticated asset reads"
on storage.objects
for select
to authenticated
using (bucket_id = 'skm-assets');
