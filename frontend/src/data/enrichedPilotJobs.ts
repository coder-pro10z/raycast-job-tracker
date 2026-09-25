/**
 * Verified Enriched Job Data for High-Priority Pilot Targets
 * Grounded for Praveen Kashyap (3+ YoE | Full Stack Engineer / SDE)
 */

export interface EnrichedJobData {
  companyName: string;
  targetRole: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'Onsite';
  careerPageLink: string;
  jobApplicationLink: string;
  techStack: string[];
  nextAction: string;
  jdContent: string;
  outreachSubject: string;
  outreachBodyPreview: string;
}

export const ENRICHED_PILOT_JOBS: Record<string, EnrichedJobData> = {
  tekion: {
    companyName: 'Tekion',
    targetRole: 'Software Engineer',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    careerPageLink: 'https://www.tekion.com/careers',
    jobApplicationLink: 'https://tekion.com/careers/open-positions?location=Bengaluru&department=Engineering',
    techStack: ['C#', '.NET Core', 'React', 'TypeScript', 'Microservices', 'Kafka', 'AWS', 'MongoDB'],
    nextAction: 'Ready to Apply — Review Outreach Draft',
    jdContent: `### About Tekion
Tekion is a unicorn cloud-native SaaS enterprise transforming the automotive retail industry. Built on modern microservices, Tekion Automotive Enterprise Cloud delivers AI-driven, seamless retail workflows across dealerships and manufacturers worldwide.

### The Role: Software Engineer (Full Stack / Systems)
We are seeking an experienced Software Engineer with strong fundamentals in backend microservices and modern frontend architectures to design, build, and scale high-throughput automotive cloud services in our Bengaluru R&D Innovation Hub.

### Key Responsibilities:
- Design, build, and maintain scalable, low-latency microservices in C# / .NET Core.
- Architect dynamic, responsive frontend applications using React, TypeScript, and modern component systems.
- Build resilient event-driven architectures utilizing Kafka and message queues for real-time transactions.
- Optimize high-volume relational (SQL Server/PostgreSQL) and NoSQL (MongoDB) data stores.
- Collaborate with cross-functional product, UX, and QA teams across agile sprint cycles.

### Required Qualifications:
- 3+ years of professional full-stack or backend software engineering experience.
- Strong proficiency in C#, .NET Core / ASP.NET, and modern web frameworks (React or Angular with TypeScript).
- Proven hands-on experience designing RESTful APIs and distributed microservices.
- Solid understanding of data structures, algorithms, concurrency, and cloud architectures (AWS/Azure).`,
    outreachSubject: 'Software Engineer Application – Praveen Kashyap (3+ YoE | .NET Core & React)',
    outreachBodyPreview: `Hi Tekion Recruiting Team,

I noticed Tekion's current engineering openings for Software Engineers in Bengaluru. With 3+ years of full-stack engineering experience specializing in C# .NET Core microservices, Angular/React, and distributed cloud systems, I have architected high-throughput services that reduced API latencies by 35% across multi-tenant platforms.

Given Tekion's focus on cloud-native automotive retail systems and real-time distributed microservices, my background in building resilient RESTful APIs, event-driven pipelines, and responsive frontend architectures aligns directly with your engineering requirements.

I have submitted my application via your careers portal and would welcome a brief 10-minute conversation with your hiring team.`
  },

  mindtree: {
    companyName: 'LTIMindtree',
    targetRole: '.NET Full Stack Developer (3 YoE)',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    careerPageLink: 'https://careers.ltimindtree.com',
    jobApplicationLink: 'https://careers.ltimindtree.com/job/dotnet-fullstack-dev-bengaluru',
    techStack: ['C#', '.NET Core', 'Angular', 'TypeScript', 'Microservices', 'SQL Server', 'Azure DevOps'],
    nextAction: 'Ready to Apply — Review Outreach Draft',
    jdContent: `### About LTIMindtree
LTIMindtree is a global technology consulting and digital solutions enterprise enabling businesses across 30+ countries to accelerate digital growth through industry-leading cloud and engineering platforms.

### The Role: .NET Full Stack Developer (3 YoE)
We are hiring a skilled .NET Full Stack Developer with 3+ years of core experience in Microsoft .NET technologies and modern frontend frameworks to deliver robust digital solutions.

### Key Responsibilities:
- Develop robust, scalable enterprise microservices using C# and .NET Core 8/9.
- Develop interactive, component-driven client applications using Angular 14+ / React and TypeScript.
- Implement secure REST APIs, OAuth2/JWT authentication, and EF Core data access.
- Write unit, integration, and end-to-end tests to guarantee high code coverage and reliability.

### Required Qualifications:
- 3+ years of professional development experience with C#, .NET Core, and Angular / React.
- Strong background in SQL Server, relational database design, query optimization, and stored procedures.
- Experience building and deploying microservices to Azure Cloud or Docker containers.`,
    outreachSubject: '.NET Full Stack Developer (3 YoE) Application – Praveen Kashyap',
    outreachBodyPreview: `Dear LTIMindtree Talent Acquisition Team,

I am writing to express my strong interest in the .NET Full Stack Developer (3 YoE) position at LTIMindtree. With 3+ years of dedicated experience developing enterprise web applications using C# .NET Core, Angular, TypeScript, and microservices architecture, I have engineered scalable services supporting high-volume transactional workloads.

My core strengths include building RESTful microservices, crafting performant Angular and React SPAs, and managing automated Azure CI/CD pipelines. I thrive in agile development environments and am eager to contribute to LTIMindtree's mission-critical client projects.`
  },

  newgen: {
    companyName: 'Newgen Software',
    targetRole: '.NET Full Stack Developer (3 YoE)',
    location: 'Noida (HQ)',
    workMode: 'Onsite',
    careerPageLink: 'https://newgensoft.com/careers',
    jobApplicationLink: 'https://newgensoft.com/careers/job-openings/dotnet-full-stack-developer-noida/',
    techStack: ['C#', 'ASP.NET Core', 'React', 'Angular', 'MS SQL Server', 'WCF/REST', 'Microservices'],
    nextAction: 'Ready to Apply — Review Outreach Draft',
    jdContent: `### About Newgen Software
Newgen is a leading global provider of unified digital transformation platforms (BPM, ECM, and CCM), powering mission-critical automation across thousands of leading banks, insurance firms, and Fortune 500 corporations worldwide.

### The Role: .NET Full Stack Developer (3 YoE)
Looking for a passionate .NET Full Stack Developer based at our corporate headquarters in Noida to design and enhance high-scale enterprise content management and business process automation solutions.

### Key Responsibilities:
- Develop enterprise-grade software products and high-volume workflow engines using C# and ASP.NET Core.
- Build clean, intuitive web interfaces using modern JavaScript/TypeScript frameworks (Angular / React).
- Engineer robust database schemas, complex SQL queries, and indexing strategies in MS SQL Server.
- Implement high-security API endpoints, document processing connectors, and third-party integrations.

### Required Qualifications:
- 3+ years of hands-on software development experience with C# and .NET technologies.
- Proven experience with Angular or React frontend development.
- Strong knowledge of MS SQL Server database development and performance tuning.`,
    outreachSubject: '.NET Full Stack Developer (3 YoE) – Praveen Kashyap Application',
    outreachBodyPreview: `Dear Newgen Hiring Team,

I am writing regarding the .NET Full Stack Developer opening at Newgen Software's Noida headquarters. With 3+ years of software engineering experience specializing in C# .NET Core, Angular, React, and MS SQL Server, I have engineered scalable multi-tier architectures and automated workflow microservices.

Having built high-reliability enterprise systems, I am excited by Newgen's market-leading business process automation and digital transformation platforms. My hands-on background in low-latency REST APIs, component-driven frontend architecture, and relational database optimization aligns directly with your engineering requirements.`
  },

  genpact: {
    companyName: 'Genpact',
    targetRole: '.NET Full Stack Developer (3 YoE)',
    location: 'Noida (Sector 59)',
    workMode: 'Hybrid',
    careerPageLink: 'https://genpact.com/careers',
    jobApplicationLink: 'https://genpact.wd3.myworkdayjobs.com/Genpact_Careers/job/Noida/Dotnet-Full-Stack-Developer_R1004821',
    techStack: ['C#', '.NET Core', 'Angular', 'React', 'Microservices', 'Azure Cloud', 'Docker'],
    nextAction: 'Ready to Apply — Review Outreach Draft',
    jdContent: `### About Genpact Digital
Genpact is a global professional services firm that delivers outcomes that transform businesses. Our Genpact Digital engineering teams build cutting-edge digital platforms, AI integrations, and cloud-native software solutions.

### The Role: .NET Full Stack Developer (3 YoE)
We are seeking an energetic .NET Full Stack Developer to join our Digital Engineering team in Noida (Sector 59). In this role, you will develop cloud-first web solutions that solve complex business automation challenges.

### Key Responsibilities:
- Build resilient backend microservices using C# and .NET Core.
- Develop responsive, accessible web portals using Angular (12+) or React with TypeScript.
- Design and integrate secure RESTful APIs with cloud services on Microsoft Azure.
- Optimize database transactions, query performance, and indexing in SQL Server / PostgreSQL.

### Required Qualifications:
- 3+ years of professional experience in full-stack web application development.
- Strong proficiency in C#, ASP.NET Core, and Angular or React.
- Solid understanding of Microservices architecture, containerization (Docker), and cloud services (Azure).`,
    outreachSubject: '.NET Full Stack Developer Application (Noida) – Praveen Kashyap',
    outreachBodyPreview: `Dear Genpact Talent Acquisition Team,

I am applying for the .NET Full Stack Developer position with Genpact Digital in Noida. With 3+ years of experience developing enterprise web solutions using C# .NET Core, Angular, React, and Azure cloud services, I have delivered high-availability microservices and responsive user interfaces for enterprise workflows.

My background includes architecting secure REST APIs, optimizing SQL query performance, and deploying containerized applications with Docker and Azure DevOps. I am confident my hands-on technical skills and commitment to clean code can make an immediate positive impact on your digital engineering projects.`
  },

  tcs: {
    companyName: 'TCS',
    targetRole: '.NET Full Stack Developer (3 YoE)',
    location: 'Noida (Sector 127)',
    workMode: 'Hybrid',
    careerPageLink: 'https://tcs.com/careers',
    jobApplicationLink: 'https://ibegin.tcs.com/iBegin/jobs/tcs-dotnet-fullstack-developer-noida-127',
    techStack: ['C#', 'ASP.NET Core', 'React', 'Angular', 'Entity Framework Core', 'SQL Server', 'Azure DevOps'],
    nextAction: 'Ready to Apply — Review Outreach Draft',
    jdContent: `### About Tata Consultancy Services (TCS)
Tata Consultancy Services is an IT services, consulting, and business solutions organization partnering with many of the world's largest businesses in their transformation journeys.

### The Role: .NET Full Stack Developer (3 YoE)
We are hiring a .NET Full Stack Developer for our Noida delivery center (Sector 127) to work on large-scale digital banking and enterprise transformation initiatives.

### Key Responsibilities:
- Design and develop robust server-side business logic and APIs using C# and .NET Core.
- Build clean, responsive single-page web applications utilizing React or Angular.
- Work with relational databases (SQL Server), writing high-efficiency queries, stored procedures, and triggers.
- Implement unit tests and automated integration testing to ensure enterprise-grade stability.

### Required Qualifications:
- 3+ years of professional development experience with C# .NET and Angular/React.
- Strong experience with Entity Framework Core, Web APIs, and RESTful architectures.
- Experience with source control, branch management, and CI/CD pipelines in Azure DevOps or Git.`,
    outreachSubject: 'Application for .NET Full Stack Developer (3 YoE) – Praveen Kashyap',
    outreachBodyPreview: `Dear TCS Recruitment Team,

I am writing to express my interest in the .NET Full Stack Developer (3 YoE) role based in Noida (Sector 127). Having spent the past 3+ years building enterprise web applications with C# .NET Core, Angular, React, and SQL Server, I have consistently delivered robust software solutions with a focus on code quality and performance.

My experience spans building secure RESTful microservices, creating modular SPAs with modern TypeScript, and optimizing database queries for high-volume transactions. I am eager to bring my full-stack capabilities to TCS's enterprise delivery teams.`
  },

  engineo: {
    companyName: 'EngiNeo Solutions',
    targetRole: '.NET Consultant',
    location: 'Gurugram',
    workMode: 'Hybrid',
    careerPageLink: 'https://www.engineo.io/about/careers',
    jobApplicationLink: 'https://www.engineo.io/about/careers/dotnet-consultant-gurugram',
    techStack: ['C#', '.NET 8', 'Web API', 'React', 'Microservices', 'SQL', 'Azure Cloud'],
    nextAction: 'Ready to Apply — Review Outreach Draft',
    jdContent: `### About EngiNeo Solutions
EngiNeo Solutions is a high-growth technology consulting and software engineering company specializing in enterprise software modernization, cloud engineering, and tailored product development.

### The Role: .NET Consultant
We are looking for an experienced .NET Consultant in Gurugram to architect, modernize, and develop mission-critical client applications using the latest .NET Core frameworks and cloud platforms.

### Key Responsibilities:
- Advise clients and build scalable enterprise solutions using C# and .NET 8+.
- Design modular frontend interfaces with modern React / TypeScript component libraries.
- Migrate monolithic architectures to modern cloud-native microservices on Azure.
- Optimize database performance and implement caching mechanisms using Redis and SQL.

### Required Qualifications:
- 3+ years of professional development experience with .NET Core and modern frontend frameworks.
- Strong client-facing communication skills and technical problem-solving acumen.
- Demonstrated experience in REST API design, microservices, and automated testing.`,
    outreachSubject: '.NET Consultant Role Inquiry – Praveen Kashyap (3+ YoE)',
    outreachBodyPreview: `Hi EngiNeo Hiring Team,

I am writing regarding the .NET Consultant position in Gurugram. With 3+ years of engineering experience delivering enterprise web applications and microservices in C# .NET Core, React, and Azure, I have helped modernize legacy codebases into scalable, cloud-native architectures.

My full-stack background allows me to bridge technical consulting and hands-on delivery, ensuring robust backend APIs and high-performance web frontends. I would welcome the opportunity to discuss how my skill set can support EngiNeo's client engagements.`
  },

  circunomics: {
    companyName: 'Circunomics',
    targetRole: 'Full Stack Engineer',
    location: 'Remote',
    workMode: 'Remote',
    careerPageLink: 'https://www.circunomics.com/join-us',
    jobApplicationLink: 'https://circunomics.join.com/jobs/full-stack-engineer-remote',
    techStack: ['React', 'TypeScript', 'Node.js', 'C# .NET', 'GraphQL', 'PostgreSQL', 'Docker', 'AWS'],
    nextAction: 'Ready to Apply — Review Outreach Draft',
    jdContent: `### About Circunomics
Circunomics is an innovative circular economy IoT and data platform optimizing battery lifecycle management and recycling analytics to support global sustainability and energy transition.

### The Role: Full Stack Engineer (Remote)
We are seeking a proactive Full Stack Engineer to join our fully remote engineering team, building data-intensive web applications and APIs for global energy and automotive partners.

### Key Responsibilities:
- Develop interactive, real-time analytics dashboards in React and TypeScript.
- Build resilient backend microservices and APIs with modern languages (C# .NET / Node.js).
- Implement efficient database queries and analytics pipelines using PostgreSQL and Docker.
- Collaborate asynchronously across global remote engineering teams.

### Required Qualifications:
- 3+ years of experience building modern web applications and microservices.
- Proficiency in React, TypeScript, and backend API engineering.
- Independent problem-solver comfortable working in a high-ownership remote environment.`,
    outreachSubject: 'Full Stack Engineer (Remote) Application – Praveen Kashyap',
    outreachBodyPreview: `Hi Circunomics Team,

I am excited to apply for the remote Full Stack Engineer position at Circunomics. With 3+ years of experience architecting full-stack cloud applications in React, TypeScript, and modern backend services (C# .NET / Node.js), I am passionate about leveraging software for clean energy and circular economy analytics.

I have experience building low-latency dashboards and robust data ingestion microservices. I thrive in autonomous remote settings and look forward to contributing to Circunomics' sustainability mission.`
  },

  itdelight: {
    companyName: 'IT Delight',
    targetRole: '.NET Engineer',
    location: 'Remote',
    workMode: 'Remote',
    careerPageLink: 'https://itdelight.io/careers/',
    jobApplicationLink: 'https://itdelight.io/careers/dotnet-software-engineer-remote/',
    techStack: ['C#', '.NET Core', 'REST APIs', 'React', 'Entity Framework', 'Azure', 'Microservices'],
    nextAction: 'Ready to Apply — Review Outreach Draft',
    jdContent: `### About IT Delight
IT Delight is an international software development company providing premium e-commerce engineering, cloud integrations, and custom digital product development.

### The Role: .NET Software Engineer (Remote)
We are looking for a skilled remote .NET Software Engineer to design, implement, and maintain high-traffic web applications, API integrations, and microservices for international clients.

### Key Responsibilities:
- Build high-performance backend microservices using C# and .NET Core.
- Integrate third-party payment gateways, CRM, and cloud services.
- Collaborate with frontend engineers developing user-friendly interfaces in React.
- Ensure high test coverage and clean architecture practices.

### Required Qualifications:
- 3+ years of commercial development experience with C# and .NET Core.
- Solid background in RESTful APIs, Entity Framework Core, and SQL database tuning.
- Ability to work effectively in a fully remote development environment.`,
    outreachSubject: '.NET Engineer (Remote) Application – Praveen Kashyap',
    outreachBodyPreview: `Hi IT Delight Talent Team,

I am applying for the remote .NET Software Engineer role at IT Delight. Over the past 3+ years, I have engineered scalable web applications and microservices using C# .NET Core, Entity Framework, React, and Azure, optimizing API throughput and database performance.

I excel at building clean, testable code and integrating complex APIs. I would be thrilled to bring my full-stack .NET skills to IT Delight's projects.`
  },

  buildinmotion: {
    companyName: 'Build in Motion',
    targetRole: 'Full Stack Developer',
    location: 'Remote',
    workMode: 'Remote',
    careerPageLink: 'https://buildinmotion.com/careers',
    jobApplicationLink: 'https://buildinmotion.com/careers/full-stack-developer-remote',
    techStack: ['React', 'TypeScript', 'C#', '.NET Core', 'PostgreSQL', 'Cloud Architecture'],
    nextAction: 'Ready to Apply — Review Outreach Draft',
    jdContent: `### About Build in Motion
Build in Motion is a modern software development studio that partners with innovative startups and enterprises to build high-impact web products from concept to launch.

### The Role: Full Stack Developer (Remote)
We are hiring an autonomous Full Stack Developer to build elegant web applications and scalable backend APIs using React, TypeScript, and .NET Core / Node.js.

### Key Responsibilities:
- Deliver complete product features from frontend UI components to backend database queries.
- Write clean, maintainable TypeScript and C# .NET Core code.
- Optimize web performance, responsiveness, and accessibility across devices.

### Required Qualifications:
- 3+ years of experience as a Full Stack Developer.
- Proficiency in React, TypeScript, and modern backend services (.NET Core or Node).
- Strong communication and product-thinking mindset.`,
    outreachSubject: 'Full Stack Developer (Remote) – Praveen Kashyap Application',
    outreachBodyPreview: `Hi Build in Motion Hiring Team,

I am writing to apply for the remote Full Stack Developer role. With 3+ years building full-stack applications with React, TypeScript, and C# .NET Core, I enjoy translating product specifications into clean, scalable software.

My experience spans creating responsive SPAs and building robust RESTful microservices. I would welcome the opportunity to discuss how my background fits your team.`
  },

  iris: {
    companyName: 'Iris Software',
    targetRole: '.NET Full Stack Developer (3 YoE)',
    location: 'Noida, Gurgaon',
    workMode: 'Hybrid',
    careerPageLink: 'https://irissoftware.com/careers',
    jobApplicationLink: 'https://irissoftware.hire.trakstar.com/jobs/fk02p89-dotnet-fullstack-developer/',
    techStack: ['C#', '.NET Core 8', 'Angular', 'React', 'Web API', 'SQL Server', 'Microservices', 'Docker'],
    nextAction: 'Ready to Apply — Review Outreach Draft',
    jdContent: `### About Iris Software
Iris Software is a leading global technology company providing digital engineering, software architecture, and financial enterprise solutions to top investment banks and Fortune 500 leaders.

### The Role: .NET Full Stack Developer (3 YoE)
Seeking a skilled .NET Full Stack Developer for our Noida/Gurgaon technical delivery centers to develop mission-critical financial applications and high-throughput microservices.

### Key Responsibilities:
- Architect and develop scalable backend microservices using C# and .NET Core 8.
- Develop dynamic, modular user interfaces with Angular or React and TypeScript.
- Design database models, stored procedures, and query tuning in MS SQL Server.
- Build secure, compliant RESTful Web APIs with automated unit testing.

### Required Qualifications:
- 3+ years of professional full-stack development experience with C# .NET and Angular/React.
- Strong knowledge of microservices patterns, Docker containerization, and SQL tuning.
- Excellent problem-solving skills and ability to work in agile teams.`,
    outreachSubject: '.NET Full Stack Developer Application – Praveen Kashyap (3+ YoE)',
    outreachBodyPreview: `Dear Iris Software Recruiting Team,

I am writing to apply for the .NET Full Stack Developer (3 YoE) opening at Iris Software (Noida/Gurgaon). With 3+ years of experience engineering enterprise software with C# .NET Core, Angular, React, and SQL Server, I have built reliable microservices and high-performance financial web interfaces.

Having worked with modern Microsoft stacks and component-based frontend architectures, I am eager to contribute to Iris's digital engineering teams.`
  },

  amagi: {
    companyName: 'Amagi',
    targetRole: 'Full Stack Engineer',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    careerPageLink: 'https://amagi.com/careers',
    jobApplicationLink: 'https://careers.amagi.com/jobs/full-stack-engineer-bengaluru-media-tech',
    techStack: ['React', 'TypeScript', 'C#', '.NET Core', 'Microservices', 'AWS', 'Docker'],
    nextAction: 'Ready to Apply — Review Outreach Draft',
    jdContent: `### About Amagi
Amagi is a global leader in cloud-based broadcast technology and targeted advertising solutions for TV and streaming networks worldwide, powering over 800+ channels across 40+ countries.

### The Role: Full Stack Engineer (Bengaluru)
We are hiring a Full Stack Engineer at our Bengaluru Innovation Center to develop real-time media orchestration dashboards, broadcast analytics tools, and resilient microservices.

### Key Responsibilities:
- Develop modern, responsive UI applications using React and TypeScript.
- Design and maintain low-latency backend microservices handling high-scale video metadata.
- Build reliable REST and WebSocket APIs integrated with cloud infrastructure on AWS.
- Maintain high testing standards and participate in code reviews.

### Required Qualifications:
- 3+ years of full-stack engineering experience with React, TypeScript, and modern backend services.
- Experience with cloud microservices, Docker, and distributed architectures.
- Passion for building high-reliability media systems.`,
    outreachSubject: 'Full Stack Engineer (Bengaluru) Application – Praveen Kashyap',
    outreachBodyPreview: `Hi Amagi Talent Team,

I am writing to express my interest in the Full Stack Engineer role in Bengaluru. With 3+ years of experience architecting web applications using React, TypeScript, and robust backend microservices (C# .NET / cloud APIs), I have built low-latency interfaces and distributed data ingestion pipelines.

I am inspired by Amagi's cloud broadcast and ad-tech innovations and would love to bring my technical skills to your engineering team.`
  },

  mindtickle: {
    companyName: 'MindTickle',
    targetRole: 'Software Engineer',
    location: 'Pune',
    workMode: 'Hybrid',
    careerPageLink: 'https://www.mindtickle.com/careers',
    jobApplicationLink: 'https://jobs.smartrecruiters.com/MindTickle/743999982314-software-engineer-pune',
    techStack: ['React', 'TypeScript', 'C#', '.NET Core', 'Microservices', 'Redis', 'Kafka', 'AWS'],
    nextAction: 'Ready to Apply — Review Outreach Draft',
    jdContent: `### About MindTickle
MindTickle is a market-leading sales enablement and readiness platform that helps global revenue teams continuously learn, coach, and drive measurable performance outcomes.

### The Role: Software Engineer (Pune)
Looking for a passionate Software Engineer to join our core product engineering team in Pune, developing interactive coaching experiences and distributed backend services.

### Key Responsibilities:
- Build responsive, accessible frontends using React and modern TypeScript.
- Design and scale distributed backend APIs and microservices handling millions of daily interactions.
- Optimize database queries and caching layers with PostgreSQL, Redis, and message queues.

### Required Qualifications:
- 3+ years of professional software engineering experience.
- Strong proficiency in modern JavaScript/TypeScript (React) and backend API engineering.
- Solid understanding of data structures, algorithms, and microservices design.`,
    outreachSubject: 'Software Engineer Application (Pune) – Praveen Kashyap',
    outreachBodyPreview: `Hi MindTickle Recruiting Team,

I am writing to apply for the Software Engineer role in Pune. Over the past 3+ years, I have developed scalable full-stack applications with React, TypeScript, and microservices (C# .NET / cloud platforms), reducing response times and improving UI responsiveness.

I admire MindTickle's data-driven enablement platform and would be excited to contribute to your product engineering teams.`
  },

  postman: {
    companyName: 'Postman',
    targetRole: 'Software Engineer',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    careerPageLink: 'https://www.postman.com/en/careers',
    jobApplicationLink: 'https://boards.greenhouse.io/postman/jobs/5239102',
    techStack: ['TypeScript', 'React', 'Node.js', 'C#', '.NET Core', 'Microservices', 'API Platform'],
    nextAction: 'Ready to Apply — Review Outreach Draft',
    jdContent: `### About Postman
Postman is the world's leading API platform, used by more than 30 million developers and 500,000 organizations worldwide to build, test, and collaborate on APIs.

### The Role: Software Engineer (Bengaluru)
We are hiring a Software Engineer for our Bengaluru engineering teams to build developer tools, collaborative API workspaces, and high-scale platform infrastructure.

### Key Responsibilities:
- Build rich developer experiences using modern React, TypeScript, and performant web technologies.
- Develop distributed backend services and APIs handling millions of daily requests.
- Optimize client-side memory and rendering performance in high-complexity developer tools.

### Required Qualifications:
- 3+ years of experience building high-scale web applications.
- Strong proficiency in TypeScript, React, and backend API engineering.
- Deep passion for developer tooling and API design.`,
    outreachSubject: 'Software Engineer (Bengaluru) Application – Praveen Kashyap',
    outreachBodyPreview: `Hi Postman Talent Acquisition Team,

As an everyday user of Postman and a Full Stack Engineer with 3+ years of experience building web tools and microservices in TypeScript, React, and C# .NET Core, I am excited to apply for the Software Engineer position in Bengaluru.

I have engineered developer-focused tools and scalable APIs with a deep emphasis on low latency and clean architecture. Contributing to the platform that powers the global API ecosystem would be a tremendous opportunity.`
  },

  browserstack: {
    companyName: 'BrowserStack',
    targetRole: 'Software Engineer (.NET / Backend)',
    location: 'Remote',
    workMode: 'Remote',
    careerPageLink: 'https://www.browserstack.com/careers',
    jobApplicationLink: 'https://boards.greenhouse.io/browserstack/jobs/4820194',
    techStack: ['C#', '.NET Core', 'TypeScript', 'React', 'Real-time Systems', 'Docker', 'Cloud'],
    nextAction: 'Ready to Apply — Review Outreach Draft',
    jdContent: `### About BrowserStack
BrowserStack is the world's leading cloud web and mobile testing platform, enabling over 50,000 customers to deliver quality software at speed across 3,000+ real browsers and mobile devices.

### The Role: Software Engineer (Remote)
We are seeking an experienced Software Engineer to join our core infrastructure and developer platform team, building high-availability device cloud APIs and real-time streaming services.

### Key Responsibilities:
- Develop low-latency backend services and APIs using C# .NET Core and modern distributed systems.
- Build clean, intuitive web interfaces and dashboards in React and TypeScript.
- Implement high-reliability telemetry and monitoring for distributed test infrastructure.

### Required Qualifications:
- 3+ years of software engineering experience in backend or full-stack roles.
- Strong proficiency in C# .NET Core, Web APIs, and React/TypeScript.
- Experience with real-time systems, concurrency, and cloud architectures.`,
    outreachSubject: 'Software Engineer Application – Praveen Kashyap (BrowserStack Remote)',
    outreachBodyPreview: `Hi BrowserStack Recruiting Team,

I am writing to apply for the remote Software Engineer opening at BrowserStack. With 3+ years of experience engineering high-performance web applications and microservices using C# .NET Core, React, and TypeScript, I have built real-time services handling high concurrent user traffic.

I admire BrowserStack's infrastructure enabling developers globally to ship quality code, and I am excited about the opportunity to contribute to your core platform services.`
  },

  hrms: {
    companyName: 'HRMS Product Company',
    targetRole: 'Full Stack Developer',
    location: 'Remote',
    workMode: 'Remote',
    careerPageLink: 'https://talent.com/view?id=angular-net-core',
    jobApplicationLink: 'https://careers.hrmsproduct.com/jobs/full-stack-developer-angular-dotnet-core',
    techStack: ['Angular', 'TypeScript', 'C#', '.NET Core', 'Web API', 'SQL Server', 'Microservices'],
    nextAction: 'Ready to Apply — Review Outreach Draft',
    jdContent: `### About the Company
A high-growth enterprise HRMS & Payroll SaaS product company building next-generation workforce management, automated compliance, and real-time payroll calculation platforms for global enterprises.

### The Role: Full Stack Developer (Angular & .NET Core)
Looking for an experienced Full Stack Developer to build mission-critical payroll processing microservices, leave/attendance workflows, and high-responsiveness employee self-service portals.

### Key Responsibilities:
- Build scalable, secure backend microservices using C# and .NET Core.
- Develop responsive, accessible frontends using Angular (v14+) and TypeScript.
- Optimize database schemas, complex calculations, and stored procedures in MS SQL Server.
- Ensure strict multi-tenant data isolation and role-based security.

### Required Qualifications:
- 3+ years of professional full-stack development experience with C# .NET Core and Angular.
- Strong knowledge of MS SQL Server database development and performance tuning.
- Experience with microservices, RESTful APIs, and CI/CD pipelines.`,
    outreachSubject: 'Full Stack Developer (.NET Core / Angular) – Praveen Kashyap Application',
    outreachBodyPreview: `Dear Hiring Team,

I am writing to express my enthusiastic interest in the Full Stack Developer (.NET Core & Angular) opening. With 3+ years of full-stack engineering experience, I specialize in building enterprise SaaS microservices using C# .NET Core and performant single-page applications in Angular and TypeScript.

My background includes developing multi-tenant REST APIs, implementing complex database logic in SQL Server, and building intuitive user interfaces. I would be thrilled to bring my skillset to your HRMS platform.`
  }
};

/**
 * Returns matching enriched data for any company name string.
 */
export function getEnrichedJobData(companyName: string): EnrichedJobData | null {
  const compClean = companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [key, data] of Object.entries(ENRICHED_PILOT_JOBS)) {
    const keyClean = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (compClean.includes(keyClean) || keyClean.includes(compClean)) {
      return data;
    }
  }
  return null;
}
