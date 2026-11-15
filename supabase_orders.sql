-- SAVY: orders + chef dashboard. Paste in Supabase > SQL Editor > Run.
-- Replace CHEF_EMAIL below with the chef's login email before running.

create extension if not exists pgcrypto;

create table if not exists chefs (email text primary key);
insert into chefs(email) values ('CHEF_EMAIL') on conflict do nothing;

create table if not exists dishes (
  id int primary key,
  name_fr text, name_ar text, course text,
  price numeric not null default 0,
  active boolean not null default true,
  stock int,                       -- null = unlimited, 0 = sold out
  updated_at timestamptz default now()
);

create sequence if not exists order_seq start 1;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  track_token uuid not null default gen_random_uuid(),
  status text not null default 'pending'
    check (status in ('pending','confirmed','preparing','ready','delivering','delivered','cancelled')),
  name text not null, phone text not null, address text, city text, slot text,
  items jsonb not null default '[]',
  subtotal numeric default 0, discount numeric default 0, total numeric default 0,
  notes text, persona text,
  reserved boolean not null default false,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

create or replace function is_chef() returns boolean
language sql stable security definer set search_path=public as $$
  select exists(select 1 from chefs where lower(email)=lower(coalesce(auth.jwt()->>'email','')));
$$;

alter table chefs enable row level security;
alter table dishes enable row level security;
alter table orders enable row level security;

drop policy if exists dishes_read on dishes;
create policy dishes_read on dishes for select using (true);
drop policy if exists dishes_chef on dishes;
create policy dishes_chef on dishes for all using (is_chef()) with check (is_chef());
drop policy if exists orders_chef_r on orders;
create policy orders_chef_r on orders for select using (is_chef());
drop policy if exists orders_chef_u on orders;
create policy orders_chef_u on orders for update using (is_chef()) with check (is_chef());

-- Customer creates an order (validated; no direct insert allowed)
create or replace function create_order(
  p_name text, p_phone text, p_address text, p_city text, p_slot text,
  p_items jsonb, p_subtotal numeric, p_discount numeric, p_total numeric,
  p_notes text, p_persona text)
returns json language plpgsql security definer set search_path=public as $$
declare v_code text; v_tok uuid; v_id uuid;
begin
  if length(coalesce(p_name,''))<2 or length(coalesce(p_phone,''))<6 then
    raise exception 'invalid_customer';
  end if;
  if jsonb_typeof(p_items)<>'array' or jsonb_array_length(p_items)=0 or jsonb_array_length(p_items)>40 then
    raise exception 'invalid_items';
  end if;
  v_code := 'SAVY-' || lpad(nextval('order_seq')::text, 4, '0');
  insert into orders(code,name,phone,address,city,slot,items,subtotal,discount,total,notes,persona)
  values (v_code,left(p_name,80),left(p_phone,30),left(p_address,200),left(p_city,40),left(p_slot,40),
          p_items,p_subtotal,p_discount,p_total,left(p_notes,300),left(p_persona,20))
  returning id, track_token into v_id, v_tok;
  return json_build_object('code',v_code,'token',v_tok);
end $$;

-- Customer tracks one order by secret token (only safe fields)
create or replace function track_order(p_token uuid)
returns json language sql security definer set search_path=public as $$
  select json_build_object('code',code,'status',status,'slot',slot,'items',items,
         'total',total,'created_at',created_at,'updated_at',updated_at)
  from orders where track_token=p_token;
$$;

-- Stock: reserve when confirmed, restore when cancelled
create or replace function orders_stock() returns trigger
language plpgsql security definer set search_path=public as $$
declare it jsonb;
begin
  new.updated_at := now();
  if new.status='confirmed' and not old.reserved then
    for it in select * from jsonb_array_elements(new.items) loop
      update dishes set stock = greatest(stock - coalesce((it->>'qty')::int,1),0)
        where id=(it->>'id')::int and stock is not null;
    end loop;
    new.reserved := true;
  elsif new.status='cancelled' and old.reserved then
    for it in select * from jsonb_array_elements(new.items) loop
      update dishes set stock = stock + coalesce((it->>'qty')::int,1)
        where id=(it->>'id')::int and stock is not null;
    end loop;
    new.reserved := false;
  end if;
  return new;
end $$;
drop trigger if exists trg_orders_stock on orders;
create trigger trg_orders_stock before update on orders
  for each row execute function orders_stock();

grant execute on function create_order(text,text,text,text,text,jsonb,numeric,numeric,numeric,text,text) to anon, authenticated;
grant execute on function track_order(uuid) to anon, authenticated;
