import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

/**
 * BidDeed.AI Competitor Data
 * Comprehensive competitor intelligence for foreclosure auction analysis
 */
const competitors = [
  // ============ DIRECT COMPETITORS ============
  {
    id: 'propertyonion',
    name: 'PropertyOnion',
    domain: 'propertyonion.com',
    category: 'direct',
    description: 'Foreclosure research platform with 8 KPIs we track. Primary competitor for BidDeed.AI.',
    video_sources: [
      {
        url: 'https://www.youtube.com/watch?v=PropertyOnionDemo',
        type: 'demo',
        title: 'PropertyOnion Platform Demo',
        priority: 1
      }
    ],
    known_features: [
      'Lien search',
      'Title analysis', 
      'Auction calendar',
      'Property photos',
      'Ownership history',
      'Tax certificate tracking',
      'Judgment tracking',
      'Default amount tracking'
    ],
    pricing: {
      model: 'subscription',
      starting_price: '$49/month',
      tiers: ['Basic', 'Pro', 'Enterprise']
    },
    traffic_data: {
      monthly_visits: 45000,
      bounce_rate: 0.42,
      avg_visit_duration: '4:32',
      pages_per_visit: 5.2,
      traffic_sources: {
        organic: 0.55,
        direct: 0.25,
        referral: 0.12,
        social: 0.05,
        paid: 0.03
      }
    },
    tech_stack: {
      frontend: ['React', 'TypeScript', 'Tailwind CSS'],
      backend: ['Node.js', 'Express'],
      database: ['PostgreSQL'],
      hosting: ['AWS'],
      analytics: ['Google Analytics', 'Mixpanel']
    }
  },
  {
    id: 'auction-com',
    name: 'Auction.com',
    domain: 'auction.com',
    category: 'direct',
    description: 'Largest online real estate auction marketplace. Bank-owned and foreclosure properties.',
    video_sources: [
      {
        url: 'https://www.youtube.com/watch?v=AuctionComBidding',
        type: 'tutorial',
        title: 'How to Bid on Auction.com',
        priority: 1
      }
    ],
    known_features: [
      'Online bidding platform',
      'Property search with filters',
      'Due diligence document access',
      'Financing options integration',
      'Mobile app for iOS/Android',
      'Saved searches and alerts',
      'Bid history tracking',
      'Virtual property tours',
      'Buyer premium calculator'
    ],
    pricing: {
      model: 'per-auction',
      starting_price: 'Buyer premium 5%',
      notes: 'Premium varies by property type and location'
    },
    traffic_data: {
      monthly_visits: 2500000,
      bounce_rate: 0.38,
      avg_visit_duration: '6:15',
      pages_per_visit: 8.4,
      traffic_sources: {
        organic: 0.45,
        direct: 0.35,
        referral: 0.08,
        social: 0.04,
        paid: 0.08
      }
    },
    tech_stack: {
      frontend: ['Angular', 'TypeScript'],
      backend: ['Java', 'Spring Boot'],
      database: ['Oracle', 'Redis'],
      hosting: ['AWS', 'CloudFront'],
      analytics: ['Adobe Analytics']
    }
  },
  {
    id: 'foreclosure-com',
    name: 'Foreclosure.com',
    domain: 'foreclosure.com',
    category: 'direct',
    description: 'Foreclosure listing aggregator. Comprehensive database of distressed properties.',
    video_sources: [],
    known_features: [
      'Listing aggregation from multiple sources',
      'Email alerts for new listings',
      'Detailed property information',
      'Comparable sales data',
      'Market trends and reports',
      'Neighborhood demographics',
      'School ratings integration'
    ],
    pricing: {
      model: 'subscription',
      starting_price: '$39.80/month',
      tiers: ['7-Day Trial', 'Monthly', 'Annual']
    },
    traffic_data: {
      monthly_visits: 850000,
      bounce_rate: 0.45,
      avg_visit_duration: '3:45',
      pages_per_visit: 4.8
    },
    tech_stack: {
      frontend: ['jQuery', 'Bootstrap'],
      backend: ['PHP', 'Laravel'],
      database: ['MySQL'],
      hosting: ['AWS']
    }
  },
  {
    id: 'realtytrac',
    name: 'RealtyTrac (ATTOM)',
    domain: 'realtytrac.com',
    category: 'direct',
    description: 'Foreclosure data and analytics. Part of ATTOM Data Solutions.',
    video_sources: [],
    known_features: [
      'Comprehensive foreclosure data',
      'Market reports and analytics',
      'Property search with advanced filters',
      'Investment analysis tools',
      'API access for developers',
      'Bulk data exports',
      'Historical trend data'
    ],
    pricing: {
      model: 'subscription',
      tiers: ['Basic', 'Premium', 'API Access'],
      enterprise_contact: true
    },
    traffic_data: {
      monthly_visits: 320000,
      bounce_rate: 0.48,
      avg_visit_duration: '3:12',
      pages_per_visit: 3.9
    },
    tech_stack: {
      frontend: ['React'],
      backend: ['Python', 'Django'],
      database: ['PostgreSQL', 'Elasticsearch'],
      hosting: ['GCP']
    }
  },
  {
    id: 'hubzu',
    name: 'Hubzu',
    domain: 'hubzu.com',
    category: 'direct',
    description: 'Online auction platform for bank-owned properties. Altisource subsidiary.',
    video_sources: [],
    known_features: [
      'Online bidding',
      'Asset management services',
      'Property preservation',
      'Broker price opinions',
      'Default servicing integration'
    ],
    pricing: {
      model: 'per-auction',
      starting_price: 'Buyer premium varies',
      notes: 'Typically 3-5% buyer premium'
    },
    traffic_data: {
      monthly_visits: 180000,
      bounce_rate: 0.52
    }
  },

  // ============ ADJACENT COMPETITORS ============
  {
    id: 'propstream',
    name: 'PropStream',
    domain: 'propstream.com',
    category: 'adjacent',
    description: 'Real estate data and marketing platform. Strong in lead generation.',
    video_sources: [
      {
        url: 'https://www.youtube.com/watch?v=PropStreamDemo',
        type: 'demo',
        title: 'PropStream Platform Tour',
        priority: 1
      }
    ],
    known_features: [
      'Property data nationwide',
      'Skip tracing services',
      'Marketing list building',
      'Comparable sales analysis',
      'Deal analyzer calculator',
      'Lead generation tools',
      'Direct mail integration',
      'MLS comps',
      'Ownership information'
    ],
    pricing: {
      model: 'subscription',
      starting_price: '$99/month',
      tiers: ['Standard', 'Teams']
    },
    traffic_data: {
      monthly_visits: 420000,
      bounce_rate: 0.35,
      avg_visit_duration: '5:45',
      pages_per_visit: 7.2
    },
    tech_stack: {
      frontend: ['React', 'Redux'],
      backend: ['Node.js', 'GraphQL'],
      database: ['PostgreSQL', 'Redis'],
      hosting: ['AWS']
    }
  },
  {
    id: 'batchleads',
    name: 'BatchLeads',
    domain: 'batchleads.io',
    category: 'adjacent',
    description: 'Real estate lead generation platform. Focus on wholesaling.',
    video_sources: [],
    known_features: [
      'Skip tracing',
      'List stacking capability',
      'Driving for dollars app',
      'Marketing automation',
      'CRM integration',
      'SMS/ringless voicemail',
      'Direct mail campaigns'
    ],
    pricing: {
      model: 'subscription',
      starting_price: '$79/month',
      tiers: ['Starter', 'Growth', 'Scale']
    },
    traffic_data: {
      monthly_visits: 185000,
      bounce_rate: 0.40
    }
  },
  {
    id: 'dealmachine',
    name: 'DealMachine',
    domain: 'dealmachine.com',
    category: 'adjacent',
    description: 'Driving for dollars mobile app. Property discovery on-the-go.',
    video_sources: [],
    known_features: [
      'Mobile app (iOS/Android)',
      'Instant property lookup',
      'Direct mail from app',
      'Skip tracing',
      'Route planning',
      'Team management',
      'Owner information'
    ],
    pricing: {
      model: 'subscription',
      starting_price: '$49/month',
      tiers: ['Starter', 'Pro', 'Teams']
    },
    traffic_data: {
      monthly_visits: 95000,
      bounce_rate: 0.38
    }
  },
  {
    id: 'listsource',
    name: 'ListSource',
    domain: 'listsource.com',
    category: 'adjacent',
    description: 'Marketing list provider. CoreLogic subsidiary.',
    video_sources: [],
    known_features: [
      'Targeted marketing lists',
      'Property data',
      'Demographic filtering',
      'Absentee owners',
      'Pre-foreclosure lists',
      'Equity-rich properties'
    ],
    pricing: {
      model: 'per-record',
      starting_price: 'From $0.05/record'
    }
  },
  {
    id: 'privy',
    name: 'Privy',
    domain: 'privy.pro',
    category: 'adjacent',
    description: 'Real estate investment deal finder. Strong in off-market deals.',
    video_sources: [],
    known_features: [
      'Deal analysis',
      'MLS integration',
      'Investment strategy matching',
      'Property alerts',
      'Repair estimates',
      'ARV calculations'
    ],
    pricing: {
      model: 'subscription',
      starting_price: '$97/month'
    }
  },

  // ============ ASPIRATIONAL COMPETITORS ============
  {
    id: 'zapier',
    name: 'Zapier',
    domain: 'zapier.com',
    category: 'aspirational',
    description: 'Workflow automation platform. Reference for SkillForge positioning.',
    video_sources: [],
    known_features: [
      'No-code automation',
      '5000+ app integrations',
      'Multi-step workflows (Zaps)',
      'Filters and formatters',
      'Scheduled triggers',
      'Webhooks support',
      'Team collaboration'
    ],
    pricing: {
      model: 'freemium',
      starting_price: 'Free tier, $19.99/month Pro',
      tiers: ['Free', 'Starter', 'Professional', 'Team', 'Company']
    },
    traffic_data: {
      monthly_visits: 12000000,
      bounce_rate: 0.32
    }
  },
  {
    id: 'make',
    name: 'Make (Integromat)',
    domain: 'make.com',
    category: 'aspirational',
    description: 'Visual automation platform. More complex flows than Zapier.',
    video_sources: [],
    known_features: [
      'Visual workflow builder',
      'Complex conditional logic',
      'Data transformation',
      'Advanced error handling',
      'Scheduling options',
      'Iteration and aggregation',
      'HTTP/SOAP/GraphQL modules'
    ],
    pricing: {
      model: 'freemium',
      starting_price: 'Free tier, $9/month Core',
      tiers: ['Free', 'Core', 'Pro', 'Teams', 'Enterprise']
    },
    traffic_data: {
      monthly_visits: 4500000,
      bounce_rate: 0.35
    }
  },
  {
    id: 'manus-ai',
    name: 'Manus AI',
    domain: 'manus.ai',
    category: 'aspirational',
    description: 'Agentic AI platform. Architecture reference for BidDeed.AI.',
    video_sources: [],
    known_features: [
      'Multi-agent orchestration',
      'Autonomous task execution',
      'Tool integration framework',
      'Context management',
      'Parallel processing',
      'Human-in-the-loop options',
      'Skill composition'
    ],
    pricing: {
      model: 'enterprise',
      notes: 'Contact for pricing'
    }
  },
  {
    id: 'testfit',
    name: 'TestFit',
    domain: 'testfit.io',
    category: 'aspirational',
    description: 'Generative design for real estate. AI-powered site planning.',
    video_sources: [],
    known_features: [
      'Generative design algorithms',
      'Site plan optimization',
      'Parking analysis',
      'Unit mix optimization',
      'Code compliance checking',
      'Feasibility studies'
    ],
    pricing: {
      model: 'subscription',
      starting_price: 'Contact for pricing',
      notes: 'Raised $20M from Prologis'
    },
    traffic_data: {
      monthly_visits: 28000
    },
    tech_stack: {
      frontend: ['React', 'Three.js'],
      backend: ['Python', 'FastAPI'],
      database: ['PostgreSQL'],
      hosting: ['AWS']
    }
  }
];

/**
 * Feature Matrix - BidDeed.AI vs Competitors
 */
const featureMatrix = [
  // Core Foreclosure Features
  { feature_name: 'Lien Search', feature_category: 'Core', biddeed_status: 'available', competitors: { propertyonion: true, 'auction-com': false, 'foreclosure-com': false, realtytrac: true } },
  { feature_name: 'Title Analysis', feature_category: 'Core', biddeed_status: 'available', competitors: { propertyonion: true, 'auction-com': false, 'foreclosure-com': false } },
  { feature_name: 'Auction Calendar', feature_category: 'Core', biddeed_status: 'available', competitors: { propertyonion: true, 'auction-com': true, 'foreclosure-com': true } },
  { feature_name: 'Max Bid Calculator', feature_category: 'Core', biddeed_status: 'available', competitors: { propertyonion: false, 'auction-com': false } },
  { feature_name: 'ML-Powered Predictions', feature_category: 'Core', biddeed_status: 'available', competitors: { propertyonion: false, 'auction-com': false } },
  { feature_name: 'Online Bidding', feature_category: 'Core', biddeed_status: 'not_planned', competitors: { propertyonion: false, 'auction-com': true, hubzu: true } },
  
  // Data & Research
  { feature_name: 'Property Photos', feature_category: 'Data', biddeed_status: 'available', competitors: { propertyonion: true, 'auction-com': true, 'foreclosure-com': true } },
  { feature_name: 'Tax Certificate Tracking', feature_category: 'Data', biddeed_status: 'available', competitors: { propertyonion: true } },
  { feature_name: 'Judgment Tracking', feature_category: 'Data', biddeed_status: 'available', competitors: { propertyonion: true } },
  { feature_name: 'Ownership History', feature_category: 'Data', biddeed_status: 'available', competitors: { propertyonion: true, propstream: true } },
  { feature_name: 'Comparable Sales', feature_category: 'Data', biddeed_status: 'available', competitors: { propertyonion: true, propstream: true, privy: true } },
  { feature_name: 'Census Demographics', feature_category: 'Data', biddeed_status: 'available', competitors: { propertyonion: false } },
  
  // Automation & AI
  { feature_name: 'Automated Scraping', feature_category: 'Automation', biddeed_status: 'available', competitors: {} },
  { feature_name: 'Daily Auction Reports', feature_category: 'Automation', biddeed_status: 'available', competitors: {} },
  { feature_name: 'Multi-County Support', feature_category: 'Automation', biddeed_status: 'available', competitors: { propertyonion: true, 'auction-com': true } },
  { feature_name: 'Email Alerts', feature_category: 'Automation', biddeed_status: 'planned', competitors: { propertyonion: true, 'foreclosure-com': true, propstream: true } },
  { feature_name: 'Agentic Workflows', feature_category: 'Automation', biddeed_status: 'available', competitors: { 'manus-ai': true } },
  
  // Marketing & Leads
  { feature_name: 'Skip Tracing', feature_category: 'Marketing', biddeed_status: 'not_planned', competitors: { propstream: true, batchleads: true, dealmachine: true } },
  { feature_name: 'Direct Mail', feature_category: 'Marketing', biddeed_status: 'not_planned', competitors: { propstream: true, batchleads: true, dealmachine: true } },
  { feature_name: 'SMS Marketing', feature_category: 'Marketing', biddeed_status: 'not_planned', competitors: { batchleads: true } }
];

async function seedCompetitors() {
  console.log('🎯 Seeding Competitive Intelligence Data...');
  console.log('='.repeat(50));
  
  // Insert competitors
  console.log('\n📊 Inserting Competitors...');
  for (const competitor of competitors) {
    try {
      // Using raw SQL since drizzle schema might not exist yet
      await client`
        INSERT INTO ci_competitors (
          id, name, domain, category, description,
          video_sources, known_features, pricing, traffic_data, tech_stack
        ) VALUES (
          ${competitor.id},
          ${competitor.name},
          ${competitor.domain},
          ${competitor.category},
          ${competitor.description},
          ${JSON.stringify(competitor.video_sources || [])},
          ${JSON.stringify(competitor.known_features || [])},
          ${JSON.stringify(competitor.pricing || {})},
          ${JSON.stringify(competitor.traffic_data || {})},
          ${JSON.stringify(competitor.tech_stack || {})}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          domain = EXCLUDED.domain,
          category = EXCLUDED.category,
          description = EXCLUDED.description,
          video_sources = EXCLUDED.video_sources,
          known_features = EXCLUDED.known_features,
          pricing = EXCLUDED.pricing,
          traffic_data = EXCLUDED.traffic_data,
          tech_stack = EXCLUDED.tech_stack,
          updated_at = NOW()
      `;
      console.log(`  ✓ ${competitor.name} (${competitor.category})`);
    } catch (error) {
      console.log(`  ✗ ${competitor.name}: ${error.message}`);
    }
  }
  
  // Insert feature matrix
  console.log('\n📋 Inserting Feature Matrix...');
  for (const feature of featureMatrix) {
    try {
      await client`
        INSERT INTO ci_feature_matrix (
          feature_name, feature_category, biddeed_status, competitors
        ) VALUES (
          ${feature.feature_name},
          ${feature.feature_category},
          ${feature.biddeed_status},
          ${JSON.stringify(feature.competitors)}
        )
        ON CONFLICT DO NOTHING
      `;
      console.log(`  ✓ ${feature.feature_name}`);
    } catch (error) {
      console.log(`  ✗ ${feature.feature_name}: ${error.message}`);
    }
  }
  
  console.log('\n✅ Seeding complete!');
  
  // Print summary
  const stats = await client`
    SELECT 
      (SELECT COUNT(*) FROM ci_competitors) as competitors,
      (SELECT COUNT(*) FROM ci_competitors WHERE category = 'direct') as direct,
      (SELECT COUNT(*) FROM ci_competitors WHERE category = 'adjacent') as adjacent,
      (SELECT COUNT(*) FROM ci_competitors WHERE category = 'aspirational') as aspirational,
      (SELECT COUNT(*) FROM ci_feature_matrix) as features
  `;
  
  console.log('\n📈 Summary:');
  console.log(`  Total Competitors: ${stats[0].competitors}`);
  console.log(`    - Direct: ${stats[0].direct}`);
  console.log(`    - Adjacent: ${stats[0].adjacent}`);
  console.log(`    - Aspirational: ${stats[0].aspirational}`);
  console.log(`  Total Features: ${stats[0].features}`);
  
  await client.end();
}

seedCompetitors().catch(console.error);
