/**
 * FAB STEEL CONSULTANCY ERP - COMPREHENSIVE SEED DATA ENGINE
 * Authentic Global Steel Engineering & Detailing Enterprise Dataset
 */

window.FabSeedData = (function () {
  'use strict';

  // Demo Accounts
  const users = [
    {
      id: 'USR-001',
      name: 'Alexander Wright',
      email: 'admin@fabsteel.demo',
      password: 'Admin@123',
      role: 'SUPER_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      designation: 'Managing Director & Chief Executive',
      department: 'Executive Management',
      site: 'Global Headquarters - Tower 1',
      active: true,
      lastLogin: '2026-11-06T09:30:00Z'
    },
    {
      id: 'USR-002',
      name: 'Sarah Jenkins',
      email: 'hr@fabsteel.demo',
      password: 'Hr@123',
      role: 'HR_STAFF',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      designation: 'Head of People & Talent Acquisition',
      department: 'Human Resources',
      site: 'Global Headquarters - Tower 1',
      active: true,
      lastLogin: '2026-11-06T08:45:00Z'
    },
    {
      id: 'USR-003',
      name: 'Marcus Sterling',
      email: 'finance@fabsteel.demo',
      password: 'Finance@123',
      role: 'FINANCE_STAFF',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      designation: 'Chief Financial Officer & Controller',
      department: 'Finance & Accounts',
      site: 'Global Headquarters - Tower 1',
      active: true,
      lastLogin: '2026-11-06T10:15:00Z'
    },
    {
      id: 'USR-004',
      name: 'Vikram Mehta (Apex Heavy Eng.)',
      email: 'partner@fabsteel.demo',
      password: 'Partner@123',
      role: 'PARTNER',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      designation: 'VP of Procurement & Contracting',
      department: 'Apex Heavy Engineering Ltd.',
      partnerId: 'PART-1001',
      site: 'Industrial Hub - Yard 4',
      active: true,
      lastLogin: '2026-11-05T16:20:00Z'
    },
    {
      id: 'USR-005',
      name: 'Rahul Sharma',
      email: 'employee@fabsteel.demo',
      password: 'Employee@123',
      role: 'EMPLOYEE',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      designation: 'Lead Tekla Structural Modeler',
      department: 'Tekla & BIM Detailing',
      employeeId: 'EMP-1001',
      site: 'Main Engineering Center',
      active: true,
      lastLogin: '2026-11-06T08:50:00Z'
    },
    {
      id: 'USR-006',
      name: 'David Macintyre',
      email: 'manager@fabsteel.demo',
      password: 'Manager@123',
      role: 'SITE_MANAGER',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      designation: 'Senior Project & Site Erection Manager',
      department: 'Field Operations',
      site: 'Apex Industrial Plant - Site A',
      active: true,
      lastLogin: '2026-11-06T07:30:00Z'
    }
  ];

  // 25 Realistic Employees
  const employees = [
    {
      id: 'EMP-1001',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@fabsteel.demo',
      phone: '+1 (555) 234-8901',
      department: 'Tekla & BIM Detailing',
      designation: 'Lead Tekla Structural Modeler',
      joiningDate: '2023-03-15',
      status: 'Active',
      basicSalary: 6800,
      assignedSite: 'Main Engineering Center',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      address: '742 Evergreen Terrace, Sector 4, Metro City',
      emergencyContact: 'Priya Sharma (+1 555-901-3321)',
      documents: ['Tekla_Certification_Level3.pdf', 'National_ID_Verified.pdf']
    },
    {
      id: 'EMP-1002',
      name: 'Elena Rostova',
      email: 'elena.rostova@fabsteel.demo',
      phone: '+1 (555) 345-1234',
      department: 'Structural Engineering',
      designation: 'Senior Connection Design Engineer (PE)',
      joiningDate: '2022-06-01',
      status: 'Active',
      basicSalary: 8200,
      assignedSite: 'Main Engineering Center',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      address: '128 High Street, Suite 402, North District',
      emergencyContact: 'Dmitri Rostov (+1 555-888-2910)',
      documents: ['PE_License_Civil_Structural.pdf', 'AISC_Member_Cert.pdf']
    },
    {
      id: 'EMP-1003',
      name: 'Carlos Mendez',
      email: 'carlos.mendez@fabsteel.demo',
      phone: '+1 (555) 456-7890',
      department: 'Field Operations',
      designation: 'Senior Steel Erection Superintendent',
      joiningDate: '2021-11-10',
      status: 'Active',
      basicSalary: 7400,
      assignedSite: 'Apex Industrial Plant - Site A',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      address: '90 Industrial Parkway, West Bay',
      emergencyContact: 'Maria Mendez (+1 555-443-1288)',
      documents: ['OSHA_30_Safety_Cert.pdf', 'Crane_Rigging_Specialist.pdf']
    },
    {
      id: 'EMP-1004',
      name: 'Priya Patel',
      email: 'priya.patel@fabsteel.demo',
      phone: '+1 (555) 567-8901',
      department: 'Quality Assurance & QC',
      designation: 'CWI Senior Welding Inspector',
      joiningDate: '2023-01-20',
      status: 'Active',
      basicSalary: 6200,
      assignedSite: 'Apex Industrial Plant - Site A',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      address: '45 Lakeview Gardens, East End',
      emergencyContact: 'Kiran Patel (+1 555-667-8912)',
      documents: ['AWS_CWI_Credentials.pdf', 'NDT_Level_II_Ultrasonic.pdf']
    },
    {
      id: 'EMP-1005',
      name: 'Liam Gallagher',
      email: 'liam.g@fabsteel.demo',
      phone: '+1 (555) 678-9012',
      department: 'Tekla & BIM Detailing',
      designation: 'Tekla Modeler - Miscellaneous Steel',
      joiningDate: '2024-02-15',
      status: 'Active',
      basicSalary: 5200,
      assignedSite: 'Main Engineering Center',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      address: '33 Riverbed Ave, Apt 12B',
      emergencyContact: 'Fiona Gallagher (+1 555-778-9900)',
      documents: ['Autodesk_BIM_Professional.pdf']
    },
    {
      id: 'EMP-1006',
      name: 'Zainab Al-Mansoor',
      email: 'zainab.m@fabsteel.demo',
      phone: '+1 (555) 789-0123',
      department: 'Project Management',
      designation: 'Senior Project Engineering Manager',
      joiningDate: '2022-09-01',
      status: 'Active',
      basicSalary: 8500,
      assignedSite: 'Global Headquarters - Tower 1',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
      address: '15 Skyline Heights, Penthouse 3',
      emergencyContact: 'Tariq Mansoor (+1 555-112-9090)',
      documents: ['PMP_Certificate_Active.pdf', 'MSc_Structural_Eng.pdf']
    },
    {
      id: 'EMP-1007',
      name: 'Michael Chang',
      email: 'michael.c@fabsteel.demo',
      phone: '+1 (555) 890-1234',
      department: 'Structural Engineering',
      designation: 'Finite Element Analysis (FEA) Specialist',
      joiningDate: '2023-05-18',
      status: 'Active',
      basicSalary: 7900,
      assignedSite: 'Main Engineering Center',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      address: '88 Innovation Way, Technopark',
      emergencyContact: 'Grace Chang (+1 555-334-7766)',
      documents: ['ANSYS_Structural_Mastery.pdf']
    },
    {
      id: 'EMP-1008',
      name: 'Aisha Bello',
      email: 'aisha.bello@fabsteel.demo',
      phone: '+1 (555) 901-2345',
      department: 'Human Resources',
      designation: 'HR Executive & Training Coordinator',
      joiningDate: '2023-08-01',
      status: 'Active',
      basicSalary: 4800,
      assignedSite: 'Global Headquarters - Tower 1',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      address: '502 Central Boulevard, Block C',
      emergencyContact: 'Ibrahim Bello (+1 555-443-8822)',
      documents: ['SHRM_CP_Certificate.pdf']
    },
    {
      id: 'EMP-1009',
      name: 'Thomas Mueller',
      email: 'thomas.m@fabsteel.demo',
      phone: '+1 (555) 012-3456',
      department: 'Finance & Accounts',
      designation: 'Senior Project Billing & Cost Accountant',
      joiningDate: '2022-04-10',
      status: 'Active',
      basicSalary: 6400,
      assignedSite: 'Global Headquarters - Tower 1',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
      address: '77 Heritage Court, Old Town',
      emergencyContact: 'Anja Mueller (+1 555-909-1234)',
      documents: ['CPA_License_Registration.pdf']
    },
    {
      id: 'EMP-1010',
      name: 'Suresh Nambiar',
      email: 'suresh.n@fabsteel.demo',
      phone: '+1 (555) 123-4567',
      department: 'Field Operations',
      designation: 'Site Welding & Rigging Foreman',
      joiningDate: '2021-08-15',
      status: 'Active',
      basicSalary: 5500,
      assignedSite: 'Apex Industrial Plant - Site A',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      address: '12 Workers Colony, Industrial Road',
      emergencyContact: 'Deepa Nambiar (+1 555-776-5544)',
      documents: ['Master_Rigger_Heavy_Lift.pdf']
    },
    {
      id: 'EMP-1011',
      name: 'Hannah Abbott',
      email: 'hannah.a@fabsteel.demo',
      phone: '+1 (555) 234-5678',
      department: 'Tekla & BIM Detailing',
      designation: 'BIM Coordinator & Model Checker',
      joiningDate: '2023-10-01',
      status: 'Active',
      basicSalary: 6600,
      assignedSite: 'Main Engineering Center',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      address: '210 Pine Hill Drive',
      emergencyContact: 'Edward Abbott (+1 555-234-9988)',
      documents: ['Tekla_Advanced_Checker.pdf']
    },
    {
      id: 'EMP-1012',
      name: 'Anand Kulkarni',
      email: 'anand.k@fabsteel.demo',
      phone: '+1 (555) 345-6789',
      department: 'Structural Engineering',
      designation: 'Senior Structural Design Engineer',
      joiningDate: '2022-01-15',
      status: 'Active',
      basicSalary: 7700,
      assignedSite: 'Main Engineering Center',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      address: '94 Maple Crescent, District 7',
      emergencyContact: 'Sunita Kulkarni (+1 555-889-0011)',
      documents: ['STAAD_Pro_Certified_Professional.pdf']
    },
    {
      id: 'EMP-1013',
      name: 'Jessica Vance',
      email: 'jessica.v@fabsteel.demo',
      phone: '+1 (555) 456-7891',
      department: 'Quality Assurance & QC',
      designation: 'NDE Specialist (Ultrasonic & Magnetic)',
      joiningDate: '2024-01-05',
      status: 'Active',
      basicSalary: 5800,
      assignedSite: 'Main Engineering Center',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
      address: '38 Birch Boulevard',
      emergencyContact: 'Peter Vance (+1 555-345-6677)',
      documents: ['ASNT_Level_II_MT_UT.pdf']
    },
    {
      id: 'EMP-1014',
      name: 'Viktor Dragov',
      email: 'viktor.d@fabsteel.demo',
      phone: '+1 (555) 567-8912',
      department: 'Field Operations',
      designation: 'Structural Steel Safety Officer',
      joiningDate: '2022-07-20',
      status: 'Active',
      basicSalary: 6100,
      assignedSite: 'Apex Industrial Plant - Site A',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      address: '101 Industrial Lane, Yard 2',
      emergencyContact: 'Olga Dragov (+1 555-778-1122)',
      documents: ['NEBOSH_Certified_HSE.pdf']
    },
    {
      id: 'EMP-1015',
      name: 'Maya Lin',
      email: 'maya.lin@fabsteel.demo',
      phone: '+1 (555) 678-9023',
      department: 'Tekla & BIM Detailing',
      designation: 'CNC Spooling & Fabrication Drafter',
      joiningDate: '2023-04-12',
      status: 'Active',
      basicSalary: 5100,
      assignedSite: 'Main Engineering Center',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      address: '64 Cedar Close, Suite 10',
      emergencyContact: 'Wei Lin (+1 555-901-4455)',
      documents: ['DSTV_CNC_File_Export_Expert.pdf']
    },
    {
      id: 'EMP-1016',
      name: 'Arthur Pendelton',
      email: 'arthur.p@fabsteel.demo',
      phone: '+1 (555) 789-0134',
      department: 'Executive Management',
      designation: 'Director of Global Engineering Operations',
      joiningDate: '2020-03-01',
      status: 'Active',
      basicSalary: 10500,
      assignedSite: 'Global Headquarters - Tower 1',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      address: '1 Royal Crest Manor',
      emergencyContact: 'Lady Eleanor (+1 555-001-2345)',
      documents: ['Chartered_Engineer_UK.pdf']
    },
    {
      id: 'EMP-1017',
      name: 'Fatima Zahra',
      email: 'fatima.z@fabsteel.demo',
      phone: '+1 (555) 890-1245',
      department: 'Tekla & BIM Detailing',
      designation: 'Tekla Modeler - Heavy Industrial Trusses',
      joiningDate: '2024-03-01',
      status: 'Active',
      basicSalary: 5400,
      assignedSite: 'Main Engineering Center',
      avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
      address: '55 Orchid Plaza, Flat 3B',
      emergencyContact: 'Hassan Zahra (+1 555-667-8899)',
      documents: ['Tekla_Structures_Associate.pdf']
    },
    {
      id: 'EMP-1018',
      name: 'Gabriel Santos',
      email: 'gabriel.s@fabsteel.demo',
      phone: '+1 (555) 901-2356',
      department: 'Field Operations',
      designation: 'Site Erection Engineer (Bolted Joints)',
      joiningDate: '2023-09-15',
      status: 'Active',
      basicSalary: 5900,
      assignedSite: 'Apex Industrial Plant - Site A',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      address: '83 Harbor View Highway',
      emergencyContact: 'Camila Santos (+1 555-445-9988)',
      documents: ['High_Strength_Bolting_Inspection.pdf']
    },
    {
      id: 'EMP-1019',
      name: 'Rachel Green',
      email: 'rachel.g@fabsteel.demo',
      phone: '+1 (555) 012-3467',
      department: 'Finance & Accounts',
      designation: 'Payroll & Accounts Payable Specialist',
      joiningDate: '2023-11-01',
      status: 'Active',
      basicSalary: 4900,
      assignedSite: 'Global Headquarters - Tower 1',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      address: '28 Meadow Lane',
      emergencyContact: 'George Green (+1 555-112-3344)',
      documents: ['Accounting_Diploma_Honors.pdf']
    },
    {
      id: 'EMP-1020',
      name: 'Dmitri Volkov',
      email: 'dmitri.v@fabsteel.demo',
      phone: '+1 (555) 123-4578',
      department: 'Structural Engineering',
      designation: 'Seismic & Dynamic Load Specialist',
      joiningDate: '2022-10-10',
      status: 'Active',
      basicSalary: 8100,
      assignedSite: 'Main Engineering Center',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      address: '90 North Star Park',
      emergencyContact: 'Katarina Volkov (+1 555-554-6677)',
      documents: ['PhD_Seismic_Engineering.pdf']
    },
    {
      id: 'EMP-1021',
      name: 'Sunita Rao',
      email: 'sunita.rao@fabsteel.demo',
      phone: '+1 (555) 234-5689',
      department: 'Quality Assurance & QC',
      designation: 'ISO 9001 Lead Auditor & Document Controller',
      joiningDate: '2023-02-14',
      status: 'Active',
      basicSalary: 5600,
      assignedSite: 'Global Headquarters - Tower 1',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      address: '14 Sunburst Apartments',
      emergencyContact: 'Ramesh Rao (+1 555-889-1122)',
      documents: ['IRCA_ISO9001_Lead_Auditor.pdf']
    },
    {
      id: 'EMP-1022',
      name: 'Oliver Queen',
      email: 'oliver.q@fabsteel.demo',
      phone: '+1 (555) 345-6790',
      department: 'Project Management',
      designation: 'Steel Project Delivery Planner',
      joiningDate: '2024-04-01',
      status: 'Active',
      basicSalary: 6200,
      assignedSite: 'Global Headquarters - Tower 1',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      address: '10 Arrowwood St',
      emergencyContact: 'Thea Queen (+1 555-998-7766)',
      documents: ['Primavera_P6_Certified.pdf']
    },
    {
      id: 'EMP-1023',
      name: 'Nadia Petrov',
      email: 'nadia.p@fabsteel.demo',
      phone: '+1 (555) 456-7801',
      department: 'Tekla & BIM Detailing',
      designation: 'Precast & Steel Hybrid Detailing Engineer',
      joiningDate: '2023-07-01',
      status: 'Active',
      basicSalary: 6100,
      assignedSite: 'Main Engineering Center',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      address: '47 Crescent Park, Flat 8',
      emergencyContact: 'Alexei Petrov (+1 555-123-9900)',
      documents: ['Revit_Structures_Pro.pdf']
    },
    {
      id: 'EMP-1024',
      name: 'Hassan Al-Farsi',
      email: 'hassan.f@fabsteel.demo',
      phone: '+1 (555) 567-8923',
      department: 'Field Operations',
      designation: 'Site Survey & Laser Scanning Specialist',
      joiningDate: '2024-05-15',
      status: 'Active',
      basicSalary: 5700,
      assignedSite: 'Apex Industrial Plant - Site A',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      address: '112 Sandpiper Highway',
      emergencyContact: 'Zahra Al-Farsi (+1 555-445-6677)',
      documents: ['Leica_Laser_Scanning_Cert.pdf']
    },
    {
      id: 'EMP-1025',
      name: 'Chloe Bennett',
      email: 'chloe.b@fabsteel.demo',
      phone: '+1 (555) 678-9034',
      department: 'Human Resources',
      designation: 'Talent Acquisition & Employee Wellness Officer',
      joiningDate: '2024-06-01',
      status: 'On Leave',
      basicSalary: 4700,
      assignedSite: 'Global Headquarters - Tower 1',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      address: '92 Rosewood Circle',
      emergencyContact: 'Mark Bennett (+1 555-776-4433)',
      documents: ['HR_Generalist_Cert.pdf']
    }
  ];

  // 10 Industrial Partners & EPC Clients
  const partners = [
    {
      id: 'PART-1001',
      companyName: 'Apex Heavy Engineering Ltd.',
      contactPerson: 'Vikram Mehta (VP Contracting)',
      email: 'vikram.mehta@apexheavy.com',
      phone: '+1 (555) 789-4321',
      address: 'Industrial Sector 9, Heavy Fabrication Yard, Houston TX',
      gstNumber: 'US-TX-99882211',
      partnershipType: 'EPC Contractor & Fabricator',
      agreementDate: '2023-01-15',
      status: 'Active',
      paymentTerms: 'Net 30 Days',
      logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=120&q=80',
      notes: 'Key client for 12,000 MT refinery pipe rack structural detailing and connection PE stamp.'
    },
    {
      id: 'PART-1002',
      companyName: 'Tata Steel Infra Projects',
      contactPerson: 'Rajeev Singhania (Head of Procurement)',
      email: 'r.singhania@tatasteelinfra.demo',
      phone: '+91 (22) 6789-0123',
      address: 'Jamshedpur Works, Tata Complex, India',
      gstNumber: '20AAACT2727Q1ZW',
      partnershipType: 'Steel Mill & Infrastructure Major',
      agreementDate: '2022-04-10',
      status: 'Active',
      paymentTerms: 'Net 45 Days',
      logo: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=120&q=80',
      notes: 'Partnered on high-speed rail viaduct steel box girders and blast furnace structures.'
    },
    {
      id: 'PART-1003',
      companyName: 'Dubai Bridge & Architectural Metals',
      contactPerson: 'Rashid Al-Nuaimi (Managing Director)',
      email: 'rashid@dubaibridgefab.demo',
      phone: '+971 4 881 2900',
      address: 'Jebel Ali Free Zone, South Yard, Dubai, UAE',
      gstNumber: 'AE-TRN-100293847500003',
      partnershipType: 'Architectural & Signature Bridges',
      agreementDate: '2023-08-20',
      status: 'Active',
      paymentTerms: 'Net 30 Days',
      logo: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=120&q=80',
      notes: 'Long-span cable-stayed pedestrian bridges and curved tubular truss detailing.'
    },
    {
      id: 'PART-1004',
      companyName: 'Larsen & Toubro Heavy Fab Div.',
      contactPerson: 'P. K. Ramaswamy (General Manager)',
      email: 'pk.ramaswamy@lnthfab.demo',
      phone: '+91 (265) 244-8900',
      address: 'Hazira Manufacturing Complex, Surat, Gujarat',
      gstNumber: '24AAACL0140P1ZL',
      partnershipType: 'EPC Offshore & Heavy Industrial',
      agreementDate: '2021-09-05',
      status: 'Active',
      paymentTerms: 'Net 60 Days',
      logo: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=120&q=80',
      notes: 'Offshore module topsides and deep-sea jacket template connection engineering.'
    },
    {
      id: 'PART-1005',
      companyName: 'Jindal Global Structural Solutions',
      contactPerson: 'Deepak Jindal (Director Projects)',
      email: 'deepak.j@jindalglobalsteel.demo',
      phone: '+91 (11) 4567-8900',
      address: 'Jindal Centre, 12 Bhikaiji Cama Place, New Delhi',
      gstNumber: '07AAACJ4321K1ZZ',
      partnershipType: 'Heavy Structural Fabrication',
      agreementDate: '2023-03-12',
      status: 'Active',
      paymentTerms: 'Net 30 Days',
      logo: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=120&q=80',
      notes: 'Standardized pre-engineered building (PEB) detailing modules and automated CNC.'
    },
    {
      id: 'PART-1006',
      companyName: 'Balfour Beatty Industrial Structures',
      contactPerson: 'Simon Hastings (Commercial Lead)',
      email: 's.hastings@balfourbeatty.demo',
      phone: '+44 20 7216 6800',
      address: '5 Churchill Place, Canary Wharf, London, UK',
      gstNumber: 'GB-VAT-238475902',
      partnershipType: 'Civil & Commercial Infrastructure',
      agreementDate: '2022-11-18',
      status: 'Active',
      paymentTerms: 'Net 45 Days',
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80',
      notes: 'High-rise composite steel framing and stadium cantilever roof truss systems.'
    },
    {
      id: 'PART-1007',
      companyName: 'Bauer Structural Steel Inc.',
      contactPerson: 'Hans-Peter Bauer (Chief Engineer)',
      email: 'hp.bauer@bauerstahl.demo',
      phone: '+49 89 4521 890',
      address: 'Industriestrasse 14, 80331 Munich, Germany',
      gstNumber: 'DE-UST-819283746',
      partnershipType: 'Automated Robotic Steel Fabrication',
      agreementDate: '2024-01-10',
      status: 'Active',
      paymentTerms: 'Net 15 Days',
      logo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=120&q=80',
      notes: 'Advanced DSTV & XML direct robot welding file feed integration.'
    },
    {
      id: 'PART-1008',
      companyName: 'Vanderbilt Logistics Warehousing EPC',
      contactPerson: 'Thomas Vanderbilt Jr. (President)',
      email: 'tvanderbilt@vanderbilt-epc.demo',
      phone: '+1 (555) 887-1234',
      address: '400 Commercial Way, Atlanta GA',
      gstNumber: 'US-GA-88771122',
      partnershipType: 'Mega Distribution Centers',
      agreementDate: '2023-05-22',
      status: 'Active',
      paymentTerms: 'Net 30 Days',
      logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=120&q=80',
      notes: 'Million sq ft automated fulfillment centers with heavy mezzanine and truss floors.'
    },
    {
      id: 'PART-1009',
      companyName: 'Nordic Clean Energy Foundations',
      contactPerson: 'Astrid Lindholm (VP Supply Chain)',
      email: 'astrid@nordiccleanfab.demo',
      phone: '+46 8 555 4321',
      address: 'Hamngatan 12, Stockholm, Sweden',
      gstNumber: 'SE-ORG-5561234567',
      partnershipType: 'Offshore Wind Transition Pieces',
      agreementDate: '2023-10-05',
      status: 'Pending Renewal',
      paymentTerms: 'Net 30 Days',
      logo: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=120&q=80',
      notes: 'Heavy tubular transition pieces for 15MW offshore wind turbines.'
    },
    {
      id: 'PART-1010',
      companyName: 'AeroSpace Hangar Constructors LLC',
      contactPerson: 'Major Gregory Vance (COO)',
      email: 'gvance@aerohangarfab.demo',
      phone: '+1 (555) 443-9876',
      address: 'Airfield Road 5, Seattle WA',
      gstNumber: 'US-WA-44332211',
      partnershipType: 'Clear-Span Aviation Hangars',
      agreementDate: '2024-02-01',
      status: 'Active',
      paymentTerms: 'Net 30 Days',
      logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80',
      notes: '120-meter clear-span door trusses and maintenance crane runway girders.'
    }
  ];

  // 20 Realistic Invoices
  const invoices = [
    {
      id: 'INV-2026-001',
      date: '2026-10-02',
      dueDate: '2026-11-01',
      partnerId: 'PART-1001',
      partnerName: 'Apex Heavy Engineering Ltd.',
      email: 'vikram.mehta@apexheavy.com',
      address: 'Industrial Sector 9, Heavy Fabrication Yard, Houston TX',
      gstNumber: 'US-TX-99882211',
      description: 'Phase 1 Structural Steel BIM Detailing & Connection PE Calculations (Refinery Yard 4)',
      items: [
        { name: 'Tekla 3D LOD 400 Steel Detailing (4,200 MT)', qty: 4200, unitPrice: 12.50, tax: 18, total: 52500 },
        { name: 'Licensed PE Stamped Connection Calculations', qty: 1, unitPrice: 8500.00, tax: 18, total: 8500 },
        { name: 'CNC DSTV Spooling & Fabrication Drawings Package', qty: 1, unitPrice: 6500.00, tax: 18, total: 6500 }
      ],
      subtotal: 67500.00,
      discountPercent: 5,
      discountAmount: 3375.00,
      taxPercent: 18,
      taxAmount: 11542.50,
      totalAmount: 75667.50,
      paidAmount: 75667.50,
      status: 'Paid',
      paymentDate: '2026-10-28',
      paymentReference: 'WIRE-US-9982710',
      notes: 'Payment received in full via Citibank Wire. Milestone 1 released.'
    },
    {
      id: 'INV-2026-002',
      date: '2026-10-10',
      dueDate: '2026-11-09',
      partnerId: 'PART-1002',
      partnerName: 'Tata Steel Infra Projects',
      email: 'r.singhania@tatasteelinfra.demo',
      address: 'Jamshedpur Works, Tata Complex, India',
      gstNumber: '20AAACT2727Q1ZW',
      description: 'High-Speed Rail Viaduct Composite Box Girder Detailed Shop Drawings',
      items: [
        { name: 'Steel Box Girder Fabrication Shop Drawings (2,500 MT)', qty: 2500, unitPrice: 14.00, tax: 18, total: 35000 },
        { name: '3D Laser Scan Cloud Alignment & Camber Analysis', qty: 1, unitPrice: 4800.00, tax: 18, total: 4800 }
      ],
      subtotal: 39800.00,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 18,
      taxAmount: 7164.00,
      totalAmount: 46964.00,
      paidAmount: 46964.00,
      status: 'Paid',
      paymentDate: '2026-11-02',
      paymentReference: 'NEFT-TATAFIN-00192',
      notes: 'Cleared via HDFC Corporate Account.'
    },
    {
      id: 'INV-2026-003',
      date: '2026-10-18',
      dueDate: '2026-11-17',
      partnerId: 'PART-1003',
      partnerName: 'Dubai Bridge & Architectural Metals',
      email: 'rashid@dubaibridgefab.demo',
      address: 'Jebel Ali Free Zone, South Yard, Dubai, UAE',
      gstNumber: 'AE-TRN-100293847500003',
      description: 'Tubular Steel Curved Pedestrian Skybridge Erection Sequencing Model',
      items: [
        { name: 'Complex Curved Hollow Section Detailing (1,100 MT)', qty: 1100, unitPrice: 18.00, tax: 5, total: 19800 },
        { name: 'Step-by-Step Erection Deflection Simulation', qty: 1, unitPrice: 9200.00, tax: 5, total: 9200 }
      ],
      subtotal: 29000.00,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 5,
      taxAmount: 1450.00,
      totalAmount: 30450.00,
      paidAmount: 15000.00,
      status: 'Pending',
      paymentDate: null,
      paymentReference: 'PARTIAL-ENBD-8821',
      notes: '50% advance received. Remainder due on final drawing submittal.'
    },
    {
      id: 'INV-2026-004',
      date: '2026-09-15',
      dueDate: '2026-10-15',
      partnerId: 'PART-1004',
      partnerName: 'Larsen & Toubro Heavy Fab Div.',
      email: 'pk.ramaswamy@lnthfab.demo',
      address: 'Hazira Manufacturing Complex, Surat, Gujarat',
      gstNumber: '24AAACL0140P1ZL',
      description: 'Offshore Flare Boom Truss Shop Drawings & Welding PQR Documentation',
      items: [
        { name: 'High-Yield Heavy Tubular Node Connection Modeling', qty: 1, unitPrice: 42000.00, tax: 18, total: 42000 },
        { name: 'Third-party AWS CWI Verification Package', qty: 1, unitPrice: 7500.00, tax: 18, total: 7500 }
      ],
      subtotal: 49500.00,
      discountPercent: 2,
      discountAmount: 990.00,
      taxPercent: 18,
      taxAmount: 8731.80,
      totalAmount: 57241.80,
      paidAmount: 0,
      status: 'Overdue',
      paymentDate: null,
      paymentReference: null,
      notes: 'Follow-up email reminder sent on Nov 2.'
    },
    {
      id: 'INV-2026-005',
      date: '2026-10-25',
      dueDate: '2026-11-24',
      partnerId: 'PART-1005',
      partnerName: 'Jindal Global Structural Solutions',
      email: 'deepak.j@jindalglobalsteel.demo',
      address: 'Jindal Centre, 12 Bhikaiji Cama Place, New Delhi',
      gstNumber: '07AAACJ4321K1ZZ',
      description: 'Automated PEB Warehouse Module Standardization (Phase 2)',
      items: [
        { name: 'Parametric Tekla Warehouse Model Library', qty: 1, unitPrice: 22000.00, tax: 18, total: 22000 },
        { name: 'Anchor Bolt Setting Plans & Foundation Reaction Tables', qty: 1, unitPrice: 4500.00, tax: 18, total: 4500 }
      ],
      subtotal: 26500.00,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 18,
      taxAmount: 4770.00,
      totalAmount: 31270.00,
      paidAmount: 0,
      status: 'Pending',
      paymentDate: null,
      paymentReference: null,
      notes: 'Invoice dispatched to client accounts department.'
    },
    {
      id: 'INV-2026-006',
      date: '2026-10-28',
      dueDate: '2026-11-27',
      partnerId: 'PART-1006',
      partnerName: 'Balfour Beatty Industrial Structures',
      email: 's.hastings@balfourbeatty.demo',
      address: '5 Churchill Place, Canary Wharf, London, UK',
      gstNumber: 'GB-VAT-238475902',
      description: 'Stadium Cantilever Roof Truss Detailing & Deflection Camber Scheme',
      items: [
        { name: 'Cantilever Roof Truss 3D Modeling (3,800 MT)', qty: 3800, unitPrice: 15.00, tax: 20, total: 57000 },
        { name: 'Wind Tunnel Load Connection Validation Report', qty: 1, unitPrice: 11000.00, tax: 20, total: 11000 }
      ],
      subtotal: 68000.00,
      discountPercent: 3,
      discountAmount: 2040.00,
      taxPercent: 20,
      taxAmount: 13192.00,
      totalAmount: 79152.00,
      paidAmount: 79152.00,
      status: 'Paid',
      paymentDate: '2026-11-04',
      paymentReference: 'BACS-LON-008271',
      notes: 'Cleared through Barclays International.'
    },
    {
      id: 'INV-2026-007',
      date: '2026-11-01',
      dueDate: '2026-12-01',
      partnerId: 'PART-1007',
      partnerName: 'Bauer Structural Steel Inc.',
      email: 'hp.bauer@bauerstahl.demo',
      address: 'Industriestrasse 14, 80331 Munich, Germany',
      gstNumber: 'DE-UST-819283746',
      description: 'Robotic Welding Cell XML Automation Data Package for Heavy Columns',
      items: [
        { name: 'Robotic CNC Automated Spooling Scripting', qty: 1, unitPrice: 18500.00, tax: 19, total: 18500 },
        { name: 'Batch Plate Nesting & Drop-Cut Optimization Files', qty: 1, unitPrice: 3500.00, tax: 19, total: 3500 }
      ],
      subtotal: 22000.00,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 19,
      taxAmount: 4180.00,
      totalAmount: 26180.00,
      paidAmount: 0,
      status: 'Pending',
      paymentDate: null,
      paymentReference: null,
      notes: 'Awaiting client approval for automated batch feed.'
    },
    {
      id: 'INV-2026-008',
      date: '2026-10-05',
      dueDate: '2026-11-04',
      partnerId: 'PART-1008',
      partnerName: 'Vanderbilt Logistics Warehousing EPC',
      email: 'tvanderbilt@vanderbilt-epc.demo',
      address: '400 Commercial Way, Atlanta GA',
      gstNumber: 'US-GA-88771122',
      description: 'Distribution Hub Mezzanine Steel Framework Shop Drawings',
      items: [
        { name: 'Bar Joist & Girder Framing Package (1,800 MT)', qty: 1800, unitPrice: 11.00, tax: 7, total: 19800 },
        { name: 'Stair Tower & OSHA Industrial Handrail Submittals', qty: 1, unitPrice: 5200.00, tax: 7, total: 5200 }
      ],
      subtotal: 25000.00,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 7,
      taxAmount: 1750.00,
      totalAmount: 26750.00,
      paidAmount: 26750.00,
      status: 'Paid',
      paymentDate: '2026-10-30',
      paymentReference: 'ACH-WELLSFARGO-991',
      notes: 'Paid on schedule.'
    },
    {
      id: 'INV-2026-009',
      date: '2026-09-01',
      dueDate: '2026-10-01',
      partnerId: 'PART-1009',
      partnerName: 'Nordic Clean Energy Foundations',
      email: 'astrid@nordiccleanfab.demo',
      address: 'Hamngatan 12, Stockholm, Sweden',
      gstNumber: 'SE-ORG-5561234567',
      description: 'Offshore Wind Transition Piece Internal Grating & Ladder Detailing',
      items: [
        { name: 'High-Fatigue Offshore Secondary Steel Detailing', qty: 1, unitPrice: 34000.00, tax: 25, total: 34000 }
      ],
      subtotal: 34000.00,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 25,
      taxAmount: 8500.00,
      totalAmount: 42500.00,
      paidAmount: 0,
      status: 'Overdue',
      paymentDate: null,
      paymentReference: null,
      notes: 'Second overdue reminder sent with commercial ledger.'
    },
    {
      id: 'INV-2026-010',
      date: '2026-11-04',
      dueDate: '2026-12-04',
      partnerId: 'PART-1010',
      partnerName: 'AeroSpace Hangar Constructors LLC',
      email: 'gvance@aerohangarfab.demo',
      address: 'Airfield Road 5, Seattle WA',
      gstNumber: 'US-WA-44332211',
      description: '120m Clear-Span Aircraft Hangar Door Truss Structural Modeling',
      items: [
        { name: 'Heavy Truss Shop Drawings (2,200 MT)', qty: 2200, unitPrice: 16.50, tax: 6.5, total: 36300 },
        { name: 'Runway Crane Girder Fatigue Verification', qty: 1, unitPrice: 7200.00, tax: 6.5, total: 7200 }
      ],
      subtotal: 43500.00,
      discountPercent: 4,
      discountAmount: 1740.00,
      taxPercent: 6.5,
      taxAmount: 2714.40,
      totalAmount: 44474.40,
      paidAmount: 0,
      status: 'Draft',
      paymentDate: null,
      paymentReference: null,
      notes: 'Draft awaiting final review by Alexander Wright.'
    },
    {
      id: 'INV-2026-011',
      date: '2026-10-12',
      dueDate: '2026-11-11',
      partnerId: 'PART-1001',
      partnerName: 'Apex Heavy Engineering Ltd.',
      email: 'vikram.mehta@apexheavy.com',
      address: 'Industrial Sector 9, Heavy Fabrication Yard, Houston TX',
      gstNumber: 'US-TX-99882211',
      description: 'Change Order #3: Additional Flare Riser Support Trusses',
      items: [
        { name: 'Riser Truss Detailing & As-Built Modification', qty: 1, unitPrice: 14200.00, tax: 18, total: 14200 }
      ],
      subtotal: 14200.00,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 18,
      taxAmount: 2556.00,
      totalAmount: 16756.00,
      paidAmount: 16756.00,
      status: 'Paid',
      paymentDate: '2026-10-25',
      paymentReference: 'WIRE-US-9912002',
      notes: 'Cleared.'
    },
    {
      id: 'INV-2026-012',
      date: '2026-10-20',
      dueDate: '2026-11-19',
      partnerId: 'PART-1002',
      partnerName: 'Tata Steel Infra Projects',
      email: 'r.singhania@tatasteelinfra.demo',
      address: 'Jamshedpur Works, Tata Complex, India',
      gstNumber: '20AAACT2727Q1ZW',
      description: 'Blast Furnace Re-lining Steel Shell Plate Modeling',
      items: [
        { name: 'Thick Curved Plate CNC Rolling Drawings', qty: 1, unitPrice: 28000.00, tax: 18, total: 28000 }
      ],
      subtotal: 28000.00,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 18,
      taxAmount: 5040.00,
      totalAmount: 33040.00,
      paidAmount: 33040.00,
      status: 'Paid',
      paymentDate: '2026-11-01',
      paymentReference: 'RTGS-TATA-77821',
      notes: 'Payment confirmed.'
    },
    {
      id: 'INV-2026-013',
      date: '2026-10-29',
      dueDate: '2026-11-28',
      partnerId: 'PART-1003',
      partnerName: 'Dubai Bridge & Architectural Metals',
      email: 'rashid@dubaibridgefab.demo',
      address: 'Jebel Ali Free Zone, South Yard, Dubai, UAE',
      gstNumber: 'AE-TRN-100293847500003',
      description: 'Cable Stay Anchor Head Weldment Detail Drawings',
      items: [
        { name: 'Cast Steel Anchor Head Machining Drawings', qty: 1, unitPrice: 19500.00, tax: 5, total: 19500 }
      ],
      subtotal: 19500.00,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 5,
      taxAmount: 975.00,
      totalAmount: 20475.00,
      paidAmount: 0,
      status: 'Pending',
      paymentDate: null,
      paymentReference: null,
      notes: 'Pending customer drawing sign-off.'
    },
    {
      id: 'INV-2026-014',
      date: '2026-08-20',
      dueDate: '2026-09-20',
      partnerId: 'PART-1004',
      partnerName: 'Larsen & Toubro Heavy Fab Div.',
      email: 'pk.ramaswamy@lnthfab.demo',
      address: 'Hazira Manufacturing Complex, Surat, Gujarat',
      gstNumber: '24AAACL0140P1ZL',
      description: 'Drilling Platform Cantilever Skid Frame Calculations',
      items: [
        { name: 'DNV-GL Heavy Offshore Skid Certification Drawings', qty: 1, unitPrice: 36000.00, tax: 18, total: 36000 }
      ],
      subtotal: 36000.00,
      discountPercent: 5,
      discountAmount: 1800.00,
      taxPercent: 18,
      taxAmount: 6156.00,
      totalAmount: 40356.00,
      paidAmount: 0,
      status: 'Overdue',
      paymentDate: null,
      paymentReference: null,
      notes: 'Overdue. Escalate to commercial director.'
    },
    {
      id: 'INV-2026-015',
      date: '2026-11-02',
      dueDate: '2026-12-02',
      partnerId: 'PART-1005',
      partnerName: 'Jindal Global Structural Solutions',
      email: 'deepak.j@jindalglobalsteel.demo',
      address: 'Jindal Centre, 12 Bhikaiji Cama Place, New Delhi',
      gstNumber: '07AAACJ4321K1ZZ',
      description: 'PEB Industrial Crane Beam Detailing Package',
      items: [
        { name: 'Crane Girders & Surging Trusses (850 MT)', qty: 850, unitPrice: 13.00, tax: 18, total: 11050 }
      ],
      subtotal: 11050.00,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 18,
      taxAmount: 1989.00,
      totalAmount: 13039.00,
      paidAmount: 0,
      status: 'Pending',
      paymentDate: null,
      paymentReference: null,
      notes: 'New invoice.'
    },
    {
      id: 'INV-2026-016',
      date: '2026-10-15',
      dueDate: '2026-11-14',
      partnerId: 'PART-1006',
      partnerName: 'Balfour Beatty Industrial Structures',
      email: 's.hastings@balfourbeatty.demo',
      address: '5 Churchill Place, Canary Wharf, London, UK',
      gstNumber: 'GB-VAT-238475902',
      description: 'Tower Core Embedded Steel Anchor Plates & Shear Stud Plans',
      items: [
        { name: 'Core Embed Plate Detailing & CNC Spooling', qty: 1, unitPrice: 24000.00, tax: 20, total: 24000 }
      ],
      subtotal: 24000.00,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 20,
      taxAmount: 4800.00,
      totalAmount: 28800.00,
      paidAmount: 28800.00,
      status: 'Paid',
      paymentDate: '2026-11-03',
      paymentReference: 'WIRE-UK-882910',
      notes: 'Paid.'
    },
    {
      id: 'INV-2026-017',
      date: '2026-11-03',
      dueDate: '2026-12-03',
      partnerId: 'PART-1007',
      partnerName: 'Bauer Structural Steel Inc.',
      email: 'hp.bauer@bauerstahl.demo',
      address: 'Industriestrasse 14, 80331 Munich, Germany',
      gstNumber: 'DE-UST-819283746',
      description: 'Direct Robot Welding Multi-Pass Chamfer Data Generator',
      items: [
        { name: 'Custom Python & Grasshopper Algorithmic Tooling', qty: 1, unitPrice: 15000.00, tax: 19, total: 15000 }
      ],
      subtotal: 15000.00,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 19,
      taxAmount: 2850.00,
      totalAmount: 17850.00,
      paidAmount: 0,
      status: 'Draft',
      paymentDate: null,
      paymentReference: null,
      notes: 'Draft stage.'
    },
    {
      id: 'INV-2026-018',
      date: '2026-10-22',
      dueDate: '2026-11-21',
      partnerId: 'PART-1008',
      partnerName: 'Vanderbilt Logistics Warehousing EPC',
      email: 'tvanderbilt@vanderbilt-epc.demo',
      address: '400 Commercial Way, Atlanta GA',
      gstNumber: 'US-GA-88771122',
      description: 'Automated Conveyor Support Structural Towers',
      items: [
        { name: 'Support Towers & Shaker Table Damping Brackets', qty: 1, unitPrice: 18000.00, tax: 7, total: 18000 }
      ],
      subtotal: 18000.00,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 7,
      taxAmount: 1260.00,
      totalAmount: 19260.00,
      paidAmount: 19260.00,
      status: 'Paid',
      paymentDate: '2026-11-04',
      paymentReference: 'ACH-VAND-7762',
      notes: 'Paid.'
    },
    {
      id: 'INV-2026-019',
      date: '2026-09-28',
      dueDate: '2026-10-28',
      partnerId: 'PART-1009',
      partnerName: 'Nordic Clean Energy Foundations',
      email: 'astrid@nordiccleanfab.demo',
      address: 'Hamngatan 12, Stockholm, Sweden',
      gstNumber: 'SE-ORG-5561234567',
      description: 'Offshore Monopile Boat Landing & Anode Cage Models',
      items: [
        { name: 'Marine Grade Stainless & Monel Steel Fabrication Files', qty: 1, unitPrice: 27500.00, tax: 25, total: 27500 }
      ],
      subtotal: 27500.00,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 25,
      taxAmount: 6875.00,
      totalAmount: 34375.00,
      paidAmount: 0,
      status: 'Overdue',
      paymentDate: null,
      paymentReference: null,
      notes: 'Overdue by 9 days.'
    },
    {
      id: 'INV-2026-020',
      date: '2026-11-05',
      dueDate: '2026-12-05',
      partnerId: 'PART-1010',
      partnerName: 'AeroSpace Hangar Constructors LLC',
      email: 'gvance@aerohangarfab.demo',
      address: 'Airfield Road 5, Seattle WA',
      gstNumber: 'US-WA-44332211',
      description: 'Hangar Door Bottom Guide Rail Embedded Trough Assembly Drawings',
      items: [
        { name: 'Heavy Rail Foundation Plates & Alignment Splices', qty: 1, unitPrice: 16500.00, tax: 6.5, total: 16500 }
      ],
      subtotal: 16500.00,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 6.5,
      taxAmount: 1072.50,
      totalAmount: 17572.50,
      paidAmount: 0,
      status: 'Pending',
      paymentDate: null,
      paymentReference: null,
      notes: 'Sent to billing.'
    }
  ];

  // 50 Attendance Records (Multi-date, realistic times and sites)
  const attendance = [];
  const sampleDates = ['2026-11-06', '2026-11-05', '2026-11-04'];
  const sitesList = ['Main Engineering Center', 'Apex Industrial Plant - Site A', 'Global Headquarters - Tower 1'];
  
  let attCounter = 1;
  sampleDates.forEach(dateStr => {
    employees.forEach((emp, index) => {
      // distribute statuses
      let status = 'Present';
      let checkIn = '08:55';
      let checkOut = '17:35';
      let hours = 8.5;

      if (index === 3 || index === 9) {
        status = 'Late';
        checkIn = '09:42';
        checkOut = '18:15';
        hours = 8.5;
      } else if (index === 7 || index === 24) {
        status = 'On Leave';
        checkIn = '—';
        checkOut = '—';
        hours = 0;
      } else if (index === 17 && dateStr === '2026-11-06') {
        status = 'Absent';
        checkIn = '—';
        checkOut = '—';
        hours = 0;
      } else if (index === 13 && dateStr === '2026-11-05') {
        status = 'Half-day';
        checkIn = '09:00';
        checkOut = '13:00';
        hours = 4.0;
      }

      if (attCounter <= 50) {
        attendance.push({
          id: `ATT-${1000 + attCounter}`,
          employeeId: emp.id,
          employeeName: emp.name,
          department: emp.department,
          date: dateStr,
          checkIn: checkIn,
          checkOut: checkOut,
          workingHours: hours,
          status: status,
          site: emp.assignedSite,
          notes: status === 'Late' ? 'Traffic bottleneck on expressway' : (status === 'On Leave' ? 'Approved medical/annual leave' : 'Normal shift completed')
        });
        attCounter++;
      }
    });
  });

  // 25 Salary Structures
  const salaryStructures = employees.map(emp => {
    const basic = emp.basicSalary;
    const hra = Math.round(basic * 0.30);
    const allowances = Math.round(basic * 0.15);
    const bonus = Math.round(basic * 0.05);
    const overtime = 250;
    const deductions = Math.round(basic * 0.10); // PF / Tax
    const advance = 0;
    const otherDeductions = 50;
    const netSalary = basic + hra + allowances + bonus + overtime - deductions - advance - otherDeductions;

    return {
      id: `SAL-${emp.id}`,
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      designation: emp.designation,
      basicSalary: basic,
      hra: hra,
      allowances: allowances,
      bonus: bonus,
      overtime: overtime,
      deductions: deductions,
      advance: advance,
      otherDeductions: otherDeductions,
      netSalary: netSalary,
      effectiveDate: '2026-01-01',
      bankName: 'Standard Chartered Bank',
      accountNumber: `**** **** ${Math.floor(1000 + Math.random() * 9000)}`,
      panNumber: `FABST${Math.floor(1000 + Math.random() * 9000)}L`
    };
  });

  // 20 Payroll Records for October 2026
  const payrollRecords = employees.slice(0, 20).map((emp, i) => {
    const sal = salaryStructures.find(s => s.employeeId === emp.id) || salaryStructures[0];
    const isPaid = i < 16;
    return {
      id: `PR-2026-10-${String(i + 1).padStart(3, '0')}`,
      payrollMonth: 'October 2026',
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      basicSalary: sal.basicSalary,
      allowances: sal.hra + sal.allowances + sal.bonus + sal.overtime,
      deductions: sal.deductions + sal.otherDeductions,
      netPayable: sal.netSalary,
      status: isPaid ? 'Paid' : 'Pending',
      paymentDate: isPaid ? '2026-10-31' : null,
      paymentReference: isPaid ? `UTR-SCB-20261031-${1000 + i}` : null,
      paymentMethod: 'Direct Bank Transfer (NEFT/ACH)',
      generatedDate: '2026-10-28'
    };
  });

  // 8 Public Team Members for CMS
  const teamMembers = [
    {
      id: 'TM-01',
      name: 'Alexander Wright',
      designation: 'Managing Director & Founder',
      department: 'Executive Leadership',
      bio: 'Over 28 years directing mega structural steel projects across North America, Europe, and the Middle East.',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      email: 'a.wright@fabsteel.demo',
      linkedin: 'https://linkedin.com/in/alexander-wright-fabsteel',
      displayOrder: 1,
      status: 'Active'
    },
    {
      id: 'TM-02',
      name: 'Elena Rostova, PE',
      designation: 'Head of Structural Design & Connection Engineering',
      department: 'Structural Engineering',
      bio: 'Licensed PE specializing in high-seismic connection design, high-strength bolting, and welded offshore structures.',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      email: 'e.rostova@fabsteel.demo',
      linkedin: 'https://linkedin.com/in/elena-rostova-pe',
      displayOrder: 2,
      status: 'Active'
    },
    {
      id: 'TM-03',
      name: 'Rahul Sharma',
      designation: 'Chief Tekla 3D & BIM Solutions Architect',
      department: 'Tekla & BIM Detailing',
      bio: 'Pioneered robotic CNC DSTV integration and custom Open API parametric Tekla components for complex trusses.',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      email: 'r.sharma@fabsteel.demo',
      linkedin: 'https://linkedin.com/in/rahul-sharma-tekla',
      displayOrder: 3,
      status: 'Active'
    },
    {
      id: 'TM-04',
      name: 'David Macintyre',
      designation: 'Global Director of Site Operations & Erection',
      department: 'Field Operations',
      bio: 'Master of heavy dual-crane tandem lifts, heavy industrial rigging, and on-site zero-incident safety management.',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      email: 'd.macintyre@fabsteel.demo',
      linkedin: 'https://linkedin.com/in/david-macintyre-rigging',
      displayOrder: 4,
      status: 'Active'
    },
    {
      id: 'TM-05',
      name: 'Priya Patel, CWI',
      designation: 'Senior Quality Assurance & NDT Director',
      department: 'Quality Assurance',
      bio: 'AWS Certified Welding Inspector with Level III Ultrasonic testing credentials for critical cyclically loaded joints.',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      email: 'p.patel@fabsteel.demo',
      linkedin: 'https://linkedin.com/in/priya-patel-cwi',
      displayOrder: 5,
      status: 'Active'
    },
    {
      id: 'TM-06',
      name: 'Marcus Sterling',
      designation: 'Chief Financial Officer',
      department: 'Finance & Strategy',
      bio: 'Directing international project finance, hedging steel commodity volatility, and contractual risk hedging.',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      email: 'm.sterling@fabsteel.demo',
      linkedin: 'https://linkedin.com/in/marcus-sterling-cfo',
      displayOrder: 6,
      status: 'Active'
    },
    {
      id: 'TM-07',
      name: 'Zainab Al-Mansoor, PMP',
      designation: 'VP of Mega Project Delivery',
      department: 'Project Management',
      bio: 'Leading 50+ engineers delivering simultaneous multi-thousand-tonne fast-track international fabrication contracts.',
      photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
      email: 'z.mansoor@fabsteel.demo',
      linkedin: 'https://linkedin.com/in/zainab-al-mansoor-pmp',
      displayOrder: 7,
      status: 'Active'
    },
    {
      id: 'TM-08',
      name: 'Michael Chang, PhD',
      designation: 'Principal FEA Structural Research Scientist',
      department: 'Structural Engineering',
      bio: 'PhD from MIT specializing in dynamic blast-resistant structures and finite element thermomechanical models.',
      photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
      email: 'm.chang@fabsteel.demo',
      linkedin: 'https://linkedin.com/in/michael-chang-fea',
      displayOrder: 8,
      status: 'Active'
    }
  ];

  // 15 Contact Form Messages from Public Website
  const contactMessages = [
    {
      id: 'MSG-3001',
      name: 'Jonathan Sterling',
      email: 'j.sterling@sterlingconstruct.com',
      phone: '+1 (555) 234-9090',
      subject: 'Inquiry for 8,500 MT Steel Detailing in Dallas Commercial Hub',
      message: 'We are bidding on a 28-story composite steel high-rise. Need an estimate for LOD 400 Tekla detailing with licensed Texas PE stamped connection calculations.',
      date: '2026-11-06T08:15:00Z',
      status: 'New',
      notes: 'High-priority commercial tender. Forwarded to Elena Rostova.'
    },
    {
      id: 'MSG-3002',
      name: 'Fatima Al-Hassan',
      email: 'f.alhassan@gulfmetalinfra.demo',
      phone: '+971 4 455 8899',
      subject: 'RFP for Aviation Hangar Truss Detailing (Dubai South)',
      message: 'Looking for expert steel detailers with experience in clear spans greater than 100 meters. Need DSTV files for Voortman CNC beam line.',
      date: '2026-11-05T14:30:00Z',
      status: 'Unread',
      notes: ''
    },
    {
      id: 'MSG-3003',
      name: 'Oliver King',
      email: 'oking@kingerectors.co.uk',
      phone: '+44 20 7946 0192',
      subject: 'Site Rigging & Erection Advisory Consultation',
      message: 'We have a complex bridge launch over an electrified rail corridor. Requesting site manager consultation and 3D step-by-step rigging simulation.',
      date: '2026-11-05T10:10:00Z',
      status: 'Read',
      notes: 'David Macintyre reviewed. Preliminary call scheduled.'
    },
    {
      id: 'MSG-3004',
      name: 'Rohan Deshmukh',
      email: 'rohan.d@deshmukhfabricators.in',
      phone: '+91 (22) 2884-1122',
      subject: 'Tekla Custom Components & API Integration Training',
      message: 'Our fabrication shop in Pune wants to automate our beam-to-column moment connections. Can Fab Steel build custom parametric components?',
      date: '2026-11-04T16:45:00Z',
      status: 'Replied',
      notes: 'Sent standard engineering consulting brochure and pricing schedule.'
    },
    {
      id: 'MSG-3005',
      name: 'Marie Dupont',
      email: 'm.dupont@eiffelinnovations.fr',
      phone: '+33 1 42 68 55 00',
      subject: 'Architectural Curved Steel Pavilion Project',
      message: 'We require finite element analysis for an organic free-form lattice shell pavilion for the 2027 cultural expo in Lyon.',
      date: '2026-11-04T09:20:00Z',
      status: 'Replied',
      notes: 'Dr. Michael Chang sent technical capabilities dossier.'
    },
    {
      id: 'MSG-3006',
      name: 'Liam O’Connor',
      email: 'liam@dublinsteelworks.ie',
      phone: '+353 1 496 0000',
      subject: 'Connection Design Calculations for Pharmaceutical Cleanroom Mezzanines',
      message: 'High-vibration sensitive flooring requires dynamic load checks. Need proposal for 1,200 MT structural framing.',
      date: '2026-11-03T11:00:00Z',
      status: 'Read',
      notes: ''
    },
    {
      id: 'MSG-3007',
      name: 'Kenji Sato',
      email: 'k.sato@nipponheavysteel.jp',
      phone: '+81 3 5555 0143',
      subject: 'Seismic Damper Frame Connection Optimization',
      message: 'Seeking collaboration with Fab Steel on BRB (Buckling-Restrained Braced) frame modeling and fabrication submittals for Tokyo project.',
      date: '2026-11-02T15:15:00Z',
      status: 'Read',
      notes: ''
    },
    {
      id: 'MSG-3008',
      name: 'Samantha Brooks',
      email: 'sbrooks@brookspipeandsteel.com',
      phone: '+1 (555) 789-2233',
      subject: 'Pipe Rack Module Detailing for Refinery Expansion',
      message: 'Need 14 pre-assembled modular units detailed with shipping envelope limits and heavy lift pad eyes.',
      date: '2026-11-01T17:40:00Z',
      status: 'Archived',
      notes: 'Tender closed. Saved for future vendor pool.'
    },
    {
      id: 'MSG-3009',
      name: 'Hans Becker',
      email: 'h.becker@rheinmetall-fab.de',
      phone: '+49 211 473 0',
      subject: 'Laser Scanning to BIM As-Built Tolerances',
      message: 'We completed erection of a 3,000 MT industrial hall and need laser point cloud clash analysis against Tekla design model.',
      date: '2026-10-31T13:25:00Z',
      status: 'Replied',
      notes: 'Laser scanning team responded.'
    },
    {
      id: 'MSG-3010',
      name: 'Alejandro Gomez',
      email: 'agomez@mexicosteelinfra.mx',
      phone: '+52 55 5345 6789',
      subject: 'Industrial Warehouse PEB Optimization in Monterrey',
      message: 'Interested in reducing steel tonnage through tapered plate girders and high-strength cold-formed purlins.',
      date: '2026-10-30T10:05:00Z',
      status: 'Read',
      notes: ''
    },
    {
      id: 'MSG-3011',
      name: 'George Kouris',
      email: 'gkouris@hellenicmetal.gr',
      phone: '+30 210 772 1000',
      subject: 'Shipyard Gantry Crane Runway Girder Detailing',
      message: 'Fatigue life calculation and shop drawings for 80-tonne shipyard gantry crane rails.',
      date: '2026-10-29T08:50:00Z',
      status: 'Archived',
      notes: 'Completed.'
    },
    {
      id: 'MSG-3012',
      name: 'Anita Svanberg',
      email: 'anita@nordicoffshore.no',
      phone: '+47 22 83 00 00',
      subject: 'NORSOK M-101 Weld Procedure Compliance Inquiry',
      message: 'Requirement for third-party CWI document auditor on offshore jacket fabrication in Stavanger.',
      date: '2026-10-28T14:10:00Z',
      status: 'Replied',
      notes: 'Priya Patel confirmed availability.'
    },
    {
      id: 'MSG-3013',
      name: 'Tariq Al-Sabah',
      email: 'tariq@kuwaitheavyfab.kw',
      phone: '+965 2224 8000',
      subject: 'Desalination Plant Structural Platform Detailing',
      message: 'Looking for urgent submittal of galvanized secondary steel walkways and stair towers.',
      date: '2026-10-27T09:30:00Z',
      status: 'Read',
      notes: ''
    },
    {
      id: 'MSG-3014',
      name: 'Brenda Miller',
      email: 'bmiller@midweststeelpros.com',
      phone: '+1 (555) 654-7890',
      subject: 'AISC Certified Quality Control Manual Consulting',
      message: 'Can Fab Steel audit our fabrication plant quality assurance manual to prepare us for AISC certification?',
      date: '2026-10-26T16:00:00Z',
      status: 'Read',
      notes: ''
    },
    {
      id: 'MSG-3015',
      name: 'Daniel Croft',
      email: 'd.croft@sydneyharbourfab.com.au',
      phone: '+61 2 9251 0000',
      subject: 'Arch Bridge Steel Truss Detailing (Australia AS 5100)',
      message: 'Need Australian Standards compliant steel detailing for scenic arch road bridge.',
      date: '2026-10-25T11:20:00Z',
      status: 'Replied',
      notes: 'Proposal submitted.'
    }
  ];

  // 10 Partner Partnership Inquiries
  const partnerInquiries = [
    {
      id: 'INQ-4001',
      companyName: 'Bechtel Infrastructure Global',
      contactPerson: 'Gregory Stone (Senior VP Procurement)',
      email: 'g.stone@bechtel.demo',
      phone: '+1 (555) 902-1144',
      partnershipType: 'Preferred Global Steel Detailing Partner',
      message: 'Seeking a long-term framework agreement for worldwide power plant, LNG train, and mining structural steel modeling.',
      submissionDate: '2026-11-06T07:45:00Z',
      status: 'New',
      assignedStaff: 'Alexander Wright',
      notes: 'Enterprise account. Schedule executive presentation.'
    },
    {
      id: 'INQ-4002',
      companyName: 'Fluor Heavy Industrial Constructors',
      contactPerson: 'Catherine Zhao (Global Detailing Lead)',
      email: 'c.zhao@fluor.demo',
      phone: '+1 (555) 883-2211',
      partnershipType: 'EPC Contractor & Fabricator',
      message: 'Requesting qualification statement for 45,000 MT refinery expansion in Texas. Must have in-house PE stamping.',
      submissionDate: '2026-11-05T13:20:00Z',
      status: 'Under Review',
      assignedStaff: 'Elena Rostova',
      notes: 'Reviewing qualification questionnaire.'
    },
    {
      id: 'INQ-4003',
      companyName: 'Hyundai Heavy Industries (Steel Div.)',
      contactPerson: 'Min-Jun Park (Director Overseas Projects)',
      email: 'mj.park@hhi-steel.demo',
      phone: '+82 2 746 1114',
      partnershipType: 'Offshore & Marine Steel Consortium',
      message: 'Looking for a joint-venture detailing engineering partner for floating production storage (FPSO) topsides.',
      submissionDate: '2026-11-04T15:10:00Z',
      status: 'Contacted',
      assignedStaff: 'Arthur Pendelton',
      notes: 'Introductory video call held on Nov 5.'
    },
    {
      id: 'INQ-4004',
      companyName: 'Eversendai Structural Steel LLC',
      contactPerson: 'Mohd Fadzil (Operations VP)',
      email: 'fadzil@eversendai.demo',
      phone: '+60 3 6099 8888',
      partnershipType: 'Complex Architectural Framing',
      message: 'Collaborate on signature stadium roof structure with 180m clear span. Tekla LOD 400 with full erection staging required.',
      submissionDate: '2026-11-03T18:00:00Z',
      status: 'Approved',
      assignedStaff: 'Rahul Sharma',
      notes: 'Approved as tier-1 detailing partner.'
    },
    {
      id: 'INQ-4005',
      companyName: 'Saipem Oil & Gas Construction',
      contactPerson: 'Marco Bellini (Procurement Manager)',
      email: 'm.bellini@saipem.demo',
      phone: '+39 02 4424 1',
      partnershipType: 'Offshore Pipe Rack Subsea Templates',
      message: 'Subsea manifold steel structural frames requiring heavy high-nickel alloy connection detailing.',
      submissionDate: '2026-11-02T11:45:00Z',
      status: 'Under Review',
      assignedStaff: 'Dr. Michael Chang',
      notes: 'Technical feasibility under review.'
    },
    {
      id: 'INQ-4006',
      companyName: 'Vinci Construction Grands Projets',
      contactPerson: 'Lucie Bernard (Head of Engineering)',
      email: 'l.bernard@vinci.demo',
      phone: '+33 1 47 16 35 00',
      partnershipType: 'High-Speed Railway Infrastructure',
      message: 'Tender for 18 viaduct composite steel spans across Southern Europe. Seeking long-term engineering partner.',
      submissionDate: '2026-11-01T14:15:00Z',
      status: 'Contacted',
      assignedStaff: 'Alexander Wright',
      notes: 'NDA executed. Tender drawings received.'
    },
    {
      id: 'INQ-4007',
      companyName: 'Schuff Steel Co.',
      contactPerson: 'Robert D. Schuff (President)',
      email: 'rds@schuffsteel.demo',
      phone: '+1 (555) 252-7787',
      partnershipType: 'Fabrication Partner & Overflow Detailing',
      message: 'Need reliable overflow detailing partner to absorb 5,000 MT/month during peak fabrication cycles.',
      submissionDate: '2026-10-30T16:30:00Z',
      status: 'Approved',
      assignedStaff: 'Zainab Al-Mansoor',
      notes: 'Signed Master Service Agreement.'
    },
    {
      id: 'INQ-4008',
      companyName: 'Zamil Industrial Steel Co.',
      contactPerson: 'Fahad Al-Zamil (Commercial VP)',
      email: 'fahad@zamilsteel.demo',
      phone: '+966 13 847 1840',
      partnershipType: 'Pre-Engineered Steel Buildings',
      message: 'Automate connection detailing and DSTV file extraction for automated FICEP CNC drilling lines.',
      submissionDate: '2026-10-28T09:10:00Z',
      status: 'Contacted',
      assignedStaff: 'Rahul Sharma',
      notes: 'Trial project underway.'
    },
    {
      id: 'INQ-4009',
      companyName: 'Severfield UK Plc',
      contactPerson: 'Ian Cochrane (COO)',
      email: 'i.cochrane@severfield.demo',
      phone: '+44 1845 577896',
      partnershipType: 'Commercial Towers & Stadia',
      message: 'Exploratory discussions on joint venture modeling for London financial district towers.',
      submissionDate: '2026-10-25T10:00:00Z',
      status: 'Under Review',
      assignedStaff: 'Alexander Wright',
      notes: ''
    },
    {
      id: 'INQ-4010',
      companyName: 'BlueScope Steel Infrastructure',
      contactPerson: 'Warren Hastings (GM Supply)',
      email: 'w.hastings@bluescope.demo',
      phone: '+61 2 4275 7522',
      partnershipType: 'Heavy Plate Girder Bridges',
      message: 'Weathering steel bridge plate girder connection designs for Australian highway network.',
      submissionDate: '2026-10-22T13:40:00Z',
      status: 'Archived',
      notes: 'Completed evaluation.'
    }
  ];

  // 30 Activity Log Records
  const activityLogs = [
    { id: 'LOG-5001', user: 'Alexander Wright', role: 'SUPER_ADMIN', action: 'LOGIN', module: 'Authentication', date: '2026-11-06', time: '09:30:15', description: 'User logged in successfully via Secure Terminal Session.' },
    { id: 'LOG-5002', user: 'Sarah Jenkins', role: 'HR_STAFF', action: 'CREATE', module: 'Employees', date: '2026-11-06', time: '09:15:20', description: 'Created new employee record: Chloe Bennett (EMP-1025).' },
    { id: 'LOG-5003', user: 'David Macintyre', role: 'SITE_MANAGER', action: 'UPDATE', module: 'Attendance', date: '2026-11-06', time: '08:50:00', description: 'Updated morning site attendance roll call for Apex Industrial Plant - Site A.' },
    { id: 'LOG-5004', user: 'Rahul Sharma', role: 'EMPLOYEE', action: 'UPDATE', module: 'Attendance', date: '2026-11-06', time: '08:50:45', description: 'Employee self check-in recorded: 08:50 AM.' },
    { id: 'LOG-5005', user: 'Marcus Sterling', role: 'FINANCE_STAFF', action: 'CREATE', module: 'Invoices', date: '2026-11-05', time: '17:20:10', description: 'Generated new invoice INV-2026-020 for AeroSpace Hangar Constructors LLC ($17,572.50).' },
    { id: 'LOG-5006', user: 'Marcus Sterling', role: 'FINANCE_STAFF', action: 'UPDATE', module: 'Payroll', date: '2026-11-05', time: '16:45:00', description: 'Approved and marked October 2026 payroll batch #1 as Paid.' },
    { id: 'LOG-5007', user: 'Alexander Wright', role: 'SUPER_ADMIN', action: 'UPDATE', module: 'Settings', date: '2026-11-05', time: '15:10:33', description: 'Updated company GSTIN and billing address in Enterprise Settings.' },
    { id: 'LOG-5008', user: 'Sarah Jenkins', role: 'HR_STAFF', action: 'UPDATE', module: 'Salary Management', date: '2026-11-05', time: '14:22:15', description: 'Adjusted overtime allowance for site engineering crew.' },
    { id: 'LOG-5009', user: 'Alexander Wright', role: 'SUPER_ADMIN', action: 'UPDATE', module: 'Website CMS', date: '2026-11-05', time: '11:05:00', description: 'Published updated public homepage hero tagline and metrics.' },
    { id: 'LOG-5010', user: 'Vikram Mehta', role: 'PARTNER', action: 'LOGIN', module: 'Authentication', date: '2026-11-05', time: '10:30:12', description: 'Partner Vikram Mehta accessed partner billing portal.' },
    { id: 'LOG-5011', user: 'Marcus Sterling', role: 'FINANCE_STAFF', action: 'UPDATE', module: 'Invoices', date: '2026-11-04', time: '16:00:22', description: 'Recorded wire payment of $79,152.00 for Invoice INV-2026-006.' },
    { id: 'LOG-5012', user: 'Alexander Wright', role: 'SUPER_ADMIN', action: 'UPDATE', module: 'Partner Inquiries', date: '2026-11-04', time: '14:40:00', description: 'Approved partnership inquiry INQ-4004 from Eversendai Structural Steel LLC.' },
    { id: 'LOG-5013', user: 'Sarah Jenkins', role: 'HR_STAFF', action: 'UPDATE', module: 'Attendance', date: '2026-11-04', time: '12:15:30', description: 'Approved leave request for Chloe Bennett.' },
    { id: 'LOG-5014', user: 'Alexander Wright', role: 'SUPER_ADMIN', action: 'CREATE', module: 'Team Management', date: '2026-11-04', time: '10:20:10', description: 'Added Dr. Michael Chang to public executive team roster.' },
    { id: 'LOG-5015', user: 'Alexander Wright', role: 'SUPER_ADMIN', action: 'UPDATE', module: 'Google Mailer', date: '2026-11-03', time: '16:50:40', description: 'Verified SMTP connection with Google Mail relay: 200 OK.' },
    { id: 'LOG-5016', user: 'Marcus Sterling', role: 'FINANCE_STAFF', action: 'CREATE', module: 'Payroll', date: '2026-11-03', time: '14:30:00', description: 'Generated October 2026 draft payroll run for 20 active personnel.' },
    { id: 'LOG-5017', user: 'David Macintyre', role: 'SITE_MANAGER', action: 'CREATE', module: 'Field Operations', date: '2026-11-03', time: '11:15:00', description: 'Logged daily safety toolbox talk: 100% tie-off compliance.' },
    { id: 'LOG-5018', user: 'Alexander Wright', role: 'SUPER_ADMIN', action: 'UPDATE', module: 'Contact Messages', date: '2026-11-02', time: '17:05:12', description: 'Replied to inquiry MSG-3004 with consulting rate card.' },
    { id: 'LOG-5019', user: 'Marcus Sterling', role: 'FINANCE_STAFF', action: 'UPDATE', module: 'Invoices', date: '2026-11-02', time: '13:40:22', description: 'Recorded payment of $46,964.00 for Invoice INV-2026-002 from Tata Steel.' },
    { id: 'LOG-5020', user: 'Sarah Jenkins', role: 'HR_STAFF', action: 'UPDATE', module: 'Employees', date: '2026-11-02', time: '10:00:00', description: 'Updated certification documents for Rahul Sharma.' },
    { id: 'LOG-5021', user: 'Alexander Wright', role: 'SUPER_ADMIN', action: 'UPDATE', module: 'Permissions', date: '2026-11-01', time: '16:20:00', description: 'Refreshed role permission matrix for Site Manager persona.' },
    { id: 'LOG-5022', user: 'Marcus Sterling', role: 'FINANCE_STAFF', action: 'CREATE', module: 'Invoices', date: '2026-11-01', time: '11:10:00', description: 'Generated Invoice INV-2026-007 for Bauer Structural Steel Inc.' },
    { id: 'LOG-5023', user: 'David Macintyre', role: 'SITE_MANAGER', action: 'UPDATE', module: 'Attendance', date: '2026-11-01', time: '08:15:00', description: 'Marked site crew attendance for Saturday overtime shift.' },
    { id: 'LOG-5024', user: 'Alexander Wright', role: 'SUPER_ADMIN', action: 'CREATE', module: 'Partners', date: '2026-10-31', time: '15:45:00', description: 'Created new enterprise partner account: AeroSpace Hangar Constructors LLC.' },
    { id: 'LOG-5025', user: 'Marcus Sterling', role: 'FINANCE_STAFF', action: 'UPDATE', module: 'Invoices', date: '2026-10-30', time: '14:20:00', description: 'Reconciled wire receipt of $26,750.00 for INV-2026-008.' },
    { id: 'LOG-5026', user: 'Sarah Jenkins', role: 'HR_STAFF', action: 'UPDATE', module: 'Salary Management', date: '2026-10-29', time: '11:30:00', description: 'Updated basic salary structure for Elena Rostova following PE licensure.' },
    { id: 'LOG-5027', user: 'Alexander Wright', role: 'SUPER_ADMIN', action: 'EXPORT', module: 'Data Management', date: '2026-10-28', time: '18:00:00', description: 'Created full system JSON database backup.' },
    { id: 'LOG-5028', user: 'Marcus Sterling', role: 'FINANCE_STAFF', action: 'UPDATE', module: 'Invoices', date: '2026-10-28', time: '15:10:00', description: 'Received full settlement of $75,667.50 for Invoice INV-2026-001.' },
    { id: 'LOG-5029', user: 'Alexander Wright', role: 'SUPER_ADMIN', action: 'UPDATE', module: 'Website CMS', date: '2026-10-27', time: '13:00:00', description: 'Added 3 new completed structural steel case studies to CMS.' },
    { id: 'LOG-5030', user: 'Alexander Wright', role: 'SUPER_ADMIN', action: 'SYSTEM', module: 'System Initialization', date: '2026-10-25', time: '08:00:00', description: 'Fab Steel Consultancy ERP v2.4 initialized with secure LocalStorage engine.' }
  ];

  // 15 System Notifications
  const notifications = [
    { id: 'NOTIF-01', type: 'invoice', title: 'Payment Received ($79,152.00)', message: 'Balfour Beatty settled Invoice INV-2026-006 via BACS wire transfer.', link: '#invoices', unread: true, timestamp: '2026-11-06T09:12:00Z' },
    { id: 'NOTIF-02', type: 'partner', title: 'New Global Partnership Inquiry', message: 'Bechtel Infrastructure submitted an inquiry for preferred detailing partner.', link: '#inquiries', unread: true, timestamp: '2026-11-06T07:45:00Z' },
    { id: 'NOTIF-03', type: 'message', title: 'New Commercial Tender Inquiry', message: 'Jonathan Sterling submitted inquiry for 8,500 MT commercial tower.', link: '#contacts', unread: true, timestamp: '2026-11-06T08:15:00Z' },
    { id: 'NOTIF-04', type: 'attendance', title: 'Site Attendance Alert', message: '2 crew members arrived late at Apex Industrial Plant - Site A today.', link: '#attendance', unread: true, timestamp: '2026-11-06T09:45:00Z' },
    { id: 'NOTIF-05', type: 'payroll', title: 'Pending Payroll Authorizations', message: '4 employee salary disbursements are pending processing for October 2026.', link: '#payroll', unread: true, timestamp: '2026-11-05T17:00:00Z' },
    { id: 'NOTIF-06', type: 'invoice', title: 'Invoice Overdue Notice', message: 'Invoice INV-2026-004 ($57,241.80) to Larsen & Toubro is 22 days overdue.', link: '#invoices', unread: false, timestamp: '2026-11-05T11:30:00Z' },
    { id: 'NOTIF-07', type: 'employee', title: 'New Employee Onboarded', message: 'Chloe Bennett was successfully registered into the HR roster.', link: '#employees', unread: false, timestamp: '2026-11-05T10:00:00Z' },
    { id: 'NOTIF-08', type: 'system', title: 'Google Mail Relay Active', message: 'Simulated connection test with smtp.gmail.com succeeded with 38ms latency.', link: '#mailer', unread: false, timestamp: '2026-11-04T16:50:00Z' },
    { id: 'NOTIF-09', type: 'partner', title: 'Partnership Approved', message: 'Eversendai Structural Steel LLC partnership status updated to Approved.', link: '#inquiries', unread: false, timestamp: '2026-11-04T14:40:00Z' },
    { id: 'NOTIF-10', type: 'salary', title: 'Salary Structure Modified', message: 'PE credentials increment applied to Elena Rostova base compensation.', link: '#salary', unread: false, timestamp: '2026-11-03T11:20:00Z' },
    { id: 'NOTIF-11', type: 'message', title: 'Public Web Message Received', message: 'Marie Dupont inquired regarding architectural curved steel shell pavilion.', link: '#contacts', unread: false, timestamp: '2026-11-02T09:20:00Z' },
    { id: 'NOTIF-12', type: 'invoice', title: 'Partial Payment Logged', message: 'Dubai Bridge & Architectural Metals paid $15,000.00 on INV-2026-003.', link: '#invoices', unread: false, timestamp: '2026-11-01T15:00:00Z' },
    { id: 'NOTIF-13', type: 'attendance', title: 'Monthly Attendance Reconciled', message: 'October workforce attendance rate closed at 96.4%.', link: '#attendance', unread: false, timestamp: '2026-11-01T08:00:00Z' },
    { id: 'NOTIF-14', type: 'system', title: 'Automatic JSON Backup', message: 'System database exported for offsite audit.', link: '#settings', unread: false, timestamp: '2026-10-31T23:59:00Z' },
    { id: 'NOTIF-15', type: 'invoice', title: 'Large Inbound Remittance', message: '$75,667.50 wire verified from Apex Heavy Engineering Ltd.', link: '#invoices', unread: false, timestamp: '2026-10-28T15:10:00Z' }
  ];

  // Company Settings & CMS
  const companySettings = {
    companyName: 'Fab Steel Consultancy',
    legalName: 'Fab Steel Consultancy Global Engineering Corp.',
    tagline: 'High-Precision Structural Steel Engineering, Tekla BIM & Fabrication Consulting',
    email: 'contact@fabsteel.demo',
    phone: '+1 (555) 783-3500',
    address: 'Suite 1800, Steel Tower, 500 Enterprise Way, Houston TX 77002, USA',
    gstin: 'US-TX-88392019-STEEL',
    taxRate: 18,
    currency: 'USD',
    currencySymbol: '$',
    websiteUrl: 'https://fabsteelconsultancy.demo',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/fab-steel-consultancy',
      twitter: 'https://twitter.com/fabsteelglobal',
      youtube: 'https://youtube.com/@fabsteelconsultancy'
    },
    bankDetails: {
      bankName: 'Standard Chartered Commercial Bank',
      accountName: 'Fab Steel Consultancy Global Corp.',
      accountNumber: '99882201948271',
      swiftCode: 'SCBLUS33XXX',
      routingNumber: '026002574'
    }
  };

  // Website CMS Content (Dynamic sync with public-preview)
  const websiteContent = {
    hero: {
      title: 'Global Leaders in Structural Steel Engineering & Tekla BIM',
      subtitle: 'From monumental stadium roofs to heavy industrial refinery pipe racks, Fab Steel delivers millimeter-precision detailing, connection engineering, and robotic CNC spooling.',
      ctaText: 'Explore Our Engineering Capabilities',
      ctaLink: '#services',
      stat1Val: '145,000+',
      stat1Label: 'Metric Tonnes Detailed',
      stat2Val: '280+',
      stat2Label: 'Mega Projects Delivered',
      stat3Val: '99.9%',
      stat3Label: 'Erection Fit-Up Accuracy',
      stat4Val: '18+',
      stat4Label: 'Countries Served'
    },
    about: {
      heading: 'Engineered for Perfection. Built for Strength.',
      description: 'Founded by veteran structural engineers and master Tekla modelers, Fab Steel Consultancy bridges the gap between architectural vision and steel fabrication reality. We specialize in complex connection design, dynamic blast and seismic loading, and automated digital data streams for robotic steel fabrication lines.',
      yearsInBusiness: 18,
      certifiedClients: 95
    },
    services: [
      {
        id: 'srv-1',
        title: 'Tekla 3D BIM & LOD 400 Steel Detailing',
        icon: 'box',
        description: 'Comprehensive 3D Tekla Structures modeling with complete fabrication shop drawings, erection anchor bolt plans, and assembly bill of materials.'
      },
      {
        id: 'srv-2',
        title: 'Licensed PE Connection Design & Calculations',
        icon: 'shield-check',
        description: 'Comprehensive bolted and welded connection engineering stamped by licensed Professional Engineers (PE/SE) across US, UK, and European codes.'
      },
      {
        id: 'srv-3',
        title: 'Robotic CNC DSTV & XML Automated Spooling',
        icon: 'cpu',
        description: 'Direct-to-machine DSTV, DXF, and XML files for robotic beam copers, laser tube cutters, and plate nesting lines, eliminating human layout errors.'
      },
      {
        id: 'srv-4',
        title: 'Site Erection Advisory & Rigging Simulation',
        icon: 'hard-hat',
        description: 'On-site construction management, crane lifting capacity analysis, stability checks during tandem lifts, and 3D step-by-step erection sequencing.'
      },
      {
        id: 'srv-5',
        title: 'Quality Assurance & CWI Welding Inspection',
        icon: 'check-square',
        description: 'AWS CWI and NDT Level III certified inspectors verifying weld procedure specifications (WPS/PQR), ultrasound flaw detection, and bolting torque.'
      },
      {
        id: 'srv-6',
        title: 'Laser Scanning & As-Built Clash Analysis',
        icon: 'scan',
        description: 'Terrestrial LiDAR 3D cloud alignment to verify real-world foundation bolt placement against virtual steel frame geometry before transport.'
      }
    ],
    pages: [
      { slug: 'home', title: 'Home', published: true, metaDesc: 'Fab Steel Consultancy — Leading Structural Steel Engineering & Detailing' },
      { slug: 'about', title: 'About Us', published: true, metaDesc: 'Learn about our heritage, leadership, and steel engineering standards' },
      { slug: 'services', title: 'Services', published: true, metaDesc: 'Tekla BIM modeling, PE connection design, CNC spooling and erection' },
      { slug: 'team', title: 'Executive Team', published: true, metaDesc: 'Meet our senior structural engineers, BIM architects and site managers' },
      { slug: 'contact', title: 'Contact Us', published: true, metaDesc: 'Connect with our engineering estimation desk' },
      { slug: 'privacy', title: 'Privacy Policy', published: true, metaDesc: 'Fab Steel Consultancy global data protection and privacy policy' },
      { slug: 'terms', title: 'Terms & Conditions', published: true, metaDesc: 'Standard contracting terms, intellectual property, and warranty limitations' }
    ]
  };

  // Google Mailer & SMTP Settings
  const mailerSettings = {
    senderName: 'Fab Steel Consultancy Automated Dispatch',
    gmailAddress: 'notifications@fabsteel.demo',
    appPasswordMasked: '•••• •••• •••• ••••',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    security: 'TLS',
    replyTo: 'billing@fabsteel.demo',
    emailSignature: 'Fab Steel Consultancy | Global Engineering & Detailing Operations\nSuite 1800, Steel Tower, Houston TX | Tel: +1 (555) 783-3500',
    lastTestStatus: 'Success (Connected to smtp.gmail.com:587 in 42ms)',
    lastTestDate: '2026-11-06T09:00:00Z',
    emailTemplates: [
      { id: 'TPL-01', name: 'Employee Welcome & Portal Credentials', subject: 'Welcome to Fab Steel Consultancy - ERP Portal Access', body: 'Dear {{employee_name}},\n\nWelcome to the Fab Steel Consultancy team. Your employee profile has been created with ID {{employee_id}}.\n\nYou can access your personal dashboard, attendance punch-in, and salary slips at {{portal_url}}.\n\nBest regards,\nPeople & Culture Team' },
      { id: 'TPL-02', name: 'Invoice Generated & Dispatched', subject: 'Invoice {{invoice_id}} from Fab Steel Consultancy', body: 'Dear {{partner_name}},\n\nPlease find attached Invoice {{invoice_id}} for {{description}} totaling {{total_amount}}.\n\nDue date: {{due_date}}.\n\nBank transfer instructions are noted on the attached invoice PDF.\n\nFinance Department\nFab Steel Consultancy' },
      { id: 'TPL-03', name: 'Invoice Payment Reminder', subject: 'Friendly Reminder: Invoice {{invoice_id}} Due Soon', body: 'Dear {{partner_name}},\n\nThis is a courtesy reminder that invoice {{invoice_id}} for {{total_amount}} is scheduled for settlement on {{due_date}}.\n\nPlease let us know if you require any additional lien waivers or milestone verification documents.' },
      { id: 'TPL-04', name: 'Monthly Salary Slip Available', subject: 'Your Salary Slip for {{payroll_month}} is Ready', body: 'Dear {{employee_name}},\n\nYour salary slip for {{payroll_month}} has been processed. Net disbursement of {{net_salary}} was transmitted via bank transfer.\n\nYou can view and download your full salary slip in the ERP.' },
      { id: 'TPL-05', name: 'Contact Form Auto-Response', subject: 'We Received Your Engineering Inquiry - Fab Steel Consultancy', body: 'Dear {{name}},\n\nThank you for reaching out to Fab Steel Consultancy. Our engineering estimation desk has logged inquiry {{message_id}} regarding "{{subject}}".\n\nA senior project engineer will review your drawings and respond within 24 business hours.' }
    ],
    sentHistory: [
      { id: 'EML-901', to: 'vikram.mehta@apexheavy.com', subject: 'Invoice INV-2026-001 Statement Receipt', status: 'Delivered', sentAt: '2026-10-28T15:15:00Z', template: 'Invoice Generated' },
      { id: 'EML-902', to: 's.hastings@balfourbeatty.demo', subject: 'Invoice INV-2026-006 Remittance Confirmation', status: 'Delivered', sentAt: '2026-11-04T16:05:00Z', template: 'Invoice Generated' },
      { id: 'EML-903', to: 'rahul.sharma@fabsteel.demo', subject: 'Your Salary Slip for October 2026 is Ready', status: 'Delivered', sentAt: '2026-10-31T18:00:00Z', template: 'Monthly Salary Slip' },
      { id: 'EML-904', to: 'j.sterling@sterlingconstruct.com', subject: 'We Received Your Engineering Inquiry - Fab Steel Consultancy', status: 'Delivered', sentAt: '2026-11-06T08:16:00Z', template: 'Contact Form Auto-Response' }
    ]
  };

  return {
    users,
    employees,
    partners,
    invoices,
    attendance,
    salaryStructures,
    payrollRecords,
    teamMembers,
    contactMessages,
    partnerInquiries,
    activityLogs,
    notifications,
    companySettings,
    websiteContent,
    mailerSettings
  };
})();

