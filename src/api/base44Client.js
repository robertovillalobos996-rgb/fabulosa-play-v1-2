export const base44 = {
  entities: {
    Advertisement: {
      list: async () => {
        // AquÃ­ podÃ©s meter tus anuncios manualmente para que se vean en la Card
        return [
          {
            id: "1",
            business_name: "FABULOSA AD",
            media_url: "https://tupagina.com/pauta.jpg",
            status: "active"
          }
        ];
      },
      update: async (id, data) => data
    }
  },
  analytics: { track: () => {} } // Esto mata los errores de analÃ­tica
};