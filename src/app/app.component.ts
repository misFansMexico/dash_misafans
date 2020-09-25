import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'dashmisFans';
  @ViewChild('filePortada')
  filePortada: ElementRef;
  @ViewChild('filePerfil')
  filePerfil: ElementRef;
  @ViewChild('imgPortada')
  imgPortada: ElementRef;
  @ViewChild('imgPerfil')
  imgPerfil: ElementRef;
  @ViewChild('confirmSwal')
  private confirmSwal: SwalComponent;
  creador = {
    nombre: '',
    username: '',
    description: '',
    img_portada: '',
    img_perfl: '',
    account_twitch: '',
    account_instagram: '',
    account_twitter: '',
    account_tiktok: '',
  };
  ProfileForm: FormGroup;

  file: File | null = null;

  constructor(public af_firestore: AngularFirestore) {}

  onClickFileInputButton(numero: number): void {
    if (numero == 1) this.filePortada.nativeElement.click();
    else this.filePerfil.nativeElement.click();
  }

  onChangeFileInput(numero: number): void {
    let files: { [key: string]: File };
    let reader = new FileReader();

    if (numero == 1) files = this.filePortada.nativeElement.files;
    else files = this.filePerfil.nativeElement.files;
    this.file = files[0];
    reader.onload = (event: any) => {
      if (numero == 1) {
        this.imgPortada.nativeElement.src = event.target.result;
        this.creador.img_portada = event.target.result;
      } else {
        this.imgPerfil.nativeElement.src = event.target.result;
        this.creador.img_perfl = event.target.result;
      }
    };

    reader.onerror = (event: any) => {
      console.log('File could not be read: ' + event.target.error.code);
    };

    reader.readAsDataURL(this.file);
  }

  enviar() {
    console.log(this.creador);
    this.af_firestore
      .collection('creadores')
      .doc(`${this.creador.username}`)
      .set(this.creador)
      .then((data) => {
        console.log(data);
        this.confirmSwal.fire();
      })
      .catch((data) => {
        console.log(data);
      });
  }
}
