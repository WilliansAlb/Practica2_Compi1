import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ViewChild,ElementRef,AfterViewInit } from '@angular/core';
import { AnalizarService } from './servicios/servicio-uno/analizar.service';
declare var require: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AnalizarService]
})
export class AppComponent implements AfterViewInit {
  @ViewChild('textbox') texto: ElementRef;
  @ViewChild('oculto') oculto: ElementRef;
  title = 'Practica2';
  myTextarea: string;
  myPath: String;
  parser = require('../assets/analizadores/principal.js');
  cantidad: number;
  constructor(private http:HttpClient, private ser:AnalizarService){
    this.myTextarea = "";
    this.myPath = ""; 
    this.cantidad = 0;
    this.obtenerCantidad();
  }
  hacerClick(){
    $("#archivo").click();
  }
  fileChangeEvent(event: Event) {
      const element = event.currentTarget as HTMLInputElement;
      let fileList: FileList | null = element.files;
      if (fileList) {
        console.log(fileList[0].type);
        if (fileList[0].type === 'text/plain'){
          this.myPath=fileList[0].name;
          let reader = new FileReader();
          reader.onloadend = () => this.printFileContents(reader.result);
          reader.readAsText(fileList[0], 'ISO-8859-1');
        } else {
          alert('¡He dicho archivo de texto!');
        }
      }
  }
  printFileContents (contents:String|ArrayBuffer|null) {
    if (typeof(contents)==='string'){
      this.myTextarea = "";
      let lines = contents.split(/\n/);
      lines.forEach(linea => {
        this.myTextarea += linea+"\n";
      });
      this.texto.nativeElement.value = this.myTextarea;
      if (this.myTextarea === ''){
        this.oculto.nativeElement.style.display = 'none';
      } else {
        this.oculto.nativeElement.style.display = '';
      }
    }
  }
  analizar(){
    this.ser.escribirDatos(this.myTextarea).subscribe(data=>{
      if (data.respuesta){
        alert(data.respuesta);
      } else {
        alert("no");
      }
    },error => {
      let errorMessage = <any>error;        
      console.log({errorAnalizar: errorMessage})
      alert("Hubo un los datos")
  });
  }

  obtenerCantidad(){
    this.ser.obtenerCuantos().subscribe(data=>{
      if (data.cuantos){
        if (data.cuantos>0){
          alert("existen");
          this.cantidad = data.cuantos;
        }
      } else {
        alert("no");
      }
    },error => {
      let errorMessage = <any>error;        
      console.log({errorAnalizar: errorMessage})
      alert("Hubo un los datos")
  });
  }
  ngAfterViewInit() {
    this.texto.nativeElement.value = '';
  }
}
