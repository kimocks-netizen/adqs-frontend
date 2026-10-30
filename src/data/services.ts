import type { Service } from '@/types';

export interface ServiceDetail extends Service {
  intro: string;
  areas: string[];
  icon: string;
}

export const dummyServices: ServiceDetail[] = [
  {
    id: '1',
    title: 'Regulatory Compliance & Legal Advisory',
    slug: 'regulatory-compliance-legal-advisory',
    icon: 'shield',
    summary:
      'Understand applicable obligations, identify compliance risks and strengthen internal policies, procedures and compliance practices.',
    intro:
      'We help businesses and organisations understand applicable legal and regulatory obligations, identify potential compliance gaps and develop practical internal processes.',
    areas: [
      'Compliance assessments and advisory',
      'POPIA and personal-information protection',
      'FICA-related compliance obligations',
      'Consumer protection matters',
      'Internal policies, procedures and compliance manuals',
      'Compliance risk identification and mitigation',
      'Reviews of business operations from a regulatory perspective',
    ],
    body: 'Full service detail.',
    display_order: 1,
    is_active: true,
  },
  {
    id: '2',
    title: 'Contract Drafting & Review',
    slug: 'contract-drafting-review',
    icon: 'file-text',
    summary:
      'Support for reviewing and preparing agreements, identifying potential contractual risks and improving clarity before commitments are made.',
    intro:
      'Clear agreements help parties understand their rights, responsibilities and risks. We provide contractual research and documentation support within the company\'s confirmed scope.',
    areas: [
      'Commercial agreements',
      'Contract review and revision',
      'Lease agreements',
      'Independent contractor and freelance agreements',
      'Service-level and business agreements',
      'Standardised templates',
      'Identification of unclear, inconsistent or potentially problematic clauses',
    ],
    body: 'Full service detail.',
    display_order: 2,
    is_active: true,
  },
  {
    id: '3',
    title: 'Labour Relations & Workplace Dispute Resolution',
    slug: 'labour-relations-workplace-dispute-resolution',
    icon: 'users',
    summary:
      'Practical workplace documentation, policy support, dispute prevention and advisory assistance relating to employment and workplace processes.',
    intro:
      'We support employers and organisations with workplace documentation, policy development, dispute prevention and advisory assistance concerning employment processes.',
    areas: [
      'Employment contracts and workplace documentation',
      'Disciplinary codes and workplace policies',
      'Guidance on disciplinary procedures',
      'Support relating to internal disciplinary processes',
      'Labour-related research and advisory support',
      'Workplace dispute management and mediation',
      'Early intervention and dispute prevention',
    ],
    body: 'Full service detail.',
    display_order: 3,
    is_active: true,
  },
  {
    id: '4',
    title: 'Human Rights & Access to Justice',
    slug: 'human-rights-access-to-justice',
    icon: 'heart',
    summary:
      'Research, legal information, policy and initiatives aimed at strengthening understanding of rights and access to appropriate remedies.',
    intro:
      'We contribute research, legal information and policy support that help people and organisations understand rights, potential remedies and access-to-justice issues.',
    areas: [
      'Human-rights research and advisory work',
      'Equality, discrimination and fundamental-rights research',
      'Access-to-justice initiatives and legal information',
      'Identification of potential remedies and referral pathways',
      'Human-rights and governance policy research',
      'Advocacy and stakeholder engagement',
      'Legal awareness and information initiatives',
    ],
    body: 'Full service detail.',
    display_order: 4,
    is_active: true,
  },
  {
    id: '5',
    title: 'Legal Research, Policy & Advocacy',
    slug: 'legal-research-policy-advocacy',
    icon: 'search',
    summary:
      'Research, legislative analysis, policy briefs and strategic insight for organisations working through legal and governance questions.',
    intro:
      'We provide structured legal and policy research for organisations and stakeholders who need clear analysis to inform strategy, programmes and decisions.',
    areas: [
      'Legal and policy research',
      'Research reports and policy briefs',
      'Legislative and regulatory analysis',
      'Human-rights and governance research',
      'Policy development and review',
      'Stakeholder engagement and advocacy support',
      'Analysis of emerging legal and regulatory issues',
    ],
    body: 'Full service detail.',
    display_order: 5,
    is_active: true,
  },
  {
    id: '6',
    title: 'Dispute Resolution & Legal Strategy',
    slug: 'dispute-resolution-legal-strategy',
    icon: 'handshake',
    summary:
      'Early assessment, dispute-prevention approaches, negotiation support and mediation-related assistance within the confirmed scope.',
    intro:
      'We emphasise early assessment, practical problem-solving and proportionate approaches to disputes.',
    areas: [
      'Assessment of dispute-related issues',
      'Dispute prevention and risk identification',
      'Negotiation support',
      'Mediation and alternative dispute resolution, where appropriate',
      'Legal correspondence and settlement discussions within the confirmed scope',
      'Information about potential remedies and referral to litigation practitioners when necessary',
    ],
    body: 'Full service detail.',
    display_order: 6,
    is_active: true,
  },
];
