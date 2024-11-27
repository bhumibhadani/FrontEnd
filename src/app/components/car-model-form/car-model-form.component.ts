import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarModelService } from 'src/app/service/car-model.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-car-model-form',
  templateUrl: './car-model-form.component.html',
  styleUrls: ['./car-model-form.component.scss'],
})
export class CarModelFormComponent implements OnInit {
  isEdit: boolean = false;
  carModelForm!: FormGroup;
  selectedFiles: FileList | null = null;
  fileName: any[] = [];
  uploadedImagePath: any = '';
  carDetails: any;
  brands = ['Audi', 'Jaguar', 'Land Rover', 'Renault'];
  classes = ['A-Class', 'B-Class', 'C-Class'];
  data: any;
  [key: string]: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private carDetailsService: CarModelService
  ) {
    const navigationState = this.router.getCurrentNavigation()?.extras?.state;
    if (navigationState) {
      this.data = navigationState['data'];
    }
  }
  ngOnInit(): void {
    this.initForm();
    if (this.data) {
      this.isEdit = true;
      this.loadCarModel(this.data);
    }
  }
  initForm(): void {
    this.carModelForm = this.fb.group({
      brand: ['', Validators.required],
      class: ['', Validators.required],
      modelName: ['', Validators.required],
      modelCode: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{1,10}$')]],
      description: ['', Validators.required],
      features: ['', Validators.required],
      price: ['', Validators.required],
      dateOfManufacturing: ['', Validators.required],
      active: [false],
      sortOrder: ['', Validators.required],
      images: ['', Validators.required],
      // fileName: [''],
    });
  }
  loadCarModel(id: string): void {
    this.carDetailsService.getCarModelswithId(id).subscribe((carModel: any) => {
      this.carDetails = carModel;
      const { fileField, ...rest } = carModel;  // Assuming carModel has a field 'fileField' for file input
      
      // If the car model has image data or existing file name, set it in the form and in the fileName variable
      if (carModel.images) {
        this.fileName = carModel.images;  // Assuming 'images' is an array of image objects with a 'name' field
      }
  
      // Populate the form with the remaining fields
      this.carModelForm.patchValue({ ...rest });
    });
  }
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileName = Array.from(input.files).map(file => file.name);
      this.handleFileSelection(input.files);
      this.selectedFiles = input.files; // Store selected files (all files)
      // this.fileName = Array.from(this.selectedFiles).map(file => file.name); // Get file names
      this.UploadFiles(); // Upload the files
    }
  }
  // Function to process the selected files
  handleFileSelection(files: FileList): void {
    // Your logic for processing the selected files
    console.log('Files selected:', files);
    // Example: Update form control with file list or handle file processing
    // this.form.get('images')?.setValue(files);

    // You can also call the function provided in the formItem functions if needed
    if (this['formItem']?.functions?.onChange) {  // Using bracket notation
      const func = this['formItem'].functions?.onChange;  // Using bracket notation
      const eventArgs = files;

      // Call the function dynamically
      this.functionCalled({
        field: this['formItem'],  // Using bracket notation
        functionName: func,  // This is the function we want to call
        eventArgs: eventArgs
      });
    }
  }

  // Function to handle other custom logic
  functionCalled(params: { field: any; functionName: string; eventArgs: any }) {
    const func = this[params.functionName]; // Now TypeScript knows this is valid
    if (func) {
      func.apply(this, params.eventArgs);
    }
  }

  // Example function that could be called dynamically
  exampleOnChange(files: FileList) {
    console.log('Files in exampleOnChange:', files);
  }
  UploadFiles(): void {
    if (!this.selectedFiles || this.selectedFiles.length === 0) return;

    const formData = new FormData();

    // Append all selected files to formData
    Array.from(this.selectedFiles).forEach(file => {
      formData.append('files', file as Blob);  // 'files' is the name for the input field in the backend
    });

    // Upload the files to the backend
    this.carDetailsService.uploadImages(formData).subscribe({
      next: (response: any) => {
        // Handle the response and update the image path or display uploaded image previews
        this.uploadedImagePath = response.filePath; // Assuming the backend returns an array of file paths
      },
      error: (error) => {
        console.error('File upload failed', error);
      }
    });
  }
  onSubmit(): void {
    if (this.carModelForm.valid) {
      if (this.isEdit) {
        let id = this.carDetails.id;
        let formData = {
          id,
          ...this.carModelForm.value,
          images: this.uploadedImagePath.toString() || this.carDetails?.images, // Use new or existing image
          fileName: this.fileName.toString(),
        };

        this.carDetailsService.updateCarModel(id, formData).subscribe({
          next: () => {
            this.toastr.success('Data updated successfully!', 'Success');
            this.router.navigate(['/CarSystemList']);
          },
          error: (err) => {
            console.error('Update failed', err);
          },
        });
      } else {
        let formData = {
          ...this.carModelForm.value,
          images: this.uploadedImagePath.toString() || this.carDetails?.images, // Use new or existing image
          fileName: this.fileName.toString(), // Use new or existing file name
        };
        this.carDetailsService.addCarModel(formData).subscribe({
          next: (data) => {
            if (data) {
              this.toastr.success('Data added successfully!', 'Success');
              this.router.navigate(['/CarSystemList']);
            }
          },
          error: (error) => {
            console.error('Add failed', error);
          },
        });
      }
    }
  }
  onCancel() {
    this.router.navigate(['/CarSystemList']); // Navigate to the list page
  }
}
