import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  IconArrowLeft,
  IconBrandWhatsapp,
  IconPhone,
  IconMail,
  IconChevronLeft,
  IconChevronRight,
  IconSend,
  IconCar,
  IconTruck,
  IconTruckDelivery,
  IconCarCrane,
  IconCarSuv,
  IconBus,
  IconBuildingSkyscraper,
  IconHome,
  IconBriefcase,
  IconDeviceLaptop,
  IconTractor,
  IconBuilding,
  IconStethoscope,
  IconSchool,
  IconActivity,
  IconBeach,
  IconUsersGroup,
} from "@tabler/icons-react";
import seguroAuto from "../../assets/autormb.png";
import seguroMedico from "../../assets/medicormb.png";
import seguroPropiedad from "../../assets/SeguroPropiedadMencasrmb.png";
import seguroVida from "../../assets/vidarmb.png";
import seguroViaje from "../../assets/viajermb.png";
import seguroMencasTeAsiste from "../../assets/asistenciarmb.png";
import toyota from "../../assets/marcas/toyota.png";
import ford from "../../assets/marcas/ford.png";
import honda from "../../assets/marcas/honda.jpeg";
import hyundai from "../../assets/marcas/hyundai.png";
import kia from "../../assets/marcas/kia.png";
import mazda from "../../assets/marcas/mazda.png";
import nissan from "../../assets/marcas/nissan.svg";
import chevrolet from "../../assets/marcas/chevrolet.png";
import jeep from "../../assets/marcas/jeep.png";
import suzuki from "../../assets/marcas/suzuki.png";
import volkswagen from "../../assets/marcas/volkswagen.svg";
import mitsubishi from "../../assets/marcas/mitsubishi.svg";
import renault from "../../assets/marcas/renault.jpg";
import subaru from "../../assets/marcas/subaru.png";
import dodge from "../../assets/marcas/dodge.svg";
import isuzu from "../../assets/marcas/isuzu.png";
import lexus from "../../assets/marcas/lexus.png";
import audi from "../../assets/marcas/audi.png";
import bmw from "../../assets/marcas/bmw.png";
import mercedes from "../../assets/marcas/mercedes.png";
import { toast } from "react-toastify";

const BRAND = "rgb(34,128,62)";

const SEGUROS = {
  vehiculo: {
    title: "Seguro de Vehículo",
    heroImage: seguroAuto,
    heroText: "Cotiza tu póliza de vehículo en minutos.",
    variants: [
      {
        title: "Daños a terceros",
        subtitle: "Responsabilidad civil",
        image: seguroAuto,
        href: "#",
      },
      {
        title: "Todo riesgo",
        subtitle: "Coberturas ampliadas",
        image: seguroAuto,
        href: "#",
      },
      {
        title: "Cerrajería de Automovil",
        subtitle:
          "En caso de que pierdas las llaves y no puedas ingresar a tu vehiculo",
        image: seguroAuto,
        href: "#",
      },
    ],
  },
  medico: {
    title: "Seguro Médico",
    heroImage: seguroMedico,
    heroText: "Salud y tranquilidad con cobertura médica.",
    variants: [
      {
        title: "Ambulatorio",
        subtitle: "Consultas y exámenes",
        image: seguroMedico,
        href: "#",
      },
      {
        title: "Hospitalario",
        subtitle: "Internación y cirugías",
        image: seguroMedico,
        href: "#",
      },
    ],
  },
  propiedad: {
    title: "Seguro de Propiedad",
    heroImage: seguroPropiedad,
    heroText: "Protege tu hogar o negocio ante imprevistos.",
    variants: [
      {
        title: "Hogar",
        subtitle: "Estructura + contenido",
        image: seguroPropiedad,
        href: "#",
      },
      {
        title: "Comercial",
        subtitle: "Local u oficina",
        image: seguroPropiedad,
        href: "#",
      },
    ],
  },
  viaje: {
    title: "Seguro de Viaje",
    heroImage: seguroViaje,
    heroText: "Asistencia médica, equipaje y demoras.",
    variants: [
      {
        title: "Turista",
        subtitle: "Viajes cortos",
        image: seguroViaje,
        href: "#",
      },
      {
        title: "Negocios",
        subtitle: "Frecuentes",
        image: seguroViaje,
        href: "#",
      },
    ],
  },
  asistencia: {
    title: "Seguro Repatriacion y Asistencia",
    heroImage: seguroMencasTeAsiste,
    heroText: "Cerca de los tuyos, sin importar la distancia.",
    variants: [
      {
        title: "Tramites de legales",
        subtitle: "De aduana para la entrega del cuerpo en el aeropuerto",
        image: seguroMencasTeAsiste,
        href: "#",
      },
      {
        title: "Traslado del cuerpo",
        subtitle: "Desde el extranjero al país de origen",
        image: seguroMencasTeAsiste,
        href: "#",
      },
      {
        title: "Féretro Especial",
        subtitle:
          "Féretro hermético y reforzado con funda de protectora para el transporte internacional",
        image: seguroMencasTeAsiste,
        href: "#",
      },
    ],
  },
  vida: {
    title: "Seguro de Personas",
    heroImage: seguroVida,
    heroText: "Protección financiera para los tuyos.",
    variants: [
      {
        title: "Vida individual",
        subtitle: "Cobertura personal",
        image: seguroVida,
        href: "#",
      },
      {
        title: "Vida colectivo",
        subtitle: "Grupos/empleados",
        image: seguroVida,
        href: "#",
      },
    ],
  },
};

// Chips canal
const channelChips = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    Icon: IconBrandWhatsapp,
    color: "bg-[#25D366]",
  },
  { key: "llamada", label: "Llamada", Icon: IconPhone, color: "bg-[#1F2937]" },
  { key: "email", label: "Email", Icon: IconMail, color: "bg-[#2563EB]" },
];

// ===== Vehículos: catálogos =====
// eslint-disable-next-line react-refresh/only-export-components
export const VEHICULO_MARCAS = [
  { label: "Toyota", logo: toyota },
  { label: "Ford", logo: ford },
  { label: "Honda", logo: honda },
  { label: "Hyundai", logo: hyundai },
  { label: "Kia", logo: kia },
  { label: "Mazda", logo: mazda },
  { label: "Nissan", logo: nissan },
  { label: "Chevrolet", logo: chevrolet },
  { label: "Jeep", logo: jeep },
  { label: "Suzuki", logo: suzuki },
  { label: "Volkswagen", logo: volkswagen },
  { label: "Mitsubishi", logo: mitsubishi },
  { label: "Renault", logo: renault },
  { label: "Subaru", logo: subaru },
  { label: "Dodge", logo: dodge },
  { label: "Isuzu", logo: isuzu },
  { label: "Lexus", logo: lexus },
  { label: "Audi", logo: audi },
  { label: "BMW", logo: bmw },
  { label: "Mercedes", logo: mercedes },
];

const VEHICULO_TIPOS = [
  { key: "turismo", label: "Turismo", Icon: IconCar },
  { key: "camioneta", label: "Camioneta", Icon: IconCarSuv },
  { key: "pick-up", label: "Pick-Up", Icon: IconCarCrane },
  { key: "microbus", label: "Microbús", Icon: IconBus },
  { key: "camioncito", label: "Camioncito", Icon: IconTruck },
  { key: "camion", label: "Camión", Icon: IconTruckDelivery },
];

const CURRENT_YEAR = new Date().getFullYear();
const VEHICULO_YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) =>
  String(CURRENT_YEAR - i)
);
const VEHICULO_USO = ["Particular", "Trabajo"];
const VEHICULO_ESTADO = ["Nuevo", "Usado"];
const VEHICULO_MODELOS = {
  Toyota: [
    "Camry",
    "Corolla",
    "Highlander",
    "Hilux",
    "Land Cruiser / Prado",
    "Prado",
    "Prius",
    "RAV4",
    "Tacoma",
    "Yaris",
  ],
  Ford: [
    "Edge",
    "Escape",
    "Escort",
    "F-Series",
    "Fiesta",
    "Focus",
    "Explorer",
    "Mustang",
    "Ranger",
    "Taurus",
  ],
  Honda: [
    "Accord",
    "City",
    "Civic",
    "CR-V",
    "Fit",
    "HR-V",
    "Odyssey",
    "Passport",
    "Pilot",
    "Ridgeline",
  ],
  Hyundai: [
    "Accent",
    "Creta",
    "Elantra",
    "Ioniq (híbrido / eléctrico)",
    "Kona",
    "Palisade",
    "Santa Fe",
    "Sonata",
    "Tucson",
    "Venue",
  ],
  Kia: [
    "Carnival",
    "Forte",
    "Picanto",
    "Rio",
    "Seltos",
    "Sorento",
    "Soul",
    "Sportage",
    "Stonic",
    "Telluride",
  ],
  Mazda: [
    "BT-50",
    "CX-3",
    "CX-5",
    "CX-9",
    "CX-30",
    "CX-50",
    "Mazda2",
    "Mazda3",
    "Mazda6",
    "MX-5",
  ],
  Nissan: [
    "370Z",
    "Altima",
    "Frontier",
    "March",
    "Patrol",
    "Qashqai",
    "Rogue",
    "Sentra",
    "Versa",
    "X-Trail",
  ],
  Chevrolet: [
    "Camaro",
    "Colorado",
    "Cruze",
    "Equinox",
    "Malibu",
    "Onix",
    "Silverado",
    "Spark",
    "Tahoe",
    "Tracker",
  ],
  Jeep: [
    "Cherokee",
    "Commander",
    "Compass",
    "Gladiator",
    "Grand Cherokee",
    "Patriot",
    "Renegade",
    "Wagoneer",
    "Wrangler",
  ],
  Suzuki: [
    "Alto",
    "Baleno",
    "Carry",
    "Celerio",
    "Ciaz",
    "Jimny",
    "Swift",
    "SX4",
    "Vitara",
  ],
  Volkswagen: [
    "Amarok",
    "Beetle",
    "Gol",
    "Jetta",
    "Passat",
    "Polo",
    "Polo",
    "T-Cross",
    "Tiguan",
    "Touareg",
  ],
  Mitsubishi: [
    "ASX",
    "Eclipse Cross",
    "L200",
    "Lancer",
    "Mirage / Mirage G4",
    "Montero",
    "Montero Sport",
    "Outlander",
    "Outlander / Outlander Sport (ASX)",
  ],
  Renault: [
    "Arkana",
    "Boreal",
    "Captur",
    "Duster",
    "Koleos",
    "Kwid",
    "Logan",
    "Oroch",
    "Stepway",
  ],
  Subaru: [
    "Ascent",
    "Crosstrek",
    "Forester",
    "Impreza",
    "Legacy",
    "Legacy",
    "Outback",
    "WRX / WRX STI",
    "XV",
  ],
  Dodge: [
    "Challenger",
    "Charger",
    "Dart",
    "Durango",
    "Grand Caravan",
    "Journey",
    "Ram 1500",
    "Stratus",
  ],
  Isuzu: [
    "D-Max",
    "F-Serie",
    "MU-X",
    "N-Series",
    "Panther",
    "P-Series",
    "Q-Series",
    "Rodeo",
    "Traviz / Traga",
  ],
  Lexus: ["CT 200h", "ES", "GX", "IS", "LS", "LX", "NX", "RX 350", "UX"],
  Audi: ["A3", "A4", "A6", "A8L", "Q3", "Q5", "Q6", "Q7", "R8", "TT"],
  BMW: [
    "Serie 1",
    "Serie 3",
    "Serie 4",
    "Serie 5",
    "X1",
    "X3",
    "X5",
    "X6",
    "X7",
  ],
  Mercedes: [
    "300SE",
    "CLA-Class",
    "E-Class",
    "G 500/Clase G",
    "G 63 AMG",
    "GLB 250 4MATIC – SUV",
    "GLC",
    "GLE 450 Coupé / GLE 450 – SUV",
    "Sprinter",
  ],
};
// Propiedad
const PROPIEDAD_TIPOS = [
  { key: "casa", label: "Casa", Icon: IconHome },
  { key: "apartamento", label: "Apartamento", Icon: IconBuildingSkyscraper },
  { key: "comercial", label: "Local/Oficina", Icon: IconBriefcase },
];
// departamentos
const HN_DEPARTAMENTOS = [
  "Atlántida",
  "Choluteca",
  "Colón",
  "Comayagua",
  "Copán",
  "Cortés",
  "El Paraíso",
  "Francisco Morazán",
  "Gracias a Dios",
  "Intibucá",
  "Islas de la Bahía",
  "La Paz",
  "Lempira",
  "Ocotepeque",
  "Olancho",
  "Santa Bárbara",
  "Valle",
  "Yoro",
];

// Material construcción y usos
const PROPIEDAD_MATERIALES = ["Madera", "Concreto", "Otro"];
const PROPIEDAD_USOS = ["Habitacional", "Comercial"];

const ASISTENCIA_TIPOS = [
  { key: "carretera", label: "Carretera" },
  { key: "hogar", label: "Hogar" },
  { key: "integral", label: "Integral" },
];
const VIDA_PROFESIONES = [
  {
    key: "Oficina o Home Office",
    label: "Oficina o Home Office",
    Icon: IconDeviceLaptop,
  },
  { key: "Campo", label: "Campo", Icon: IconTractor },
  { key: "Construcción", label: "Construcción", Icon: IconBuilding },
  { key: "Salud", label: "Salud", Icon: IconStethoscope },
  { key: "Educación", label: "Educación", Icon: IconSchool },
  { key: "Transporte", label: "Transporte", Icon: IconBus },
  {
    key: "Actividades de alto riesgo",
    label: "Alto Riesgo",
    Icon: IconActivity,
  },
  { key: "Otro", label: "Otro", Icon: IconBriefcase },
];
const VIAJE_TIPOS = [
  { key: "turista", label: "Turista", Icon: IconBeach },
  { key: "negocios", label: "Negocios", Icon: IconBriefcase },
  { key: "familiar", label: "Familiar", Icon: IconUsersGroup },
];
//Códigos ISO 3166-1 alpha-2 - Codigos de país
const ISO2_COUNTRY_CODES = [
  "AF",
  "AX",
  "AL",
  "DZ",
  "AS",
  "AD",
  "AO",
  "AI",
  "AQ",
  "AG",
  "AR",
  "AM",
  "AW",
  "AU",
  "AT",
  "AZ",
  "BS",
  "BH",
  "BD",
  "BB",
  "BY",
  "BE",
  "BZ",
  "BJ",
  "BM",
  "BT",
  "BO",
  "BQ",
  "BA",
  "BW",
  "BV",
  "BR",
  "IO",
  "BN",
  "BG",
  "BF",
  "BI",
  "CV",
  "KH",
  "CM",
  "CA",
  "KY",
  "CF",
  "TD",
  "CL",
  "CN",
  "CX",
  "CC",
  "CO",
  "KM",
  "CG",
  "CD",
  "CK",
  "CR",
  "CI",
  "HR",
  "CU",
  "CW",
  "CY",
  "CZ",
  "DK",
  "DJ",
  "DM",
  "DO",
  "EC",
  "EG",
  "SV",
  "GQ",
  "ER",
  "EE",
  "SZ",
  "ET",
  "FK",
  "FO",
  "FJ",
  "FI",
  "FR",
  "GF",
  "PF",
  "TF",
  "GA",
  "GM",
  "GE",
  "DE",
  "GH",
  "GI",
  "GR",
  "GL",
  "GD",
  "GP",
  "GU",
  "GT",
  "GG",
  "GN",
  "GW",
  "GY",
  "HT",
  "HM",
  "VA",
  "HN",
  "HK",
  "HU",
  "IS",
  "IN",
  "ID",
  "IR",
  "IQ",
  "IE",
  "IM",
  "IL",
  "IT",
  "JM",
  "JP",
  "JE",
  "JO",
  "KZ",
  "KE",
  "KI",
  "KP",
  "KR",
  "KW",
  "KG",
  "LA",
  "LV",
  "LB",
  "LS",
  "LR",
  "LY",
  "LI",
  "LT",
  "LU",
  "MO",
  "MG",
  "MW",
  "MY",
  "MV",
  "ML",
  "MT",
  "MH",
  "MQ",
  "MR",
  "MU",
  "YT",
  "MX",
  "FM",
  "MD",
  "MC",
  "MN",
  "ME",
  "MS",
  "MA",
  "MZ",
  "MM",
  "NA",
  "NR",
  "NP",
  "NL",
  "NC",
  "NZ",
  "NI",
  "NE",
  "NG",
  "NU",
  "NF",
  "MK",
  "MP",
  "NO",
  "OM",
  "PK",
  "PW",
  "PS",
  "PA",
  "PG",
  "PY",
  "PE",
  "PH",
  "PN",
  "PL",
  "PT",
  "PR",
  "QA",
  "RE",
  "RO",
  "RU",
  "RW",
  "BL",
  "SH",
  "KN",
  "LC",
  "MF",
  "PM",
  "VC",
  "WS",
  "SM",
  "ST",
  "SA",
  "SN",
  "RS",
  "SC",
  "SL",
  "SG",
  "SX",
  "SK",
  "SI",
  "SB",
  "SO",
  "ZA",
  "GS",
  "SS",
  "ES",
  "LK",
  "SD",
  "SR",
  "SJ",
  "SE",
  "CH",
  "SY",
  "TW",
  "TJ",
  "TZ",
  "TH",
  "TL",
  "TG",
  "TK",
  "TO",
  "TT",
  "TN",
  "TR",
  "TM",
  "TC",
  "TV",
  "UG",
  "UA",
  "AE",
  "GB",
  "US",
  "UM",
  "UY",
  "UZ",
  "VU",
  "VE",
  "VN",
  "VG",
  "VI",
  "WF",
  "EH",
  "YE",
  "ZM",
  "ZW",
];

const BASE_URL = (import.meta.env?.VITE_API_URL || "").replace(/\/+$/, "");
const CONTACTS_URL = BASE_URL ? `${BASE_URL}/contacts/add` : "/contacts/add";
const QUOTES_URL = BASE_URL
  ? `${BASE_URL}/createQuotes/add`
  : "/createQuotes/add";
// Formatea DD/MM/AAAA a YYYY-MM-DD
function formatDOB(d, m, y) {
  if (!d || !m || !y) return "";
  const dd = String(d).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

// Genera la lista en español con Intl.DisplayNames.
// Si Intl.DisplayNames no existe, caemos a un fallback corto.
function getCountryListEs() {
  try {
    if (typeof Intl.DisplayNames !== "function")
      throw new Error("no-DisplayNames");
    const dn = new Intl.DisplayNames(["es"], { type: "region" });

    const items = ISO2_COUNTRY_CODES.map((code) => ({
      code,
      name: dn.of(code) || code,
    }))
      .filter((x) => x.name && x.name !== x.code)
      .sort((a, b) => a.name.localeCompare(b.name, "es"));
    return items;
  } catch {
    return [
      { code: "US", name: "Estados Unidos" },
      { code: "MX", name: "México" },
      { code: "ES", name: "España" },
      { code: "HN", name: "Honduras" },
    ];
  }
}

// Componente reutilizable
function CountryMultiSelect({ label = "Selecciona países", value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const countries = React.useMemo(getCountryListEs, []);
  const selectedSet = new Set(value.map((v) => v.code));

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.code.includes(query.toUpperCase())
  );

  function toggle(c) {
    if (selectedSet.has(c.code)) {
      onChange(value.filter((x) => x.code !== c.code));
    } else {
      onChange([...value, c]);
    }
    setQuery("");
  }

  return (
    <div className="relative">
      <label className="block mb-2 text-center text-lg font-semibold text-cyan-800">
        {label}
      </label>

      <div className="flex items-center gap-2 rounded-2xl border border-slate-800 px-3 py-2 min-h-[48px] bg-white">
        {/* Chips seleccionados */}
        <div className="flex flex-wrap gap-2 flex-1">
          {value.map((c) => (
            <span
              key={c.code}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm bg-slate-800 text-white"
            >
              {c.name}
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x.code !== c.code))}
              >
                ×
              </button>
            </span>
          ))}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder={value.length ? "" : "Empieza a escribir…"}
            className="min-w-[160px] flex-1 outline-none text-sm py-1"
          />
        </div>

        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="rounded-full p-1 hover:bg-slate-100"
          >
            ⨯
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-full p-1 hover:bg-slate-100"
        >
          ▾
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-2 w-full max-h-64 overflow-auto rounded-xl border bg-white shadow-lg">
          {filtered.length === 0 ? (
            <div className="p-3 text-sm text-neutral-500">Sin resultados…</div>
          ) : (
            filtered.map((c) => {
              const active = selectedSet.has(c.code);
              return (
                <button
                  key={c.code}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => toggle(c)}
                  className={`w-full px-3 py-2 text-sm flex justify-between ${
                    active ? "bg-cyan-50" : ""
                  }`}
                >
                  <span>{c.name}</span>
                  {active && <span>✓</span>}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
function CountrySelect({ label = "País", value, onChange }) {
  const countries = React.useMemo(getCountryListEs, []);
  const opts = [
    { value: "", label: "Selecciona un país", disabled: true },
    ...countries.map((c) => ({
      value: c.code,
      label: `${c.name} (${c.code})`,
    })),
  ];
  return (
    <Select label={label} value={value} onChange={onChange} options={opts} />
  );
}

export default function SeguroDetalle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const conf = useMemo(() => SEGUROS[slug], [slug]);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // scroll to top
  const scrollToId = React.useCallback((id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  React.useEffect(() => {
    const el = document.getElementById("wizard");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  //bug de map
  // ISO2 -> nombre en español (para el resumen de "asistencia")
  const COUNTRY_MAP = useMemo(() => {
    const entries = getCountryListEs().map((c) => [c.code, c.name]);
    return Object.fromEntries(entries);
  }, []);
  //fin bug de map

  // Paso 1
  const [vehiculo, setVehiculo] = useState({
    marca: "",
    modelo: "",
    tipo: "",
    anio: "",
    uso: "Particular",
    valor: "",
    estado: "Usado",
  });
  const [medico, setMedico] = useState({
    dia: "",
    mes: "",
    anio: "",
    genero: "",
    parejaAsegurar: "",
    parejaDia: "",
    parejaMes: "",
    parejaAnio: "",
    parejaGenero: "",
    tieneHijos: "",
    hijosCantidad: "",
  });
  const [propiedad, setPropiedad] = useState({
    tipo: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    material: "",
    materialOtro: "",
    uso: "",
    valorPropiedad: "",
    valorMenaje: "",
  });

  const [asistencia, setAsistencia] = useState({
    nombre: "",
    pais: "",
    identificacion: "",
    direccion: "",
    telefono: "",
    ocupacion: "",
    contactoHonduras: "",
  });
  const [vida, setVida] = useState({
    dia: "",
    mes: "",
    anio: "",
    genero: "",
    valorAsegurar: "",
    profesion: "",
    profesionOtro: "",
  });
  const [viaje, setViaje] = useState({
    destino: "",
    destinos: [],
    salida: "",
    regreso: "",
    personas: 1,
    tipo: "turista",
  });

  // Paso 2
  const [personal, setPersonal] = useState({
    nombre: "",
    telefono: "",
    email: "",
    canal: "whatsapp",
    dni: "",
    birthDate: "",
  });
  // DOB desde paso 1 cuando sea "medico"
  React.useEffect(() => {
    if (slug !== "medico") return;
    const dob = formatDOB(medico.dia, medico.mes, medico.anio);
    if (dob)
      setPersonal((p) => (p.birthDate === dob ? p : { ...p, birthDate: dob }));
  }, [slug, medico.dia, medico.mes, medico.anio]);

  // "vida"
  React.useEffect(() => {
    if (slug !== "vida") return;
    const dob = formatDOB(vida.dia, vida.mes, vida.anio);
    if (dob)
      setPersonal((p) => (p.birthDate === dob ? p : { ...p, birthDate: dob }));
  }, [slug, vida.dia, vida.mes, vida.anio]);

  if (!conf) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black"
        >
          <IconArrowLeft className="h-4 w-4" /> Volver
        </button>
        <h1 className="mt-4 text-xl font-semibold">Seguro no encontrado</h1>
      </div>
    );
  }
  // Validaciones
  function validateStep1() {
    switch (slug) {
      case "vehiculo":
        if (!vehiculo.marca) return toast.error("Selecciona la marca.");
        if (!vehiculo.modelo) return toast.error("Indica el modelo.");
        if (!vehiculo.tipo)
          return toast.error("Selecciona el tipo de vehículo.");
        if (!vehiculo.anio)
          return toast.error("Selecciona el año del vehículo.");
        if (!vehiculo.estado) return toast.error("Indica el estado.");
        if (vehiculo.valor && Number.isNaN(Number(vehiculo.valor)))
          return toast.error("El valor del vehículo debe ser numérico.");
        break;
      case "medico":
        if (!medico.dia || !medico.mes || !medico.anio)
          return toast.error("Completa tu fecha de nacimiento.");
        if (!isAdultDate(medico.dia, medico.mes, medico.anio))
          return toast.error("Debes ser mayor de 18 años para continuar.");

        if (!medico.genero) return toast.error("Selecciona tu género.");
        if (!medico.parejaAsegurar)
          return toast.error("Indica si deseas asegurar a tu pareja.");

        if (medico.parejaAsegurar === "Si") {
          if (!medico.parejaDia || !medico.parejaMes || !medico.parejaAnio)
            return toast.error("Completa la fecha de nacimiento de tu pareja.");
          if (
            !isAdultDate(medico.parejaDia, medico.parejaMes, medico.parejaAnio)
          )
            return toast.error(
              "La fecha de nacimiento de tu pareja debe indicar 18 años o más."
            );

          if (!medico.parejaGenero)
            return toast.error("Selecciona el género de tu pareja.");
          if (!medico.tieneHijos) return toast.error("Indica si tienen hijos.");
          if (medico.tieneHijos === "Si" && !medico.hijosCantidad)
            return toast.error("Indica cuántos hijos tienen.");
        }
        break;
      case "propiedad":
        if (!propiedad.tipo)
          return toast.error("Selecciona el tipo de propiedad.");
        if (!propiedad.departamento)
          return toast.error("Selecciona el departamento de tu propiedad.");
        if (!propiedad.ciudad.trim())
          return toast.error("Ingresa la ciudad de tu propiedad.");
        if (!propiedad.direccion.trim())
          return toast.error("Ingresa la dirección exacta de tu propiedad.");

        if (!propiedad.material)
          return toast.error("Selecciona el material de construcción.");
        if (propiedad.material === "Otro" && !propiedad.materialOtro.trim())
          return toast.error("Especifica el material de construcción.");

        if (!propiedad.uso)
          return toast.error("Indica para qué usas tu propiedad.");

        if (propiedad.valorPropiedad === "")
          return toast.error("Ingresa el valor de tu propiedad.");
        if (
          Number.isNaN(Number(propiedad.valorPropiedad)) ||
          Number(propiedad.valorPropiedad) <= 0
        )
          return toast.error(
            "El valor de tu propiedad debe ser un número mayor a 0."
          );

        if (propiedad.valorMenaje === "")
          return toast.error("Ingresa el valor de tu menaje.");
        if (
          Number.isNaN(Number(propiedad.valorMenaje)) ||
          Number(propiedad.valorMenaje) < 0
        )
          return toast.error(
            "El valor de tu menaje debe ser un número (0 o mayor)."
          );
        break;
      case "viaje": {
        const hasMulti =
          Array.isArray(viaje.destinos) && viaje.destinos.length > 0;
        const hasLegacy = (viaje.destino || "").trim().length > 0;
        if (!hasMulti && !hasLegacy)
          return toast.error("Indica al menos un destino de viaje.");

        if (viaje.salida && isNaN(Date.parse(viaje.salida)))
          return toast.error("Fecha de salida inválida.");
        if (viaje.regreso && isNaN(Date.parse(viaje.regreso)))
          return toast.error("Fecha de regreso inválida.");
        if (
          viaje.salida &&
          viaje.regreso &&
          new Date(viaje.regreso) < new Date(viaje.salida)
        )
          return toast.error(
            "La fecha de regreso debe ser posterior a la salida."
          );

        if (viaje.personas < 1 || viaje.personas > 6)
          return toast.error(
            "El número de personas viajeras debe estar entre 1 y 6."
          );
        break;
      }
      case "asistencia": {
        if (!asistencia.nombre.trim())
          return toast.error(
            "Ingresa el nombre completo del hondureño migrante."
          );
        if (!asistencia.pais)
          return toast.error("Selecciona el país de residencia.");
        if (!asistencia.identificacion.trim())
          return toast.error("Ingresa el número de identificación.");
        if (!asistencia.direccion.trim())
          return toast.error("Ingresa la dirección.");
        if (!/^\d{8,}$/.test(asistencia.telefono.trim()))
          return toast.error(
            "Teléfono del migrante inválido (solo números, mínimo 8)."
          );
        if (!asistencia.ocupacion.trim())
          return toast.error("Ingresa la ocupación.");
        if (!asistencia.contactoHonduras.trim())
          return toast.error("Ingresa un contacto en Honduras.");
        break;
      }
      case "vida":
        if (!vida.dia || !vida.mes || !vida.anio)
          return toast.error("Completa tu fecha de nacimiento.");
        if (!isAdultDate(vida.dia, vida.mes, vida.anio))
          return toast.error(
            "Debes ser mayor de 18 años para contratar este seguro."
          );

        if (!vida.genero) return toast.error("Selecciona tu género.");

        if (vida.valorAsegurar === "")
          return toast.error("Indica la suma que te gustaría asegurar.");
        if (
          Number.isNaN(Number(vida.valorAsegurar)) ||
          Number(vida.valorAsegurar) <= 0
        )
          return toast.error(
            "La suma a asegurar debe ser un número mayor a 0."
          );

        if (!vida.profesion)
          return toast.error("Selecciona tu ocupación/profesión.");
        if (vida.profesion === "Otro" && !vida.profesionOtro.trim())
          return toast.error("Especifica tu ocupación/profesión.");
        break;

      default:
        break;
    }
    return null;
  }
  function validateStep2() {
    if (!personal.nombre.trim())
      return toast.error("El nombre es obligatorio.");
    const digits = personal.telefono.replace(/\D/g, "");
    if (!/^\d{8}$/.test(digits)) {
      return toast.error(
        "Teléfono inválido (deben ser 8 dígitos ej. 32614605)."
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email.trim()))
      return toast.error("Email inválido.");
    const id = personal.dni.replace(/\D+/g, "");
    if (!/^\d{13}$/.test(id)) {
      return toast.error(
        "El DNI/identidad es obligatorio, ej. 0703199000000)."
      );
    }
    const necesitaDOB = slug !== "medico" && slug !== "vida";
    if (necesitaDOB && !personal.birthDate)
      return toast.error("La fecha de nacimiento es obligatoria.");
    if (personal.birthDate && isNaN(Date.parse(personal.birthDate)))
      return toast.error(
        "La fecha de nacimiento no es válida (usa YYYY-MM-DD)."
      );

    return null;
  }
  function next(e) {
    e?.preventDefault?.();
    const hasError =
      step === 1 ? !!validateStep1() : step === 2 ? !!validateStep2() : false;
    if (hasError) return;

    setStep((s) => {
      const nextStep = Math.min(3, s + 1);
      if (nextStep === 2) requestAnimationFrame(() => scrollToId("wizard"));
      return nextStep;
    });
  }
  function back() {
    setStep((s) => {
      const prev = Math.max(1, s - 1);
      requestAnimationFrame(() => {
        const el = document.getElementById("wizard");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return prev;
    });
  }

  // Valida que (d/m/y) sea una fecha real y que sea 18+ años
  function isAdultDate(d, m, y) {
    const dd = Number(d),
      mm = Number(m),
      yy = Number(y);
    if (!dd || !mm || !yy) return false;

    const dob = new Date(yy, mm - 1, dd);
    // fecha real
    const isRealDate =
      dob.getFullYear() === yy &&
      dob.getMonth() === mm - 1 &&
      dob.getDate() === dd;
    if (!isRealDate) return false;

    const today = new Date();
    const adultCutoff = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return dob <= adultCutoff;
  }

  // Servicios
  function serviceTypeCodeFromSlug(slug) {
    switch (slug) {
      case "vehiculo":
        return "AUTO";
      case "medico":
        return "MEDICAL";
      case "propiedad":
        return "PROPERTY";
      case "viaje":
        return "TRAVEL";
      case "asistencia":
        return "ASSIST";
      case "vida":
        return "LIFE";
      default:
        return "OTHER";
    }
  }

  function serviceTypeLabelFromSlug(slug) {
    switch (slug) {
      case "vehiculo":
        return "Seguro de Vehículo";
      case "medico":
        return "Seguro Médico";
      case "propiedad":
        return "Seguro de Propiedad";
      case "viaje":
        return "Seguro de Viaje";
      case "asistencia":
        return "Repatriación y Asistencia";
      case "vida":
        return "Seguro de Vida";
      default:
        return "Otro";
    }
  }

  // Normaliza numéricos
  const numOrNull = (v) => {
    const n = Number(String(v).replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : null;
  };

  //bloque "details" según el seguro
  function buildDetails() {
    switch (slug) {
      case "vehiculo": {
        return {
          vehicleBrand: vehiculo.marca || null,
          vehicleModel: vehiculo.modelo || null,
          vehicleYear: vehiculo.anio ? Number(vehiculo.anio) : null,
          vehicleType: vehiculo.tipo || null,
          use: vehiculo.uso || null,
          condition: vehiculo.estado || null,
          marketValue: numOrNull(vehiculo.valor),
          invoiceValue: null,
        };
      }
      case "medico": {
        const titularDOB =
          medico.dia && medico.mes && medico.anio
            ? `${medico.anio}-${String(medico.mes).padStart(2, "0")}-${String(
                medico.dia
              ).padStart(2, "0")}`
            : null;
        const parejaDOB =
          medico.parejaDia && medico.parejaMes && medico.parejaAnio
            ? `${medico.parejaAnio}-${String(medico.parejaMes).padStart(
                2,
                "0"
              )}-${String(medico.parejaDia).padStart(2, "0")}`
            : null;

        return {
          titular: {
            birthDate: titularDOB,
            gender: medico.genero || null,
          },
          pareja:
            medico.parejaAsegurar === "Si"
              ? {
                  insure: true,
                  birthDate: parejaDOB,
                  gender: medico.parejaGenero || null,
                  haveChildren: medico.tieneHijos || null,
                  childrenCount:
                    medico.tieneHijos === "Si"
                      ? Number(medico.hijosCantidad || 0)
                      : 0,
                }
              : { insure: false },
        };
      }
      case "propiedad": {
        return {
          propertyType: propiedad.tipo || null,
          department: propiedad.departamento || null,
          city: propiedad.ciudad || null,
          address: propiedad.direccion || null,
          material:
            propiedad.material === "Otro" && propiedad.materialOtro
              ? `Otro (${propiedad.materialOtro})`
              : propiedad.material || null,
          use: propiedad.uso || null,
          propertyValue: numOrNull(propiedad.valorPropiedad),
          contentsValue: numOrNull(propiedad.valorMenaje),
        };
      }
      case "viaje": {
        return {
          destinations:
            Array.isArray(viaje.destinos) && viaje.destinos.length
              ? viaje.destinos.map((d) => ({ code: d.code, name: d.name }))
              : viaje.destino
              ? [{ code: null, name: viaje.destino }]
              : [],
          departure: viaje.salida || null,
          return: viaje.regreso || null,
          people: Number(viaje.personas || 1),
          tripType: viaje.tipo || null,
        };
      }
      case "asistencia": {
        return {
          migrant: {
            fullName: asistencia.nombre || null,
            residenceCountry: asistencia.pais || null,
            idNumber: asistencia.identificacion || null,
            address: asistencia.direccion || null,
            phone: asistencia.telefono || null,
            occupation: asistencia.ocupacion || null,
            contactHN: asistencia.contactoHonduras || null,
          },
        };
      }
      case "vida": {
        const dob =
          vida.dia && vida.mes && vida.anio
            ? `${vida.anio}-${String(vida.mes).padStart(2, "0")}-${String(
                vida.dia
              ).padStart(2, "0")}`
            : null;

        return {
          birthDate: dob,
          gender: vida.genero || null,
          sumAssured: numOrNull(vida.valorAsegurar),
          profession:
            vida.profesion === "Otro" && vida.profesionOtro
              ? `Otro (${vida.profesionOtro})`
              : vida.profesion || null,
        };
      }
      default:
        return {};
    }
  }
  // Envía la cotización al backend primero creando el contacto, luego la cotización
  async function submitQuote() {
    try {
      const err1 = validateStep1();
      if (err1) {
        toast.warn(err1);
        setStep(1);
        return;
      }
      const err2 = validateStep2();
      if (err2) {
        toast.warn(err2);
        setStep(2);
        return;
      }

      setSubmitting(true);

      // 1) Crear CONTACTO
      const contactPayload = {
        recordType: "PROFILE",
        fullName: personal.nombre,
        DNI: personal.dni,
        gender:
          slug === "medico"
            ? medico.genero || null
            : slug === "vida"
            ? vida.genero || null
            : null,
        birthDate:
          slug === "medico"
            ? formatDOB(medico.dia, medico.mes, medico.anio) || null
            : slug === "vida"
            ? formatDOB(vida.dia, vida.mes, vida.anio) || null
            : personal.birthDate || null,
        cellphone: personal.telefono,
        email: personal.email,
        preferContact:
          personal.canal === "whatsapp"
            ? "WhatsApp"
            : personal.canal === "llamada"
            ? "llamada"
            : "email",
        enabled: true,
        updatedAt: new Date().toISOString(),
        searchDate: new Date().toISOString(),
      };

      const contactRes = await fetch(CONTACTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactPayload),
      });

      if (!contactRes.ok) {
        const text = await contactRes.text().catch(() => "");
        throw new Error(
          text || `Error al crear contacto (${contactRes.status})`
        );
      }
      // const contactData = await contactRes.json().catch(() => ({}));
      // toast.success("Contacto creado con éxito");

      // 2 COTIZACIÓN
      const quotePayload = {
        recordType: "QUOTE",
        serviceType: serviceTypeLabelFromSlug(slug),
        serviceTypeCode: serviceTypeCodeFromSlug(slug),
        details: buildDetails(),
        contactSnapshot: {
          DNI: contactPayload.DNI || "",
          fullName: personal.nombre,
          email: personal.email,
          cellphone: personal.telefono,
          preferContact:
            personal.canal === "whatsapp"
              ? "WhatsApp"
              : personal.canal === "llamada"
              ? "Phone"
              : "Email",
        },
        status: "PENDING",
        createdAt: new Date().toISOString(),
      };
      console.log("Enviando cotización:", quotePayload);
      const quoteRes = await fetch(QUOTES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quotePayload),
      });

      if (!quoteRes.ok) {
        const text = await quoteRes.text().catch(() => "");
        throw new Error(
          text || `Error al crear cotización (${quoteRes.status})`
        );
      }

      const quoteData = await quoteRes.json().catch(() => ({}));
      // leer quoteData.quoteSnapshot.quoteId
      toast.success("¡Cotización creada correctamente!");

      // Redirección suave
      setTimeout(() => navigate("/"), 1200);
    } catch (e) {
      console.error(e);
      toast.error(e.message || "No pudimos completar tu solicitud.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full bg-white">
      <section
        id="wizard"
        className="scroll-mt-24 overflow-hidden relative h-[60vh] min-h-[420px] bg-gradient-to-r from-emerald-700 to-emerald-500 text-white flex items-center pt-20"
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between p-10">
          {/* Texto */}
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight drop-shadow">
              {conf.title}
            </h1>
            <p className="mt-4 text-base md:text-lg opacity-90">
              {conf.heroText}
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("wizard")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="mt-6 inline-flex items-center rounded-lg bg-white text-[rgb(34,128,62)] px-6 py-3 text-sm md:text-base font-semibold shadow hover:shadow-lg hover:bg-gray-100 transition"
            >
              Quiero cotizar
            </button>
          </div>

          {/* Imagen */}
          <div className="mt-8 md:mt-0 md:ml-10 flex-shrink-0 w-full md:w-1/2">
            <img
              src={conf.heroImage}
              alt="Seguro"
              className="w-full max-h-[320px] object-contain"
            />
          </div>
        </div>
      </section>

      {/* WIZARD */}
      <section id="wizard" className="max-w-6xl mx-auto p-6 md:p-10">
        <Stepper step={step} />

        {step === 1 && (
          <div className="text-black mt-6 rounded-xl border border-neutral-200 bg-white p-4 md:p-6">
            {slug === "vehiculo" && (
              <VehiculoStep vehiculo={vehiculo} setVehiculo={setVehiculo} />
            )}
            {slug === "medico" && (
              <MedicoStep medico={medico} setMedico={setMedico} />
            )}
            {slug === "propiedad" && (
              <PropiedadStep
                propiedad={propiedad}
                setPropiedad={setPropiedad}
              />
            )}

            {slug === "viaje" && (
              <ViajeStep viaje={viaje} setViaje={setViaje} />
            )}
            {slug === "asistencia" && (
              <RepatriacionStep
                asistencia={asistencia}
                setAsistencia={setAsistencia}
              />
            )}

            {slug === "vida" && <VidaStep vida={vida} setVida={setVida} />}

            <div className="mt-6 flex items-center justify-end">
              <button
                onClick={next}
                className="inline-flex items-center rounded-lg bg-[rgb(34,128,62)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Siguiente <IconChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-black mt-6 rounded-xl border border-neutral-200 bg-white p-4 md:p-6">
            <h3 className="mb-4 text-base font-semibold text-neutral-800">
              Datos de contacto
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field
                label="Nombre *"
                value={personal.nombre}
                onChange={(v) => setPersonal((p) => ({ ...p, nombre: v }))}
                placeholder="Tu nombre completo"
              />
              <Field
                label="Teléfono *"
                value={personal.telefono}
                onChange={(v) => setPersonal((p) => ({ ...p, telefono: v }))}
                placeholder="+504 9xxx-xxxx"
                maxLength={8}
              />
              <Field
                label="Email *"
                value={personal.email}
                onChange={(v) => setPersonal((p) => ({ ...p, email: v }))}
                placeholder="tu@correo.com"
              />
              <Field
                label="DNI / Identidad *"
                value={personal.dni}
                onChange={(v) => setPersonal((p) => ({ ...p, dni: v }))}
                placeholder="0801xxxxxxxx"
                maxLength={13}
              />

              {/* DOB: si es vida/medico, se muestra readonly; si no, input date */}
              {slug === "medico" || slug === "vida" ? (
                <ReadOnly
                  label="Fecha de nacimiento"
                  value={personal.birthDate || "—"}
                />
              ) : (
                <Field
                  label="Fecha de nacimiento *"
                  type="date"
                  value={personal.birthDate}
                  onChange={(v) => setPersonal((p) => ({ ...p, birthDate: v }))}
                  placeholder="YYYY-MM-DD"
                />
              )}
              <div className="hidden md:block" />
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs text-neutral-500">Canal preferido</p>
              <div className="flex flex-wrap gap-2">
                {channelChips.map(({ key, label, Icon, color }) => {
                  const active = personal.canal === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPersonal((p) => ({ ...p, canal: key }))}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm border transition
                        ${active ? "text-white" : "text-neutral-700"}
                        ${
                          active
                            ? color
                            : "bg-white border-neutral-200 hover:bg-neutral-50"
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={back}
                className="inline-flex items-center rounded-lg border border-neutral-200 px-4 py-2 text-sm hover:bg-neutral-100"
              >
                <IconChevronLeft className="mr-1 h-4 w-4" />
                Atrás
              </button>
              <button
                onClick={next}
                className="inline-flex items-center rounded-lg bg-[rgb(34,128,62)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Siguiente <IconChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-black mt-6 rounded-xl border border-neutral-200 bg-white p-4 md:p-6">
            <h3 className="mb-4 text-base font-semibold text-neutral-800">
              Resumen
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {slug === "vehiculo" && (
                <>
                  <ReadOnly label="Marca" value={vehiculo.marca} />
                  <ReadOnly label="Modelo" value={vehiculo.modelo} />
                  <ReadOnly label="Tipo" value={vehiculo.tipo} />
                  <ReadOnly label="Año" value={vehiculo.anio} />
                  <ReadOnly label="Uso" value={vehiculo.uso} />
                  <ReadOnly label="Estado" value={vehiculo.estado} />
                  <ReadOnly label="Valor (L)" value={vehiculo.valor} />
                </>
              )}
              {slug === "medico" && (
                <>
                  <ReadOnly
                    label="Nacimiento"
                    value={`${medico.dia}/${medico.mes}/${medico.anio}`}
                  />
                  <ReadOnly label="Género" value={medico.genero} />
                  <ReadOnly
                    label="¿Asegurar pareja?"
                    value={medico.parejaAsegurar}
                  />
                  {medico.parejaAsegurar === "Si" && (
                    <>
                      <ReadOnly
                        label="Nacimiento pareja"
                        value={`${medico.parejaDia}/${medico.parejaMes}/${medico.parejaAnio}`}
                      />
                      <ReadOnly
                        label="Género pareja"
                        value={medico.parejaGenero}
                      />
                      <ReadOnly
                        label="¿Tienen hijos?"
                        value={medico.tieneHijos}
                      />
                      {medico.tieneHijos === "Si" && (
                        <ReadOnly
                          label="Cantidad de hijos"
                          value={medico.hijosCantidad}
                        />
                      )}
                    </>
                  )}
                </>
              )}
              {slug === "propiedad" && (
                <>
                  <ReadOnly label="Tipo de propiedad" value={propiedad.tipo} />
                  <ReadOnly
                    label="Departamento"
                    value={propiedad.departamento}
                  />
                  <ReadOnly label="Ciudad" value={propiedad.ciudad} />
                  <ReadOnly label="Dirección" value={propiedad.direccion} />
                  <ReadOnly
                    label="Material"
                    value={
                      propiedad.material === "Otro" && propiedad.materialOtro
                        ? `Otro (${propiedad.materialOtro})`
                        : propiedad.material
                    }
                  />
                  <ReadOnly label="Uso" value={propiedad.uso} />
                  <ReadOnly
                    label="Valor propiedad (L)"
                    value={propiedad.valorPropiedad}
                  />
                  <ReadOnly
                    label="Valor menaje (L)"
                    value={propiedad.valorMenaje}
                  />
                </>
              )}

              {slug === "viaje" && (
                <>
                  <ReadOnly
                    label="Destinos"
                    value={
                      (viaje.destinos?.length
                        ? viaje.destinos.map((d) => d.name).join(", ")
                        : viaje.destino) || "—"
                    }
                  />
                  <ReadOnly label="Salida" value={viaje.salida} />
                  <ReadOnly label="Regreso" value={viaje.regreso} />
                  <ReadOnly label="Personas" value={String(viaje.personas)} />
                  <ReadOnly label="Tipo de viaje" value={viaje.tipo} />
                </>
              )}

              {slug === "asistencia" && (
                <>
                  <ReadOnly
                    label="Nombre del migrante"
                    value={asistencia.nombre}
                  />
                  <ReadOnly
                    label="País de residencia"
                    value={
                      COUNTRY_MAP[(asistencia.pais || "").toUpperCase()] ||
                      asistencia.pais ||
                      "—"
                    }
                  />
                  <ReadOnly
                    label="Identificación"
                    value={asistencia.identificacion}
                  />
                  <ReadOnly label="Dirección" value={asistencia.direccion} />
                  <ReadOnly label="Teléfono" value={asistencia.telefono} />
                  <ReadOnly label="Ocupación" value={asistencia.ocupacion} />
                  <ReadOnly
                    label="Contacto en Honduras"
                    value={asistencia.contactoHonduras}
                  />
                </>
              )}

              {slug === "vida" && (
                <>
                  <ReadOnly
                    label="Nacimiento"
                    value={`${vida.dia}/${vida.mes}/${vida.anio}`}
                  />
                  <ReadOnly label="Género" value={vida.genero} />
                  <ReadOnly
                    label="Suma asegurada (L)"
                    value={vida.valorAsegurar}
                  />
                  <ReadOnly
                    label="Profesión"
                    value={
                      vida.profesion === "Otro" && vida.profesionOtro
                        ? `Otro (${vida.profesionOtro})`
                        : vida.profesion
                    }
                  />
                </>
              )}

              <ReadOnly label="Nombre" value={personal.nombre} />
              <ReadOnly label="Teléfono" value={personal.telefono} />
              <ReadOnly label="Email" value={personal.email} />
              <ReadOnly label="Canal" value={personal.canal} />
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={back}
                className="inline-flex items-center rounded-lg border border-neutral-200 px-4 py-2 text-sm hover:bg-neutral-100"
              >
                <IconChevronLeft className="mr-1 h-4 w-4" />
                Atrás
              </button>
              <button
                onClick={submitQuote}
                disabled={submitting}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-90 ${
                  submitting ? "opacity-60 cursor-not-allowed" : ""
                }`}
                style={{ backgroundColor: BRAND }}
              >
                <IconSend className="h-4 w-4" />
                {submitting ? "Enviando…" : "Enviar solicitud"}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Apple Cards style */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-neutral-900 text-lg font-semibold mb-4">
            Planes relacionados
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {conf.variants.map((v, i) => (
              <a
                key={i}
                href={v.href}
                className="group relative h-64 w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50"
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${v.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(0.9)",
                  }}
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/30 transition-colors" />
                <div className="relative z-10 h-full p-4 flex flex-col justify-end text-white">
                  <div className="transform-gpu transition duration-300 group-hover:-translate-y-1">
                    <p className="text-xs opacity-80">{v.subtitle}</p>
                    <h4 className="text-lg font-semibold">{v.title}</h4>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={() => navigate("/contacto")}
              className="inline-flex items-center rounded-md bg-[rgb(34,128,62)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Solicitar información
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ====== Subcomponentes Paso 1 ====== */

function VehiculoStep({ vehiculo, setVehiculo }) {
  const modelosDeMarca = VEHICULO_MODELOS[vehiculo.marca] || [];

  return (
    <>
      {/* Marca */}
      <h3 className="mb-4 text-center text-lg font-semibold text-cyan-800">
        Indica la marca de tu vehículo
      </h3>
      <div className="mx-auto max-w-xl">
        <input
          placeholder="Ingresa la marca de tu vehículo"
          value={vehiculo.marca}
          onChange={(e) =>
            setVehiculo((v) => ({ ...v, marca: e.target.value, modelo: "" }))
          }
          className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[rgba(34,128,62,0.25)]"
        />
        <p className="mt-4 text-center text-sm text-neutral-500">
          O selecciona una de las más cotizadas
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {VEHICULO_MARCAS.map(({ label, logo }) => (
            <button
              key={label}
              onClick={() =>
                setVehiculo((v) => ({ ...v, marca: label, modelo: "" }))
              }
              className={`flex flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-sm font-medium shadow-sm hover:shadow
                ${
                  vehiculo.marca === label
                    ? "border-cyan-600 bg-cyan-50 text-cyan-700"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
            >
              <img src={logo} alt={label} className="h-10 object-contain" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Modelo / Año */}
      <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {modelosDeMarca.length > 0 ? (
          <Select
            label="Modelo *"
            value={vehiculo.modelo}
            onChange={(v) => setVehiculo((x) => ({ ...x, modelo: v }))}
            options={modelosDeMarca}
          />
        ) : (
          <Field
            label="Modelo *"
            value={vehiculo.modelo}
            onChange={(v) => setVehiculo((x) => ({ ...x, modelo: v }))}
            placeholder="Ej. Corolla, Civic, Ranger…"
          />
        )}
        <Select
          label="Año *"
          value={vehiculo.anio}
          onChange={(v) => setVehiculo((x) => ({ ...x, anio: v }))}
          options={VEHICULO_YEARS}
        />
      </div>

      {/* Tipo */}
      <h3 className="mt-8 mb-4 text-center text-lg font-semibold text-cyan-800">
        ¿Qué tipo de vehículo es?
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {VEHICULO_TIPOS.map(({ key, label, Icon }) => {
          const active = vehiculo.tipo === key;
          return (
            <button
              key={key}
              onClick={() => setVehiculo((v) => ({ ...v, tipo: key }))}
              className={`flex flex-col items-center rounded-3xl border p-6 text-center shadow-sm hover:shadow
                ${
                  active
                    ? "border-cyan-600 bg-cyan-50 text-cyan-700"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
            >
              <Icon className="mb-2 h-10 w-10" />
              <span className="font-semibold">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Uso / Estado / Valor */}
      <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        <Select
          label="Uso"
          value={vehiculo.uso}
          onChange={(v) => setVehiculo((x) => ({ ...x, uso: v }))}
          options={VEHICULO_USO}
        />
        <Select
          label="Estado"
          value={vehiculo.estado}
          onChange={(v) => setVehiculo((x) => ({ ...x, estado: v }))}
          options={VEHICULO_ESTADO}
        />
        <Field
          label="Valor estimado (L)"
          type="number"
          value={vehiculo.valor}
          onChange={(v) => setVehiculo((x) => ({ ...x, valor: v }))}
          placeholder="Ej. 450000"
        />
      </div>
    </>
  );
}

/* helpers de animación ---------- */
function Collapse({ show, children }) {
  return (
    <div
      className={`grid transition-all duration-300 ease-out ${
        show ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div
        className={`overflow-hidden transform transition-all duration-300 ease-out ${
          show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function TogglePill({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-28 rounded-3xl border p-4 text-center text-sm font-semibold shadow-sm hover:shadow transition
        ${
          active
            ? "border-cyan-600 bg-cyan-50 text-cyan-700"
            : "border-neutral-200 bg-white text-neutral-700"
        }`}
    >
      {children}
    </button>
  );
}
/* ------------------------------------------------ */

function MedicoStep({ medico, setMedico }) {
  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const years = Array.from({ length: 90 }, (_, i) =>
    String(new Date().getFullYear() - i)
  );

  const set = (patch) => setMedico((m) => ({ ...m, ...patch }));

  return (
    <>
      {/* Titular: fecha */}
      <h3 className="mb-6 text-center text-lg font-semibold text-cyan-800">
        ¿Cuándo naciste?
      </h3>
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        <Select
          label="Día"
          value={medico.dia}
          onChange={(v) => set({ dia: v })}
          options={days}
        />
        <Select
          label="Mes"
          value={medico.mes}
          onChange={(v) => set({ mes: v })}
          options={months}
        />
        <Select
          label="Año"
          value={medico.anio}
          onChange={(v) => set({ anio: v })}
          options={years}
        />
      </div>

      {/* Titular: género */}
      <h3 className="mt-10 mb-4 text-center text-lg font-semibold text-cyan-800">
        ¿Cuál es tu género?
      </h3>
      <div className="flex flex-wrap justify-center gap-4">
        {["Femenino", "Masculino"].map((g) => (
          <TogglePill
            key={g}
            active={medico.genero === g}
            onClick={() => set({ genero: g })}
          >
            {g}
          </TogglePill>
        ))}
      </div>

      {/* Pareja: ¿asegurar? */}
      <h3 className="mt-10 mb-4 text-center text-lg font-semibold text-cyan-800">
        ¿Tienes pareja y quieres asegurarlo?
      </h3>
      <div className="flex flex-wrap justify-center gap-4">
        {["Si", "No"].map((opt) => (
          <TogglePill
            key={opt}
            active={medico.parejaAsegurar === opt}
            onClick={() =>
              set({
                parejaAsegurar: opt,
                ...(opt === "No"
                  ? {
                      parejaDia: "",
                      parejaMes: "",
                      parejaAnio: "",
                      parejaGenero: "",
                      tieneHijos: "",
                      hijosCantidad: "",
                    }
                  : {}),
              })
            }
          >
            {opt}
          </TogglePill>
        ))}
      </div>

      {/* Bloque condicional para pareja */}
      <Collapse show={medico.parejaAsegurar === "Si"}>
        {/* Pareja: fecha */}
        <h3 className="mt-8 mb-4 text-center text-lg font-semibold text-cyan-800">
          ¿Cuándo nació tu pareja?
        </h3>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            label="Día"
            value={medico.parejaDia}
            onChange={(v) => set({ parejaDia: v })}
            options={days}
          />
          <Select
            label="Mes"
            value={medico.parejaMes}
            onChange={(v) => set({ parejaMes: v })}
            options={months}
          />
          <Select
            label="Año"
            value={medico.parejaAnio}
            onChange={(v) => set({ parejaAnio: v })}
            options={years}
          />
        </div>

        {/* Pareja: género */}
        <h3 className="mt-8 mb-4 text-center text-lg font-semibold text-cyan-800">
          ¿Cuál es el género de tu pareja?
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {["Femenino", "Masculino"].map((g) => (
            <TogglePill
              key={g}
              active={medico.parejaGenero === g}
              onClick={() => set({ parejaGenero: g })}
            >
              {g}
            </TogglePill>
          ))}
        </div>

        {/* Hijos: ¿tienen? */}
        <h3 className="mt-8 mb-4 text-center text-lg font-semibold text-cyan-800">
          ¿Tienes hijos?
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {["Si", "No"].map((opt) => (
            <TogglePill
              key={opt}
              active={medico.tieneHijos === opt}
              onClick={() =>
                set({
                  tieneHijos: opt,
                  ...(opt === "No" ? { hijosCantidad: "" } : {}),
                })
              }
            >
              {opt}
            </TogglePill>
          ))}
        </div>

        {/* Número de hijos */}
        <Collapse show={medico.tieneHijos === "Si"}>
          <h3 className="mt-8 mb-3 text-center text-lg font-semibold text-cyan-800">
            ¿Cuántos hijos tienes?
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {["1", "2", "3", "4", "5", "+"].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => {
                  if (n === "+") {
                    const v = window.prompt(
                      "¿Cuántos hijos tienes?",
                      medico.hijosCantidad || "6"
                    );
                    if (v && /^\d+$/.test(v)) set({ hijosCantidad: String(v) });
                  } else {
                    set({ hijosCantidad: n });
                  }
                }}
                className={`rounded-full px-4 py-2 text-sm border transition
                  ${
                    medico.hijosCantidad === n
                      ? "bg-cyan-600 text-white border-cyan-600"
                      : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                  }`}
              >
                {n}
              </button>
            ))}
          </div>
        </Collapse>
      </Collapse>
    </>
  );
}

function PropiedadStep({ propiedad, setPropiedad }) {
  const set = (patch) => setPropiedad((p) => ({ ...p, ...patch }));

  return (
    <>
      {/* Tipo de propiedad */}
      <h3 className="mb-4 text-center text-lg font-semibold text-cyan-800">
        ¿Qué tipo de propiedad deseas asegurar?
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {PROPIEDAD_TIPOS.map(({ key, label, Icon }) => {
          const active = propiedad.tipo === key;
          return (
            <button
              key={key}
              onClick={() => set({ tipo: key })}
              className={`flex flex-col items-center rounded-3xl border p-6 text-center shadow-sm hover:shadow
                ${
                  active
                    ? "border-cyan-600 bg-cyan-50 text-cyan-700"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
            >
              <Icon className="mb-2 h-10 w-10" />
              <span className="font-semibold">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Departamento / Ciudad */}
      <h3 className="mt-8 mb-3 text-center text-lg font-semibold text-cyan-800">
        ¿Departamento de tu propiedad?
      </h3>
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Departamento"
          value={propiedad.departamento}
          onChange={(v) => set({ departamento: v })}
          options={[
            {
              value: "",
              label: "Selecciona departamento",
              disabled: true,
              hidden: false,
            },
            ...HN_DEPARTAMENTOS.map((d) => ({ value: d, label: d })),
          ]}
        />
        <Field
          label="Ciudad de tu propiedad"
          value={propiedad.ciudad}
          onChange={(v) => set({ ciudad: v })}
          placeholder="Ingresa la ciudad"
        />
      </div>

      {/* Dirección exacta */}
      <div className="mx-auto mt-4 max-w-3xl">
        <label className="block">
          <span className="mb-1 block text-xs text-neutral-500">
            ¿Cuál es la dirección?
          </span>
          <textarea
            rows={3}
            value={propiedad.direccion}
            onChange={(e) => set({ direccion: e.target.value })}
            placeholder="Ingresa la dirección exacta"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(34,128,62,0.25)]"
          />
        </label>
      </div>

      {/* Material de construcción */}
      <h3 className="mt-8 mb-3 text-center text-lg font-semibold text-cyan-800">
        ¿Cuál es el material de construcción?
      </h3>
      <div className="flex flex-wrap justify-center gap-4">
        {PROPIEDAD_MATERIALES.map((m) => {
          const active = propiedad.material === m;
          return (
            <button
              key={m}
              type="button"
              onClick={() =>
                set({
                  material: m,
                  materialOtro: m === "Otro" ? propiedad.materialOtro : "",
                })
              }
              className={`w-32 rounded-3xl border p-4 text-center text-sm font-semibold shadow-sm hover:shadow transition
                ${
                  active
                    ? "border-cyan-600 bg-cyan-50 text-cyan-700"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
            >
              {m}
            </button>
          );
        })}
      </div>
      <Collapse show={propiedad.material === "Otro"}>
        <div className="mx-auto mt-3 max-w-3xl">
          <Field
            label="Especifique el material"
            value={propiedad.materialOtro}
            onChange={(v) => set({ materialOtro: v })}
            placeholder="Ej. Adobe, Mixto, Prefabricado..."
          />
        </div>
      </Collapse>

      {/* Uso de la propiedad */}
      <h3 className="mt-8 mb-3 text-center text-lg font-semibold text-cyan-800">
        ¿Para qué usas tu propiedad?
      </h3>
      <div className="flex flex-wrap justify-center gap-4">
        {PROPIEDAD_USOS.map((u) => {
          const active = propiedad.uso === u;
          return (
            <button
              key={u}
              type="button"
              onClick={() => set({ uso: u })}
              className={`w-40 rounded-3xl border p-4 text-center text-sm font-semibold shadow-sm hover:shadow transition
                ${
                  active
                    ? "border-cyan-600 bg-cyan-50 text-cyan-700"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
            >
              {u}
            </button>
          );
        })}
      </div>

      {/* Valores en Lempiras */}
      <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="¿Cuál es el valor de tu propiedad? (L)"
          type="number"
          value={propiedad.valorPropiedad}
          onChange={(v) => set({ valorPropiedad: v })}
          placeholder="L.000.00"
        />
        <Field
          label="¿Cuál es el valor de tu menaje? (L)"
          type="number"
          value={propiedad.valorMenaje}
          onChange={(v) => set({ valorMenaje: v })}
          placeholder="L.000.00"
        />
      </div>
    </>
  );
}

function ViajeStep({ viaje, setViaje }) {
  const set = (patch) => setViaje((v) => ({ ...v, ...patch }));

  return (
    <>
      {/* Destinos (multi) */}
      <div className="mx-auto max-w-3xl">
        <CountryMultiSelect
          value={viaje.destinos}
          onChange={(arr) => set({ destinos: arr })}
        />
      </div>

      {/* Fechas */}
      <h3 className="mt-10 mb-3 text-center text-lg font-semibold text-cyan-800">
        Fecha de tu viaje
      </h3>
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Salida"
          type="date"
          value={viaje.salida}
          onChange={(v) => set({ salida: v })}
          placeholder=""
        />
        <Field
          label="Regreso"
          type="date"
          value={viaje.regreso}
          onChange={(v) => set({ regreso: v })}
          placeholder=""
        />
      </div>

      {/* Personas viajeras */}
      <h3 className="mt-8 mb-3 text-center text-lg font-semibold text-cyan-800">
        Personas viajeras
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        {[1, 2, 3, 4, 5, 6].map((n) => {
          const active = viaje.personas === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => set({ personas: n })}
              className={`w-16 rounded-2xl px-4 py-3 text-sm border shadow-sm hover:shadow transition
                ${
                  active
                    ? "border-cyan-600 bg-cyan-50 text-cyan-700"
                    : "border-neutral-200 bg-white text-neutral-700"
                }`}
            >
              {n}
            </button>
          );
        })}
      </div>

      {/* Tipo de viaje */}
      <h3 className="mt-8 mb-3 text-center text-lg font-semibold text-cyan-800">
        Tipo de viaje
      </h3>
      <div className="flex flex-wrap justify-center gap-4">
        {VIAJE_TIPOS.map(({ key, label, Icon }) => {
          const active = viaje.tipo === key;
          return (
            <button
              key={key}
              onClick={() => set({ tipo: key })}
              className={`flex flex-col items-center rounded-3xl border p-6 text-center shadow-sm hover:shadow transition
          ${
            active
              ? "border-cyan-600 bg-cyan-50 text-cyan-700"
              : "border-neutral-200 bg-white text-neutral-700"
          }`}
            >
              <Icon className="mb-2 h-10 w-10" />
              <span className="font-semibold">{label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function RepatriacionStep({ asistencia, setAsistencia }) {
  const set = (patch) => setAsistencia((v) => ({ ...v, ...patch }));

  return (
    <>
      <h3 className="mb-2 text-center text-lg font-semibold text-cyan-800">
        Datos de tu ser querido en el extranjero
      </h3>
      <p className="mb-6 text-center text-sm text-neutral-600">
        Completa la información del hondureño migrante para preparar la
        asistencia y repatriación.
      </p>

      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field
            label="Nombre completo del hondureño migrante *"
            value={asistencia.nombre}
            onChange={(v) => set({ nombre: v })}
            placeholder="Ej. María Fernanda López"
          />
        </div>

        <div className="sm:col-span-2">
          <CountrySelect
            label="País de residencia *"
            value={asistencia.pais}
            onChange={(v) => set({ pais: v })}
          />
        </div>

        <Field
          label="Número de identificación *"
          value={asistencia.identificacion}
          onChange={(v) => set({ identificacion: v })}
          placeholder="Documento local / pasaporte"
        />
        <Field
          label="Teléfono *"
          type="tel"
          inputMode="tel"
          value={asistencia.telefono}
          onChange={(v) => set({ telefono: v.replace(/\D/g, "") })}
          placeholder="Ej. 98765432"
          maxLength={15}
        />

        <div className="sm:col-span-2">
          <Field
            label="Dirección *"
            value={asistencia.direccion}
            onChange={(v) => set({ direccion: v })}
            placeholder="Calle, número, ciudad, código postal"
          />
        </div>

        <Field
          label="Ocupación *"
          value={asistencia.ocupacion}
          onChange={(v) => set({ ocupacion: v })}
          placeholder="Ej. Construcción, Servicios, Estudiante…"
        />
        <Field
          label="Contacto en Honduras *"
          value={asistencia.contactoHonduras}
          onChange={(v) => set({ contactoHonduras: v })}
          placeholder="Nombre y teléfono del contacto"
        />
      </div>
    </>
  );
}

function VidaStep({ vida, setVida }) {
  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const years = Array.from({ length: 90 }, (_, i) =>
    String(new Date().getFullYear() - i)
  );

  const set = (patch) => setVida((v) => ({ ...v, ...patch }));

  return (
    <>
      {/* Fecha de nacimiento */}
      <h3 className="mb-6 text-center text-lg font-semibold text-cyan-800">
        ¿Cuándo naciste?
      </h3>
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        <Select
          label="Día"
          value={vida.dia}
          onChange={(v) => set({ dia: v })}
          options={days}
        />
        <Select
          label="Mes"
          value={vida.mes}
          onChange={(v) => set({ mes: v })}
          options={months}
        />
        <Select
          label="Año"
          value={vida.anio}
          onChange={(v) => set({ anio: v })}
          options={years}
        />
      </div>

      {/* Género */}
      <h3 className="mt-10 mb-4 text-center text-lg font-semibold text-cyan-800">
        ¿Cuál es tu género?
      </h3>
      <div className="flex flex-wrap justify-center gap-4">
        {["Femenino", "Masculino"].map((g) => (
          <TogglePill
            key={g}
            active={vida.genero === g}
            onClick={() => set({ genero: g })}
          >
            {g}
          </TogglePill>
        ))}
      </div>

      {/* Suma a asegurar */}
      <h3 className="mt-10 mb-2 text-center text-lg font-semibold text-cyan-800">
        ¿Cuál es la suma que te gustaría asegurar?
      </h3>
      <div className="mx-auto max-w-md">
        <Field
          label="Suma asegurada (L)"
          type="number"
          value={vida.valorAsegurar}
          onChange={(v) => set({ valorAsegurar: v })}
          placeholder="L 2,000,000"
        />
      </div>

      {/* Profesión / Ocupación */}
      <h3 className="mt-10 mb-4 text-center text-lg font-semibold text-cyan-800">
        ¿A qué te dedicas?
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 justify-center">
        {VIDA_PROFESIONES.map(({ key, label, Icon }) => {
          const active = vida.profesion === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() =>
                setVida((v) => ({
                  ...v,
                  profesion: key,
                  profesionOtro: key === "Otro" ? v.profesionOtro : "",
                }))
              }
              className={`flex flex-col items-center rounded-3xl border p-6 text-center shadow-sm hover:shadow transition
          ${
            active
              ? "border-cyan-600 bg-cyan-50 text-cyan-700"
              : "border-neutral-200 bg-white text-neutral-700"
          }`}
            >
              <Icon className="mb-2 h-10 w-10" />
              <span className="font-semibold">{label}</span>
            </button>
          );
        })}
      </div>

      <Collapse show={vida.profesion === "Otro"}>
        <div className="mx-auto mt-3 max-w-3xl">
          <Field
            label="Especifica tu ocupación"
            value={vida.profesionOtro}
            onChange={(v) => setVida((p) => ({ ...p, profesionOtro: v }))}
            placeholder="Ej. Piloto de drones, Buceo profesional…"
          />
        </div>
      </Collapse>
    </>
  );
}

/* ===== Utilidades UI ===== */
function Stepper({ step }) {
  const items = [
    { n: 1, label: "Seguro" },
    { n: 2, label: "Personal" },
    { n: 3, label: "Resultado" },
  ];

  return (
    <div
      className="w-full overflow-x-auto px-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      aria-label="Progreso de cotización"
    >
      <div className="mx-auto flex items-center justify-between gap-3 sm:gap-6 min-w-[320px]">
        {items.map((it, idx) => {
          const active = step >= it.n;
          const current = step === it.n;

          return (
            <div
              key={it.n}
              className="flex items-center gap-2 sm:gap-3 shrink-0"
            >
              {/* círculo */}
              <span
                className={[
                  "flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full text-xs sm:text-sm font-bold",
                  current
                    ? "bg-cyan-700 text-white"
                    : active
                    ? "bg-cyan-600 text-white"
                    : "bg-cyan-100 text-cyan-700",
                ].join(" ")}
                aria-current={current ? "step" : undefined}
              >
                {it.n}
              </span>

              {/* label (solo en sm+) */}
              <span
                className={[
                  "hidden sm:inline text-sm font-semibold",
                  active ? "text-cyan-700" : "text-neutral-500",
                ].join(" ")}
              >
                {it.label}
              </span>

              {/* conector */}
              {idx < items.length - 1 && (
                <span
                  className={[
                    "mx-1 sm:mx-2 h-px w-10 sm:w-24 block",
                    active && step > it.n ? "bg-cyan-600" : "bg-neutral-200",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-neutral-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(34,128,62,0.25)]"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-neutral-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[rgba(34,128,62,0.25)]"
      >
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <option
              key={opt.label}
              value={opt.value}
              disabled={opt.disabled}
              hidden={opt.hidden}
            >
              {opt.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}

function ReadOnly({ label, value }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="text-sm font-medium text-neutral-800">{value || "—"}</p>
    </div>
  );
}
