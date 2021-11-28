import { Component, OnInit } from '@angular/core';
//custom
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { comparaValidator } from '../validators/compara-validator';
import { CpfValidator } from '../validators/cpf-validator';
import { Usuario } from './../models/Usuario';
import { ToastController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  formCadastro: FormGroup;
  usuario: Usuario = new Usuario;

  mensagem = {
    nome: [
      { tipo: 'required', mensagem: 'O campo Nome é obrigatório' },
      { tipo: 'minlength', mensagem: 'O campo Nome precisa ter pelo menos 3 caracteres' }
    ],
    cpf: [
      { tipo: 'required', mensagem: 'O campo cpf é obrigatório!' },
      { tipo: 'invalido', mensagem: 'cpf inválido' }
    ],
    email: [
      { tipo: 'required', mensagem: 'O campo email é obrigatório' },
      { tipo: 'email', mensagem: 'E-mail inválido' }
    ],
    senha: [
      { tipo: 'required', mensagem: 'O campo senha é obrigatório' },
      { tipo: 'minlength', mensagem: 'A senha deve ter pelo menos 6 caracteres.', },
      { tipo: 'maxlength', mensagem: 'A senha deve ter no máximo 15 caracteres' },
    ],
    confirmasenha: [
      { tipo: 'required', mensagem: 'O campo Confirmar Senha é obrigatório' },
      { tipo: 'minlength', mensagem: 'A senha deve ter no mínimo 6 caracteres' },
      { tipo: 'maxlength', mensagem: 'A senha deve ter no máximo 15 caracteres' },
      { tipo: 'comparacao', mensagem: 'A senha deve ser igual' },
    ],
  };

  constructor(
    private formBuilder: FormBuilder,
    public toastController: ToastController,
    private storageService: StorageService,
    private route: Router) {
    this.formCadastro = this.formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cpf: ['', Validators.compose([Validators.required, CpfValidator.cpfValido])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      confirmasenha: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])]
    }, {
      validator: comparaValidator('senha', 'confirmasenha')
    });
  }

  ngOnInit() {
  }

  async salvarCadastro() {
    if (this.formCadastro.valid) {
      this.usuario.nome = this.formCadastro.value.nome;
      this.usuario.cpf = this.formCadastro.value.cpf;
      this.usuario.email = this.formCadastro.value.email;
      this.usuario.senha = this.formCadastro.value.senha;
      await this.storageService.set(this.usuario.email, this.usuario);
      this.route.navigateByUrl('/home');
    } else {
      this.exibirErro();
    }
  }

  async exibirErro() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000,
      color: 'success',
      position: 'middle'
    });
    toast.present();
  }



}
