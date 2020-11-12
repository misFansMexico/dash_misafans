import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import Swal from 'sweetalert2';

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
  registrado = false;
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
    account_facebook: '',
  };
  ProfileForm = new FormGroup({
    img_perfl: new FormControl('', [Validators.required]),
    img_portada: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    account_twitch: new FormControl('', [Validators.required]),
    account_instagram: new FormControl('', [Validators.required]),
    account_twitter: new FormControl('', [Validators.required]),
    account_tiktok: new FormControl('', [Validators.required]),
    account_facebook: new FormControl('', [Validators.required]),
  });

  file: File | null = null;

  constructor(
    public af_firestore: AngularFirestore,
    private cdRef: ChangeDetectorRef
  ) {}

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
    this.registrado = false;
  }

  onClickFileInputButton(numero: number): void {
    if (numero == 1) this.filePortada.nativeElement.click();
    else this.filePerfil.nativeElement.click();
  }

  onChangeFileInput(numero: number): void {
    let files = [];
    let reader = new FileReader();

    if (numero == 1) files = this.filePortada.nativeElement.files;
    else files = this.filePerfil.nativeElement.files;
    if (files.length !== 0) {
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
  }

  cambio() {
    if (this.registrado) {
      this.registrado = false;
    } else this.registrado = true;
  }

  enviar() {
    if (this.ProfileForm.valid) {
      this.checkUsername().subscribe((data: any) => {
        if (data.size === 0) {
          this.af_firestore
            .collection('creadores')
            .doc(`${this.creador.username}`)
            .set(this.creador)
            .then((data) => {
              console.log(data);
              this.registrado = true;
            })
            .catch((data) => {
              Swal.fire(
                'Algo va mal',
                'Error al crear creador, intenta de nuevo',
                'error'
              );
            });
        } else {
          Swal.fire('Algo va mal', 'El nombre de usuario ya existe', 'error');
        }
      });
    } else {
      Swal.fire('Algo va mal', 'Llena todo los campos', 'error');
    }
  }

  checkUsername() {
    return this.af_firestore
      .collection('creadores', (ref) =>
        ref.where('username', '==', this.creador.username)
      )
      .get();
  }

  go_perfil() {
    location.href = `https://misfans-df9cb.web.app/creador/${this.creador.username}`;
  }
}
