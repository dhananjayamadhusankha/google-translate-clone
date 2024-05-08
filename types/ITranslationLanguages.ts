export type ITranslationLanguages = {
    translation: {
      [key: string]: {
        name: string;
        nativeName: string;
        dir: "ltr" | "rtl";
      };
    };
  };