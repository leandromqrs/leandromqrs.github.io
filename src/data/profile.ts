export type Locale = 'en' | 'pt-br';

interface Localized<T> {
	en: T;
	'pt-br': T;
}

export interface Experience {
	company: string;
	role: Localized<string>;
	period: Localized<string>;
	summary: Localized<string>;
	stack: string[];
	workName?: string;
	contract?: boolean;
}

export const companyAnchor = (company: string) => company.split(/[ ,(/]/)[0].toLowerCase();

export interface SkillGroup {
	name: Localized<string>;
	items: string[];
}

export interface EducationEntry {
	title: Localized<string>;
	school: string;
	period: Localized<string>;
}

export const experience: Experience[] = [
	{
		company: 'Stefanini Group, CASSI',
		role: { en: 'Senior Full Stack Developer', 'pt-br': 'Desenvolvedor Full Stack Sênior' },
		period: { en: 'Nov 2024 - Present', 'pt-br': 'Nov 2024 - Atual' },
		summary: {
			en: 'APIs and microservices for CASSI, the health plan of Banco do Brasil employees, with 600k+ beneficiaries. The microservice architecture raised scalability by 60% and cut maintenance costs by 35%.',
			'pt-br':
				'APIs e microsserviços para a CASSI, plano de saúde dos funcionários do Banco do Brasil, com mais de 600 mil beneficiários. A arquitetura de microsserviços elevou a escalabilidade em 60% e reduziu os custos de manutenção em 35%.',
		},
		stack: ['Java', 'Spring Boot', 'Quarkus', 'Kafka', 'RabbitMQ', 'Azure DevOps', 'React'],
		workName: 'CASSI',
	},
	{
		company: 'QW Software (Grupo Vernet)',
		role: { en: 'Full Stack Developer', 'pt-br': 'Desenvolvedor Full Stack' },
		period: { en: 'Mar 2022 - Nov 2024', 'pt-br': 'Mar 2022 - Nov 2024' },
		summary: {
			en: 'QWControl is a commercial workload automation platform that competes with Control-M. I led its modularization, wrote 50+ integration plugins, built the VMware dashboard, the monitoring board and the Rule Flow editor, and led teams of up to 5 developers.',
			'pt-br':
				'O QWControl é uma plataforma comercial de automação de workloads que concorre com o Control-M. Liderei a modularização, escrevi mais de 50 plugins de integração, construí o dashboard de VMware, o dashboard de monitoramento de jobs e o editor de Rule Flow, e liderei times de até 5 desenvolvedores.',
		},
		stack: ['Java', 'Groovy', 'Grails', 'Vue.js', 'Quartz', 'SAP R3', 'Docker'],
		workName: 'QW Software',
	},
	{
		company: 'Prodesp',
		contract: true,
		role: { en: 'Developer', 'pt-br': 'Desenvolvedor' },
		period: { en: '3 months', 'pt-br': '3 meses' },
		summary: {
			en: 'A Visual Basic application for the Snow agent inventory of the São Paulo state government, and SQL Server queries that remove duplicate inventory data.',
			'pt-br':
				'Uma aplicação em Visual Basic para o inventário do agente Snow do governo do estado de São Paulo, e consultas em SQL Server que removem dados duplicados do inventário.',
		},
		stack: ['Visual Basic', 'SQL Server', '.NET'],
	},
	{
		company: 'IDVLab (Grupo Vernet)',
		role: { en: 'Systems Analyst', 'pt-br': 'Analista de Sistemas' },
		period: { en: 'Feb 2022 - Nov 2022', 'pt-br': 'Fev 2022 - Nov 2022' },
		summary: {
			en: 'Server room monitoring dashboards in Node-RED, with gateways sending data over MQTT.',
			'pt-br': 'Dashboards de monitoramento de sala de servidores em Node-RED, com gateways enviando dados por MQTT.',
		},
		stack: ['Node-RED', 'MQTT', 'Python', 'Docker', 'Nginx'],
	},
	{
		company: 'Tribunal de Contas da União',
		role: { en: 'Intern', 'pt-br': 'Estagiário' },
		period: { en: 'Oct 2021 - May 2022', 'pt-br': 'Out 2021 - Mai 2022' },
		summary: {
			en: 'Oracle Apex applications for the federal audit court.',
			'pt-br': 'Aplicações em Oracle Apex para o órgão de controle externo do governo federal.',
		},
		stack: ['Oracle Apex', 'PL/SQL', 'JavaScript'],
	},
	{
		company: 'DATASUS / Fiocruz (FIOTEC)',
		contract: true,
		role: { en: 'Software Engineer, consulting', 'pt-br': 'Engenheiro de Software, consultoria' },
		period: { en: '8 months', 'pt-br': '8 meses' },
		summary: {
			en: 'Migration of backend services of the RNDS, the national health data network, from Java 8/11 and Spring Boot 2.x to Java 21 and Spring Boot 3.5, plus GraalVM native images that cut memory by 64% to 94% in staging, and the removal of the configuration server.',
			'pt-br':
				'Migração de serviços do backend da RNDS, a rede nacional de dados em saúde, de Java 8/11 e Spring Boot 2.x para Java 21 e Spring Boot 3.5, além de native images do GraalVM que reduziram a memória em 64% a 94% em homologação e da remoção do config server.',
		},
		stack: ['Java', 'Spring Boot', 'Elasticsearch', 'Kafka', 'AWS', 'Kubernetes'],
		workName: 'DATASUS',
	},
	{
		company: 'DataCore Solutions',
		contract: true,
		role: { en: 'Backend Developer', 'pt-br': 'Desenvolvedor Backend' },
		period: { en: '6 months', 'pt-br': '6 meses' },
		summary: {
			en: 'Spring Batch jobs that turn billing files into PDF, e-mail and SMS notifications for telecom operators, in 1,000-record lots with parallel rendering.',
			'pt-br':
				'Jobs Spring Batch que transformam arquivos de faturamento em notificações por PDF, e-mail e SMS para operadoras de telecomunicações, em lotes de 1.000 registros com renderização paralela.',
		},
		stack: ['Java', 'Spring Batch', 'Kafka', 'SQL Server', 'Oracle'],
		workName: 'DataCore',
	},
];

export const skills: SkillGroup[] = [
	{
		name: { en: 'Languages', 'pt-br': 'Linguagens' },
		items: ['Java', 'Groovy', 'Kotlin', 'Python', 'C#', 'TypeScript', 'JavaScript', 'Rust'],
	},
	{
		name: { en: 'Backend', 'pt-br': 'Backend' },
		items: [
			'Spring Boot',
			'Spring Batch',
			'Quarkus',
			'Grails',
			'Django',
			'Jakarta EE',
			'JPA',
			'Hibernate',
			'REST',
			'SOAP',
			'Microservices',
		],
	},
	{
		name: { en: 'Frontend', 'pt-br': 'Frontend' },
		items: ['Vue.js', 'React', 'Next.js', 'Angular', 'AstroJS', 'NodeJS', 'ASP.NET'],
	},
	{
		name: { en: 'Cloud and DevOps', 'pt-br': 'Cloud e DevOps' },
		items: ['AWS', 'GCP', 'Azure', 'Azure DevOps', 'Docker', 'Kubernetes', 'OpenShift', 'Rancher', 'Jenkins', 'Linux'],
	},
	{
		name: { en: 'Databases', 'pt-br': 'Bancos de dados' },
		items: ['Oracle', 'PostgreSQL', 'SQL Server', 'MySQL', 'MongoDB', 'Cassandra', 'DB2', 'Elasticsearch'],
	},
	{
		name: { en: 'Messaging and integration', 'pt-br': 'Mensageria e integração' },
		items: ['Kafka', 'RabbitMQ', 'SAP R3', 'MQTT', 'Quartz'],
	},
	{
		name: { en: 'AI engineering', 'pt-br': 'Engenharia de IA' },
		items: ['Claude Code', 'Codex', 'MCP', 'AI-assisted code review'],
	},
];

export const education: EducationEntry[] = [
	{
		title: { en: 'MBA in Software Engineering', 'pt-br': 'MBA em Engenharia de Software' },
		school: 'Universidade de São Paulo',
		period: { en: 'Apr 2024 - Present', 'pt-br': 'Abr 2024 - Atual' },
	},
	{
		title: { en: "Bachelor's in Computer Science", 'pt-br': 'Bacharelado em Ciência da Computação' },
		school: 'Centro Universitário de Brasília',
		period: { en: 'Aug 2022 - Dec 2024', 'pt-br': 'Ago 2022 - Dez 2024' },
	},
	{
		title: { en: "Bachelor's in Computer Science", 'pt-br': 'Bacharelado em Ciência da Computação' },
		school: 'Instituto Federal de Brasília',
		period: { en: 'Jan 2019 - Nov 2022', 'pt-br': 'Jan 2019 - Nov 2022' },
	},
];

export const certifications: Localized<string[]> = {
	en: ['Docker for Beginners', 'Spring Framework', 'Agile Methodologies', 'AWS Educate'],
	'pt-br': ['Docker para Iniciantes', 'Spring Framework', 'Metodologias Ágeis', 'AWS Educate'],
};

export const languages: Localized<string[]> = {
	en: ['Portuguese (fluent)', 'English (B2)'],
	'pt-br': ['Português (fluente)', 'Inglês (B2)'],
};
