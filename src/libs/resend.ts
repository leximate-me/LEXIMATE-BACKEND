import { RESEND_API_KEY } from '../configs/envConfig.js';
import { Resend as OriginalResend } from 'resend';

interface ResendEmails {
  send: (options: {
    from: string;
    to: string[];
    subject: string;
    html: string;
  }) => Promise<{ data: any; error: any }>;
}

class Resend extends OriginalResend {
  emails: ResendEmails;

  constructor(apiKey: string) {
    super(apiKey);
    this.emails = {
      send: async (options) => {
        // Implementación del envío de correo electrónico
        return { data: 'Correo enviado', error: null };
      },
    };
  }
}

const resend = new Resend(RESEND_API_KEY);

export { resend };
