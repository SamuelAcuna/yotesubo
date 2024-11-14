import { Injectable } from '@angular/core';
import emailjs from 'emailjs-com';  // Importar la librería de EmailJS
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  // Función para enviar un correo
  sendEmail(fromName: string, fromEmail: string, toName: string, message: string): Promise<any> {
    const templateParams = {
      from_name: fromName,
      from_email: fromEmail,
      to_name: toName,
      message: message,
    };

    return emailjs.send('service_68mfc3i', 'template_rzlqzjl', templateParams, '67Tn-0ajLwPrdiQin')
      .then((response) => {
        console.log(fromName, fromEmail, toName, message);
        console.log('Correo enviado exitosamente', response);
        return response;
      })
      .catch((error) => {
        console.log('Error al enviar correo', error);
        throw error;
      });
  }
}
