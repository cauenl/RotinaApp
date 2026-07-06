import { supabase } from '../lib/supabase';
 
// ─────────────────────────────────────────────────────────────────────────
// Busca as tarefas do usuário logado.
// ─────────────────────────────────────────────────────────────────────────
export async function getTasks(filtros = {}) {
  let query = supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });
 
  if (filtros.status === 'pendentes') {
    query = query.eq('concluida', false);
  } else if (filtros.status === 'concluidas') {
    query = query.eq('concluida', true);
  }
 
  if (filtros.prioridade && filtros.prioridade !== 'todas') {
    query = query.eq('prioridade', filtros.prioridade);
  }
 
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
 
// ─────────────────────────────────────────────────────────────────────────
// Busca apenas as tarefas que possuem localização definida.
// Usada pela tela de mapa (Semana 3) para exibir os pins.
// ─────────────────────────────────────────────────────────────────────────
export async function getTasksComLocalizacao() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);
 
  if (error) throw error;
  return data;
}
 
// ─────────────────────────────────────────────────────────────────────────
// Cria uma nova tarefa. Aceita latitude/longitude opcionais.
// ─────────────────────────────────────────────────────────────────────────
export async function createTask({ titulo, descricao, prioridade, latitude, longitude }) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
 
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: userData.user.id,
      titulo,
      descricao: descricao || null,
      prioridade,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
    })
    .select()
    .single();
 
  if (error) throw error;
  return data;
}
 
// ─────────────────────────────────────────────────────────────────────────
// Atualiza uma tarefa existente, incluindo localização.
// ─────────────────────────────────────────────────────────────────────────
export async function updateTask(id, { titulo, descricao, prioridade, latitude, longitude }) {
  const { data, error } = await supabase
    .from('tasks')
    .update({
      titulo,
      descricao: descricao || null,
      prioridade,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
    })
    .eq('id', id)
    .select()
    .single();
 
  if (error) throw error;
  return data;
}
 
// ─────────────────────────────────────────────────────────────────────────
// Remove uma tarefa.
// ─────────────────────────────────────────────────────────────────────────
export async function deleteTask(id) {
  const { error } = await supabase.from('tasks').delete().eq('id', id);
  if (error) throw error;
}
 
// ─────────────────────────────────────────────────────────────────────────
// Inverte o status de conclusão de uma tarefa.
// ─────────────────────────────────────────────────────────────────────────
export async function toggleConcluida(id, valorAtual) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ concluida: !valorAtual })
    .eq('id', id)
    .select()
    .single();
 
  if (error) throw error;
  return data;
}
 