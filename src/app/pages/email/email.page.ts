import { Component, OnInit } from '@angular/core';
import emailjs from 'emailjs-com';
@Component({
  selector: 'app-email',
  templateUrl: './email.page.html',
  styleUrls: ['./email.page.scss'],
})
export class EmailPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  sendEmail() {
    const templateParams = {
      from_name: 'Samuel ',
      from_email: 'yotesubo37@gmail.com',
      to_name: 'Samuel',
      message: 'Este es un mensaje de prueba desde Ionic.',
    };

    emailjs.send('service_68mfc3i', 'template_rzlqzjl', templateParams, '67Tn-0ajLwPrdiQin')
      .then((response) => {
        console.log('Correo enviado exitosamente', response);
      }, (error) => {
        console.log('Error al enviar correo', error);
      });
  }
}
