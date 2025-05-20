const spine = {
  abilitiesAndSkills: {
    body: {
      strength: ['athletics', 'heavy-attack', 'unarmed-attack'],
      dexterity: ['locks-and-traps', 'ranged-attack', 'sleight-of-hand'],
      agility: ['acrobatics', 'finesse-attack', 'stealth'],
    },
    mind: {
      awareness: ['navigation', 'perception', 'tracking'],
      intellect: ['investigation', 'reason-and-logic', 'study-and-write'],
      wisdom: ['animal-ken', 'healing', 'survival'],
    },
    soul: {
      heart: ['connect', 'empathy', 'insight'],
      mystique: ['charm', 'deception', 'intimidation'],
      presence: ['influence', 'leadership', 'performance']
    },
  },
  fixedRepeatingSections: [
    { 
      name: 'ammunition',
      fields: ['name', 'quantity'],
      fixed: 2,
    },
    { 
      name: 'condition',
      fields: ['name', 'treatment'],
      fixed: 6,
    },
    { 
      name: 'weapon',
      fields: ['name', 'ability-skill', 'attributes', 'damage', 'damage-type', 'heart'],
      fixed: 4,
    },
    { 
      name: 'proficiencies',
      fields: ['name'],
      fixed: 6,
    },
    { 
      name: 'languages',
      fields: ['name'],
      fixed: 6,
    },
    { 
      name: 'feats',
      fields: ['name'],
      fixed: 6,
    },
    { 
      name: 'discovered-spells',
      fields: ['name'],
      fixed: 6,
    }
  ],
  health: {
    bars: [
      { name: 'bruises', steps: 3, max: 2, values: ['1-3'] },
      { name: 'scrapes', steps: 3, max: 2, values: ['4-6'] },
      { name: 'wounds', steps: 3, max: 1, values: ['7-9'] },
      { name: 'injuries', steps: 3, max: 1, values: ['10-12','13+'] },
      { name: 'madness',  max: 6, steps: 10 },
    ]
  },
  lists: {
    knowledge: ['alchemy-and-transmutation', 'archeology-and-artifacts', 'art-and-appraisal', 'artifice-and-mechanisms', 'astrology-and-cosmology', 'cartography-and-maps', 'craft-and-repair', 'diplomacy-and-politics', 'exploration-and-wilderness', 'herbalism-and-healing', 'history-and-culture', 'justice-and-law', 'language-and-translation', 'math-and-science', 'monsters-and-myth', 'nature-and-animals', 'occult-and-paranormal', 'organization-and-administration', 'poison-and-disease', 'religion-and-spiritualism', 'sailing-and-ships', 'sorcery-and-magic', 'strategy-and-warfare', 'thievery-and-crime'],
  },
  pages: ['page-1', 'page-2', 'page-3'],
  resolve: {
    attributes: ['toughness', 'reflexes', 'focus', 'composure', 'willpower'],
  },
  roleplay: ['appearance', 'personality', 'origin', 'bonds', 'drives', 'belief', 'background'],
  traditions: {
    a: '1-4',
    b: '5-8',
    c: '9-12',
  }
};