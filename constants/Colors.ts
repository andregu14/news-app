const tintColorLight = '#3F3F3F';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconSelected: tintColorLight,
    headerIcon: "#2F2F2F",
    borderColor: '#eee', 
    secondaryText: '#888',
    bodyText: "#555",
    headerBackground: '#f8f8f8',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconSelected: tintColorDark,
    headerIcon: "#fff",
    borderColor: 'rgba(255, 255, 255, 0.2)', 
    secondaryText: 'rgba(255, 255, 255, 0.7)',
    bodyText: "#ddd",
    headerBackground: '#181A20',
  },
};

export type Department =
  | "Tecnologia"
  | "Economia"
  | "Ciência"
  | "Esportes"
  | "Política"
  | "Entretenimento"
  | "Saúde"
  | "Mundo";

type DepartmentColors = {
  [key in Department]: {
    backgroundColor: string;
    textColor: string;
  };
};

export const departmentColors: DepartmentColors = {
   Tecnologia: {
    backgroundColor: "#E3F2FD",
    textColor: "#1565C0",
  },
  Economia: {
    backgroundColor: "#FFF3E0",
    textColor: "#E65100",
  },
  Ciência: {
    backgroundColor: "#E8F5E9",
    textColor: "#2E7D32",
  },
  Esportes: {
   backgroundColor: "#E8F5E9",
    textColor: "#2E7D32",
  },
  Política: {
    backgroundColor: "#FFEBEE",
    textColor: "#C62828",
  },
  Entretenimento: {
    backgroundColor: "#F3E5F5",
    textColor: "#7B1FA2",
  },
  Saúde: {
    backgroundColor: "#FCE4EC",
    textColor: "#C2185B",
  },
  Mundo: {
    backgroundColor: "#E0F2F1",
    textColor: "#00695C",
  },
}
