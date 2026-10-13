-- Ejecute en SQL Editor de un proyecto Supabase Free dedicado a estos audios.
-- Primero cree fabulosaplay@gmail.com en Authentication > Users > Add user,
-- con contraseña propia y Auto Confirm User. No active políticas públicas de escritura.
begin;
do $setup$
declare
  administrator uuid;
  expression text;
begin
  select id into administrator from auth.users
    where lower(email) = 'fabulosaplay@gmail.com' and email_confirmed_at is not null;
  if administrator is null then
    raise exception 'Primero cree y confirme el usuario fabulosaplay@gmail.com en Authentication.';
  end if;
  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('camera-radio', 'camera-radio', true, 52428800,
    array['audio/mpeg','audio/mp3','audio/mp4','audio/x-m4a','audio/aac','audio/wav','audio/x-wav','audio/wave','audio/ogg','application/ogg','audio/flac','audio/x-flac'])
  on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
  expression := format('bucket_id = %L and (select auth.uid()) = %L::uuid', 'camera-radio', administrator);
  execute 'drop policy if exists camera_radio_admin_select on storage.objects';
  execute 'drop policy if exists camera_radio_admin_insert on storage.objects';
  execute 'drop policy if exists camera_radio_admin_delete on storage.objects';
  execute 'create policy camera_radio_admin_select on storage.objects for select to authenticated using (' || expression || ')';
  execute 'create policy camera_radio_admin_insert on storage.objects for insert to authenticated with check (' || expression || ')';
  execute 'create policy camera_radio_admin_delete on storage.objects for delete to authenticated using (' || expression || ')';
end $setup$;
commit;

-- Solo el UUID del administrador puede listar, subir y borrar.
-- El público puede escuchar los archivos mediante sus enlaces públicos.
-- Este script no modifica permisos de otros contenedores.
