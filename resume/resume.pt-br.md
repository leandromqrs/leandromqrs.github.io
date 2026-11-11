---
pages: 3
css: terminal.css
output: ../public/assets/Leandro-Rodrigues-CV-pt-br
style:
  font-family: "'JetBrains Mono', monospace"
  font-size: 9.5pt
  text-color: '#0e110e'
  link-color: '#0b6b2e'
  background-color: '#ffffff'
  name-size: 19pt
  name-caps: normal
  section-title-size: 11pt
  section-title-color: '#0e110e'
  section-title-border: '1px solid #bcc2bc'
  link-underline: none
  auto-icons: none
  header-align: left
  page-margin-x: 0.6in
  page-margin-y: 0.55in
  section-gap: 14px
validate:
  rules:
    long-bullet: off
---

# Leandro Marques Rodrigues

Brasília, DF, Brasil

+55 (61) 98174-2374 | leandromqrs@hotmail.com

[leandromqrs.dev](https://leandromqrs.dev/pt-br/) | [linkedin.com/in/leandromqrs](https://linkedin.com/in/leandromqrs) | [github.com/leandromqrs](https://github.com/leandromqrs)

Engenheiro de software full stack sênior com mais de 5 anos de experiência em sistemas corporativos com Java, Spring Boot e Quarkus. Atuou no QWControl, plataforma comercial de automação de workloads que concorre com o Control-M, e hoje entrega APIs e microsserviços para a CASSI na Stefanini. Usa Claude Code, Codex e MCP no desenvolvimento.

## Experiência Profissional

### Stefanini Group - CASSI || Nov 2024 - Atual

_Desenvolvedor Full Stack Sênior_ || Remoto

Cliente: CASSI, plano de saúde dos funcionários do Banco do Brasil, com mais de 600 mil beneficiários.

- Desenvolvimento de APIs RESTful e serviços SOAP com Spring Boot, Spring MVC, Spring Data e Quarkus, aplicando SOLID e padrões de design
- Implementação de arquiteturas de microsserviços que aumentaram a escalabilidade do sistema em 60% e reduziram custos de manutenção em 35%
- Desenvolvimento em Java 8 e Java 11 com Streams, lambdas e APIs de concorrência
- Acesso a dados em SQL Server, PostgreSQL, MySQL, MongoDB e Cassandra com JPA e Hibernate
- Entrega de 15+ projetos em produção com 100% de conformidade aos requisitos, com equipes de desenvolvimento, QA e infraestrutura
- Integração de RabbitMQ e Kafka para comunicação assíncrona entre serviços
- Integração contínua com Git e Azure DevOps, contribuindo para pipelines de CI/CD, e testes automatizados com JUnit e Mockito
- Desenvolvimento em C# e ASP&#46;NET, e frontends com React.js, Next.js e TypeScript
- Liderança técnica de equipes sob metodologias ágeis
- Construção de integrações MCP (Model Context Protocol) conectadas ao Azure, e uso de Claude Code e Codex para geração de código, revisão de pull requests e análise estática de código legado

### QW Software (Grupo Vernet) || Mar 2022 - Nov 2024

_Desenvolvedor Full Stack_ || Brasília, DF

A QW Software desenvolve o QWControl, plataforma comercial de automação de workloads com orquestração de workflows, integração com SAP e monitoramento operacional para clientes de médio e grande porte.

- Manutenção e desenvolvimento da plataforma com Java, Groovy, Grails, Quartz e Oracle, modularizando o sistema sob o padrão MVC
- Liderança técnica da modularização que dividiu o código único em módulos e plugins Grails independentes carregados pelo núcleo, com 1.600+ commits desde 2022
- Desenvolvimento de 50+ plugins personalizados que integram a ferramenta com SAP R3 (criação e monitoramento de jobs), NetBackup, bancos SQL, sistemas legados e transferência de arquivos por SFTP, FTPS e z/OS, reduzindo em 40% o tempo de execução de tarefas operacionais
- Desenvolvimento do dashboard de VMware, do dashboard de monitoramento de jobs diários e do editor visual do Rule Flow com Vue.js e TypeScript
- Liderança de times multidisciplinares com até 5 desenvolvedores, sob metodologias ágeis
- Redesenho da infraestrutura com containers, cluster, alta disponibilidade e load balancing
- Contribuição para a automação de CI/CD e DevOps com Gradle e Docker

### IDVLab (Grupo Vernet) || Fev 2022 - Nov 2022

_Analista de Sistemas_ || Brasília, DF

A IDVLab desenvolve soluções de monitoramento e infraestrutura de TI para ambientes físicos e digitais com IoT.

- Desenvolvimento de dashboards de monitoramento de sala de servidores em Node-RED, com gateways enviando dados por MQTT
- Manutenção dos sites de monitoramento e novas telas de monitoramento conforme os requisitos do cliente

### Tribunal de Contas da União || Out 2021 - Mai 2022

_Estagiário_ || Brasília, DF

- Desenvolvimento e manutenção de aplicações em Oracle Apex com JavaScript, SQL e PL/SQL, para o órgão de controle externo do governo federal

## Trabalhos por Contrato

### Prodesp || 3 meses

_Desenvolvedor_ || Remoto

A Prodesp é a companhia de processamento de dados do governo do estado de São Paulo.

- Desenvolvimento e manutenção de uma aplicação em Visual Basic que registra o usuário atual de cada máquina para o inventário do agente Snow
- Consultas em SQL Server que removem dados duplicados do inventário, melhorando a precisão do processo

### DATASUS / Fiocruz (FIOTEC) || 8 meses

_Engenheiro de Software, consultoria_ || Remoto

O DATASUS é o departamento de informática do SUS. A FIOTEC é a fundação de apoio da Fiocruz.

- Estudo e evolução da arquitetura backend em Java 8 e Spring Boot da RNDS (Rede Nacional de Dados em Saúde), com foco em modularização, escalabilidade e manutenção
- Migração dos serviços em que atuei de Java 8/11 e Spring Boot 2.x para Java 21 e Spring Boot 3.5, com parte deles em Java 25 e Spring Boot 4, e atualização da wiki de arquitetura de microsserviços modulares e padrões de integração
- Native images do GraalVM testadas em homologação em 6 serviços: memória de 64% a 94% menor (666 para 41 MiB no gateway de busca) e inicialização em menos de 2 segundos
- Remoção do config server em 8 serviços, com as configurações movidas para variáveis de ambiente e variáveis de CI/CD por escopo, de modo que os pods não dependem mais dele para subir e escalar
- Correção de um vazamento de file descriptors no serviço de PDF que derrubava pods, e dos limites de memória do ZGC e do container que reiniciavam pods de desenvolvimento
- Elasticsearch para busca e indexação de dados em larga escala, e apoio na estruturação de ambientes AWS para escalabilidade e resiliência

### DataCore Solutions || 6 meses

_Desenvolvedor Backend_ || Remoto

A DataCore desenvolve integrações e processamento de dados em larga escala para clientes de telecomunicações e serviços.

- Jobs com Spring Batch em Java 8 e 17 que transformam arquivos de faturamento em notificações por PDF, e-mail e SMS para operadoras de telecomunicações, divididos em lotes de 1.000 registros e renderizados em paralelo
- Entrega dos arquivos gerados a motores de distribuição, com empacotamento, criptografia e controle de capacidade entre as etapas
- Job de replicação de banco, webhook de status de bounce e atualização de status entre SQL Server e Oracle com retries e classificação de erros
- Consumidor do hub de notificações em Kafka e Azure Event Hubs

## Habilidades

Linguagens de programação
: Java, Groovy, Kotlin, Python, C#, TypeScript, JavaScript, Rust

Desenvolvimento backend
: Spring Boot, Spring MVC, Spring Data, Spring Batch, Quarkus, Grails, Django, Jakarta EE, JPA, Hibernate, APIs RESTful, SOAP, microsserviços

Desenvolvimento frontend
: Vue.js, React, Next.js, Angular, AstroJS, NodeJS, HTML, CSS, Bootstrap, ASP&#46;NET

Cloud e DevOps
: AWS, GCP, Azure, Azure DevOps, Docker, Kubernetes, OpenShift, Rancher, Jenkins, Linux, administração de sistemas

Bancos de dados
: Oracle, PostgreSQL, SQL Server, MySQL, MongoDB, Cassandra, DB2, Elasticsearch

Mensageria e integração
: Kafka, RabbitMQ, SAP R3, MQTT, Quartz

Testes e ferramentas
: JUnit, Mockito, Spock, Selenium, Git, GitHub, GitLab, Bitbucket, Jira, Gradle

Engenharia de IA
: Claude Code, Codex, MCP, revisão de código assistida por IA, análise estática

Idiomas
: Português (fluente), Inglês (B2)

## Educação

### Engenharia de Software, MBA || Universidade de São Paulo, Abr 2024 - Atual

### Ciência da Computação, Bacharelado || Centro Universitário de Brasília, 2022 - 2024

### Ciência da Computação, Bacharelado || Instituto Federal de Brasília, 2019 - 2022

## Certificações

- Docker para Iniciantes
- Spring Framework
- Metodologias Ágeis
- AWS Educate

## Projetos Notáveis

**Plataforma modular do QWControl, QW Software** - Divisão de uma plataforma comercial de automação de workloads, construída sobre o Rundeck, de um código único para um núcleo que carrega módulos e plugins independentes, para que cada funcionalidade tenha build, testes e verificação de licença próprios. Java, Groovy, Grails, Gradle. [Detalhes](https://leandromqrs.dev/work/qwcontrol-modular-platform/)

**Dashboard de VMware, QWControl** - Estado de hosts e VMs, operações de energia, coleta de métricas por hora e relatórios em PDF, CSV e XLSX, atrás de uma verificação de licença por funcionalidade. Java, Groovy, Grails, Vue.js, API do vSphere, Jasper Reports. [Detalhes](https://leandromqrs.dev/work/vm-monitor-dashboard/)

**Plugins de integração, QWControl** - Passos de job que executam jobs SAP R3, políticas do NetBackup, scripts SQL e transferências de arquivos para hosts Linux e z/OS. Java, Groovy, SAP JCo, JDBC, SSHJ. [Detalhes](https://leandromqrs.dev/work/qwcontrol-integration-plugins/)

**Editor Rule Flow e monitoramento de jobs diários, QWControl** - Um editor visual que executa os passos de um job por regras e condições, e um dashboard do plano do dia com ações por job. Vue.js, TypeScript, Vue Flow, Groovy, Quartz. [Detalhes](https://leandromqrs.dev/pt-br/work/)

**Pipeline de notificações, DataCore Solutions** - Jobs Spring Batch que transformam arquivos de faturamento em notificações por PDF, e-mail e SMS para operadoras de telecomunicações, em lotes de 1.000 registros, com renderização paralela e entrega baseada em arquivos. Java, Spring Batch, SQL Server, Oracle. [Detalhes](https://leandromqrs.dev/work/file-system-as-message-bus/)

**Gateway de proxy de APIs, CASSI** - Um proxy cujas rotas, mapeamentos de campos e fluxos com várias chamadas ficam no banco e mudam sem deploy, com credenciais criptografadas e renovação de token. Java, Spring Boot, SQL Server. [Detalhes](https://leandromqrs.dev/work/runtime-routes-from-a-database/)

**Modernização dos serviços da RNDS, DATASUS** - Serviços de backend da rede nacional de dados em saúde migrados de Java 8/11 e Spring Boot 2.x para Java 21 e Spring Boot 3.5, com Java 25 e Spring Boot 4 em desenvolvimento, native images do GraalVM que reduziram a memória em 64% a 94% em homologação e o config server removido. Java, Spring Boot, GraalVM, Kubernetes. [Detalhes](https://leandromqrs.dev/work/graalvm-native-images-spring-boot/)

**Aetheris, projeto pessoal** - Cliente Kubernetes nativo para o desktop GNOME. Rust. [Detalhes](https://leandromqrs.dev/pt-br/blog/developing-aetheris/)
