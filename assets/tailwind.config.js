/* ============================================================
   AJA FOOTBALL — Design system (issu de l'export Stitch)
   Ce fichier centralise les couleurs, espacements et polices.
   Modifie une valeur ici et TOUTES les pages du site suivent.
   ============================================================ */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-tertiary-fixed": "#1a1c1c",
        "primary-fixed": "#ffe16d",
        "on-tertiary-container": "#5e5f5f",
        "outline": "#7e775f",
        "on-tertiary": "#ffffff",
        "primary-container": "#ffd700",
        "on-secondary-fixed": "#1c1b1b",
        "tertiary-fixed-dim": "#c6c6c7",
        "on-secondary": "#ffffff",
        "surface-bright": "#fbf9f8",
        "tertiary": "#5d5f5f",
        "secondary-fixed": "#e5e2e1",
        "tertiary-container": "#dadada",
        "on-error-container": "#93000a",
        "surface-container-low": "#f5f3f3",
        "secondary-container": "#e5e2e1",
        "on-primary-fixed": "#221b00",
        "on-surface-variant": "#4d4732",
        "surface-tint": "#705d00",
        "error-container": "#ffdad6",
        "surface-variant": "#e4e2e2",
        "on-surface": "#1b1c1c",
        "on-secondary-container": "#656464",
        "surface": "#fbf9f8",
        "secondary": "#5f5e5e",
        "inverse-primary": "#e9c400",
        "on-primary": "#ffffff",
        "surface-container": "#efeded",
        "surface-container-highest": "#e4e2e2",
        "on-error": "#ffffff",
        "inverse-surface": "#303031",
        "background": "#fbf9f8",
        "error": "#ba1a1a",
        "success": "#2e7d32",
        "surface-container-lowest": "#ffffff",
        "on-primary-fixed-variant": "#544600",
        "on-tertiary-fixed-variant": "#454747",
        "on-primary-container": "#705e00",
        "tertiary-fixed": "#e2e2e2",
        "primary": "#705d00",
        "secondary-fixed-dim": "#c8c6c5",
        "inverse-on-surface": "#f2f0f0",
        "surface-container-high": "#e9e8e7",
        "on-secondary-fixed-variant": "#474646",
        "on-background": "#1b1c1c",
        "outline-variant": "#d0c6ab",
        "surface-dim": "#dbdad9",
        "primary-fixed-dim": "#e9c400"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        xs: "4px",
        base: "8px",
        sm: "12px",
        "margin-mobile": "16px",
        md: "24px",
        gutter: "24px",
        lg: "48px",
        "margin-desktop": "64px",
        xl: "80px"
      },
      fontFamily: {
        "headline-md": ["Hanken Grotesk"],
        "headline-xl": ["Hanken Grotesk"],
        "headline-lg": ["Hanken Grotesk"],
        "label-bold": ["Hanken Grotesk"],
        "label-sm": ["Hanken Grotesk"],
        "body-md": ["Hanken Grotesk"],
        "body-lg": ["Hanken Grotesk"]
      },
      fontSize: {
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "headline-xl": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "label-bold": ["14px", { lineHeight: "20px", fontWeight: "700" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }]
      }
    }
  }
};
