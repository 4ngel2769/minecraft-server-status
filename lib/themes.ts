export interface Theme {
  id: string;
  name: string;
  variant: 'light' | 'dark';
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    accent: string;
    accentForeground: string;
    muted: string;
    mutedForeground: string;
    border: string;
    input: string;
    ring: string;
  };
  gradients?: {
    background: string;
  };
  font?: string;
}

export const themes: Theme[] = [
  // Cherry Theme
  {
    id: 'cherry-dark',
    name: 'Cherry',
    variant: 'dark',
    colors: {
      background: '0 0% 10%',
      foreground: '0 0% 95%',
      card: '350 50% 15%',
      cardForeground: '0 0% 95%',
      primary: '350 70% 60%',
      primaryForeground: '0 0% 100%',
      secondary: '350 40% 25%',
      secondaryForeground: '0 0% 95%',
      accent: '350 60% 50%',
      accentForeground: '0 0% 100%',
      muted: '350 30% 20%',
      mutedForeground: '0 0% 70%',
      border: '350 40% 25%',
      input: '350 40% 25%',
      ring: '350 70% 60%',
    },
    gradients: {
      background: 'linear-gradient(135deg, hsl(350, 50%, 15%) 0%, hsl(340, 40%, 10%) 50%, hsl(330, 30%, 8%) 100%)',
    },
  },
  {
    id: 'cherry-light',
    name: 'Cherry',
    variant: 'light',
    colors: {
      background: '0 0% 100%',
      foreground: '0 0% 10%',
      card: '350 60% 95%',
      cardForeground: '0 0% 10%',
      primary: '350 70% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '350 40% 85%',
      secondaryForeground: '0 0% 10%',
      accent: '350 60% 60%',
      accentForeground: '0 0% 100%',
      muted: '350 30% 90%',
      mutedForeground: '0 0% 40%',
      border: '350 30% 85%',
      input: '350 30% 85%',
      ring: '350 70% 50%',
    },
    gradients: {
      background: 'linear-gradient(135deg, hsl(350, 60%, 95%) 0%, hsl(340, 50%, 90%) 50%, hsl(330, 40%, 85%) 100%)',
    },
  },

  // Forest Theme
  {
    id: 'forest-dark',
    name: 'Forest',
    variant: 'dark',
    colors: {
      background: '120 15% 10%',
      foreground: '120 5% 95%',
      card: '130 25% 15%',
      cardForeground: '120 5% 95%',
      primary: '140 60% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '130 30% 25%',
      secondaryForeground: '120 5% 95%',
      accent: '140 50% 45%',
      accentForeground: '0 0% 100%',
      muted: '130 20% 20%',
      mutedForeground: '120 5% 70%',
      border: '130 25% 25%',
      input: '130 25% 25%',
      ring: '140 60% 50%',
    },
    gradients: {
      background: 'linear-gradient(135deg, hsl(130, 25%, 15%) 0%, hsl(140, 20%, 10%) 50%, hsl(150, 15%, 8%) 100%)',
    },
  },
  {
    id: 'forest-light',
    name: 'Forest',
    variant: 'light',
    colors: {
      background: '120 20% 98%',
      foreground: '120 10% 10%',
      card: '130 40% 95%',
      cardForeground: '120 10% 10%',
      primary: '140 60% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '130 30% 85%',
      secondaryForeground: '120 10% 10%',
      accent: '140 50% 50%',
      accentForeground: '0 0% 100%',
      muted: '130 25% 90%',
      mutedForeground: '120 10% 40%',
      border: '130 30% 85%',
      input: '130 30% 85%',
      ring: '140 60% 40%',
    },
    gradients: {
      background: 'linear-gradient(135deg, hsl(130, 40%, 95%) 0%, hsl(140, 30%, 90%) 50%, hsl(150, 25%, 85%) 100%)',
    },
  },

  // Solarized Theme
  {
    id: 'solarized-dark',
    name: 'Solarized',
    variant: 'dark',
    colors: {
      background: '192 100% 11%',
      foreground: '44 87% 94%',
      card: '192 81% 14%',
      cardForeground: '44 87% 94%',
      primary: '205 69% 49%',
      primaryForeground: '44 87% 94%',
      secondary: '192 90% 18%',
      secondaryForeground: '44 87% 94%',
      accent: '68 100% 30%',
      accentForeground: '44 87% 94%',
      muted: '192 90% 16%',
      mutedForeground: '186 8% 55%',
      border: '192 90% 18%',
      input: '192 90% 18%',
      ring: '205 69% 49%',
    },
    gradients: {
      background: 'linear-gradient(135deg, hsl(192, 81%, 14%) 0%, hsl(192, 100%, 11%) 50%, hsl(193, 100%, 9%) 100%)',
    },
  },
  {
    id: 'solarized-light',
    name: 'Solarized',
    variant: 'light',
    colors: {
      background: '44 87% 94%',
      foreground: '192 81% 14%',
      card: '44 11% 93%',
      cardForeground: '192 81% 14%',
      primary: '205 69% 49%',
      primaryForeground: '44 87% 94%',
      secondary: '45 7% 89%',
      secondaryForeground: '192 81% 14%',
      accent: '68 100% 30%',
      accentForeground: '44 87% 94%',
      muted: '45 7% 89%',
      mutedForeground: '194 14% 40%',
      border: '45 7% 89%',
      input: '45 7% 89%',
      ring: '205 69% 49%',
    },
    gradients: {
      background: 'linear-gradient(135deg, hsl(44, 11%, 93%) 0%, hsl(44, 87%, 94%) 50%, hsl(45, 20%, 96%) 100%)',
    },
  },

  // Minecraft Theme
  {
    id: 'minecraft-dark',
    name: 'Minecraft',
    variant: 'dark',
    font: 'MinecraftDefault',
    colors: {
      background: '0 0% 12%',
      foreground: '0 0% 95%',
      card: '0 0% 18%',
      cardForeground: '0 0% 95%',
      primary: '142 76% 36%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 25%',
      secondaryForeground: '0 0% 95%',
      accent: '142 76% 45%',
      accentForeground: '0 0% 100%',
      muted: '0 0% 20%',
      mutedForeground: '0 0% 65%',
      border: '0 0% 30%',
      input: '0 0% 25%',
      ring: '142 76% 36%',
    },
    gradients: {
      background: 'linear-gradient(135deg, hsl(0, 0%, 18%) 0%, hsl(0, 0%, 12%) 50%, hsl(0, 0%, 8%) 100%)',
    },
  },
  {
    id: 'minecraft-light',
    name: 'Minecraft',
    variant: 'light',
    font: 'MinecraftDefault',
    colors: {
      background: '0 0% 92%',
      foreground: '0 0% 10%',
      card: '0 0% 98%',
      cardForeground: '0 0% 10%',
      primary: '142 76% 36%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 85%',
      secondaryForeground: '0 0% 10%',
      accent: '142 76% 45%',
      accentForeground: '0 0% 100%',
      muted: '0 0% 88%',
      mutedForeground: '0 0% 40%',
      border: '0 0% 82%',
      input: '0 0% 85%',
      ring: '142 76% 36%',
    },
    gradients: {
      background: 'linear-gradient(135deg, hsl(0, 0%, 98%) 0%, hsl(0, 0%, 92%) 50%, hsl(0, 0%, 88%) 100%)',
    },
  },

  // Default (current) theme
  {
    id: 'default-dark',
    name: 'Default',
    variant: 'dark',
    colors: {
      background: '222.2 84% 4.9%',
      foreground: '210 40% 98%',
      card: '222.2 84% 4.9%',
      cardForeground: '210 40% 98%',
      primary: '217.2 91.2% 59.8%',
      primaryForeground: '222.2 47.4% 11.2%',
      secondary: '217.2 32.6% 17.5%',
      secondaryForeground: '210 40% 98%',
      accent: '217.2 32.6% 17.5%',
      accentForeground: '210 40% 98%',
      muted: '217.2 32.6% 17.5%',
      mutedForeground: '215 20.2% 65.1%',
      border: '217.2 32.6% 17.5%',
      input: '217.2 32.6% 17.5%',
      ring: '224.3 76.3% 48%',
    },
  },
  {
    id: 'default-light',
    name: 'Default',
    variant: 'light',
    colors: {
      background: '0 0% 100%',
      foreground: '222.2 84% 4.9%',
      card: '0 0% 100%',
      cardForeground: '222.2 84% 4.9%',
      primary: '221.2 83.2% 53.3%',
      primaryForeground: '210 40% 98%',
      secondary: '210 40% 96.1%',
      secondaryForeground: '222.2 47.4% 11.2%',
      accent: '210 40% 96.1%',
      accentForeground: '222.2 47.4% 11.2%',
      muted: '210 40% 96.1%',
      mutedForeground: '215.4 16.3% 46.9%',
      border: '214.3 31.8% 91.4%',
      input: '214.3 31.8% 91.4%',
      ring: '221.2 83.2% 53.3%',
    },
  },
];

export function getTheme(themeId: string): Theme | undefined {
  return themes.find((t) => t.id === themeId);
}

export function getThemesByName(name: string): Theme[] {
  return themes.filter((t) => t.name === name);
}
