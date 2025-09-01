// angular import
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, User, Role } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  roles: Role[] = [];
  isLoading = false;
  isRolesLoading = false;
  errorMessage = '';
  successMessage = '';
  selectedFile: File | null = null;
  photoPreviewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadRoles();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userId: ['', Validators.required],
      roleId: ['', Validators.required],
      presentAddress: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      termsAccepted: [false, Validators.requiredTrue]
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.photoPreviewUrl = null;
    }
  }

  private loadRoles(): void {
    this.isRolesLoading = true;
    this.userService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.isRolesLoading = false;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.errorMessage = 'Failed to load roles. Please try again later.';
        this.isRolesLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const userData: Omit<User, 'id'> = {
        ...this.registerForm.value,
        roleId: Number(this.registerForm.value.roleId) // Convert roleId to number
      };

      this.userService.createUser(userData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'User registered successfully!';
          // Upload photo if selected
          if (this.selectedFile && response.userId) {
            this.uploadPhoto(response.userId);
          }
          this.registerForm.reset();
          this.selectedFile = null;
          this.photoPreviewUrl = null;
          // Redirect to login after a delay
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'An error occurred during registration. Please try again.';
          console.error('Registration error:', error);
        }
      });
    }
  }

  uploadPhoto(userId: string): void {
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.http.post(`${this.userService.apiUrl}/api/users/${userId}/photo`, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          console.log('Upload Progress:', Math.round((event.loaded / (event.total || 1)) * 100) + '%');
        } else if (event.type === HttpEventType.Response) {
          console.log('Photo uploaded successfully!', event.body);
        }
      },
      error: (error) => {
        console.error('Photo upload error:', error);
        this.errorMessage = 'Failed to upload photo. Please try again.';
      }
    });
  }
}
