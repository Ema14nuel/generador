/* templates.js — Built-in themed sticker collections for VelaSticker */

const BUILTIN_TEMPLATES = [
  {
    id: 'general-colores',
    name: 'General Colorida',
    category: 'general',
    description: '10 palabras positivas con secuencia de colores vibrantes',
    brushStyle: 'classic',
    font: 'Dancing Script',
    stickers: [
      { text: 'Amor',         color: '#ff9f43' },
      { text: 'Salud',        color: '#00b894' },
      { text: 'Familia',      color: '#74b9ff' },
      { text: 'Prosperidad',  color: '#fdcb6e' },
      { text: 'Fe',           color: '#a29bfe' },
      { text: 'Esperanza',    color: '#fd79a8' },
      { text: 'Paz',          color: '#55efc4' },
      { text: 'Alegría',      color: '#e17055' },
      { text: 'Éxito',        color: '#0984e3' },
      { text: 'Abundancia',   color: '#d63031' },
    ]
  },
  {
    id: 'religiosas-virgenes',
    name: 'Vírgenes y Santos',
    category: 'religiosas',
    description: 'Advocaciones marianas y santos populares',
    brushStyle: 'paintbrush',
    font: 'Dancing Script',
    stickers: [
      { text: 'Virgen del Carmen',       color: '#a29bfe' },
      { text: 'Virgen de Guadalupe',     color: '#fd79a8' },
      { text: 'San Judas Tadeo',         color: '#00b894' },
      { text: 'Santa Bárbara',           color: '#d63031' },
      { text: 'San Miguel Arcángel',     color: '#74b9ff' },
      { text: 'San Francisco',           color: '#fdcb6e' },
      { text: 'Virgen Milagrosa',        color: '#55efc4' },
      { text: 'Santo Niño de Atocha',    color: '#ff9f43' },
      { text: 'San Expedito',            color: '#e17055' },
      { text: 'Madre Divina',            color: '#b2bec3' },
    ]
  },
  {
    id: 'religiosas-oraciones',
    name: 'Oraciones e Intenciones',
    category: 'religiosas',
    description: 'Intenciones espirituales para velas votivas',
    brushStyle: 'ribbon',
    font: 'Satisfy',
    stickers: [
      { text: 'Protección',     color: '#a29bfe' },
      { text: 'Sanación',       color: '#00b894' },
      { text: 'Fuerza',         color: '#ff9f43' },
      { text: 'Gratitud',       color: '#fdcb6e' },
      { text: 'Perdón',         color: '#fd79a8' },
      { text: 'Guía divina',    color: '#74b9ff' },
      { text: 'Bendición',      color: '#55efc4' },
      { text: 'Milagro',        color: '#e17055' },
    ]
  },
  {
    id: 'mascotas-perros',
    name: 'Mascotas y Perros',
    category: 'mascotas',
    description: 'Para velas dedicadas a las mascotas',
    brushStyle: 'wavy',
    font: 'Caveat',
    stickers: [
      { text: 'Mi Perrito',     color: '#fdcb6e' },
      { text: 'Fiel Amigo',     color: '#ff9f43' },
      { text: 'Mi Gatito',      color: '#fd79a8' },
      { text: 'Huellitas',      color: '#e17055' },
      { text: 'Peludo',         color: '#a29bfe' },
      { text: 'Mi Mascota',     color: '#00b894' },
      { text: 'Travieso',       color: '#fdcb6e' },
      { text: 'Compañero',      color: '#d63031' },
    ]
  },
  {
    id: 'mascotas-amor',
    name: 'Amor por los Animales',
    category: 'mascotas',
    description: 'Velas de amor para los animales',
    brushStyle: 'rounded',
    font: 'Pacifico',
    stickers: [
      { text: 'Patas',          color: '#fdcb6e' },
      { text: 'Colita',         color: '#fd79a8' },
      { text: 'Pelaje',         color: '#ff9f43' },
      { text: 'Ternura',        color: '#a29bfe' },
      { text: 'Lealtad',        color: '#0984e3' },
      { text: 'Mordiscos',      color: '#e17055' },
    ]
  },
  {
    id: 'profesiones-salud',
    name: 'Profesionales de Salud',
    category: 'profesiones',
    description: 'Para enfermeras, médicos y personal de salud',
    brushStyle: 'classic',
    font: 'Dancing Script',
    stickers: [
      { text: 'Enfermera',      color: '#fd79a8' },
      { text: 'Médico',         color: '#74b9ff' },
      { text: 'Cirujana',       color: '#00b894' },
      { text: 'Paramédico',     color: '#d63031' },
      { text: 'Nutrióloga',     color: '#55efc4' },
      { text: 'Fisioterapeuta', color: '#a29bfe' },
      { text: 'Veterinaria',    color: '#fdcb6e' },
      { text: 'Dentista',       color: '#0984e3' },
    ]
  },
  {
    id: 'profesiones-educacion',
    name: 'Educadores',
    category: 'profesiones',
    description: 'Para maestras, profesores y educadores',
    brushStyle: 'ribbon',
    font: 'Caveat',
    stickers: [
      { text: 'Maestra',        color: '#ff9f43' },
      { text: 'Profesor',       color: '#74b9ff' },
      { text: 'Director',       color: '#fdcb6e' },
      { text: 'Orientadora',    color: '#fd79a8' },
      { text: 'Preceptora',     color: '#00b894' },
      { text: 'Pedagoga',       color: '#e17055' },
      { text: 'Psicóloga',      color: '#55efc4' },
    ]
  },
  {
    id: 'profesiones-servicios',
    name: 'Servicios y Oficios',
    category: 'profesiones',
    description: 'Mecánicos, chefs, abogados y más',
    brushStyle: 'wavy',
    font: 'Dancing Script',
    stickers: [
      { text: 'Chef',           color: '#e17055' },
      { text: 'Mecánico',       color: '#6d4c41' },
      { text: 'Abogada',        color: '#0984e3' },
      { text: 'Contadora',      color: '#fdcb6e' },
      { text: 'Ingeniera',      color: '#74b9ff' },
      { text: 'Arquitecta',     color: '#a29bfe' },
      { text: 'Estilista',      color: '#fd79a8' },
      { text: 'Costurera',      color: '#55efc4' },
      { text: 'Policía',        color: '#0984e3' },
      { text: 'Bombero',        color: '#d63031' },
    ]
  },
  {
    id: 'navidad-clasica',
    name: 'Navidad Clásica',
    category: 'navidad',
    description: 'Velas navideñas con palabras y colores tradicionales',
    brushStyle: 'paintbrush',
    font: 'Satisfy',
    stickers: [
      { text: 'Feliz Navidad',     color: '#d63031' },
      { text: 'Noche Buena',       color: '#00b894' },
      { text: 'Paz en la Tierra',  color: '#74b9ff' },
      { text: 'Estrella de Belén', color: '#fdcb6e' },
      { text: 'Niño Jesús',        color: '#fd79a8' },
      { text: 'Posadas',           color: '#ff9f43' },
      { text: 'Villancico',        color: '#a29bfe' },
      { text: 'Nacimiento',        color: '#e17055' },
      { text: 'Regalos',           color: '#d63031' },
      { text: 'Alegría',           color: '#55efc4' },
    ]
  },
  {
    id: 'navidad-reyes',
    name: 'Reyes Magos',
    category: 'navidad',
    description: 'Velas para la noche de Reyes Magos',
    brushStyle: 'burst',
    font: 'Dancing Script',
    stickers: [
      { text: 'Melchor',        color: '#fdcb6e' },
      { text: 'Gaspar',         color: '#a29bfe' },
      { text: 'Baltazar',       color: '#6d4c41' },
      { text: 'Estrella Guía',  color: '#fdcb6e' },
      { text: 'Incienso',       color: '#00b894' },
      { text: 'Mirra',          color: '#e17055' },
      { text: 'Oro',            color: '#fdcb6e' },
      { text: 'Epifanía',       color: '#0984e3' },
    ]
  },
  {
    id: 'general-chakras',
    name: 'Chakras y Energía',
    category: 'general',
    description: 'Colores correspondientes a los 7 chakras',
    brushStyle: 'rounded',
    font: 'Pacifico',
    stickers: [
      { text: 'Raíz',        color: '#d63031', subtext: '1° Chakra' },
      { text: 'Sacral',      color: '#e17055', subtext: '2° Chakra' },
      { text: 'Plexo Solar', color: '#fdcb6e', subtext: '3° Chakra' },
      { text: 'Corazón',     color: '#00b894', subtext: '4° Chakra' },
      { text: 'Garganta',    color: '#74b9ff', subtext: '5° Chakra' },
      { text: 'Tercer Ojo',  color: '#6c5ce7', subtext: '6° Chakra' },
      { text: 'Corona',      color: '#a29bfe', subtext: '7° Chakra' },
    ]
  },
  {
    id: 'general-hogar',
    name: 'Hogar y Familia',
    category: 'general',
    description: 'Intenciones positivas para el hogar',
    brushStyle: 'classic',
    font: 'Caveat',
    stickers: [
      { text: 'Hogar Dulce',    color: '#ff9f43' },
      { text: 'Unión familiar', color: '#fd79a8' },
      { text: 'Armonía',        color: '#55efc4' },
      { text: 'Abundancia',     color: '#fdcb6e' },
      { text: 'Protección',     color: '#a29bfe' },
      { text: 'Salud',          color: '#00b894' },
      { text: 'Trabajo',        color: '#74b9ff' },
      { text: 'Amor de pareja', color: '#fd79a8' },
    ]
  },
];

function getAllTemplates() {
  return [...BUILTIN_TEMPLATES, ...getSavedTemplates()];
}

function getSavedTemplates() {
  try {
    return JSON.parse(localStorage.getItem('velasticker_saved_templates') || '[]');
  } catch(e) { return []; }
}

function saveUserTemplate(tpl) {
  const saved = getSavedTemplates();
  const idx = saved.findIndex(t => t.id === tpl.id);
  if (idx >= 0) saved[idx] = tpl; else saved.push(tpl);
  localStorage.setItem('velasticker_saved_templates', JSON.stringify(saved));
}

function deleteUserTemplate(id) {
  const saved = getSavedTemplates().filter(t => t.id !== id);
  localStorage.setItem('velasticker_saved_templates', JSON.stringify(saved));
}
