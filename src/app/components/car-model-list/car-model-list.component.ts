import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarModelService } from 'src/app/service/car-model.service';

interface CarModel {
  id: number;
  brand:string;
  class:string;
  modelName: string;
  modelCode: string;
  images: any;
  fileName:string;
  price: number;
  dateOfManufacturing: Date;
  sortOrder: number;
  active: boolean;
}

@Component({
  selector: 'app-car-model-list',
  templateUrl: './car-model-list.component.html',
  styleUrls: ['./car-model-list.component.scss'],
})
export class CarModelListComponent implements OnInit {
  carModels: CarModel[] = []; // List of all models
  filteredModels: CarModel[] = []; // For filtered and paginated models
  searchTerm: string = '';
  sortField: string = 'manufacturingDate'; // Default sort field
  sortOrder: string = 'desc'; // Default sort order
  pageSize: number = 5; // Items per page
  currentPage: number = 0; // Current page index
  carDetails: CarModel[] = [];  // To hold the car details from API
  errorMessage: string = '';
  page: number = 0; // Current page number

  constructor(private router: Router, private carDetailsService: CarModelService,private toastr: ToastrService,) { }
  ngOnInit(): void {
    this.getdetails();

  }
  getdetails() {
    this.carDetailsService.getCarModels().subscribe(
      (data) => {
        if (data) {
          this.carDetails = data;  // Assign the response data to the carDetails array
          this.carDetails.forEach((model) => {
            if (typeof model.images === 'string') {
              // If images are stored as a string, split them into an array
              model.images = model.images.split(','); // Split by comma
            }
            // If it's already an array, no need to do anything
          });
          this.filteredModels = [...this.carDetails];
        }
        else {
          this.toastr.success('No Data Found!!', 'Success');
          this.carDetails = [];
        }
      },
      (error: any) => {
        this.errorMessage = 'Failed to load car details';  // Handle errors
        console.error(error);
      }
    );
  }
  filterModels() {
    this.filteredModels = this.carDetails.filter(model => 
      model.modelName.includes(this.searchTerm) || model.modelCode.includes(this.searchTerm)
    );
  }
  sortData(field: keyof CarModel): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }
    this.filteredModels.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      if (aValue < bValue) {
        return this.sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  deleteModel(id: number): void {
    if (confirm('Are you sure you want to delete this model?')) {
      this.carDetailsService.deleteCarModel(id).subscribe(
        (data) => {
          this.toastr.success('Data Deleted successfully!', 'Success');
          this.getdetails();
        });
    }

  }
  editModel(id: number): void {
    this.router.navigate(['/AddCarSystem'],{state:{data:id}});
  }
  addModel(){
    this.router.navigate(['/AddCarSystem']);
  }
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
