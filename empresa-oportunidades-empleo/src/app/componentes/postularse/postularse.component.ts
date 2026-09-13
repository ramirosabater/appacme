import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService
import { ActivatedRoute } from '@angular/router';
import { Oportunidad, Ubicacion } from 'src/app/modelos/Oportunidad';
import { NgRecaptcha3Service } from 'ng-recaptcha3';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-postularse',
  templateUrl: './postularse.component.html',
  styleUrls: ['./postularse.component.css']
})
export class PostularseComponent implements OnInit {
  postularseForm: FormGroup;
  id_empleo: number | null = null;
  oportunidad: Oportunidad = {};
  isSubmitting: boolean = false;
  isSubmitted: boolean = false;
  hasError: boolean = false;
  errorMessage: string = '';

  ubicaciones: Ubicacion[] = [];

  // Nuevas propiedades para el modo CVS
  isCvsMode: boolean = false;
  puestosDisponibles: { id_categoria_trabajo: number, descripcion_categoria: string }[] = [];
  puestosSeleccionados: { id_categoria_trabajo: number, descripcion_categoria: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private location: Location,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private recaptchaService: NgRecaptcha3Service
  ) {
    this.postularseForm = this.fb.group({
      id_postulante: [null],
      id_empleo: [null],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      tipo_documento: ['', Validators.required],
      nro_documento: ['', Validators.required],
      genero: [''],
      id_provincia: ['1'],
      localidad: [''],
      fecha_postulacion: [new Date().toISOString()],
      curriculum_vitae: [null, Validators.required],
      estado: ['pendiente'],
      puestos_interes: [[]]
    });
  }

  ngOnInit(): void {
    this.initRecaptcha(); // Inicialización de reCAPTCHA
    this.getUbicaciones();
    this.getCategoriasTrabajo(); // Cargar categorías de trabajo
    this.oportunidad = this.apiService.oportunidad;
    if (this.route.snapshot.params.id == 'cvs') {
      this.id_empleo = null;
      this.oportunidad = {};
      this.postularseForm.get('id_empleo')?.setValue(null);
      this.isCvsMode = true; // Activar modo CVS
    }
    else if (this.oportunidad.id_empleo) {
      this.id_empleo = this.route.snapshot.params.id;
      this.postularseForm.get('id_empleo')?.setValue(this.oportunidad.id_empleo);
    }
    else {
      // Si no hay id_empleo, activar modo CVS
      this.id_empleo = null;
      this.oportunidad = {};
      this.postularseForm.get('id_empleo')?.setValue(null);
      this.isCvsMode = true;
    }

  }

  private initRecaptcha(): void {
    const siteKey = environment.siteKey;
    //console.log('Recaptcha Site Key:', siteKey);
    if (siteKey) {
      this.recaptchaService.init(siteKey).then(status => {
        if (status === 'success') {
          //console.log('Recaptcha initialized successfully');
        } else {
          console.error('Recaptcha initialization failed');
        }
      });
    }
  }

  async onSubmit() {
    if (this.postularseForm.valid) {
      // Validar reCAPTCHA antes de enviar el formulario
      try {
        const recaptchaToken = await this.recaptchaService.getToken();
        //console.log('Recaptcha Token:', recaptchaToken);

        this.isSubmitting = true;
        this.isSubmitted = false;
        this.hasError = false;

        // Solo enviar puestos de interés si NO hay id_empleo (modo CVS)
        const puestosAEnviar = this.id_empleo ? [] : this.puestosSeleccionados;
        this.postularseForm.get('puestos_interes')?.setValue(puestosAEnviar);

        // Actualizar puestos de interés antes del envío
        const {
          id_empleo,
          nombre,
          apellido,
          email,
          telefono,
          tipo_documento,
          nro_documento,
          genero,
          id_provincia,
          localidad,
          fecha_postulacion,
          curriculum_vitae,
          estado
        } = this.postularseForm.value;

        this.apiService.postPostulacion(id_empleo, nombre, apellido, email,
          telefono, tipo_documento, nro_documento, genero, id_provincia,
          localidad, fecha_postulacion, curriculum_vitae, estado, puestosAEnviar, recaptchaToken).subscribe({
            next: (response) => {
              this.isSubmitting = false;
              this.isSubmitted = true;
              this.toastr.success('Postulación enviada con éxito', 'Postulación correcta');
            },
            error: (error) => {
              //console.error('Error al enviar el formulario:', error);
              const mensajeBackend = error?.error?.message || 'Ocurrió un error al enviar el formulario. Por favor, inténtalo nuevamente.';
              this.isSubmitting = false;
              this.hasError = true;
              this.errorMessage = mensajeBackend, 'Por favor, inténtalo nuevamente.';
              this.toastr.error(mensajeBackend, 'Error de envío');
            }
          });
      } catch (error) {
        console.error('Error al obtener el token de reCAPTCHA:', error);
        this.hasError = true;
        this.errorMessage = 'Ocurrió un error al verificar reCAPTCHA. Por favor, inténtalo nuevamente.';
        this.toastr.error('Error de reCAPTCHA', 'Error de envío');
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.postularseForm.get('curriculum_vitae')?.setValue(input.files[0]);
    } else {
      this.postularseForm.get('curriculum_vitae')?.setValue(null);
    }
  }

  atras(): void {
    this.location.back();
  }

  getUbicaciones() {
    this.apiService.getUbicaciones().subscribe(
      res => {
        this.ubicaciones = res;
      },
      err => alert(err.error.message)
    );
  }

  getCategoriasTrabajo() {
    this.apiService.getCategoriasTrabajo().subscribe(
      res => {
        this.puestosDisponibles = res;
      },
      err => alert(err.error.message)
    );
  }

  // Método para manejar la selección desde el combo
  onPuestoSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const puestoId = parseInt(select.value);

    if (puestoId && this.puestosSeleccionados.length < 3) {
      const puestoEncontrado = this.puestosDisponibles.find(p => p.id_categoria_trabajo === puestoId);
      if (puestoEncontrado && !this.puestosSeleccionados.some(p => p.id_categoria_trabajo === puestoId)) {
        this.puestosSeleccionados.push(puestoEncontrado);
        select.value = ''; // Limpiar el select después de seleccionar
      }
    }
  }

  // Remover un puesto seleccionado (para los tags)
  removePuesto(puesto: { id_categoria_trabajo: number, descripcion_categoria: string }): void {
    const index = this.puestosSeleccionados.findIndex(p => p.id_categoria_trabajo === puesto.id_categoria_trabajo);
    if (index > -1) {
      this.puestosSeleccionados.splice(index, 1);
    }
  }

  // Verificar si un puesto ya está seleccionado (para deshabilitar en el combo)
  isPuestoSeleccionado(puesto: { id_categoria_trabajo: number, descripcion_categoria: string }): boolean {
    return this.puestosSeleccionados.some(p => p.id_categoria_trabajo === puesto.id_categoria_trabajo);
  }

  // Verificar si se pueden seleccionar más puestos
  canSelectMorePuestos(): boolean {
    return this.puestosSeleccionados.length < 3;
  }

  // Verificar si se han seleccionado al menos 1 puesto (mínimo requerido)
  hasRequiredPuestos(): boolean {
    return this.puestosSeleccionados.length >= 1;
  }

  // Verificar si la selección está en el rango válido (1-3)
  isValidSelection(): boolean {
    return this.puestosSeleccionados.length >= 1 && this.puestosSeleccionados.length <= 3;
  }
}
