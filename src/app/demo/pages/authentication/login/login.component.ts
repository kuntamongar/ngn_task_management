// angular import
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule, CommonModule, NzIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  showPassword: boolean = false;
  user: any = {};

  ngOnInit() {
    this.user = this.user || { email: '', password: '' };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    console.log('password', this.showPassword);
  }

  login() {
    const payload = {
      username: this.user.email,
      password: this.user.password
    }; 
    console.log('userData',payload)
  }
}
