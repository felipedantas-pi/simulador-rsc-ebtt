/**
 * Dados extraídos de Planilha_RSC.xlsx (RSC_I, RSC_II, RSC_III, Anexo_III).
 * Cada nível tem grupos (diretrizes I, II, III...). Cada grupo tem:
 *   weight   -> peso aplicado ao subtotal do grupo (coluna B do Anexo III)
 *   cap      -> pontuação máxima válida do grupo (coluna C do Anexo III) = weight * 10
 *   items[]  -> { desc, factor, unit, max, round }
 * Pontuação do item = factor * quantidade informada (arredondada se round=true).
 * Subtotal do grupo = soma da pontuação dos itens.
 * Pontuação obtida do grupo (Anexo III) = weight * subtotal.
 * Pontuação válida do grupo = MIN(obtida, cap).
 * Subtotal do nível = soma das pontuações válidas dos grupos (máx. 100).
 * Total geral = soma dos 3 níveis (máx. 300).
 */
const RSC_DATA = {
  I: {
    label: "RSC I",
    groups: [
      {
        title: "I - Experiência na área de formação e/ou atuação do docente, anterior ao ingresso na Instituição, contemplando o impacto de suas ações nas demais diretrizes dispostas para todos os níveis do RSC",
        weight: 1, cap: 10,
        items: [
          { desc: "Gestão Escolar (Direção, Assistente de Direção, Gerente)", factor: 0.25, unit: "mês", max: 40 },
          { desc: "Gestão Escolar (Supervisão, Coordenação, Orientação Educacional)", factor: 0.15, unit: "mês", max: 66 },
          { desc: "Exercício de Magistério (Educação Infantil, Básica e Superior)", factor: 0.15, unit: "mês", max: 66 },
          { desc: "Gestão Iniciativa Privada na Área de Atuação (Presidência, Superintendência, Direção, Gerência, Chefia, Supervisão e coordenação em Empresas ou Entidades)", factor: 0.17, unit: "mês", max: 60 },
          { desc: "Experiência na área de atuação ou formação em nível técnico, administrativo, operacional, comercial ou profissional liberal", factor: 0.08, unit: "mês", max: 120 },
          { desc: "Participação em Colegiados ou Conselhos de Empresas, Entidades ou Instituições de ensino", factor: 0.17, unit: "mês", max: 60 },
          { desc: "Atividade em Organizações Sociais e Assistenciais", factor: 0.17, unit: "mês", max: 60 },
          { desc: "Atividades na função de Instrutor em capacitação ou treinamento em empresas, instituições de ensino ou entidades", factor: 0.08, unit: "mês", max: 120 },
          { desc: "Atuação como conferencista ou palestrante", factor: 0.4, unit: "evento", max: 25 },
          { desc: "Participação em conferência, palestra, seminários, simpósio, colóquio, congresso ou similares", factor: 0.17, unit: "evento", max: 60 },
          { desc: "Avaliação de projetos, protótipos e invenções", factor: 1, unit: "evento", max: 10 },
          { desc: "Participação em comissões e representações institucionais, sindicais e profissionais", factor: 0.17, unit: "mês", max: 60 },
          { desc: "Produção de material didático e/ou implantação de ambientes de aprendizagem, nas atividades de ensino, pesquisa, extensão e/ou inovação, artigo completo publicado em periódico científico ou apresentação artística em mostras ou similares, na área/subárea do curso", factor: 0.5, unit: "material", max: 20 },
          { desc: "Revisão técnica, tradução ou organização de material didático, paradidático em atividades de ensino, pesquisa, extensão e/ou inovação", factor: 1, unit: "material", max: 10 },
          { desc: "Participação em processo seletivo em bancas de avaliação acadêmica e/ou de concurso, grupo de trabalho, oficinas institucionais, visitas técnicas com alunos, projetos de interesse institucional de ensino, pesquisa, extensão e/ou inovação, projetos e/ou práticas pedagógicas de reconhecida relevância.", factor: 0.1, unit: "atividade concluída", max: 100 },
          { desc: "Participação no desenvolvimento de protótipos, depósitos e/ou registros de propriedade intelectual", factor: 5, unit: "atividade concluída", max: 2 },
          { desc: "Prêmios por atividades científicas, artísticas, esportivas e culturais", factor: 5, unit: "prêmio", max: 2 },
          { desc: "Organização de eventos científicos, tecnológicos, esportivos, sociais, filantrópicos ou culturais", factor: 2, unit: "evento", max: 5 },
        ],
      },
      {
        title: "II - Cursos de capacitação e/ou graduação na área de interesse institucional",
        weight: 1, cap: 10,
        items: [
          { desc: "Participação em conferência, palestra, seminário, simpósio, colóquio, workshop, congresso ou similares", factor: 0.25, unit: "evento", max: 40 },
          { desc: "Cursos de aperfeiçoamento (carga horária mínima de 120 h em certificado individual ou soma de até 5 certificados)", factor: 10, unit: "curso concluído", max: 1 },
        ],
      },
      {
        title: "III - Atuação nos diversos níveis e modalidades de educação",
        weight: 2, cap: 20,
        items: [
          { desc: "Cursos de Formação Inicial e Continuada - FIC", factor: 0.055, unit: "mês", max: 180 },
          { desc: "Curso de formação de professores", factor: 0.055, unit: "mês", max: 180 },
          { desc: "Proeja, EJA ou outro programa de ensino formal", factor: 0.055, unit: "mês", max: 180 },
          { desc: "Técnico: integrado, concomitante, subsequente", factor: 0.055, unit: "mês", max: 180 },
          { desc: "Superior (Bacharelado, Licenciatura e Tecnológico)", factor: 0.055, unit: "mês", max: 180 },
          { desc: "Pós Graduação lato sensu", factor: 0.055, unit: "mês", max: 180 },
        ],
      },
      {
        title: "IV - Atuação em comissões e representações institucionais, de classes e profissionais, contemplando o impacto de suas ações nas demais diretrizes dispostas para todos os níveis do RSC",
        weight: 1, cap: 10,
        items: [
          { desc: "Participação como TITULAR em Atividades Regulares previstas em Lei, Estatuto ou Regimento (conselhos, colegiados, ou comissões de ética, CPPD, CPA, ou outras de interesse da instituição)", factor: 0.17, unit: "mês", max: 60 },
          { desc: "Participação como SUPLENTE em Atividades Regulares previstas em Lei, Estatuto ou Regimento (conselhos, colegiados, ou comissões de ética, CPPD, CPA, ou outras de interesse da instituição)", factor: 0.08, unit: "mês", max: 120 },
          { desc: "Participação como TITULAR em conselhos de classe e profissionais", factor: 0.17, unit: "mês", max: 60 },
          { desc: "Participação como SUPLENTE em conselhos de classe e profissionais", factor: 0.08, unit: "mês", max: 120 },
          { desc: "Membro da gestão sindical (presidente, diretor e conselheiro)", factor: 0.21, unit: "mês", max: 48 },
          { desc: "Participação em Comissão de Processo administrativo disciplinar, Sindicância e Processo ético", factor: 5, unit: "processo", max: 2 },
          { desc: "Trabalho Desenvolvido no âmbito do MEC (cessão)", factor: 0.21, unit: "mês", max: 48 },
          { desc: "Comissão ou Grupo de trabalho de caráter pedagógico e Núcleos Docentes Estruturante - NDE", factor: 0.14, unit: "mês", max: 72 },
        ],
      },
      {
        title: "V - Produção de material didático e/ou implantação de ambientes de aprendizagem, nas atividades de ensino, pesquisa, extensão e/ou inovação",
        weight: 1, cap: 10,
        items: [
          { desc: "Produção de apostilas, livros didáticos, manuais técnicos, apresentações, roteiros técnicos, culturais e esportivos e outros instrumentos didáticos", factor: 0.5, unit: "material", max: 20 },
          { desc: "Projeto e implantação de ambientes de ensino/aprendizagem, laboratórios, oficinas, estúdios, salas ou áreas para práticas esportivas", factor: 5, unit: "projeto implantado", max: 2 },
        ],
      },
      {
        title: "VI - Atuação na gestão acadêmica e institucional, contemplando o impacto de suas ações individuais nas demais diretrizes dispostas para todos os níveis da RSC",
        weight: 2, cap: 20,
        items: [
          { desc: "Cargo de Direção 1", factor: 0.21, unit: "mês", max: 48 },
          { desc: "Cargo de Direção 2", factor: 0.21, unit: "mês", max: 48, round: true },
          { desc: "Cargo de Direção 3", factor: 0.21, unit: "mês", max: 48, round: true },
          { desc: "Cargo de Direção 4", factor: 0.21, unit: "mês", max: 48, round: true },
          { desc: "Função gratificada ou não gratificada de Coordenação de Área, Curso ou de atividades administrativas nomeadas pelo Reitor ou Diretor de câmpus", factor: 0.21, unit: "mês", max: 48, round: true },
        ],
      },
      {
        title: "VII - Participação em processos seletivos, em bancas de avaliação acadêmica e/ou de concursos",
        weight: 1, cap: 10,
        items: [
          { desc: "Banca de Concurso Público, elaboração de provas de concurso público, correção de prova de concurso público", factor: 5, unit: "concurso", max: 2 },
          { desc: "Banca de Seleção de Professor substituto/temporário", factor: 2, unit: "banca", max: 5 },
          { desc: "Bancas para aprovações do programa CERTIFIC e equivalentes", factor: 0.1, unit: "candidato", max: 80 },
          { desc: "TCC de cursos de graduação", factor: 0.3, unit: "banca", max: 40 },
          { desc: "TCC ou Monografia de Curso de Especialização", factor: 0.5, unit: "banca", max: 20 },
          { desc: "Processo seletivo para aprovações em programas e projetos institucionais", factor: 0.1, unit: "candidato", max: 80 },
        ],
      },
      {
        title: "VIII - Outras graduações, na área de interesse, além daquela que o habilita e define o nível de RSC pretendido, no âmbito do plano de qualificação institucional",
        weight: 1, cap: 10,
        items: [
          { desc: "Curso adicional de graduação", factor: 10, unit: "curso concluído", max: 1 },
        ],
      },
    ],
  },

  II: {
    label: "RSC II",
    groups: [
      {
        title: "I - Orientação do corpo discente em atividades de ensino, extensão, pesquisa e/ou inovação",
        weight: 2, cap: 20,
        items: [
          { desc: "Orientação ou co-orientação de TCC de cursos técnicos", factor: 0.4, unit: "orientação concluída", max: 25 },
          { desc: "Orientação ou co-orientação de TCC de cursos de graduação", factor: 0.5, unit: "orientação concluída", max: 20 },
          { desc: "Orientação ou co-orientação de TCC ou Monografia de especialização", factor: 0.5, unit: "orientação concluída", max: 20 },
          { desc: "Orientação de bolsista de pesquisa", factor: 1, unit: "orientação concluída", max: 10 },
          { desc: "Orientação de bolsistas de extensão", factor: 1, unit: "orientação concluída", max: 10 },
          { desc: "Orientação de estágios curriculares obrigatório ou não", factor: 0.17, unit: "mês", max: 60 },
          { desc: "Supervisão de estágios curriculares obrigatórios ou não", factor: 0.17, unit: "mês", max: 60 },
          { desc: "Orientação ou supervisão de atividades extra curriculares de ensino, pesquisa e extensão", factor: 0.17, unit: "aluno", max: 60 },
        ],
      },
      {
        title: "II - Participação no desenvolvimento de protótipos, depósitos e/ou registros de propriedade intelectual",
        weight: 1, cap: 10,
        items: [
          { desc: "Propriedade intelectual (patente, registro)", factor: 10, unit: "patente ou registro", max: 1 },
          { desc: "Produto ou processo não patenteado, protótipo, software não registrado e similares", factor: 2, unit: "desenvolvimento concluído", max: 5 },
        ],
      },
      {
        title: "III - Participação em grupos de trabalho e oficinas institucionais",
        weight: 1, cap: 10,
        items: [
          { desc: "Participação em núcleo de inovação tecnológica ou atividades correlatas", factor: 0.21, unit: "mês", max: 48 },
        ],
      },
      {
        title: "IV - Participação no desenvolvimento de projetos, de interesse institucional, de ensino, pesquisa, extensão e/ou inovação",
        weight: 2, cap: 20,
        items: [
          { desc: "Coordenação de projetos de ensino, pesquisa, inovação tecnológica e extensão na própria instituição de ensino", factor: 2.5, unit: "projeto", max: 4 },
          { desc: "Participação como executor de projeto de ensino, pesquisa, inovação tecnológica e extensão na própria instituição de ensino", factor: 2.5, unit: "projeto", max: 4 },
          { desc: "Participação em projetos de ensino, pesquisa, inovação tecnológica e extensão na própria instituição de ensino", factor: 1.25, unit: "projeto", max: 8 },
        ],
      },
      {
        title: "V - Participação no desenvolvimento de projetos e/ou práticas pedagógicas de reconhecida relevância",
        weight: 2, cap: 20,
        items: [
          { desc: "Coordenação de Projetos Integradores", factor: 2.5, unit: "projeto", max: 4 },
          { desc: "Participação em Projetos Integradores", factor: 1.25, unit: "projeto", max: 8 },
        ],
      },
      {
        title: "VI - Participação na organização de eventos científicos, tecnológicos, esportivos, sociais e/ou culturais",
        weight: 1, cap: 10,
        items: [
          { desc: "Participação na organização de congresso e simpósio", factor: 2, unit: "evento", max: 5 },
          { desc: "Participação na organização de workshop, seminário, mostra", factor: 2, unit: "evento", max: 5 },
          { desc: "Participação na organização de eventos esportivos, sociais, culturais e filantrópicas", factor: 1, unit: "evento", max: 10 },
          { desc: "Participação na organização de palestra", factor: 1, unit: "evento", max: 10 },
        ],
      },
      {
        title: "VII - Outras pós-graduações lato sensu, na área de interesse, além daquela que o habilita e define o nível de RSC pretendido, no âmbito do plano de qualificação institucional",
        weight: 1, cap: 10,
        items: [
          { desc: "Curso de aperfeiçoamento", factor: 5, unit: "curso concluído", max: 2 },
          { desc: "Curso de especialização", factor: 10, unit: "curso concluído", max: 1 },
        ],
      },
    ],
  },

  III: {
    label: "RSC III",
    groups: [
      {
        title: "I - Desenvolvimento, produção e transferência de tecnologias",
        weight: 1, cap: 10,
        items: [
          { desc: "Elaboração e utilização de protótipo e tecnologia com aplicação em ensino, pesquisa e extensão", factor: 10, unit: "contrato ou licenciamento", max: 1 },
          { desc: "Contratos de transferência de tecnologia e licenciamento", factor: 10, unit: "contrato ou licenciamento", max: 1 },
        ],
      },
      {
        title: "II - Desenvolvimento de pesquisas e aplicação de métodos e tecnologias educacionais que proporcionem a interdisciplinaridade e a integração de conteúdos acadêmicos na educação profissional e tecnológica ou na educação básica",
        weight: 2, cap: 20,
        items: [
          { desc: "Participação em elaboração de PPC de curso de Pós-graduação", factor: 2.5, unit: "PPC", max: 4 },
          { desc: "Participação em elaboração de PPC de curso de Graduação", factor: 2.5, unit: "PPC", max: 4 },
          { desc: "Participação em elaboração de PPC de curso Técnicos Integrados, subsequentes e concomitantes", factor: 2.5, unit: "PPC", max: 4 },
          { desc: "Participação em elaboração de PPC de curso FIC", factor: 2, unit: "PPC", max: 5 },
          { desc: "Participação em reformulação de PPC de curso de Pós-graduação", factor: 2.5, unit: "PPC", max: 4 },
          { desc: "Participação em reformulação de PPC de curso de Graduação", factor: 2.5, unit: "PPC", max: 4 },
          { desc: "Participação em reformulação de PPC de curso de Técnicos Integrados, subsequentes e concomitantes", factor: 2.5, unit: "PPC", max: 4 },
          { desc: "Participação em reformulação de PPC de curso FIC", factor: 2.5, unit: "PPC", max: 5 },
        ],
      },
      {
        title: "III - Desenvolvimento de pesquisas e atividades de extensão que proporcionem a articulação institucional com os arranjos sociais, culturais e produtivos",
        weight: 2, cap: 20,
        items: [
          { desc: "Captação de recursos em projetos de pesquisa, inovação tecnológica e extensão na própria instituição", factor: 5, unit: "projeto", max: 2 },
          { desc: "Coordenação e/ou participação em núcleo de inovação tecnológica", factor: 0.21, unit: "mês", max: 48 },
          { desc: "Coordenação e/ou participação em cursos de extensão", factor: 0.17, unit: "mês", max: 60 },
        ],
      },
      {
        title: "IV - Atuação em projetos e/ou atividades em parceria com outras instituições",
        weight: 1, cap: 10,
        items: [
          { desc: "Captação de recursos em projetos de pesquisa, inovação tecnológica e extensão em parceria com outras instituições", factor: 5, unit: "projeto", max: 2 },
          { desc: "Coordenação de projetos de pesquisa e inovação tecnológica em parceria com outras instituições", factor: 5, unit: "projeto", max: 2 },
          { desc: "Coordenação ou participação em equipe diretiva visando a implantação de Unidade de Ensino", factor: 2, unit: "projeto", max: 5 },
          { desc: "Participação em projetos de pesquisa e inovação tecnológica em parceria com outras instituições", factor: 2, unit: "projeto", max: 5 },
          { desc: "Liderança de grupo de pesquisa", factor: 0.17, unit: "mês", max: 60 },
        ],
      },
      {
        title: "V - Atuação em atividades de assistência técnica nacional e/ou internacional",
        weight: 1, cap: 10,
        items: [
          { desc: "Trabalhos técnicos e consultorias internacionais", factor: 10, unit: "atividade concluída", max: 1 },
          { desc: "Trabalhos técnicos e consultorias nacionais", factor: 2, unit: "atividade concluída", max: 5 },
          { desc: "Trabalhos técnicos e consultorias regionais", factor: 2, unit: "atividade concluída", max: 5 },
          { desc: "Consultorias a órgãos internacionais especializados de gestão científica, tecnológica ou cultural, ou consultorias técnicas prestadas a órgãos públicos e privados", factor: 5, unit: "consultoria realizada", max: 2 },
          { desc: "Consultorias a órgãos nacionais especializados de gestão científica, tecnológica ou cultural, ou consultorias técnicas prestadas a órgãos públicos e privados", factor: 1, unit: "consultoria realizada", max: 10 },
        ],
      },
      {
        title: "VI - Outras pós-graduações stricto sensu, na área de interesse, além daquela que o habilita e define o nível de RSC pretendido, no âmbito do plano de qualificação institucional",
        weight: 1, cap: 10,
        items: [
          { desc: "Curso stricto sensu", factor: 10, unit: "curso concluído", max: 1 },
        ],
      },
      {
        title: "VII - Produção acadêmica e/ou tecnológica, nas atividades de ensino, pesquisa, extensão e/ou inovação",
        weight: 2, cap: 20,
        items: [
          { desc: "Prêmios por atividades científicas, artísticas, esportivas e culturais", factor: 2, unit: "prêmio", max: 5 },
          { desc: "Publicação de livro especializado", factor: 5, unit: "livro", max: 2 },
          { desc: "Publicação de capítulo de livro especializado", factor: 2.5, unit: "livro", max: 4 },
          { desc: "Tradutor de livro especializado", factor: 5, unit: "livro", max: 2 },
          { desc: "Revisor técnico de livro especializado", factor: 1.25, unit: "livro", max: 8 },
          { desc: "Publicação de artigo em revista indexada", factor: 2.5, unit: "artigo", max: 4 },
          { desc: "Publicação de artigo em revista não indexada", factor: 1.25, unit: "artigo", max: 8 },
          { desc: "Publicação de relatório de pesquisa interno", factor: 1.25, unit: "relatório", max: 8 },
          { desc: "Apresentação ou publicação de trabalho de pesquisa em evento internacional", factor: 2.5, unit: "trabalho", max: 4 },
          { desc: "Apresentação ou publicação de trabalho de pesquisa em evento nacional", factor: 1, unit: "trabalho", max: 10 },
          { desc: "Apresentação ou publicação de trabalho de pesquisa em evento regional", factor: 1, unit: "trabalho", max: 10 },
          { desc: "Coordenação de ações de extensão (visitas, eventos externos, parcerias, ações sociais ou outros similares)", factor: 0.5, unit: "evento", max: 20 },
          { desc: "Participação como membro de projeto de extensão", factor: 0.5, unit: "participação", max: 20 },
          { desc: "Ministrante de unidade curricular ou disciplina de curso de ensino, pesquisa ou extensão", factor: 0.5, unit: "disciplina", max: 20 },
        ],
      },
    ],
  },
};
