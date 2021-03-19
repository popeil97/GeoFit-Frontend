import { FormGroup, FormControl, } from '@angular/forms';

// custom validator to check that two fields match
function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}

function cannotBeEmptyString(mustBeString:Boolean = false) {
    return function (control: FormControl) {
      const val = control.value;
      if (!val) {
        return null
      }
      const valid = (
        (!mustBeString && val.toString().trim().length > 0) ||
        (mustBeString && typeof val === "string" && val.trim().length > 0)
      );
      if (!valid) {
        return {
          isEmpty:true
        }
      }
      return null;
    }
}

function isNumber() {
    return function (control:FormControl) {
      const val = control.value;
      if (
        !isNaN(val) && 
        parseFloat(val) == val && 
        !isNaN(parseFloat(val))
      ) return null;
      return {
        notNumber: true
      }
    }
  }
  
  function numberGreaterThanOrEqualTo( min:number ) {
    return function (control: FormControl) {
      const val = control.value;
  
      if (typeof val === 'undefined' || val == null) 
        return {
          missing:true,
        }
      if (typeof val !== 'number') 
        return {
          notNumber:true,
        }
      if (val < min) 
        return {
          notGreaterThan:true
        }
      return null;
    };
  }
  
function requiredFileType( required:boolean, types: Array<string> = ['jpg','jpeg','png'] ) {
    return function (control: FormControl) {
        const file = control.value;
        if ( file ) {
            const filename_components = file.split('.');
            const extension = filename_components[filename_components.length - 1].toLowerCase();
            if ( types.indexOf(extension) > -1 ) {
                return null;
            }
            return {
                requiredFileType: true
            }
        }
        if (required) {
            return {
                requiredFileType: true
            };
        }
        return null;
    }
}

function isFormValid(f:FormGroup):Boolean { 
    if (!f.disabled) return f.valid;
    return Object.keys(f.controls).reduce((accumulator,inputKey)=>{
      return (accumulator && f.get(inputKey).errors == null);
    },true);
}

function notSameStartEndLocations(form:FormGroup) {
    const startLat = form.get('startLat'),
          startLon = form.get('startLon'),
          endLat = form.get('endLat'),
          endLon = form.get('endLon');
  
    const latError = parseFloat(startLat.value) == parseFloat(endLat.value);
    const lonError = parseFloat(startLon.value) == parseFloat(endLon.value);
  
    if (latError) endLat.setErrors({sameAsStart:true});
    if (lonError) endLon.setErrors({sameAsStart:true});
  
    return null;
  
  }

export {
    MustMatch,
    cannotBeEmptyString,
    requiredFileType,
    isNumber,
    numberGreaterThanOrEqualTo,
    notSameStartEndLocations,
    isFormValid,
}
