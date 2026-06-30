-- =====================================================================
-- Iracambi Raiz Verde — DADOS DE EXEMPLO (apenas para TESTES)
-- ---------------------------------------------------------------------
-- Insere alguns PROJETOS (áreas) de exemplo para que você consiga testar:
--   • o seletor de área em "Admin › Nova Atualização";
--   • a exibição dos projetos no site público, no painel e no mapa;
--   • a sincronização admin → usuários.
--
-- COMO USAR:
--   1. Abra o Supabase do projeto → SQL Editor.
--   2. Cole este arquivo inteiro e clique em "Run".
--
-- É seguro rodar mais de uma vez: não duplica (verifica pelo nome).
-- Para REMOVER os exemplos depois, role até o final ("LIMPEZA").
-- =====================================================================

insert into public.areas (nome, descricao, objetivo, status, tamanho, meta_arvores, geojson)
select v.nome, v.descricao, v.objetivo, v.status, v.tamanho, v.meta_arvores, v.geojson::jsonb
from (values
  (
    'Reserva Córrego Fundo',
    'Área de nascente em recuperação na Zona da Mata mineira, com foco em proteção hídrica.',
    'Reflorestar a mata ciliar para proteger a nascente e ampliar o corredor ecológico.',
    'ativo',
    42.5,
    5000,
    '{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-42.219,-20.388],[-42.211,-20.388],[-42.211,-20.394],[-42.219,-20.394],[-42.219,-20.388]]]}}'
  ),
  (
    'Trilha das Águas',
    'Encosta antes degradada por pastagem, agora em processo de regeneração assistida.',
    'Plantar espécies nativas pioneiras e secundárias para acelerar a sucessão florestal.',
    'em_andamento',
    28.0,
    3200,
    '{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-42.208,-20.397],[-42.200,-20.397],[-42.200,-20.403],[-42.208,-20.403],[-42.208,-20.397]]]}}'
  ),
  (
    'Mata do Cruzeiro',
    'Fragmento florestal em conexão com a reserva principal da Iracambi.',
    'Enriquecer o fragmento com mudas nativas e monitorar a fauna que retorna.',
    'ativo',
    63.7,
    8000,
    '{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-42.230,-20.382],[-42.221,-20.382],[-42.221,-20.389],[-42.230,-20.389],[-42.230,-20.382]]]}}'
  ),
  (
    'Viveiro Comunitário Limeira',
    'Projeto-piloto concluído de produção de mudas com a comunidade local.',
    'Produzir mudas nativas para abastecer os demais projetos de reflorestamento.',
    'concluido',
    5.4,
    1500,
    '{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-42.214,-20.405],[-42.209,-20.405],[-42.209,-20.409],[-42.214,-20.409],[-42.214,-20.405]]]}}'
  )
) as v(nome, descricao, objetivo, status, tamanho, meta_arvores, geojson)
where not exists (
  select 1 from public.areas a where a.nome = v.nome
);

-- (Opcional) Uma atualização de exemplo para a primeira área, só para
-- popular a timeline/últimas atualizações. Remova o bloco se não quiser.
insert into public.area_updates (area_id, data, arvores, especies, observacao, status)
select a.id, current_date - 7, 320, array['Ipê-amarelo','Jacarandá','Aroeira'],
       'Primeiro mutirão de plantio na borda da nascente.', 'plantio'
from public.areas a
where a.nome = 'Reserva Córrego Fundo'
  and not exists (
    select 1 from public.area_updates u
    where u.area_id = a.id and u.observacao = 'Primeiro mutirão de plantio na borda da nascente.'
  );

-- =====================================================================
-- LIMPEZA — rode SOMENTE quando quiser apagar os dados de exemplo.
-- (As atualizações ligadas a essas áreas são removidas em cascata.)
-- ---------------------------------------------------------------------
-- delete from public.areas
-- where nome in (
--   'Reserva Córrego Fundo',
--   'Trilha das Águas',
--   'Mata do Cruzeiro',
--   'Viveiro Comunitário Limeira'
-- );
-- =====================================================================
