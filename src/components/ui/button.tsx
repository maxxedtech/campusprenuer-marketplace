@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 210 33% 98%;
    --foreground: 220 44% 14%;
    --card: 0 0% 100%;
    --card-foreground: 220 44% 14%;
    --popover: 0 0% 100%;
    --popover-foreground: 220 44% 14%;
    --primary: 38 91% 54%;
    --primary-foreground: 220 44% 10%;
    --secondary: 220 18% 96%;
    --secondary-foreground: 220 44% 14%;
    --muted: 220 18% 95%;
    --muted-foreground: 220 14% 45%;
    --accent: 38 91% 54%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 220 20% 90%;
    --input: 220 20% 90%;
    --ring: 38 91% 54%;
    --radius: 1rem;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --sidebar-background: 220 44% 21%;
    --sidebar-foreground: 0 0% 100%;
    --sidebar-primary: 38 91% 54%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 220 40% 30%;
    --sidebar-accent-foreground: 0 0% 100%;
    --sidebar-border: 220 40% 30%;
    --sidebar-ring: 38 91% 54%;
  }

  .dark {
    --background: 220 44% 10%;
    --foreground: 0 0% 98%;
    --card: 220 44% 13%;
    --card-foreground: 0 0% 98%;
    --popover: 220 44% 13%;
    --popover-foreground: 0 0% 98%;
    --primary: 38 91% 54%;
    --primary-foreground: 220 44% 10%;
    --secondary: 220 30% 20%;
    --secondary-foreground: 0 0% 98%;
    --muted: 220 30% 18%;
    --muted-foreground: 220 15% 65%;
    --accent: 38 91% 54%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 62% 30%;
    --destructive-foreground: 0 0% 98%;
    --border: 220 30% 20%;
    --input: 220 30% 20%;
    --ring: 38 91% 54%;
    --sidebar-background: 220 44% 8%;
    --sidebar-foreground: 0 0% 98%;
    --sidebar-primary: 38 91% 54%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 220 40% 18%;
    --sidebar-accent-foreground: 0 0% 98%;
    --sidebar-border: 220 40% 18%;
    --sidebar-ring: 38 91% 54%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-body antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-display font-bold;
  }
}

@layer components {
  .card-soft {
    @apply bg-card rounded-2xl shadow-soft border border-border/50 p-6;
  }

  .gradient-hero {
    background: hsl(220 44% 21% / 0.06);
  }

  .gradient-primary {
    background: hsl(220 44% 21%);
  }

  .text-brand-orange {
    color: hsl(38 91% 54%);
  }

  .bg-brand-navy {
    background-color: hsl(220 44% 21%);
  }

  .bg-brand-orange {
    background-color: hsl(38 91% 54%);
  }
}
